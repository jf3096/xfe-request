"use strict";
exports.__esModule = true;
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var window = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://jx3.xoyo.com/',
    referrer: 'http://jx3.xoyo.com/',
    contentType: 'text/html',
    userAgent: 'Mellblomenator/9000',
    includeNodeLocations: true
}).window;
global.window = window;
require('../dependency-lib/jquery-1.7.2.js');
global.$ = window.$;
global.jQuery = window.jQuery = window.$;
global.localStorage = {};
//# sourceMappingURL=jsdom-configs.js.map