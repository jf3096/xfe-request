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
var index_1 = require("../abstract-request/index");
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
//# sourceMappingURL=implementation.js.map