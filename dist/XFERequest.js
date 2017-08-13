(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("XFERequest", [], factory);
	else if(typeof exports === 'object')
		exports["XFERequest"] = factory();
	else
		root["XFERequest"] = factory();
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
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	exports.__esModule = true;
	var index_1 = __webpack_require__(1);
	exports.jQueryRequest = index_1["default"];


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	exports.__esModule = true;
	var implementation_1 = __webpack_require__(2);
	__webpack_require__(4);
	var jQueryRequest = new implementation_1["default"]();
	exports["default"] = jQueryRequest;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var __rest = (this && this.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	};
	exports.__esModule = true;
	var index_1 = __webpack_require__(3);
	function getResponseFromMock(rawResponse, requestConfigs) {
	    var response;
	    if (typeof rawResponse === 'function') {
	        response = rawResponse(requestConfigs);
	    }
	    else {
	        response = rawResponse;
	    }
	    return response;
	}
	function registerRequestWithMock(context) {
	    context.register({
	        request: function (requestConfigs) {
	            var mock = context.mock;
	            var url = requestConfigs.url;
	            if (mock) {
	                if (mock['*']) {
	                    requestConfigs.$$response = getResponseFromMock(mock['*'], requestConfigs);
	                }
	                if (mock[url]) {
	                    requestConfigs.$$response = getResponseFromMock(mock[url], requestConfigs);
	                }
	            }
	            return requestConfigs;
	        }
	    });
	}
	var JQueryRequest = (function (_super) {
	    __extends(JQueryRequest, _super);
	    function JQueryRequest(options, requests, responses, responseRejects) {
	        var _this = _super.call(this, options, requests, responses, responseRejects) || this;
	        registerRequestWithMock(_this);
	        return _this;
	    }
	    JQueryRequest.getJqueryVersion = function () {
	        return $.fn.jquery;
	    };
	    JQueryRequest.invariantJQueryVersion = function () {
	        var jqueryVersion = JQueryRequest.getJqueryVersion();
	        if (jqueryVersion !== '1.7.2') {
	            throw new Error("\u5F53\u524D\u4F7F\u7528JQuery\u7248\u672C\uFF08" + jqueryVersion + "\uFF09\u6F5C\u5728\u4E0D\u517C\u5BB9\u7684\u60C5\u51B5\uFF0C" +
	                "\u5F53\u524D\u5B9E\u73B0\u9488\u5BF9JQuery 1.7.2\uFF0C\u51FA\u4E8E\u7A33\u5B9A\u6027\u7684\u8003\u8651\uFF0C\u8BF7\u786E\u4FDD\u60A8\u4F7F\u7528\u7684JQuery\u7248\u672C\u6B63\u786E\u901A\u8FC7\u6D4B\u8BD5\u7528\u4F8B");
	        }
	    };
	    /**
	     * 根据 mock value 可以使用 function 的方式提供正则匹配方法
	     * @param {RegExp} regex 正则
	     * @param mockResponse {MockResponseType} 返回类型，可以试function或者直接试返回值
	     * @returns {MockResponseType}
	     */
	    JQueryRequest.prototype.mockRegexMatcher = function (regex, mockResponse) {
	        return function (requestConfigs) {
	            if (regex.test(requestConfigs.url)) {
	                return mockResponse;
	            }
	        };
	    };
	    // noinspection JSMethodCanBeStatic
	    JQueryRequest.prototype.create = function (options, requests, responses, responseRejects) {
	        return new JQueryRequest(options, requests, responses, responseRejects);
	    };
	    JQueryRequest.prototype.requestImplementation = function (url, data, options) {
	        var dataType = options.dataType, method = options.method, restParams = __rest(options, ["dataType", "method"]);
	        JQueryRequest.invariantJQueryVersion();
	        /**
	         * 由于JQuery 1.10+的行为 $.support.cors 默认值为true，并且在IE8-，当前 cors 值由true变成了false
	         * 故统一行为
	         * @type {boolean}
	         */
	        $.support.cors = true;
	        /**
	         * 使用 spread object 生成的代码含有index of， 无法兼容IE8-
	         * @type {any}
	         */
	        var ajaxOptions = {};
	        for (var key in options) {
	            if (key === "method" || key === 'dataType') {
	                continue;
	            }
	            ajaxOptions[key] = options.key;
	        }
	        return $.ajax(__assign({ type: method, url: url,
	            data: data,
	            dataType: dataType }, restParams));
	        // JQueryRequest.overwritePromiseObject(jqueryPromise);
	    };
	    JQueryRequest.prototype.getPromiseResolve = function (args) {
	        var resolvedValue = $.Deferred().resolve(args);
	        JQueryRequest.invariantJQueryVersion();
	        // JQueryRequest.overwritePromiseObject(resolvedValue);
	        return resolvedValue;
	    };
	    return JQueryRequest;
	}(index_1.AbstractRequest));
	exports["default"] = JQueryRequest;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	exports.__esModule = true;
	var AbstractRequest = (function () {
	    /**
	     * 初始化成员变量
	     * requests：请求前拦截
	     * responses：请求成功后拦截
	     * responseRejects：请求失败后拦截
	     */
	    function AbstractRequest(_a, requests, responses, responseRejects) {
	        var _b = (_a === void 0 ? {} : _a).apiRoot, apiRoot = _b === void 0 ? '' : _b;
	        if (requests === void 0) { requests = []; }
	        if (responses === void 0) { responses = []; }
	        if (responseRejects === void 0) { responseRejects = []; }
	        this.apiRoot = apiRoot;
	        this.requests = requests;
	        this.responses = responses;
	        this.responseRejects = responseRejects;
	    }
	    AbstractRequest.prototype.setApiRoot = function (apiRoot) {
	        this.apiRoot = apiRoot;
	    };
	    /**
	     * 注册拦截事件
	     * @param interceptor {object} 拦截对象
	     */
	    AbstractRequest.prototype.register = function (interceptor) {
	        var _a = this, requests = _a.requests, responses = _a.responses, responseRejects = _a.responseRejects;
	        var request = interceptor.request, response = interceptor.response, responseReject = interceptor.responseReject;
	        if (request) {
	            requests.push(request);
	        }
	        if (response) {
	            responses.push(response);
	        }
	        if (responseReject) {
	            responseRejects.push(responseReject);
	        }
	    };
	    /**
	     * get 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.get = function (apiName, data, requestConfigs) {
	        return this.general('get', apiName, data, requestConfigs);
	    };
	    /**
	     * post 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.post = function (apiName, data, requestConfigs) {
	        return this.general('post', apiName, data, requestConfigs);
	    };
	    /**
	     * put 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.put = function (apiName, data, requestConfigs) {
	        return this.general('put', apiName, data, requestConfigs);
	    };
	    // noinspection ReservedWordAsName
	    /**
	     * delete 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype["delete"] = function (apiName, data, requestConfigs) {
	        return this.general('delete', apiName, data, requestConfigs);
	    };
	    /**
	     * options 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.options = function (apiName, data, requestConfigs) {
	        return this.general('options', apiName, data, requestConfigs);
	    };
	    /**
	     * head 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.head = function (apiName, data, requestConfigs) {
	        return this.general('head', apiName, data, requestConfigs);
	    };
	    /**
	     * trace 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.trace = function (apiName, data, requestConfigs) {
	        return this.general('trace', apiName, data, requestConfigs);
	    };
	    /**
	     * connect 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.connect = function (apiName, data, requestConfigs) {
	        return this.general('connect', apiName, data, requestConfigs);
	    };
	    /**
	     * jsonp 请求
	     * @param apiName 请求地址
	     * @param data 请求数据
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.jsonp = function (apiName, data, requestConfigs) {
	        var options = { dataType: 'jsonp' };
	        return this.get(apiName, data, __assign({}, requestConfigs, { options: options }));
	    };
	    /**
	     * 通用请求处理函数
	     * @param method 请求方法
	     * @param apiName 通用请求
	     * @param data 请求数据
	     * @param rawRequestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.general = function (method, apiName, data, rawRequestConfigs) {
	        var options;
	        if (rawRequestConfigs && rawRequestConfigs.options) {
	            options = __assign({}, rawRequestConfigs.options, { method: method });
	        }
	        else {
	            options = { method: method };
	        }
	        var requestConfigs = { data: data, apiName: apiName, options: options };
	        requestConfigs = rawRequestConfigs ? __assign({}, rawRequestConfigs, requestConfigs) : requestConfigs;
	        if (!requestConfigs.apiRoot) {
	            requestConfigs.apiRoot = this.apiRoot;
	        }
	        if (!requestConfigs.url) {
	            requestConfigs.url = requestConfigs.apiRoot + apiName;
	        }
	        return this.send(requestConfigs);
	    };
	    /**
	     * 请求核心实现
	     * @param requestConfigs {options} 参考底层requestHelper
	     * @returns {*} 返回请求后的数据
	     */
	    AbstractRequest.prototype.send = function (requestConfigs) {
	        var _this = this;
	        /**
	         * 保证每一个请求都有独立的uid
	         */
	        if (!requestConfigs.uid) {
	            requestConfigs.uid = ++AbstractRequest.uid;
	        }
	        var _a = this, requests = _a.requests, responses = _a.responses, responseRejects = _a.responseRejects;
	        // 遍历请求前的拦截方法
	        var requestPromise = requests.reduce(function (prev, cur) {
	            return prev.then(function () {
	                var args = Array.prototype.slice.call(arguments);
	                return cur.apply(this, args.concat([requestConfigs]));
	            });
	        }, this.getPromiseResolve(requestConfigs));
	        var response = requestPromise.then(function (requestConfigs) {
	            var url = requestConfigs.url, data = requestConfigs.data, options = requestConfigs.options, $$response = requestConfigs.$$response;
	            /**
	             * 如果在配置参数中存在$$response
	             * 则直接拦截当前请求
	             */
	            if ($$response !== undefined) {
	                return _this.getPromiseResolve($$response);
	            }
	            return _this.requestImplementation(url, data, options);
	        });
	        // 遍历返回后的拦截失败方法
	        response = responses.reduce(function (prev, cur) {
	            return prev.then(function (res) {
	                return cur.call(_this, res, requestConfigs);
	            });
	        }, response);
	        // 遍历返回后的拦截失败方法
	        return responseRejects.reduce(function (prev, cur) {
	            return prev.then(void 0, function (res) { return cur.call(_this, res, requestConfigs); });
	        }, response);
	    };
	    /**
	     * @type {number} 请求拥有唯一ID
	     */
	    AbstractRequest.uid = 0;
	    return AbstractRequest;
	}());
	exports.AbstractRequest = AbstractRequest;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	exports.__esModule = true;
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (elt /*, from*/) {
	        // tslint:disable
	        var len = this.length >>> 0;
	        // tslint:enable
	        var from = Number(arguments[1]) || 0;
	        from = (from < 0)
	            ? Math.ceil(from)
	            : Math.floor(from);
	        if (from < 0) {
	            from += len;
	        }
	        for (; from < len; from++) {
	            if (from in this && this[from] === elt) {
	                return from;
	            }
	        }
	        return -1;
	    };
	}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	if (!Array.prototype.reduce) {
	    Array.prototype.reduce = function (callback) {
	        if (this === null) {
	            throw new TypeError('Array.prototype.reduce ' +
	                'called on null or undefined');
	        }
	        if (typeof callback !== 'function') {
	            throw new TypeError(callback +
	                ' is not a function');
	        }
	        // 1. Let O be ? ToObject(this value).
	        var o = Object(this);
	        // 2. Let len be ? ToLength(? Get(O, "length")).
	        //noinspection TsLint
	        var len = o.length >>> 0;
	        // Steps 3, 4, 5, 6, 7
	        var k = 0;
	        var value;
	        if (arguments.length >= 2) {
	            value = arguments[1];
	        }
	        else {
	            while (k < len && !(k in o)) {
	                k++;
	            }
	            // 3. If len is 0 and initialValue is not present,
	            //    throw a TypeError exception.
	            if (k >= len) {
	                throw new TypeError('Reduce of empty array ' +
	                    'with no initial value');
	            }
	            value = o[k++];
	        }
	        // 8. Repeat, while k < len
	        while (k < len) {
	            // a. Let Pk be ! ToString(k).
	            // b. Let kPresent be ? HasProperty(O, Pk).
	            // c. If kPresent is true, then
	            //    i.  Let kValue be ? Get(O, Pk).
	            //    ii. Let accumulator be ? Call(
	            //          callbackfn, undefined,
	            //          « accumulator, kValue, k, O »).
	            if (k in o) {
	                value = callback(value, o[k], k, o);
	            }
	            // d. Increase k by 1.
	            k++;
	        }
	        // 9. Return accumulator.
	        return value;
	    };
	}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/* tslint:disable */
	if ($.fn.jquery !== '1.7.2') {
	    throw new Error('当前处理针对JQuery 1.7.2');
	}
	$.Deferred = function (func) {
	    var tuples = [
	        ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
	        ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
	        ["notify", "progress", jQuery.Callbacks("memory")]
	    ], state = "pending", promise = {
	        state: function () {
	            return state;
	        },
	        always: function () {
	            deferred.done(arguments).fail(arguments);
	            return this;
	        },
	        then: function () {
	            var fns = arguments;
	            return jQuery.Deferred(function (newDefer) {
	                jQuery.each(tuples, function (i, tuple) {
	                    var fn = jQuery.isFunction(fns[i]) && fns[i];
	                    // deferred[ done | fail | progress ] for forwarding actions to newDefer
	                    deferred[tuple[1]](function () {
	                        var returned = fn && fn.apply(this, arguments);
	                        if (returned && jQuery.isFunction(returned.promise)) {
	                            returned.promise()
	                                .progress(newDefer.notify)
	                                .done(newDefer.resolve)
	                                .fail(newDefer.reject);
	                        }
	                        else {
	                            newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
	                        }
	                    });
	                });
	                fns = null;
	            }).promise();
	        },
	        // Get a promise for this deferred
	        // If obj is provided, the promise aspect is added to the object
	        promise: function (obj) {
	            return obj != null ? jQuery.extend(obj, promise) : promise;
	        }
	    }, deferred = {};
	    // Keep pipe for back-compat
	    promise.pipe = promise.then;
	    // Add list-specific methods
	    jQuery.each(tuples, function (i, tuple) {
	        var list = tuple[2], stateString = tuple[3];
	        // promise[ done | fail | progress ] = list.add
	        promise[tuple[1]] = list.add;
	        // Handle state
	        if (stateString) {
	            list.add(function () {
	                // state = [ resolved | rejected ]
	                state = stateString;
	                // [ reject_list | resolve_list ].disable; progress_list.lock
	            }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
	        }
	        // deferred[ resolve | reject | notify ]
	        deferred[tuple[0]] = function () {
	            deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
	            return this;
	        };
	        deferred[tuple[0] + "With"] = list.fireWith;
	    });
	    // Make the deferred a promise
	    promise.promise(deferred);
	    // Call given func if any
	    if (func) {
	        func.call(deferred, deferred);
	    }
	    // All done!
	    return deferred;
	};
	/* tslint:enable */


/***/ })
/******/ ])
});
;
//# sourceMappingURL=XFERequest.js.map