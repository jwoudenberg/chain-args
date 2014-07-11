var chainArgs = require('../../lib/chainArgs');

exports.fullName =
    chainArgs()
        .property('first')
        .property('last')
        .resolver('end')
        .callback(function(err, result) {
            return result.first + ' ' + result.last;
        })
        .done();

exports.sum =
    chainArgs()
        .array('number')
        .resolver('end')
        .callback(function(err, result) {
            return result.number.reduce(function(acc, value) {
                return acc + value;
            }, 0);
        })
        .done();
