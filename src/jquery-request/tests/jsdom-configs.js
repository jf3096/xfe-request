"use strict";
exports.__esModule = true;
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var window = new JSDOM('<!doctype html><html><body></body></html>').window;
global.window = window;
require('../dependency-lib/jquery-1.7.2.js');
global.$ = window.$;
global.jQuery = window.jQuery = window.$;
global.localStorage = {};
//# sourceMappingURL=jsdom-configs.js.map