/* global before, beforeEach, describe, it */

const assert          = require('chai').assert,
      fs              = require('fs'),
      MatchDirective  = require('../index'),
      combineParse    = require('@combinejs/parser');
      CombineNode     = require('@combinejs/node');


require('@combinejs/directives-provider').define('match', MatchDirective);

describe('MatchDirective testing', function() {

    describe('match by one-level tree with index rule', function() {

        let tree = combineParse(fs.readFileSync('./test/one-level-match-by-index.comb').toString());

        it('find second child by rule match=2', function() {
            let [node] = MatchDirective.matchNodeByPath(tree, [1]);
            assert.equal(node.name, 'child2');
        });

        it('find N-child by rule match=N', function() {
            for (let index = 0; index < 3; ++index) {
                let [node] = MatchDirective.matchNodeByPath(tree, [index]);
                assert.equal(node.name, `child${(index+1)}`);
            }
        });
    });
});
