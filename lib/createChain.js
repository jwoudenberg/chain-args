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
var Chain = require('./chain');

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
    function CustomChain(callback) {
        if (!(this instanceof CustomChain)) {
            return new CustomChain(callback);
        }
        CustomChain.super_.call(this, callback);
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

module.exports = createChain;
