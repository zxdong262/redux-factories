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
  return Object.freeze(obj)
}

export function reducerFactory(initState) {

  let types = constantFactory(initState)

  return function (state = initState, action) {

    let mutations = {}

    function mutate(prop) {
      return Object.assign({}, state, prop)
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
            [target]: action.data
          }
          return mutate(obj)
        }
      } else if (method === 'add') {
        act = action => {
          let rt = target
          let obj = {
            [rt]: state[rt].slice(0).concat(action.data)
          }
          return mutate(obj)
        }
      } else if (method === 'del') {
        act = action => {
          let rt = target
          let arr0 = state[rt].slice(0)
          let data = action.data
          let compare = action.compare
          for (let i = 0, len = arr0.length; i < len; i++) {
            let item = arr0[i]
            let res = compare ? compare(item, data) : item.id === data.id
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
          let arr0 = state[rt].slice(0)
          let data = action.data
          let compare = action.compare
          for (let i = 0, len = arr0.length; i < len; i++) {
            let item = arr0[i]
            let res = compare ? compare(item, data) : item.id === data.id
            if (res) {
              arr0.splice(i, 1, Object.assign({}, item, data))
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

    let func = mutations[action.type]
    if (func) return func(action)
    else return mutate({})
  }

}