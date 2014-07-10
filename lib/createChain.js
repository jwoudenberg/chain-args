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
 * values 'property', 'list' or 'callback'. These functions set methods
 * corresponding to these types on a Chain prototype.
 */
var PROPERTY_METHODS = {
    property: function(Chain, key) {
        Chain.prototype[key] = function setChainProperty(value) {
            this._propertySet();
            this._result[key] = value;
            return this;
        };
    },
    array: function(Chain, key) {
        Chain._lists.push(key);
        Chain.prototype[key] = function pushChainProperty(value) {
            this._propertySet();
            this._result[key].push(value);
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
 * Take a descriptor object and return a Chain class.
 */
function createChain(descriptor) {
    if (typeof descriptor !== 'object') {
        throw new TypeError('createChain: descriptor is not an object: ' +
                            descriptor);
    }

    //Create the Chain class.
    function CustomChain(callback) {
        CustomChain.super_.call(this, callback);
        CustomChain._lists.forEach(function(listName) {
            this._result[listName] = [];
        }, this);
    }
    util.inherits(CustomChain, Chain);

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
    if (!(this instanceof Chain)) {
        return new Chain();
    }
    this._result = {};
    this._callback = callback;
}

//The default callback simply returns the result object.
Chain.prototype._callback = function() {
    return this._result;
};

//`_hasEnd` indicates whether this Chain has a resolution mechanism.
//This is either a method the user has to explicitly call or a timer.
Chain.prototype._hasEnd = false;

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
    return this._callback(this._result);
};

module.exports = createChain;
