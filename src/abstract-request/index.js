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
            return prev.then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return cur.apply(_this, args.concat(requestConfigs));
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
//# sourceMappingURL=index.js.map