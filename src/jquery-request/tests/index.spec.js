"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
exports.__esModule = true;
var sinon = require("sinon");
var chai_1 = require("chai");
require("./jsdom-configs");
var ResponseModal_1 = require("../../models/ResponseModal");
var index_1 = require("../index");
/**
 * 注入sinon的拦截处理
 * @param {Object} mockData
 * @param {() => Promise<any>} callback
 * @returns {Promise<any>}
 */
function sinonIntercept(mockData, callback) {
    var deferred = $.Deferred();
    var stub = sinon.stub($, 'ajax').returns(deferred);
    var promise = callback();
    deferred.resolveWith(this, [mockData]);
    stub.restore();
    return promise;
}
describe("jquery-request", function () {
    it('jquery ajax pipe: 原始JQuery 1.7.2 pipe 方法行为应该接近 标准Promise then', function () {
        return $.ajax('http://localhost:3000/login-success').pipe(function (res) {
            return __assign({}, res, { code: 2 });
        }).pipe(function (res) {
            chai_1.expect(res.code).to.be.equal(2);
        });
    });
    it('jquery ajax then: 原始JQuery 1.7.2 then 方法设计缺失，所以 then 无法修改值', function () {
        return $.ajax('http://localhost:3000/login-success').then(function (res) {
            return __assign({}, res, { code: 2 });
        }).then(function (res) {
            chai_1.expect(res.code).to.be.equal(2);
        });
    });
    it('new instance: jquery-request 允许创建一个全新的实例', function () {
        var request = index_1["default"].create();
        var url = 'http://localhost:3000/login-success';
        return request.get(url).then(function (response) {
            var code = response.code, data = response.data, message = response.message;
            chai_1.expect(code).to.be.equal(1);
            chai_1.expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            chai_1.expect(message).to.be.equal('');
        });
    });
    it('new instance: jqueryRequest.create 全新的实例依旧拥有内置的拦截函数配置', function () {
        var request = index_1["default"].create();
        request.mock = {
            'http://localhost:3000/login-success': {
                code: 1,
                message: '',
                data: 'mock data'
            }
        };
        var url = 'http://localhost:3000/login-success';
        return request.get(url).then(function (response) {
            var code = response.code, data = response.data, message = response.message;
            chai_1.expect(code).to.be.equal(1);
            chai_1.expect(data).to.be.equal('mock data');
            chai_1.expect(message).to.be.equal('');
        });
    });
    it('get：模拟登陆成功，正确解析返回数据', function () {
        var url = 'http://localhost:3000/login-success';
        return index_1["default"].get(url).then(function (response) {
            var code = response.code, data = response.data, message = response.message;
            chai_1.expect(code).to.be.equal(1);
            chai_1.expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            chai_1.expect(message).to.be.equal('');
        });
    });
    it('get：模拟登陆失败，正确解析返回数据', function () {
        var url = 'http://localhost:3000/login-error';
        return index_1["default"].get(url).then(function (response) {
            var code = response.code, data = response.data, message = response.message;
            chai_1.expect(code).to.be.equal(-20101);
            chai_1.expect(data).to.be.eql({
                request_id: '34454339-A521-DDDE-703D-EEC222A352E8'
            });
            chai_1.expect(message).to.be.equal('请先登录');
        });
    });
    it("get\uFF1A\u83B7\u53D6\u6240\u6709\u7528\u6237", function () {
        var url = 'http://localhost:3000/get-user';
        return index_1["default"].get(url).then(function (responses) {
            chai_1.expect(responses.length).to.be.equal(2);
        });
    });
    it("get\uFF1A\u4F20\u9012username=allen\u80FD\u627E\u5230\u5BF9\u5E94\u7528\u6237", function () {
        var url = 'http://localhost:3000/get-user?data.username=allen';
        return index_1["default"].get(url).then(function (responses) {
            var _a = responses[0], code = _a.code, data = _a.data, message = _a.message;
            chai_1.expect(code).to.be.equal(1);
            chai_1.expect(data.username).to.be.eql('allen');
            chai_1.expect(message).to.be.equal('');
        });
    });
    it("post\uFF1A\u63D0\u4EA4\u8D26\u6237\u4FE1\u606F\u53C2\u6570\u5E76\u6CE8\u518C\u7528\u6237", function () {
        var url = 'http://localhost:3000/register';
        var data = {
            id: 1,
            username: 'allen',
            password: 'hello world'
        };
        return index_1["default"].post(url, data).then(function (response) {
            chai_1.expect(response).to.be.eql({ id: 1, username: 'allen', password: 'hello world' });
        });
    });
    it("head\uFF1A\u83B7\u53D6 response headers \u4E2D\u7684 last modify", function () {
        var url = 'http://localhost:3000';
        return index_1["default"].head(url).then(/* tslint:disable */ function () {
            var xhr = arguments[2];
            var lastModify = xhr.getResponseHeader('last-modified');
            chai_1.expect(lastModify).not.to.be.equal(null);
            chai_1.expect(isNaN(+new Date(lastModify))).not.to.be.equal(true);
        });
    });
    it("head\uFF1A\u591A\u6B21then\u540E\u7B2C\u4E09\u4E2A\u53C2\u6570 xhr \u5E94\u8BE5\u4FDD\u7559\u4E0D\u4F1A\u4E22\u5931", function () {
        var url = 'http://localhost:3000';
        return index_1["default"].head(url).then(/* tslint:disable */ function () {
            var xhr = arguments[2];
            chai_1.expect(typeof xhr).to.be.equal('object');
            return $.Deferred().resolveWith(this, arguments);
        }).then(/* tslint:disable */ function () {
            var xhr = arguments[2];
            chai_1.expect(typeof xhr).to.be.equal('object');
        });
    });
    it("jsonp\uFF1A\u666E\u901A\u63D0\u4EA4\uFF0C\u83B7\u53D6\u5B8C\u6574json\u6570\u636E", function () {
        return sinonIntercept({ code: 1, data: { message: 'jsonp returned' }, message: '' }, function () {
            return index_1["default"].jsonp('').then(function (response) {
                var code = response.code, data = response.data, message = response.message;
                chai_1.expect(code).to.be.equal(1);
                chai_1.expect(data).to.be.eql({
                    message: 'jsonp returned'
                });
                chai_1.expect(message).to.be.equal('');
            });
        });
    });
    it("version: \u8BBE\u7F6Ejquery\u7248\u672C\u4E3A\u4E0D\u5408\u6CD5\uFF0C\u671F\u671B\u629B\u51FA\u5F02\u5E38", function (done) {
        function temporarySetJqueryVersion(cb) {
            var originalVersion = $.fn.jquery;
            $.fn.jquery = '1.10.1';
            try {
                cb();
            }
            finally {
                $.fn.jquery = originalVersion;
                done();
            }
        }
        chai_1.expect(function () { return temporarySetJqueryVersion(function () { return index_1["default"].jsonp('/'); }); }).to["throw"]('');
    });
    it("error: \u5904\u7406404 not found error", function (done) {
        var server = sinon.fakeServer.create();
        index_1["default"].get('http://localhost:3000/404').then(function (f) { return f; }, /* tslint:disable */ function () {
            var res = arguments[0];
            var status = arguments[1];
            var httpDescription = arguments[2];
            chai_1.expect(res.status).to.be.equal(404);
            chai_1.expect(status).to.be.equal('error');
            chai_1.expect(httpDescription).to.be.equal('Not Found');
            done();
        });
        server.respondWith('GET', '/', [
            200, { 'Content-Type': 'application/json' },
            '[' + JSON.stringify({ test: 1 }) + ']'
        ]);
        server.respond();
        server.restore();
    });
    it("ECONNREFUSED", function (done) {
        var url = 'http://localhost:9999/login-success';
        index_1["default"].get(url).then(function (f) { return f; }, /* tslint:disable */ function () {
            chai_1.expect(arguments[1]).to.be.equal('error');
            done();
        });
    });
    it("\u62E6\u622A: \u8BF7\u6C42\u524D\u52A0\u5165\u81EA\u5B9A\u4E49\u53C2\u6570", function () {
        var request = index_1["default"].create();
        var url = 'http://localhost:3000/login-success';
        request.register({
            request: function (requestConfigs) {
                requestConfigs.mock = true;
                return requestConfigs;
            }
        });
        request.register({
            request: function (requestConfigs) {
                chai_1.expect(requestConfigs.mock).to.be.equal(true);
                requestConfigs.skipExternalRequest = true;
                return requestConfigs;
            }
        });
        return request.get(url).then(function (response) {
            var code = response.code, data = response.data, message = response.message;
            chai_1.expect(code).to.be.equal(1);
            chai_1.expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            chai_1.expect(message).to.be.equal('');
        });
    });
    it("\u62E6\u622A: \u8BF7\u6C42\u6210\u529F\u540E\u52A0\u5DE5\u6570\u636E", function () {
        var request = index_1["default"].create();
        var url = 'http://localhost:3000/login-success';
        request.register({
            response: function (res) {
                res.code = 100;
                return res;
            }
        });
        request.register({
            response: function (res) {
                return new ResponseModal_1["default"](res.data, res.code, res.message);
            }
        });
        return request.get(url).then(function (response) {
            chai_1.expect(response instanceof ResponseModal_1["default"]).to.be.equal(true);
            chai_1.expect(response.code).to.be.equal(100);
        });
    });
    /**
     * TODO: 有CACHE的时候 response顺序有问题
     */
    it("\u62E6\u622A: head \u8BF7\u6C42\u62E6\u622A\u83B7\u53D6get response headers", function (done) {
        var request = index_1["default"].create();
        var url = 'http://jx3.xoyo.com/';
        request.register({
            request: function (requestConfigs) {
                if (localStorage.currentYear) {
                    var clientCurrentYear = new Date().getFullYear();
                    if (clientCurrentYear !== localStorage.currentYear) {
                        // 由于单元测试的原因， 浏览器环境请使用localStorage.removeItem
                        localStorage.currentYear = null;
                    }
                    else {
                        requestConfigs.$$response = localStorage.currentYear;
                    }
                }
                return requestConfigs;
            },
            response: function (res, statusText, xhr, requestConfigs) {
                if (!res && requestConfigs.url === 'http://jx3.xoyo.com/') {
                    var dateString = xhr.getResponseHeader('date');
                    chai_1.expect(dateString).not.to.be.equal(null);
                    var date = new Date(dateString);
                    chai_1.expect(isNaN(+date)).not.to.be.equal(true);
                    localStorage.currentYear = date.getFullYear();
                    return localStorage.currentYear;
                }
                else {
                    chai_1.expect(res).to.be.equal(new Date().getFullYear());
                }
                return res;
            }
        });
        var firstRequest = function () { return request.head(url).then(function (response) {
            chai_1.expect(response).to.be.equal(new Date().getFullYear());
        }); };
        var secondRequest = function () { return request.head(url).then(function (response) {
            chai_1.expect(response).to.be.equal(new Date().getFullYear());
            done();
        }); };
        firstRequest().then(secondRequest);
    });
    it("\u62E6\u622A: \u8BF7\u6C42\u6210\u529F\u540E\uFF0C\u6839\u636E\u6570\u636E\u5F3A\u5236\u8BA4\u5B9A\u8BE5promise\u5E94\u8BE5\u4E3A\u5931\u8D25", function (done) {
        var request = index_1["default"].create();
        var url = 'http://localhost:3000/login-success';
        request.register({
            response: function (res) {
                /**
                 * 假设我们认为request_id在以下值时不合法，切换到reject
                 */
                if (res.data.request_id === "2A5BDF18-F11F-9CEB-CE93-348AB9340EE4") {
                    return $.Deferred().reject('should be redirected as reject promise');
                }
                return res;
            }
        });
        request.get(url).then(function (f) { return f; }, function (res) {
            chai_1.expect(res).to.be.equal('should be redirected as reject promise');
            done();
        });
    });
    it("promise: \u7B26\u5408promise api\u7684\u884C\u4E3A\uFF0C\u5141\u8BB8\u8FDE\u7EED\u591A\u4E2Apromise\u4F7F\u7528", function () {
        var url = 'http://localhost:3000/login-success';
        return index_1["default"].get(url)
            .then(function (res) {
            return res.data;
        })
            .then(function (data) {
            chai_1.expect(data).to.be.eql({ request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4' });
        });
    });
    it("promise: \u7B26\u5408promise api\u7684\u884C\u4E3A\uFF0C\u5141\u8BB8promise chaining\u7684\u8FC7\u7A0B\u4E2D\u6839\u636E\u6570\u636E\u5207\u6362\u5230reject\u72B6\u6001", function (done) {
        var url = 'http://localhost:3000/login-success';
        index_1["default"].get(url)
            .then(function (res) {
            if (res.data.request_id === "2A5BDF18-F11F-9CEB-CE93-348AB9340EE4") {
                return $.Deferred().reject('should be redirected as reject promise');
            }
            return res;
        })
            .then(function (f) { return f; }, function (data) {
            return '再次加工';
        })
            .then(function (f) { return f; }, function (data) {
            chai_1.expect(data).to.be.equal('再次加工');
            done();
        });
    });
    it("promise: \u94FE\u5F0F\u4E2D\u6CA1\u6709\u8FD4\u56DE\u5E94\u8BE5\u5F53\u6210undefined\u5904\u7406", function () {
        var url = 'http://localhost:3000/login-success';
        return index_1["default"].get(url)
            .then(function (res) {
            // if coder forget to return
        })
            .then(function (f) { return f; }, function (data) {
            chai_1.expect(data).to.be.equal(undefined);
        });
    });
    it("mock: \u914D\u7F6E mock \u5B9E\u73B0\u5047\u6570\u636E", function () {
        var request = index_1["default"].create();
        request.mock = {
            'http://localhost:3000/login-success': {
                data: 666
            }
        };
        return request.get('http://localhost:3000/login-success').then(function (res) {
            chai_1.expect(res.data).to.be.equal(666);
        });
    });
    it("mock: \u914D\u7F6Emock\u5B9E\u73B0\u5047\u6570\u636E\uFF0C\u914D\u7F6E\u5141\u8BB8\u4F7F\u7528 function", function () {
        var request = index_1["default"].create();
        request.mock = {
            'http://localhost:3000/login-success': function (requestConfigs) {
                if (requestConfigs.options.method === 'post') {
                    return {
                        data: 666
                    };
                }
                else {
                    return undefined;
                }
            },
            '/get-name': 'allen'
        };
        return $.when(request.get('http://localhost:3000/login-success'), request.post('http://localhost:3000/login-success'), request.post('/get-name')).then(function (_a, resFromPost, resFromGetName) {
            var resFromGet = _a[0];
            chai_1.expect(resFromGet).to.be.eql({
                code: 1,
                message: '',
                data: {
                    request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
                }
            });
            chai_1.expect(resFromPost).to.be.eql({
                data: 666
            });
            chai_1.expect(resFromGetName).to.be.equal('allen');
        });
    });
    it('mock: 配置mock实现假数据， 使用 * 可以匹配一切 url', function () {
        var request = index_1["default"].create();
        request.mock = {
            '*': function (requestConfigs) {
                if (requestConfigs.options.method === 'get') {
                    return {
                        data: 666
                    };
                }
            }
        };
        return request.get('http://localhost:3000/login-success').then(function (res) {
            chai_1.expect(res.data).to.be.equal(666);
        });
    });
    it('mock: 配置mock实现假数据， 使用 * 后依然正确匹配 url，以后这为准， 这样的设计提供一个方式 * 检查所有请求', function () {
        var request = index_1["default"].create();
        request.mock = {
            '*': function (requestConfigs) {
                if (requestConfigs.options.method === 'get') {
                    return {
                        data: 666
                    };
                }
            },
            'http://localhost:3000/login-success': function (requestConfigs) {
                if (requestConfigs.options.method === 'get') {
                    return {
                        data: 777
                    };
                }
            }
        };
        return request.get('http://localhost:3000/login-success').then(function (res) {
            chai_1.expect(res.data).to.be.equal(777);
        });
    });
    it('mock: 配置mock实现假数据， 使用 * 的方式自定义正则匹配规则', function () {
        var request = index_1["default"].create();
        request.mock = {
            '*': request.mockRegexMatcher(/.*\/login-.*$/, { data: 666 })
        };
        return $.when(request.get('http://localhost:3000/login-success'), request.get('http://localhost:3000/login-error'), request.get('http://localhost:3000/register')).then(function (resFromSuccess, resFromError, _a) {
            var resFromRegister = _a[0];
            chai_1.expect(resFromSuccess.data).to.be.equal(666);
            chai_1.expect(resFromError.data).to.be.equal(666);
            chai_1.expect(resFromRegister).to.be.eql([
                {
                    id: 1,
                    username: 'allen',
                    password: 'hello world'
                }
            ]);
        });
    });
    it('promise catch: 配置mock实现假数据， 使用 * 的方式自定义正则匹配规则', function () {
        var request = index_1["default"].create();
        request.mock = {
            '*': request.mockRegexMatcher(/.*\/login-.*$/, { data: 666 })
        };
        return $.when(request.get('http://localhost:3000/login-success'), request.get('http://localhost:3000/login-error'), request.get('http://localhost:3000/register')).then(function () {
            return $.Deferred().reject("reject from here");
        }).fail(function (data) {
            chai_1.expect(data).to.be.equal('reject from here');
            return 'reject again';
        }).fail(function (data) {
            chai_1.expect(data).to.be.equal('reject again');
        });
    });
    it('timeout: 设置5秒超时， 并正确返回超时错误', function (done) {
        _this.timeout = 10000;
        index_1["default"]
            .get('http://localhost:9999', undefined, { options: { timeout: 1000, headers: { foo: 'bar' } } })
            .then(function (f) { return f; }, function (jqXHR) {
            chai_1.expect(jqXHR.statusText === 'timeout').to.be.equal(true);
            done();
        });
    });
    it('headers：请求携带headers', function () {
        return index_1["default"]
            .get('http://localhost:3000/login-success', undefined, { options: { headers: { foo: 'bar' } } })
            .then(function () {
            chai_1.expect(this.headers).to.be.eql({ foo: 'bar' });
        });
    });
    it('cookie: 使用 with credentials 跨域传递 cookie', function () {
        return index_1["default"]
            .get('http://localhost:3000/login-success', undefined, { options: { withCredential: true } })
            .then(/* tslint:disable */ function () {
            chai_1.expect(this.withCredential).to.be.equal(true);
        });
    });
});
//# sourceMappingURL=index.spec.js.map