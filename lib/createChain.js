var util = require('util');
var _ = require('underscore');
var Chain = require('./chain');

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
        var property = descriptor[key];
        //When a chain method is called, a number of actions need to take place.
        var actionList = [
            //1. Decide what item to store from the arguments.
            getArgumentInterpreter(property.elem),
            //2. Decide whether to set or push the item to store to an array.
            getPropertySetter(CustomChain, key, property.plural),
            //3. End the chain or return `this` for further chaining.
            getChainEnder(CustomChain, property.end)
        ].reverse();
        CustomChain.prototype[key] = _.compose.apply(null, actionList);
    });

    return CustomChain;
}

function getArgumentInterpreter(elem) {
    var argumentInterpreter = null;
    if (typeof elem === 'function') {
        argumentInterpreter = elem;
    } else if (elem === 'firstArg') {
        argumentInterpreter = returnFirstArgument;
    } else if (elem === 'arguments') {
        argumentInterpreter = returnArgumentsArray;
    } else if (!elem) {
        argumentInterpreter = returnNull;
    } else {
        throw new Error('Unknown property element type: ' + elem);
    }
    return argumentInterpreter;
}

function getPropertySetter(Chain, key, plural) {
    var propertySetter = null;
    if (plural) {
        Chain._lists.push(key);
        propertySetter = _.partial(Chain.prototype._pushProperty, key);
    } else {
        propertySetter = _.partial(Chain.prototype._setProperty, key);
    }
    return propertySetter;
}

function getChainEnder(Chain, end) {
    var chainEnder = null;
    if (end) {
        Chain.prototype._hasEnd = true;
        chainEnder = Chain.prototype._resolve;
    }
    else {
        chainEnder = returnThis;
    }
    return chainEnder;
}

function returnFirstArgument(arg) {
    return arg;
}

function returnArgumentsArray() {
    return Array.prototype.slice.call(arguments);
}

function returnNull() {
    return void(0);
}

function returnThis() {
    return this;
}

module.exports = createChain;
