var chainArgs = require('.');

var fullName = chainArgs()
    .property('first')
    .property('last')
    .ender('end', function(result) {
        console.log(result.foo + ' ' + result.bar);
    });

fullName
    .first('Jasper')
    .last('Woudenber')
    .end();             //Jasper Woudenberg

var div = chainArgs()
    .property('numerator')
    .property('denominator')
    .nextTick(function(result) {
        console.log(result.numerator / result.denominator);
    });

div
    .numerator(6)
    .denominator(2);    //3
