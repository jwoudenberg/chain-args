function Chain(callback) {
    this._result = {};
    if (callback) {
        this._callback = callback;
    }
}

//The default callback simply returns the result object.
Chain.prototype._callback = function() {
    return this._result;
};

//`_hasEnd` indicates whether this Chain has a resolution mechanism.
//This is either a method the user has to explicitly call or a timer.
Chain.prototype._hasEnd = false;

Chain.prototype._setProperty = function(key, value) {
    this._propertySet();
    this._result[key] = value;
    return this;
};

Chain.prototype._pushProperty = function(key, value) {
    this._propertySet();
    this._result[key].push(value);
    return this;
};

//Called whenever a property is set.
Chain.prototype._propertySet = function() {
    //Check that the chain isn't already resolved.
    if (this._resolved) {
        throw new Error('Chain: cannot add property to resolved chain.');
    }
    //Check that the Chain has a resolution mechanism.
    if (!this._hasEnd) {
        //Resolve automatically at the next tick.
        this._hasEnd = true;
        var _this = this;
        process.nextTick(function() {
            _this._resolve();
        });
    }
};

Chain.prototype._resolve = function() {
    var args = Array.prototype.slice.call(arguments);
    args = [this._result].concat(args);
    this._resolved = true;
    return this._callback.apply(null, args);
};

Chain.prototype.toString = function toString() {
    return '[object Chain]';
};

module.exports = Chain;
