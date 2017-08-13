/* tslint:disable */
if ($.fn.jquery !== '1.7.2') {
    throw new Error('当前处理针对JQuery 1.7.2');
}
($ as any).Deferred = function (func: any) {
    var tuples = [
            ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
            ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
            ["notify", "progress", jQuery.Callbacks("memory")]
        ],
        state = "pending",
        promise = {
            state: function () {
                return state;
            },
            always: function () {
                (deferred as any).done(arguments).fail(arguments);
                return this;
            },
            then: function (/* fnDone, fnFail, fnProgress */) {
                var fns = arguments;
                return jQuery.Deferred(function (newDefer) {
                    jQuery.each(tuples, function (i, tuple) {
                        var fn = jQuery.isFunction(fns[i]) && fns[i];

                        // deferred[ done | fail | progress ] for forwarding actions to newDefer
                        (deferred as any)[(tuple as any)[1]](function () {
                            var returned = fn && fn.apply(this, arguments);
                            if (returned && jQuery.isFunction(returned.promise)) {
                                returned.promise()
                                    .progress(newDefer.notify)
                                    .done(newDefer.resolve)
                                    .fail(newDefer.reject);
                            } else {
                                (newDefer as any)[tuple[0] + "With"](
                                    this === promise ? newDefer.promise() : this,
                                    fn ? [returned] : arguments
                                );
                            }
                        });
                    });
                    fns = null;
                }).promise();
            },

            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function (obj: any) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
            }
        },
        deferred = {};

    // Keep pipe for back-compat
    (promise as any).pipe = promise.then;

    // Add list-specific methods
    jQuery.each(tuples, function (i, tuple) {
        var list = tuple[2],
            stateString = tuple[3];

        // promise[ done | fail | progress ] = list.add
        (promise as any)[(tuple as any)[1]] = (list as any).add;

        // Handle state
        if (stateString) {
            (list as any).add(function () {

                // state = [ resolved | rejected ]
                state = stateString as any;

                // [ reject_list | resolve_list ].disable; progress_list.lock
            }, (tuples[i ^ 1][2] as any).disable, (tuples[2][2] as any).lock);
        }

        // deferred[ resolve | reject | notify ]
        (deferred as any)[tuple[0] as any] = function () {
            (deferred as any)[tuple[0] + "With"](this === deferred ? promise : this, arguments);
            return this;
        };
        (deferred as any)[tuple[0] + "With"] = (list as any).fireWith;
    });

    // Make the deferred a promise
    promise.promise(deferred);

    // Call given func if any
    if (func) {
        func.call(deferred, deferred);
    }

    // All done!
    return deferred;
};
/* tslint:enable */
