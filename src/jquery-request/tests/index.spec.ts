import * as sinon from 'sinon';
import {expect} from 'chai';
import './jsdom-configs';
import ResponseModal from '../../models/ResponseModal';
import {IRequestConfigs, MethodType} from '../../abstract-request/index';
import jQueryRequest from '../index';
import Deferred = JQuery.Deferred;

/**
 * 注入sinon的拦截处理
 * @param {Object} mockData
 * @param {() => Promise<any>} callback
 * @returns {Promise<any>}
 */
function sinonIntercept(mockData: object, callback: () => Promise<any>): Promise<any> {
    const deferred = $.Deferred();
    const stub = sinon.stub($, 'ajax').returns(deferred);
    const promise = callback();
    deferred.resolveWith(this, [mockData]);
    stub.restore();
    return promise;
}

describe(`jquery-request`, () => {
    it('jquery ajax pipe: 原始JQuery 1.7.2 pipe 方法行为应该接近 标准Promise then', () => {
        return $.ajax('http://localhost:3000/login-success').pipe((res) => {
            return {
                ...res,
                code: 2
            };
        }).pipe((res) => {
            expect(res.code).to.be.equal(2);
        });
    });
    it('jquery ajax then: 原始JQuery 1.7.2 then 方法设计缺失，所以 then 无法修改值', () => {
        return $.ajax('http://localhost:3000/login-success').then((res) => {
            return {
                ...res,
                code: 2
            };
        }).then((res) => {
            expect(res.code).to.be.equal(2);
        });
    });

    it('new instance: jquery-request 允许创建一个全新的实例', () => {
        const request = jQueryRequest.create();
        const url = 'http://localhost:3000/login-success';
        return request.get(url).then((response: ResponseModal) => {
            const {code, data, message} = response;
            expect(code).to.be.equal(1);
            expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            expect(message).to.be.equal('');
        });
    });

    it('new instance: jqueryRequest.create 全新的实例依旧拥有内置的拦截函数配置', () => {
        const request = jQueryRequest.create();
        request.mock = {
            'http://localhost:3000/login-success': {
                code: 1,
                message: '',
                data: 'mock data'
            }
        };
        const url = 'http://localhost:3000/login-success';
        return request.get(url).then((response: ResponseModal) => {
            const {code, data, message} = response;
            expect(code).to.be.equal(1);
            expect(data).to.be.equal('mock data');
            expect(message).to.be.equal('');
        });
    });

    it('get：模拟登陆成功，正确解析返回数据', () => {
        const url = 'http://localhost:3000/login-success';
        return jQueryRequest.get(url).then((response: ResponseModal) => {
            const {code, data, message} = response;
            expect(code).to.be.equal(1);
            expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            expect(message).to.be.equal('');
        });
    });

    it('get：模拟登陆失败，正确解析返回数据', () => {
        const url = 'http://localhost:3000/login-error';
        return jQueryRequest.get(url).then((response: ResponseModal) => {
            const {code, data, message} = response;
            expect(code).to.be.equal(-20101);
            expect(data).to.be.eql({
                request_id: '34454339-A521-DDDE-703D-EEC222A352E8'
            });
            expect(message).to.be.equal('请先登录');
        });
    });

    it(`get：获取所有用户`, () => {
        const url = 'http://localhost:3000/get-user';
        return jQueryRequest.get(url).then((responses: ResponseModal[]) => {
            expect(responses.length).to.be.equal(2);
        });
    });

    it(`get：传递username=allen能找到对应用户`, () => {
        const url = 'http://localhost:3000/get-user?data.username=allen';
        return jQueryRequest.get(url).then((responses: ResponseModal[]) => {
            const {code, data, message} = responses[0];
            expect(code).to.be.equal(1);
            expect(data.username).to.be.eql('allen');
            expect(message).to.be.equal('');
        });
    });

    it(`post：提交账户信息参数并注册用户`, () => {
        const url = 'http://localhost:3000/register';
        const data = {
            id: 1,
            username: 'allen',
            password: 'hello world'
        };

        return jQueryRequest.post(url, data).then((response: any) => {
            expect(response).to.be.eql({id: 1, username: 'allen', password: 'hello world'});
        });
    });

    it(`head：获取 response headers 中的 last modify`, () => {
        const url = 'http://localhost:3000';
        return jQueryRequest.head(url).then(/* tslint:disable */function () /* tslint:enable */ {
            const xhr = arguments[2];
            const lastModify = xhr.getResponseHeader('last-modified');
            expect(lastModify).not.to.be.equal(null);
            expect(isNaN(+new Date(lastModify))).not.to.be.equal(true);
        });
    });

    it(`head：多次then后第三个参数 xhr 应该保留不会丢失`, () => {
        const url = 'http://localhost:3000';
        return jQueryRequest.head(url).then(/* tslint:disable */function () /* tslint:enable */ {
            const xhr = arguments[2];
            expect(typeof xhr).to.be.equal('object');
            return arguments;
        }).then(/* tslint:disable */function () /* tslint:enable */ {
            const xhr = arguments[2];
            expect(typeof xhr).to.be.equal('object');
        });
    });

    it(`jsonp：普通提交，获取完整json数据`, () => {
        return sinonIntercept(
            {code: 1, data: {message: 'jsonp returned'}, message: ''},
            () =>
                jQueryRequest.jsonp('').then((response: ResponseModal) => {
                    const {code, data, message} = response;
                    expect(code).to.be.equal(1);
                    expect(data).to.be.eql({
                        message: 'jsonp returned'
                    });
                    expect(message).to.be.equal('');
                })
        );
    });

    it(`version: 设置jquery版本为不合法，期望抛出异常`, (done) => {
        function temporarySetJqueryVersion(cb: () => void): void {
            const originalVersion = $.fn.jquery;
            $.fn.jquery = '1.10.1';
            try {
                cb();
            } finally {
                $.fn.jquery = originalVersion;
                done();
            }
        }

        expect(() => temporarySetJqueryVersion(() => jQueryRequest.jsonp('/'))).to.throw('');
    });

    it(`error: 处理404 not found error`, (done) => {
        const server = sinon.fakeServer.create();
        jQueryRequest.get('http://localhost:3000/404').then((f: any) => f, /* tslint:disable */function () /* tslint:enable */ {
            const res = arguments[0];
            const status = arguments[1];
            const httpDescription = arguments[2];
            expect(res.status).to.be.equal(404);
            expect(status).to.be.equal('error');
            expect(httpDescription).to.be.equal('Not Found');
            done();
        });
        server.respondWith(
            'GET',
            '/',
            [
                200, {'Content-Type': 'application/json'},
                '[' + JSON.stringify({test: 1}) + ']'
            ]);
        server.respond();
        server.restore();
    });

    it(`ECONNREFUSED`, (done) => {
        const url = 'http://localhost:9999/login-success';
        jQueryRequest.get(url).then((f: any) => f, /* tslint:disable */function () /* tslint:enable */ {
            expect(arguments[1]).to.be.equal('error');
            done();
        });
    });

    it(`拦截: 请求前加入自定义参数`, () => {
        const request = jQueryRequest.create();
        const url = 'http://localhost:3000/login-success';
        request.register({
            request(requestConfigs: IRequestConfigs): IRequestConfigs {
                requestConfigs.mock = true;
                return requestConfigs;
            }
        });

        request.register({
            request(requestConfigs: IRequestConfigs): IRequestConfigs {
                expect(requestConfigs.mock).to.be.equal(true);
                requestConfigs.skipExternalRequest = true;
                return requestConfigs;
            }
        });

        return request.get(url).then((response: ResponseModal) => {
            const {code, data, message} = response;
            expect(code).to.be.equal(1);
            expect(data).to.be.eql({
                request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
            });
            expect(message).to.be.equal('');
        });
    });

    it(`拦截: 请求成功后加工数据`, () => {
        const request = jQueryRequest.create();
        const url = 'http://localhost:3000/login-success';
        request.register({
            response(res: ResponseModal): ResponseModal {
                res.code = 100;
                return res;
            }
        });
        request.register({
            response(res: ResponseModal): ResponseModal {
                return new ResponseModal(res.data, res.code, res.message);
            }
        });
        return request.get(url).then((response: ResponseModal) => {
            expect(response instanceof ResponseModal).to.be.equal(true);
            expect(response.code).to.be.equal(100);
        });
    });

    it(`拦截: head 请求拦截获取get response headers`, (done) => {
        const request = jQueryRequest.create();
        const url = 'http://localhost:3000/get-current-year';
        request.register({
            request(requestConfigs: IRequestConfigs): IRequestConfigs {
                if (localStorage.serverTime) {
                    const clientCurrentYear = new Date().getFullYear();
                    if (clientCurrentYear !== localStorage.currentYear) {
                        // 由于单元测试的原因， 浏览器环境请使用localStorage.removeItem
                        localStorage.currentYear = null;
                    }
                    requestConfigs.$$response = localStorage.serverTime;
                }
                return requestConfigs;
            },
            response(res: any, statusText: string, xhr: JQueryXHR, requestConfigs: IRequestConfigs): void {
                if (requestConfigs.url === url) {
                    const lastModify = xhr.getResponseHeader('last-modified');
                    expect(lastModify).not.to.be.equal(null);
                    const lastModifyDate = new Date(lastModify);
                    expect(isNaN(+lastModifyDate)).not.to.be.equal(true);
                    localStorage.currentYear = lastModifyDate.getFullYear();
                    return localStorage.currentYear;
                }
                return res;
            }
        });
        const firstRequest = () => request.head(url).then((response: ResponseModal) => {
            expect(response).to.be.equal('');
        });
        const secondRequest = () => request.head(url).then((response: ResponseModal) => {
            expect(response).to.be.equal('');
            done();
        });
        firstRequest().then(secondRequest);
    });

    it(`拦截: 请求成功后，根据数据强制认定该promise应该为失败`, (done) => {
        const request = jQueryRequest.create();
        const url = 'http://localhost:3000/login-success';
        request.register({
            response(res: ResponseModal): Deferred<string> | ResponseModal {
                /**
                 * 假设我们认为request_id在以下值时不合法，切换到reject
                 */
                if (res.data.request_id === `2A5BDF18-F11F-9CEB-CE93-348AB9340EE4`) {
                    return $.Deferred().reject('should be redirected as reject promise');
                }
                return res;
            }
        });
        request.get(url).then((f: any) => f, (res: string) => {
            expect(res).to.be.equal('should be redirected as reject promise');
            done();
        });
    });

    it(`promise: 符合promise api的行为，允许连续多个promise使用`, () => {
        const url = 'http://localhost:3000/login-success';
        return jQueryRequest.get(url)
            .then((res: ResponseModal) => {
                return res.data;
            })
            .then((data: any) => {
                expect(data).to.be.eql({request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'});
            });
    });

    it(`promise: 符合promise api的行为，允许promise chaining的过程中根据数据切换到reject状态`, (done) => {
        const url = 'http://localhost:3000/login-success';
        jQueryRequest.get(url)
            .then((res: ResponseModal) => {
                if (res.data.request_id === `2A5BDF18-F11F-9CEB-CE93-348AB9340EE4`) {
                    return $.Deferred().reject('should be redirected as reject promise');
                }
                return res;
            })
            .then((f: any) => f, (data: any) => {
                return '再次加工';
            })
            .then((f: any) => f, (data: any) => {
                expect(data).to.be.equal('再次加工');
                done();
            });
    });

    it(`promise: 链式中没有返回应该当成undefined处理`, () => {
        const url = 'http://localhost:3000/login-success';
        return jQueryRequest.get(url)
            .then((res: ResponseModal) => {
                // if coder forget to return
            })
            .then((f: any) => f, (data: any) => {
                expect(data).to.be.equal(undefined);
            });
    });

    it(`mock: 配置mock实现假数据`, () => {
        const request = jQueryRequest.create();
        request.mock = {
            'http://localhost:3000/login-success': {
                data: 666
            }
        };
        return request.get('http://localhost:3000/login-success').then((res: any) => {
            expect(res.data).to.be.equal(666);
        });
    });

    it(`mock: 配置mock实现假数据，配置允许使用 function`, () => {
        const request = jQueryRequest.create();
        request.mock = {
            'http://localhost:3000/login-success': (requestConfigs: IRequestConfigs) => {
                if (requestConfigs.options.method === 'post') {
                    return {
                        data: 666
                    };
                } else {
                    return undefined;
                }
            },
            '/get-name': 'allen'
        };

        return $.when(
            request.get('http://localhost:3000/login-success'),
            request.post('http://localhost:3000/login-success'),
            request.post('/get-name')
        ).then(([resFromGet], resFromPost, resFromGetName) => {
            expect(resFromGet).to.be.eql({
                code: 1,
                message: '',
                data: {
                    request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
                }
            });
            expect(resFromPost).to.be.eql({
                data: 666
            });
            expect(resFromGetName).to.be.equal('allen');
        });
    });

    it('mock: 配置mock实现假数据， 使用 * 可以匹配一切 url', () => {
        const request = jQueryRequest.create();
        request.mock = {
            '*': (requestConfigs: IRequestConfigs) => {
                if (requestConfigs.options.method === 'get') {
                    return {
                        data: 666
                    };
                }
            }
        };
        return request.get('http://localhost:3000/login-success').then((res) => {
            expect(res.data).to.be.equal(666);
        });
    });

    it('mock: 配置mock实现假数据， 使用 * 后依然正确匹配 url，以后这为准， 这样的设计提供一个方式 * 检查所有请求', () => {
        const request = jQueryRequest.create();
        request.mock = {
            '*': (requestConfigs: IRequestConfigs) => {
                if (requestConfigs.options.method === 'get') {
                    return {
                        data: 666
                    };
                }
            },
            'http://localhost:3000/login-success': (requestConfigs: IRequestConfigs) => {
                if (requestConfigs.options.method === 'get' as MethodType) {
                    return {
                        data: 777
                    };
                }
            }
        };
        return request.get('http://localhost:3000/login-success').then((res) => {
            expect(res.data).to.be.equal(777);
        });
    });

    it('mock: 配置mock实现假数据， 使用 * 的方式自定义正则匹配规则', () => {
        const request = jQueryRequest.create();

        request.mock = {
            '*': request.mockRegexMatcher(/.*\/login-.*$/, {data: 666})
        };
        return $.when(
            request.get('http://localhost:3000/login-success'),
            request.get('http://localhost:3000/login-error'),
            request.get('http://localhost:3000/register'),
        ).then((resFromSuccess, resFromError, [resFromRegister]) => {
            expect(resFromSuccess.data).to.be.equal(666);
            expect(resFromError.data).to.be.equal(666);
            expect(resFromRegister).to.be.eql([
                {
                    id: 1,
                    username: 'allen',
                    password: 'hello world'
                }
            ]);
        });
    });

    it('promise catch: 配置mock实现假数据， 使用 * 的方式自定义正则匹配规则', () => {
        const request = jQueryRequest.create();
        request.mock = {
            '*': request.mockRegexMatcher(/.*\/login-.*$/, {data: 666})
        };
        return $.when(
            request.get('http://localhost:3000/login-success'),
            request.get('http://localhost:3000/login-error'),
            request.get('http://localhost:3000/register'),
        ).then(() => {
            return $.Deferred().reject(`reject from here`);
        }).fail((data) => {
            expect(data).to.be.equal('reject from here');
            return 'reject again';
        }).fail((data) => {
            expect(data).to.be.equal('reject again');
        });
    });

    it('timeout: 设置5秒超时， 并正确返回超时错误', () => {

    });

    it('cookie: 使用 with credentials 跨域传递 cookie', () => {

    });
    it('headers：请求携带headers', () => {

    });
    it('cookie: 跨域携带cookie', () => {

    });
});
