const {cloneDeep} = require('lodash')
const {deepCopy} = require('../dist/redux-factories')
const {log} = console
let eg = {
  a: 'a',
  b: 7879,
  g: false,
  h: [
    {g: 0, l: true, k: {l: 56}},
    {g: 0, l: true, fg: 'dfg', k: {l: 56}},
    {g: 0, l: true, k: {l: 56}}
  ],
  jk: {
    ager: 56,
    tank: 'sj',
    what: {
      sdf: {
        sdf: 'asdasd',
        ll: ['safd', {sdfs: 'dfsf'}]
      }
    }
  }
}

const len = 100000
let t1 = new Date().getTime()
for(let i = 0;i < len;i ++) {
  let ed = cloneDeep(eg)
}
let t2 = new Date().getTime()
log(t2 - t1, len, 'cloneDeep')

let t3 = new Date().getTime()
for(let j = 0;j < len;j ++) {
  let ed = deepCopy(eg)
}
let t4 = new Date().getTime()
log(t4 - t3, len, 'deepCopy')