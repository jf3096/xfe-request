import Utils from './index';

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe(`Utils辅助函数`, () => {
    it('joinUrl：#1连接url的多个部分', () => {
        expect(
            Utils.joinUrl('http://www.google.com', 'a', '/b/cd', '?foo=123')
        ).to.be.equals(`http://www.google.com/a/b/cd?foo=123`);
    });

    it('joinUrl：#2连接url的多个部分，结尾依然携带/', () => {
        expect(
            Utils.joinUrl('http://www.google.com', 'a', '/b/cd/')
        ).to.be.equals(`http://www.google.com/a/b/cd/`);
    });

    it('joinUrl：在连接处没有/的情况，应该自动加上/', () => {
        expect(
            Utils.joinUrl('https://apps-ws.xoyo.com', 'passport/get_info')
        ).to.be.equals(`https://apps-ws.xoyo.com/passport/get_info`);
    });

    it('joinUrl：在连接处自动处理2个/的情况，应该当做单个/处理', () => {
        expect(
            Utils.joinUrl('https://apps-ws.xoyo.com/', '/passport/get_info')
        ).to.be.equals(`https://apps-ws.xoyo.com/passport/get_info`);
    });

    it('joinUrl：在连接处自动处理3个/的情况, 不应直接回到根host', () => {
        expect(
            Utils.joinUrl('https://apps-ws.xoyo.com/relative', '//passport/get_info')
        ).to.be.equals(`https://apps-ws.xoyo.com/relative/passport/get_info`);
    });

    it('joinUrl：存在相对路径时，按照原意依旧拼接，不应直接回到根host', () => {
        expect(
            Utils.joinUrl('https://apps-ws.xoyo.com/relative', '/passport/get_info')
        ).to.be.equals(`https://apps-ws.xoyo.com/relative/passport/get_info`);
    });

    it('joinUrl：禁止使用../或者./', () => {
        expect(
            () => Utils.joinUrl('https://apps-ws.xoyo.com/relative', '../passport/get_info')
        ).to.throw(`Utils/index.ts: joinUrl不支持./或../`);
    });

    it('joinUrl：应该只是//无协议的情况', () => {
        expect(
            Utils.joinUrl('//apps-ws.xoyo.com/relative', '/passport/get_info')
        ).to.be.equals(`//apps-ws.xoyo.com/relative/passport/get_info`);
    });
});
