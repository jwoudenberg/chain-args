var chainArgs = require('./lib/chainArgs');

//Example 1
var fullName = chainArgs()
                .property('first')
                .property('last')
                .resolver('end')
                .callback(function(err, result) {
                    return result.first + ' ' + result.last;
                });

var myName = fullName()
                .first('Jasper')
                .last('Woudenberg')
                .end();

console.log(myName);    //Jasper Woudenberg


//Example 2
var div = chainArgs()
            .property('numerator')
            .property('denominator')
            .callback(function(err, result) {
                console.log(result.numerator / result.denominator);
            });

div()
    .numerator(6)
    .denominator(2);    //3


//Example 3
var sum = chainArgs()
            .array('number')
            .resolver('end')
            .callback(function(err, result) {
                return result.number.reduce(function(acc, value) {
                    return acc + value;
                }, 0);
            });

var total = sum()
                .number(4)
                .number(2)
                .end();

console.log(total);     //6


//Example 4
var query = chainArgs()
                .property('from')
                .args('where')
                .callback(function(err, result) {
                    var query = [
                        'FROM ' + result.from,
                        'WHERE ' + result.where.join(' ')
                    ].join('\n');
                    console.log(query);
                });

query()
    .from('foo')
    .where('something', 'is', 'selected');  //<query>
