import {AbstractRequest, IRequestConfigs, IRequestOptions, RequestType, ResponseRejectType, ResponseType} from '../abstract-request/index';

export type MockResponseType = any | RequestType;

interface IMock {
    [key: string]: MockResponseType;
}

function getResponseFromMock(rawResponse: MockResponseType, requestConfigs: IRequestConfigs): any {
    let response;
    if (typeof rawResponse === 'function') {
        response = (rawResponse as RequestType)(requestConfigs);
    } else {
        response = rawResponse;
    }
    return response;
}

function registerRequestWithMock(context: JQueryRequest): void {
    context.register({
        request: (requestConfigs: IRequestConfigs) => {
            const {mock} = context;
            const {url} = requestConfigs;
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

export default class JQueryRequest extends AbstractRequest {

    private static getJqueryVersion(): string {
        return $.fn.jquery;
    }

    private static invariantJQueryVersion(): void {
        const jqueryVersion = JQueryRequest.getJqueryVersion();
        if (jqueryVersion !== '1.7.2') {
            throw new Error(`当前使用JQuery版本（${jqueryVersion}）潜在不兼容的情况，` +
                `当前实现针对JQuery 1.7.2，出于稳定性的考虑，请确保您使用的JQuery版本正确通过测试用例`);
        }
    }

    /**
     * 模拟数据配置
     */
    public mock: IMock;

    constructor(options?: { apiRoot: string }, requests?: RequestType[],
                responses?: ResponseType[], responseRejects?: ResponseRejectType[]) {
        super(options, requests, responses, responseRejects);
        registerRequestWithMock(this);
    }

    /**
     * 根据 mock value 可以使用 function 的方式提供正则匹配方法
     * @param {RegExp} regex 正则
     * @param mockResponse {MockResponseType} 返回类型，可以试function或者直接试返回值
     * @returns {MockResponseType}
     */
    public mockRegexMatcher(regex: RegExp, mockResponse: MockResponseType): MockResponseType {
        return (requestConfigs: IRequestConfigs) => {
            if (regex.test(requestConfigs.url)) {
                return mockResponse;
            }
        };
    }

    // noinspection JSMethodCanBeStatic
    public create(options?: { apiRoot: string }, requests?: RequestType[],
                  responses?: ResponseType[], responseRejects?: ResponseRejectType[]): JQueryRequest {
        return new JQueryRequest(options, requests, responses, responseRejects);
    }

    public requestImplementation(url: string, data: object, options: IRequestOptions): Promise<any> {
        const {dataType, method, ...restParams} = options;

        JQueryRequest.invariantJQueryVersion();
        /**
         * 由于JQuery 1.10+的行为 $.support.cors 默认值为true，并且在IE8-，当前 cors 值由true变成了false
         * 故统一行为
         * @type {boolean}
         */
        $.support.cors = true;

        return $.ajax({
            type: method,
            url,
            data,
            dataType,
            ...restParams
        }) as any;
        // JQueryRequest.overwritePromiseObject(jqueryPromise);
    }

    public getPromiseResolve(args: any): Promise<any> {
        const resolvedValue = $.Deferred().resolve(args);
        JQueryRequest.invariantJQueryVersion();
        // JQueryRequest.overwritePromiseObject(resolvedValue);
        return resolvedValue as any;
    }
}
