var createChain = require('./createChain');

var descriptor = {
    property: 'array',
    args: 'array',
    array: 'array',
    resolver: 'property',
    callback: 'lastProperty'
};

var callback = function(result) {
    var descriptor = {};
    result.property.forEach(function (key) {
        descriptor[key] = 'property';
    }, descriptor);
    result.array.forEach(function (key) {
        descriptor[key] = 'array';
    }, descriptor);
    result.args.forEach(function (key) {
        descriptor[key] = 'args';
    }, descriptor);
    var resolver = result.resolver;
    if (resolver) {
        descriptor[resolver] = 'callback';
    }
    return createChain(descriptor, result.callback);
};

module.exports = createChain(descriptor, callback);
