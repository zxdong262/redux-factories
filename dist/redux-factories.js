(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.constantFactory = constantFactory;
	exports.deepCopy = deepCopy;
	exports.reducerFactory = reducerFactory;
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	/**
	 * constantFactory
	 * create constant from initState
	 * @param {*} initState
	 */
	function constantFactory(initState) {
	  var obj = {};
	  var keys = Object.keys(initState);
	  keys.forEach(function (key) {
	    var value = initState[key];
	    var methods = ['set'];
	    if (Array.isArray(value)) {
	      methods = ['set', 'add', 'del', 'update'];
	    }
	    methods.forEach(function (met) {
	      var name = met + '_' + key;
	      obj[name] = name;
	    });
	  });
	  obj.custom = 'custom';
	  return Object.freeze(obj);
	}
	
	/**
	 * simplified version of deepCopy
	 * only for plain object, no regexp, no date, no fucntion
	 * from http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
	 */
	function deepCopy(src) {
	  if (src === null || (typeof src === 'undefined' ? 'undefined' : _typeof(src)) !== 'object') {
	    return src;
	  }
	  if (Array.isArray(src)) {
	    var ret = src.slice();
	    var i = ret.length;
	    while (i--) {
	      ret[i] = deepCopy(ret[i]);
	    }
	    return ret;
	  }
	  var dest = {};
	  for (var key in src) {
	    dest[key] = deepCopy(src[key]);
	  }
	  return dest;
	}
	
	/**
	 * reducerFactory
	 * create reducer from initState
	 * @param {object} initState
	 */
	function reducerFactory(initState) {
	
	  var types = constantFactory(initState);
	
	  return function () {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
	    var action = arguments[1];
	
	
	    var mutations = {};
	
	    function mutate(prop) {
	      return Object.assign(deepCopy(state), prop);
	    }
	
	    //build mutation tree
	    Object.keys(types).forEach(function (typ) {
	
	      var arr = typ.split('_');
	      var method = arr[0];
	      var target = arr[1];
	      var act = void 0;
	      if (method === 'set') {
	        act = function act(action) {
	          var obj = _defineProperty({}, target, action.data);
	          return mutate(obj);
	        };
	      } else if (method === 'add') {
	        act = function act(action) {
	          var rt = target;
	          var obj = _defineProperty({}, rt, state[rt].slice(0).concat(action.data));
	          return mutate(obj);
	        };
	      } else if (method === 'del') {
	        act = function act(action) {
	          var rt = target;
	          var arr0 = state[rt].slice(0);
	          var data = action.data,
	              compare = action.compare;
	
	          for (var i = 0, len = arr0.length; i < len; i++) {
	            var item = arr0[i];
	            var res = compare ? compare(item, data) : item.id === data.id;
	            if (res) {
	              arr0.splice(i, 1);
	              break;
	            }
	          }
	          var obj = _defineProperty({}, rt, arr0);
	          return mutate(obj);
	        };
	      } else if (method === 'update') {
	        act = function act(action) {
	          var rt = target;
	          var arr0 = state[rt].slice(0);
	          var data = action.data,
	              compare = action.compare;
	
	          for (var i = 0, len = arr0.length; i < len; i++) {
	            var item = arr0[i];
	            var res = compare ? compare(item, data) : item.id === data.id;
	            if (res) {
	              arr0.splice(i, 1, Object.assign(deepCopy(item), data));
	              break;
	            }
	          }
	          var obj = _defineProperty({}, rt, arr0);
	          return mutate(obj);
	        };
	      }
	      mutations[typ] = act;
	    });
	    if (action.type === 'custom') {
	      return action.func(deepCopy(state));
	    }
	    var func = mutations[action.type];
	    if (func) return func(action);else return mutate({});
	  };
	}

/***/ }
/******/ ])
});
;