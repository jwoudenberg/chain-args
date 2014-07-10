// var chainArgs = require('./');

// var fullName = chainArgs()
//     .property('first')
//     .property('last')
//     .ender('end', function(result) {
//         return result.foo + ' ' + result.bar;
//     });

// var myName = fullName
//             .first('Jasper')
//             .last('Woudenber')
//             .end();

// console.log(myName);    //Jasper Woudenberg

// var div = chainArgs()
//     .property('numerator')
//     .property('denominator')
//     .nextTick(function(result) {
//         console.log(result.numerator / result.denominator);
//     });

// div
//     .numerator(6)
//     .denominator(2);    //3

// var sum = chainArgs()
//     .list('number')
//     .ender('end', function(result) {
//         return result.reduce(function(acc, value) {
//             return acc + value;
//         }, 0);
//     });

// var total = sum()
//                 .number(4)
//                 .number(2)
//                 .end();

// console.log(total);     //6

var createChain = require('./lib/createChain');

var MyChain = createChain({
    foo: 'property',
    list: 'array',
    end: 'callback'
});

new MyChain(console.log)
    .foo('bar')
    .list(1)
    .list(2)
    .end();

var MyChain2 = createChain({
    foo: 'property',
    list: 'array'
});

new MyChain2(console.log)
    .foo('bar')
    .list(1)
    .list(2);
