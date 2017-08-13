export interface IRequest {
}

export interface IRequestConfigs {
    [key: string]: any;

    /**
     * 如果在配置参数中存在$$response
     * 则直接拦截当前请求
     */
    $$response?: any;
    /**
     * 用于标识每一个请求
     */
    uid?: number;
    /**
     * 最终提交的请求url
     */
    url?: string;
    /**
     * 提交数据data
     */
    data?: object;
    /**
     * TODO: 测试这里
     * 请求的相对路径，用于和apiRoot拼接，但如果配置中存在url，则优先url
     * 例如：（无需关系前置是否有/左斜杠，这里已经处理有斜杠的情况）
     * apiName：user/get-name 或 /user/get-name
     * apiRoot：http://localhost 或 http://localhost/
     * 最终请求url为：
     * http://localhost/user/get-name
     */
    apiName?: string;
    /**
     * 请求的根路径，用于和apiName拼接，但如果配置中存在url，则优先url
     * 例如：（无需关系前置是否有/左斜杠，这里已经处理有斜杠的情况）
     * apiName：user/get-name 或 /user/get-name
     * apiRoot：http://localhost 或 http://localhost/
     * 最终请求url为：
     * http://localhost/user/get-name
     */
    apiRoot?: string;
    options?: IRequestOptions;
}

export interface IInterceptor {
    request?: RequestType;
    response?: ResponseType;
    responseReject?: ResponseRejectType;
}

export interface IRequestOptions {
    [key: string]: string;

    dataType?: 'jsonp' | string;
    method: MethodType;
}

export type RequestType = (requestConfigs: IRequestConfigs) => IRequestConfigs;
export type ResponseType = (...args: any[]) => any;
export type ResponseRejectType = (this: Request, res: object, requestConfigs: object) => any;

export type MethodType = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'trace' | 'connect';

export abstract class AbstractRequest implements IRequest {
    /**
     * @type {number} 请求拥有唯一ID
     */
    private static uid = 0;
    /**
     * 根路径
     */
    public apiRoot: string;
    /**
     * 请求前拦截
     */
    protected requests: RequestType[];
    /**
     * 返回后拦截
     */
    protected responses: ResponseType[];
    /**
     * 失败返回拦截
     */
    protected responseRejects: ResponseRejectType[];

    /**
     * 初始化成员变量
     * requests：请求前拦截
     * responses：请求成功后拦截
     * responseRejects：请求失败后拦截
     */
    public constructor({apiRoot = ''} = {},
                       requests: RequestType[] = [],
                       responses: ResponseType[] = [],
                       responseRejects: ResponseRejectType[] = []) {
        this.apiRoot = apiRoot;
        this.requests = requests;
        this.responses = responses;
        this.responseRejects = responseRejects;
    }

    public setApiRoot(apiRoot: string): void {
        this.apiRoot = apiRoot;
    }

    /**
     * 请求实现
     * @param {string} url 请求地址
     * @param {Object} data 请求参数
     * @param options
     * @returns {Promise<*>}
     */
    public abstract requestImplementation(url: string, data?: object, options?: IRequestOptions): Promise<any>;

    /**
     * 获取promise resolver
     * @returns {Promise<*>}
     */
    public abstract getPromiseResolve(args?: any): Promise<any>;

    /**
     * 注册拦截事件
     * @param interceptor {object} 拦截对象
     */
    public register(interceptor: IInterceptor): void {
        const {requests, responses, responseRejects} = this;
        const {request, response, responseReject} = interceptor;
        if (request) {
            requests.push(request);
        }
        if (response) {
            responses.push(response);
        }
        if (responseReject) {
            responseRejects.push(responseReject);
        }
    }

    /**
     * get 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public get (apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('get', apiName, data, requestConfigs);
    }

    /**
     * post 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public post(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('post', apiName, data, requestConfigs);
    }

    /**
     * put 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public put(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('put', apiName, data, requestConfigs);
    }

    // noinspection ReservedWordAsName
    /**
     * delete 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public delete(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('delete', apiName, data, requestConfigs);
    }

    /**
     * options 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public options(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('options', apiName, data, requestConfigs);
    }

    /**
     * head 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public head(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('head', apiName, data, requestConfigs);
    }

    /**
     * trace 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public trace(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('trace', apiName, data, requestConfigs);
    }

    /**
     * connect 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public connect(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        return this.general('connect', apiName, data, requestConfigs);
    }

    /**
     * jsonp 请求
     * @param apiName 请求地址
     * @param data 请求数据
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    public jsonp(apiName: string, data?: object, requestConfigs?: IRequestConfigs): Promise<any> {
        const options = {dataType: 'jsonp'} as IRequestOptions;
        return this.get(apiName, data, {...requestConfigs, ...{options}});
    }

    /**
     * 通用请求处理函数
     * @param method 请求方法
     * @param apiName 通用请求
     * @param data 请求数据
     * @param rawRequestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    private general(method: MethodType, apiName: string,
                    data?: object, rawRequestConfigs?: IRequestConfigs): Promise<any> {
        let options;
        if (rawRequestConfigs && rawRequestConfigs.options) {
            options = {...rawRequestConfigs.options, method};
        } else {
            options = {method};
        }
        let requestConfigs = {data, apiName, options} as IRequestConfigs;
        requestConfigs = rawRequestConfigs ? {...rawRequestConfigs, ...requestConfigs} : requestConfigs;
        if (!requestConfigs.apiRoot) {
            requestConfigs.apiRoot = this.apiRoot;
        }
        if (!requestConfigs.url) {
            requestConfigs.url = requestConfigs.apiRoot + apiName;
        }
        return this.send(requestConfigs);
    }

    /**
     * 请求核心实现
     * @param requestConfigs {options} 参考底层requestHelper
     * @returns {*} 返回请求后的数据
     */
    private send(requestConfigs: IRequestConfigs): Promise<any> {
        /**
         * 保证每一个请求都有独立的uid
         */
        if (!requestConfigs.uid) {
            requestConfigs.uid = ++AbstractRequest.uid;
        }

        const {requests, responses, responseRejects} = this;
        // 遍历请求前的拦截方法
        const requestPromise = requests.reduce((prev, cur) => {
            return prev.then(function (): Promise<any> {
                const args = Array.prototype.slice.call(arguments);
                return cur.apply(this, [...args, requestConfigs]);
            });
        }, this.getPromiseResolve(requestConfigs));

        let response = requestPromise.then((requestConfigs: IRequestConfigs) => {
            const {url, data, options, $$response} = requestConfigs;
            /**
             * 如果在配置参数中存在$$response
             * 则直接拦截当前请求
             */
            if ($$response !== undefined) {
                return this.getPromiseResolve($$response);
            }
            return this.requestImplementation(url, data, options);
        });
        // 遍历返回后的拦截失败方法
        response = responses.reduce((prev, cur) => {
            return prev.then((...args: any[]) => {
                return cur.apply(this, args.concat(requestConfigs));
            });
        }, response);

        // 遍历返回后的拦截失败方法
        return responseRejects.reduce((prev, cur) => {
            return prev.then(void 0, (res) => cur.call(this, res, requestConfigs));
        }, response);
    }
}
