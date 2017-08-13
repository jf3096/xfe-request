if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        // tslint:disable
        var len = this.length >>> 0;
        // tslint:enable
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; from++) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}
//# sourceMappingURL=array-indexof.js.map