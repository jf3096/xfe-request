"use strict";
exports.__esModule = true;
var joinUrl = require("url-join");
var Utils = (function () {
    function Utils() {
    }
    /**
     * 用于连接url的多个部分
     * @param {string} urls
     */
    Utils.joinUrl = function () {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i] = arguments[_i];
        }
        for (var key in urls) {
            if (urls[key].indexOf('./') > -1 || urls[key].indexOf('../') > -1) {
                throw new Error("Utils/index.ts: joinUrl\u4E0D\u652F\u6301./\u6216../");
            }
        }
        return joinUrl.apply(null, urls);
    };
    return Utils;
}());
exports["default"] = Utils;
//# sourceMappingURL=index.js.map