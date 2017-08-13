"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var _a = require('mocha'), describe = _a.describe, it = _a.it;
var expect = require('chai').expect;
describe("Utils\u8F85\u52A9\u51FD\u6570", function () {
    it('joinUrl：#1连接url的多个部分', function () {
        expect(index_1["default"].joinUrl('http://www.google.com', 'a', '/b/cd', '?foo=123')).to.be.equals("http://www.google.com/a/b/cd?foo=123");
    });
    it('joinUrl：#2连接url的多个部分，结尾依然携带/', function () {
        expect(index_1["default"].joinUrl('http://www.google.com', 'a', '/b/cd/')).to.be.equals("http://www.google.com/a/b/cd/");
    });
    it('joinUrl：在连接处没有/的情况，应该自动加上/', function () {
        expect(index_1["default"].joinUrl('https://apps-ws.xoyo.com', 'passport/get_info')).to.be.equals("https://apps-ws.xoyo.com/passport/get_info");
    });
    it('joinUrl：在连接处自动处理2个/的情况，应该当做单个/处理', function () {
        expect(index_1["default"].joinUrl('https://apps-ws.xoyo.com/', '/passport/get_info')).to.be.equals("https://apps-ws.xoyo.com/passport/get_info");
    });
    it('joinUrl：在连接处自动处理3个/的情况, 不应直接回到根host', function () {
        expect(index_1["default"].joinUrl('https://apps-ws.xoyo.com/relative', '//passport/get_info')).to.be.equals("https://apps-ws.xoyo.com/relative/passport/get_info");
    });
    it('joinUrl：存在相对路径时，按照原意依旧拼接，不应直接回到根host', function () {
        expect(index_1["default"].joinUrl('https://apps-ws.xoyo.com/relative', '/passport/get_info')).to.be.equals("https://apps-ws.xoyo.com/relative/passport/get_info");
    });
    it('joinUrl：禁止使用../或者./', function () {
        expect(function () { return index_1["default"].joinUrl('https://apps-ws.xoyo.com/relative', '../passport/get_info'); }).to["throw"]("Utils/index.ts: joinUrl\u4E0D\u652F\u6301./\u6216../");
    });
    it('joinUrl：应该只是//无协议的情况', function () {
        expect(index_1["default"].joinUrl('//apps-ws.xoyo.com/relative', '/passport/get_info')).to.be.equals("//apps-ws.xoyo.com/relative/passport/get_info");
    });
});
//# sourceMappingURL=index.spec.js.map