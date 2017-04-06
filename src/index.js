/**
 * constantFactory
 * create constant from initState
 * @param {*} initState
 */
export function constantFactory(initState) {
  let obj = {}
  let keys = Object.keys(initState)
  keys.forEach(key => {
    let value = initState[key]
    let methods = ['set']
    if (Array.isArray(value)) {
      methods = ['set', 'add', 'del', 'update']
    }
    methods.forEach(met => {
      let name = met + '_' + key
      obj[name] = name
    })
  })
  obj.custom = 'custom'
  return Object.freeze(obj)
}

/**
 * simplified version of deepCopy
 * only for plain object, no regexp, no date, no fucntion
 * from http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
 */
export function deepCopy(src) {
  if(src === null || typeof(src) !== 'object'){
    return src
  }
  if (Array.isArray(src)) {
      let ret = src.slice()
      let i = ret.length
      while (i--) {
        ret[i] = deepCopy(ret[i])
      }
      return ret
  }
  let dest = {}
  for (var key in src) {
    dest[key] = deepCopy(src[key])
  }
  return dest
}

/**
 * reducerFactory
 * create reducer from initState
 * @param {object} initState
 */
export function reducerFactory(initState) {

  let types = constantFactory(initState)

  return function (state = initState, action) {

    let mutations = {}

    function mutate(prop) {
      return Object.assign(deepCopy(state), prop)
    }

    //build mutation tree
    Object.keys(types).forEach(typ => {

      let arr = typ.split('_')
      let method = arr[0]
      let target = arr[1]
      let act
      if (method === 'set') {
        act = action => {
          let obj = {
            [target]: deepCopy(action.data)
          }
          return mutate(obj)
        }
      } else if (method === 'add') {
        act = action => {
          let rt = target
          let {method = 'unshift', index, data} = action
          let res = deepCopy(state[rt])
          if (typeof index !== 'undefined') {
            res.splice(index, 0, data)
          }
          else res[method](deepCopy(data))
          let obj = {
            [rt]: res
          }
          return mutate(obj)
        }
      } else if (method === 'del') {
        act = action => {
          let rt = target
          let arr0 = deepCopy(state[rt])
          let {data, compare, prop = 'id'} = action
          for (let i = 0, len = arr0.length; i < len; i++) {
            let item = arr0[i]
            let res = compare ? compare(item, data) : item[prop] === data[prop]
            if (res) {
              arr0.splice(i, 1)
              break
            }
          }
          let obj = {
            [rt]: arr0
          }
          return mutate(obj)
        }
      } else if (method === 'update') {
        act = action => {
          let rt = target
          let arr0 = deepCopy(state[rt])
          let {data, compare, prop = 'id'} = action
          for (let i = 0, len = arr0.length; i < len; i++) {
            let item = arr0[i]
            let res = compare ? compare(item, data) : item[prop] === data[prop]
            if (res) {
              arr0.splice(i, 1, Object.assign(item, data))
              break
            }
          }
          let obj = {
            [rt]: arr0
          }
          return mutate(obj)
        }
      }
      mutations[typ] = act
    })
    if (action.type === 'custom') {
      return action.func(deepCopy(state))
    }
    let func = mutations[action.type]
    if (func) return func(action)
    else return mutate({})
  }

}