function ChainArgs() {
    this._resolved = false;
    this._chain = new Chain();
    if (!(this instanceof ChainArgs)) {
        return new ChainArgs();
    }
}

ChainArgs.prototype.property = function(key) {
    if (this._resolved) {
        throw new Error('ChainArgs cannot add property ' + key +
                        'ChainArgs is already resolved');
    }
    this._chain[key] = function(value) {
        if (this._resolved) {
            throw new Error('Chain cannot set property ' + key +
                            ' to ' + value + '. Chain is already resolved');
        }
        this._response[key] = value;
    };
    return this;
};

ChainArgs.prototype.ender = function(methodName, callback) {
    this._resolved = true;
    this._chain[methodName] = function() {
        callback(this._response);
    };
    return this._chain;
};

ChainArgs.prototype.nextTick = function(callback) {
    var _this = this;
    process.nextTick(function() {
        this._resolved = true;
    });
    return this._chain;
};

function Chain() {
    this._resolved = false;
    this._response = {};
}

module.exports = ChainArgs;
