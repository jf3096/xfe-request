# xfe-request
> 前端请求抽象模块，基于angular请求拦截原理定制实现。

## 说明

当前这个库核心部分提供在请求前，请求成功和请求失败等3个环节的拦截机制。这样做可以根据项目需求实现以下：

1. 请求前可以校验是否登录
2. 自动拦截并切换请求到测试数据
3. 请求失败后根据状态码统一做相应操作
4. 请求成功后提前加工解析数据

由于在设计上使用的是抽象类，所以可以轻易的接入多个ajax实现类如jquery ajax，fetch等。

## 注意

由于公司 PC 端主要使用 JQuery 1.7.2 进行日常开发， 所以jquery-request仅仅
只面向 JQuery 1.7.2 做单元测试 （暂只针对1.7.2的主要原因在于JQuery 1.5到1.8 做了多次Promise API变更
在promise的实现不符合ES6 Promise标准）。若后续需要版本升级，只需在版本升级后执行单元测试用例即可完成升级。

## 实用功能

1. 提供拦截，允许在环节中装饰数据
2. 支持 CommonJS, AMD, NO Module（ IE6+）
3. 支持注入缓存或 mock 数据。

## 使用 xfe-request

#### 获取变量
```javascript
    <script src='xxx/xxx/xfe-request.min.js'></script>
    <script>
        var jQueryRequest = window.XFERequest.jQueryRequest; // window 可省略
    </script>
```

#### 简单用例
无论是amd，cmd，commonjs还是日常JQuery （no module standard）下，我们希望以下函数能单独写到一个或多个文件，
该文件我们作为**service层**管理，不应该在内部编写任何业务相关代码。
（如果能使用ES6的写法，请使用class定义以下方法更优）

**注意： 以下测试域名 http://jx3.xoyo.com 直接调用会有跨域问题，请使用代理或者host进行相关测试。**

##### Service 层

```javascript
    (function (xoyoService) {
        /**
         * 使用 get 请求获取用户信息
         */
        xoyoService.getUserInfo = function () {
            return jqueryRequest.get('http://jx3.xoyo.com/user-info');
        }
        
        /**
         * 使用 post 注册
         */
        xoyoService.register = function (account) {
            return jqueryRequest.post('http://jx3.xoyo.com/register', account));
        }
        
        /**
         * 使用 jsonp 判断是否已经登陆
         */
        xoyoService.hasLogin = function () {
            return jqueryRequest.jsonp('http://jx3.xoyo.com/has-login'));
        }
        
        /**
         * 使用 head 获取服务器时间
         * 可用于copy right
         */
        xoyoService.getServerDateTime = function () {
            return jqueryRequest.head('http://jx3.xoyo.com')).then((response, status, jqXhr)=>{
                // response 为返回数据的实体，head 请求不存在实体， 所以该值为 undefined
                // status 为 “nocontent”
                // jqXhr 为 jquery xhr 函数
                var dateString = jqXhr.getResponseHeader('Date');
                // service 层允许对数据简单加工处理
                return new Date(dateString);
            });
        } 
    })(xoyoService || (xoyoService = {}));
```

##### 业务层
```javascript
    <script src='xxx/xxx/xoyo-service.js'></script>
    
    /**
     * 创建枚举统一规范返回数据状态
     * 请注意大小写，大写小的规范来源TS枚举 https://www.typescriptlang.org/docs/handbook/enums.html
     */
    var ResponseStatus = {
        Success: 1,
        Error: -1
    }
    
    xoyoService.getUserInfo().then(function(res) {
        var status = res.status;
        var data = res.data;
        if (status === ResponseStatus.Success) {
            var username = data.username;
            $('.username').text(username);
        }
        throw new Error('xoyoService.getUserInfo has invalid status. status = '+ status);
    });
    
    
    var username = $('#register-form .username').val();
    var password = $('#register-form .password').val();
    var account = {
        username: username,
        password: password
    };
    xoyoService.register(account).then(function(res) {
        var status = res.status;
        if (status === ResponseStatus.Success) {
            alert('注册成功');
        }
        else if (status === ResponseStatus.Error) {
            alert('注册失败');
        }
        throw new Error('xoyoService.getUserInfo has invalid status. status = '+ status);
    });
    ...
```

分析以上代码，使用 promise 尽管比以前 callback 的方式简洁不少，服务层和业务层的简单分离，枚举去处理状态，
主动抛异常，对返回数据简单加工等，但是依旧有很多问题，以下是第一步代码优化：

