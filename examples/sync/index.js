var chainArgs = require('../../lib/chainArgs');

function ret(val) {
    return val;
}

exports.fullName =
    chainArgs()
        .property('first')
        .property('last')
        .resolver('end', ret, 'end')
        .callback(function(err, result) {
            return result.first + ' ' + result.last;
        });

exports.sum =
    chainArgs()
        .property('number', 'plural')
        .resolver('end', ret, 'end')
        .callback(function(err, result) {
            return result.number.reduce(function(acc, value) {
                return acc + value;
            }, 0);
        });
