const assert = require('assert');

describe('selector testing', function() {
    it('first test', function() {
        let Selector = require('../selector');

        let base = new Selector('2n+1');

        assert.equal(base.priority, 1);
    });
});

