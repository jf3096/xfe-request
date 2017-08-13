"use strict";
exports.__esModule = true;
var CodeEnum;
(function (CodeEnum) {
    CodeEnum[CodeEnum["Success"] = 1] = "Success";
})(CodeEnum || (CodeEnum = {}));
var ResponseModal = (function () {
    function ResponseModal(data, code, message) {
        if (code === void 0) { code = 1 /* Success */; }
        if (message === void 0) { message = ''; }
        this.data = data;
        this.code = code;
        this.message = message;
    }
    return ResponseModal;
}());
exports["default"] = ResponseModal;
//# sourceMappingURL=ResponseModal.js.map