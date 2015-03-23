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

Chain.prototype._setProperty = function setProperty(key, value) {
    if (this._resolved) return;
    // console.log('SetProperty: %s', key, value);
    this._propertySet();
    this._result[key] = value;
    return this;
};

Chain.prototype._pushProperty = function pushProperty(key, value) {
    if (this._resolved) return;
    // console.log('PushProperty: %s', key, value);
    this._propertySet(key);
    this._result[key].push(value);
    return this;
};

//Called whenever a property is set.
Chain.prototype._propertySet = function(key) {
    // //Check that the chain isn't already resolved.
    if (this._resolved) {
        throw new Error('Chain: cannot add property `' + key + '` to resolved chain.');
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

Chain.prototype._resolve = function resolve() {
    this._resolved = true;
    this._resolution = this._resolution || this._callback.call(null, null, this._result);
    // console.log('resolve called : %s', this._resolved, 'resolution:', !!this._resolution);
    // console.log('------------- RESULTS -------------')
    // console.log(this._result);
    return this._resolution;
};

Chain.prototype.toString = function toString() {
    return '[object Chain]';
};

module.exports = Chain;
