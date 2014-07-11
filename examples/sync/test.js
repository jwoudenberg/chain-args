/* global describe, it */
var assert = require('assert');
var fullName = require('./').fullName;
var sum = require('./').sum;

describe('Synchronous chains', function() {
    it('Supports property type elements', function() {
        var myName =
            fullName()
                .first('Jasper')
                .last('Woudenberg')
                .end();
        assert.equal(myName, 'Jasper Woudenberg');
    });

    it('Supports array type elements', function() {
        var total =
            sum()
                .number(4)
                .number(2)
                .end();
        assert.equal(total, 6);
    });

});
