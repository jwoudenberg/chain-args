/**
 * #createChain()
 * `createChain` takes a descriptor object and returns a chain constructor.
 *
 * For example, you can create a Chain constructor like this:
 *
 *     var MyChain = createChain({
 *         foo: 'property',
 *         list: 'array',
 *         end: 'callback'
 *     });
 *
 * MyChain can then be used as follows:
 *
 *     MyChain(console.log)
 *         .foo('bar')
 *         .list(1)
 *         .list(2)
 *         .end();
 *
 * The following object will be logged to the console:
 *
 *     {
 *         foo: 'bar',
 *         list: [1, 2]
 *     }
 */
var util = require('util');

/**
 * The values of the keys in a descriptor passed to createChain can take the
 * values 'property', 'lastProperty', 'args', 'list' or 'callback'. These
 * functions set methods corresponding to these types on a Chain prototype.
 */
var PROPERTY_METHODS = {
    property: function(Chain, key) {
        Chain.prototype[key] = function(value) {
            this._setProperty(key, value);
            return this;
        };
    },
    lastProperty: function(Chain, key) {
        Chain.prototype._hasEnd = true;
        Chain.prototype[key] = function(value) {
            this._setProperty(key, value);
            return this._resolve();
        };
    },
    args: function(Chain, key) {
        Chain.prototype[key] = function() {
            var args = Array.prototype.slice.call(arguments);
            this._setProperty(key, args);
            return this;
        };
    },
    array: function(Chain, key) {
        Chain._lists.push(key);
        Chain.prototype[key] = function(value) {
            this._pushProperty(key, value);
            return this;
        };
    },
    callback: function(Chain, key) {
        //The Chain gains a resolution mechanism.
        Chain.prototype._hasEnd = true;
        Chain.prototype[key] = Chain.prototype._resolve;
    }
};

/**
 * Take a descriptor object and return a Chain constructor.
 * An optional default callback for this type of Chain.
 */
function createChain(descriptor, callback) {
    if (typeof descriptor !== 'object') {
        throw new TypeError('createChain: descriptor is not an object: ' +
                            descriptor);
    }

    //Create the Chain class.
    function CustomChain() {
        if (!(this instanceof CustomChain)) {
            return new CustomChain();
        }
        CustomChain.super_.call(this);
        CustomChain._lists.forEach(function(listName) {
            this._result[listName] = [];
        }, this);
    }
    util.inherits(CustomChain, Chain);
    if (callback) {
        CustomChain.prototype._callback = callback;
    }

    //This will come to contain the names of all lists in the chain.
    CustomChain._lists = [];

    //Add descriptor properties to Chain prototype.
    var keys = Object.keys(descriptor);
    keys.forEach(function(key) {
        var propertyType = descriptor[key];
        var propertyConstructor = PROPERTY_METHODS[propertyType];
        if (!propertyConstructor) {
            throw new Error('createChain: invalid property type: ' +
                            propertyType);
        }
        propertyConstructor(CustomChain, key);
    });

    return CustomChain;
}

function Chain(callback) {
    this._result = {};
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
    this._resolved = true;
    return this._callback.call(null, null, this._result);
};

Chain.prototype.toString = function toString() {
    return '[object Chain]';
};

module.exports = createChain;
