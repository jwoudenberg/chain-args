var chainArgs = require('../../lib/chainArgs');

var divChain = chainArgs()
    .property('numerator')
    .property('denominator')
    .done();

exports.div = function(callback) {
    return divChain(function(err, result) {
        if (err) {
            return callback(err);
        }
        if (result.denominator === 0) {
            return callback(new Error('Denomimator may not be zero!'));
        }
        var div = result.numerator / result.denominator;
        callback(null, div);
    });
};

var queryChain = chainArgs()
    .property('from')
    .args('where')
    .done();

exports.query = function(callback) {
    return queryChain(function(err, result) {
        if (err) {
            return callback(err);
        }
        var query = [
            'FROM ' + result.from,
            'WHERE ' + result.where.join(' ')
        ].join('\n');
        callback(null, query);
    });
};
