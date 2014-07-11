/* global describe, it */
var assert = require('assert');
var div = require('./').div;
var query = require('./').query;

describe('Synchronous chains', function() {
    it('Supports property type elements', function(done) {
        var check = function(err, result) {
            assert.equal(result, 3);
            done();
        };
        div(check)
            .numerator(6)
            .denominator(2);
    });

    it('Supports args type elements', function(done) {
        var check = function(err, result) {
            assert.equal(result, 'FROM foo\nWHERE something is selected');
            done();
        };
        query(check)
            .from('foo')
            .where('something', 'is', 'selected');  //<query>
    });
});
