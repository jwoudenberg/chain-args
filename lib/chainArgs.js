var createChain = require('./createChain');

var descriptor = {
    property: {
        plural: true,
        elem: 'arguments',
        end: false
    },
    args: {
        plural: true,
        elem: 'arguments',
        end: false
    },
    resolver: {
        plural: true,
        elem: 'firstArg',
        end: false
    },
    callback: {
        plural: false,
        elem: 'firstArg',
        end: true
    },
    done: {
        plural: false,
        elem: null,
        end: true
    }
};

var callback = function(err, result) {
    var descriptor = {};
    result.property.forEach(function(args) {
        var key = args[0];
        var discriptorProp = argParser(args);
        discriptorProp.elem = 'firstArg';
        descriptor[key] = discriptorProp;
    }, descriptor);
    result.args.forEach(function(args) {
        var key = args[0];
        var discriptorProp = argParser(args);
        discriptorProp.elem = 'arguments';
        descriptor[key] = discriptorProp;
    }, descriptor);
    result.resolver.forEach(function(key) {
        descriptor[key] = {
            end: true
        };
    });
    return createChain(descriptor, result.callback);
};

function argParser(args) {
    return {
        plural: (args[1] === 'plural'),
        end: (args[2] === 'end')
    };
}

module.exports = createChain(descriptor, callback);