Service 层 (优化)
```javascript

    /**
     * 创建枚举统一规范返回数据状态
     * 请注意大小写，大写小的规范来源TS枚举 https://www.typescriptlang.org/docs/handbook/enums.html
     */
    var ResponseStatus = {
        Success: 1,
        Error: -1
        RequiredLogin: -10402
    }

    /**
     * 设置当前 service 请求的域名
     * 设置后所有的请求不再需要手动加入 http://jx3.xoyo.com
     * 建议使用该方法易于维护，并且不需要考虑域名和相对路径拼接时考虑左斜杠 / 的问题 （“http://jx3.xoyo.com” + "/" + “user-info”）
     */
    jqueryRequest.setApiRoot('http://jx3.xoyo.com');
    
    /**
     * 根据需求，我们往往可以提前对返回数据做相应加工工作，
     * 例如：
     * 返回的数据结构都是：
     * {
     *     data: {...}
     *     message: “...”
     *     status: {}
     * }
     * 1. 返回数据90%以上都是成功且我几乎（注意用词）是 response 里面的 data，
     * 2. 对于
     */
    jqueryRequest.register({
        response: function(res){
            var code = res.code;
            var data = res.data;
            if (code === ResponseStatus.Success) {
                return data;
            }
            else if (code === ResponseStatus.RequiredLogin) {
                // 调用登录
                // 注意：这里如果是promise可以在promise完成后再次发起请求
                // 其次，以下代码直接置入此处属于污染行为，但为了不再增加复杂度，在本案例中采取这种写法
                XPASS.signin();
            }
            else if (code === ResponseStatus.Error) {
                /**
                 * 如果错误码等于 ResponseStatus.Error， 交给reject去处理，
                 * 这样我们能清楚的关注成功和单独处理失败
                 */
                return $.Deferred().reject(res);
            }
            /**
             * 当我们遇到未知错误码的时候可以直接抛出异常，这样我们能使用日志等方式报警
             * 如果没有抛异常错误过于滞后难以追踪甚至并没有显式错误导致后续代码进入不可控逻辑区域
             */
            throw new Error('xoyoService: invalid status. status = '+ status);
        }
    })

    /**
     * 使用 get 请求获取用户信息
     */
    xoyoService.getUserInfo = function () {
        return jqueryRequest.get('user-info');
    }
    
    /**
     * 使用 post 注册
     */
    xoyoService.register = function (account) {
        return jqueryRequest.post('register', account));
    }
```

#### 业务层 (优化）
```javascript
    <script src='xxx/xxx/xoyo-service.js'></script>
    
    xoyoService.getUserInfo().then(function(data) {
        // 这里较先前能直接使用data并且不需要考虑一些异常分支，因为拦截器已经做了相应操作。
        var username = data.username;
        $('.username').text(username);
    });
    
    var username = $('#register-form .username').val();
    var password = $('#register-form .password').val();
    var account = {
        username: username,
        password: password
    };
    
    xoyoService.register(account).then(function(res) {
        alert('注册成功');
    }, function() {
         if (status === ResponseStatus.Error) {
            alert('注册失败');
         }
    });
    ...
```

## 注意
在 JQuery 1.5 后 ajax 新增了对 Promise 的支持 (Derfer)， 但由于当时 API 并没有一个统一标准导致， 其中主要问题在于
Promise 的 then 无法将变更的值一直传递下去。

```javascript
    $.ajax().then((res)=>{
        // res = {code: 1, message: "", data: {...}}
        return 'data has been changed'
    }).then((res)=>{
        // 在标准 Promise API 下 res = 'data has been changed'
        // 在 Ajax Promise 下却是 res = {code: 1, message: "", data: {...}}, 
    })
```

## Mock Data

### 基本使用
在开发过程中，Mock 数据是必不可少的。其中一个常见的方案是使用 Mock Server，接着我们把测试数据编写到 Mock Server 中。
在这个过程中我们需要：

1. 搭建 Mock Server
2. 编写 Mock 数据
3. 在代码中 URL 指向 Mock Server （或者DNS HOST）
4. 开发完成后需要手动移除测试数据。

在这个过程中开发人员往往认为过于繁琐，所以更愿意把测试代码编写在项目中，其实这样也是合理的，在测试工具 SINON 在某种程度
上也做了同样的事情。但这样做暴露了一个更严重的问题：测试数据容易因为认为失误被部署到线上了。

为了解决上述问题， XFE-Request 提供一个简便的方式：

```javascript
    it('mock: 配置mock实现假数据', () => {
        jQueryRequest.mock = {
            'http://localhost:3000/login-success': {
                data: 'success'
            },
            'http://localhost:3000/login-error': {
                data: 'error'
            }
        };
        return jQueryRequest.get('http://localhost:3000/login-success').then((res) => {
            expect(res.data).to.be.equal('success');
        });
    });
```

