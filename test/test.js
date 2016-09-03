
const chai = require('chai')
,expect = chai.expect
,pkg = require('../package.json')
,resolve = require('path').resolve
,should = chai.should()
,factories = require('../dist/redux-factories')
console.log(factories)
const { constantFactory, reducerFactory } = factories

let init = {
	users: []
	,loading: false
}

describe(pkg.name, function() {

	it('types', function() {
		let types = constantFactory(init)
		expect(types.set_loading).to.equal('set_loading')
		expect(types.set_users).to.equal('set_users')
		expect(types.add_users).to.equal('add_users')
		expect(types.del_users).to.equal('del_users')
		expect(types.update_users).to.equal('update_users')
	})

	it('reducers set', function() {
		
		let reducer = reducerFactory(init)

		let s1 = reducer(init, {
			type: 'set_loading'
			,data: true
		})

		expect(s1.loading).to.equal(true)

	})

	it('reducers set array', function() {

		let reducer = reducerFactory(init)

		let s2 = reducer(init, {
			type: 'set_users'
			,data: [{x:1}]
		})

		expect(s2.users[0].x).to.equal(1)

	})

	it('reducers del array item', function() {

		let reducer = reducerFactory(init)

		let s3 = reducer({
			users: [
				{
					id: 0
				}
			]
		}, {
			type: 'del_users'
			,data: {id:0}
		})

		expect(s3.users.length).to.equal(0)

	})

	it('reducers update array item', function() {

		let reducer = reducerFactory(init)

		let s4 = reducer({
			users: [
				{
					id: 0
					,name: 'x'
				}
				,{
					id: 2
					,name: 'xx'
				}
			]
		}, {
			type: 'update_users'
			,data: { id: 2, name: 'y'}
		})

		expect(s4.users[1].name).to.equal('y')

	})

	it('reducers add array item', function() {

		let reducer = reducerFactory(init)

		let s5 = reducer({
			users: [
				{
					id: 0
					,name: 'x'
				}
				,{
					id: 2
					,name: 'xx'
				}
			]
		}, {
			type: 'add_users'
			,data: { id: 4, name: 'yy'}
		})

		expect(s5.users[2].name).to.equal('yy')

	})

})
