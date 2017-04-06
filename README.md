# redux-factories
[![Build Status](https://travis-ci.org/zxdong262/redux-factories.svg?branch=master)](https://travis-ci.org/zxdong262/redux-factories)

- a factory lib to produce redux constants and reducers of certain format.
- so no need to write reducers
- and can change multiple prop in one reducer by custom function

## install
```bash
npm i --save-dev redux-factories
```

## use

```javascript
import { constantFactory, reducerFactory } from 'redux-factories'

let initState = {
    loading: false,
    users: [],
    total: 0
}

const types = constantFactory(initState)
/*
    types = {
        set_loading: 'set_loading',
        set_total: 'set_total',
        set_users: 'set_users',
        add_users: 'add_users',
        del_users: 'del_users',
        update_users: 'update_users'
    }
*/

const reducers = reducerFactory(initState)

//all through 'data' key

//set will replace the whole value 
dispatch({
    type: types.set_loading
    ,data: true
})
dispatch({
    type: types.set_users
    ,data: [{ name: 'apple' }]
})

//add will push/unshift one item into array
dispatch({
    type: types.add_users
    ,data: { name: 'apple' }
    ,method: 'push' //optional, default is 'unshift'
    ,index: 0 //optional, default is undefined, when exist, insert to index position, skip method
})

//del will remove one item with same id or compare by costum function
dispatch({
    type: types.del_users
    ,data: { id: 'appleid' }
    //optional compare prop, default is 'id'
    ,prop: 'name'
    //optional compare fucntion
    ,compare: (a, b) => a.id === b.id
})

//update will update one item with same id by default
dispatch({
    type: types.update_users
    ,data: { id: 'appleid', name: 'orange' }
    //optional compare fucntion
    ,compare: (a, b) => a.id === b.id
    //optional compare prop, default is 'id'
    ,prop: 'name'
})

//use custom function as updater to update multiple props/all kinds of update in one action
dispatch({
    type: types.custom
    ,custom: state => {
      state.total = 1
      state.users = []
      return state
    }
})
```

## test
```bash
git clone git@github.com:zxdong262/redux-factories.git
cd redux-factories
npm install

#test
npm run test
```

## License
MIT