在这个简单的单元测试中，我们把需要拦截 URL 作为对象的 key，而这个URL的值就是 mock data。
当请求命中 http://localhost:3000/login-success 时，无论 get 或者 post，都会忽略网络请求，转而使用 Mock 数据。

### 动态返回
直接使用 {data: 'success'} 作为 mock data 能解决我们 80% 以上的业务需求，为了让 mock data 更动态，这里可以使用函数。

```javascript
    it(`mock: 配置mock实现假数据，配置允许使用 function`, () => {
        jQueryRequest.mock = {
            'http://localhost:3000/login-success': (requestConfigs) => {
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
            jQueryRequest.get('http://localhost:3000/login-success'),
            jQueryRequest.post('http://localhost:3000/login-success'),
            jQueryRequest.post('/get-name')
        ).then(([resFromGet], resFromPost, resFromGetName) => {
            // 服务端返回的数据
            expect(resFromGet).to.be.eql({
                code: 1,
                message: '',
                data: {
                    request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE4'
                }
            });
            // mock 数据
            expect(resFromPost).to.be.eql({
                data: 666
            });
            // mock 数据
            expect(resFromGetName).to.be.equal('allen');
        });
    });
```

函数参数 requestConfigs 为请求配置，开发者可以根据请求配置做定制化的拦截。
上述例子我们可以仅仅只拦截post请求并替换成 mock data，其他情况可以不返回或者返回 undefined，undefined 表示不拦截。

### 全局拦截 mock 数据
以下方法拦截所有的 get 请求。
```javascript
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
```

### Regex 正则匹配

根据 * 的形式，衍生 Regex 匹配替换。提供 jQueryRequest.mockRegexMatcher 匹配正则。

```javascript
    it('mock: 配置mock实现假数据， 使用 * 的方式自定义正则匹配规则', () => {
        jQueryRequest.mock = {
            '*': jQueryRequest.mockRegexMatcher(/.*\/login-.*$/, {data: 666})
        };
        return $.when(
            jQueryRequest.get('http://localhost:3000/login-success'),
            jQueryRequest.get('http://localhost:3000/login-error'),
            jQueryRequest.get('http://localhost:3000/register'),
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
```
上述方法匹配 ‘login-’ 并返回 {data: 666}

## 拦截器

拦截器是当前API库的核心，理解它能很大程度封装自己的代码，简化代码逻辑，并且能够使用无侵入的方式优化代码。

场景：剑网3的footer每次都需要获取服务器时间的年份，并添加到 copy right。
分析：年份周期非常长，一年变更一次，那么我们可以使用 localStorage 等方式存储起来 （仅仅只是DEMO，如果一定要实时稳定请走服务器）。

```javascript
    const Response = {
        Success: 1
    };
    /**
     * footer 缓存
     */
    jqueryRequest.register({
        request(requestConfigs) {
            const currentYear = localStorage.getItem('currentYear');
            if (currentYear) {
                const clientCurrentYear = new Date().getFullYear();
                if (clientCurrentYear !== currentYear) {
                    localStorage.removeItem('currentYear');
                } else {
                    requestConfigs.$$response = currentYear;
                }
            }
            return requestConfigs;
        },
        response(res, statusText, xhr, requestConfigs) {
            if (!res && requestConfigs.url === 'http://jx3.xoyo.com/') {
                const dateString = xhr.getResponseHeader('date');
                const date = new Date(dateString);
                if(!isNaN(+date)) {
                    localStorage.setItem('currentYear', date.getFullYear());
                    return localStorage.currentYear;
                }
            }
            return res;
        }
    })
```

## 兼容JQuery

jQueryRequest.get(<url>, <data>, <requestConfigs>), JQuery Ajax 的参数对应requestConfigs中options，例如：

```javascript
    $.ajax({
        url: '/',
        withCredentials: true,
        async: true
    })
    
    // 等效于
    
    jquertRequest.get('/', undefined, {options: { withCredentials: true, async: true }})
```

## API
#### requestConfigs
```javascript
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
```

## FAQ
1. 为什么 resolve 和 reject 中的参数 jqXHR 顺序这么怪异？
由于这个实现部分基于 JQuery 1.7.2，为了让开发者有文档可查询，所以很多设计依旧兼容原版本的设计，
但并不会因此与原生 Promise API 偏移过大。 在原版本 7538 ~ 7542 行中，返回 Promise 参数如下：
```javascript
    if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    }
```

## License

MIT © Ailun She
