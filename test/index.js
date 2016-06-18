/* global before, beforeEach, describe, it */

const assert          = require('chai').assert,
      MatchDirective  = require('../index'),
      CombineNode     = require('@combinejs/node');

let rootNode, childs;

beforeEach(function() {
    rootNode = new CombineNode('Root');
    childs = [];

    for (let i = 0; i < 5; ++i) {
        childs[i] = new CombineNode('child_' + i);
        rootNode.addChild(childs[i]);

        for (let k = 0; k < 5; ++k) {
            let subChild = new CombineNode(`child_${i}_${k}`);
            childs[i].addChild(subChild);
        }
    }
});

describe('match by index selector', function() {
    let rootNode = new CombineNode('Root');
    rootNode.addChild();

    describe('test 1', function() {

        it('instance', function() {
            let match = new MatchDirective('2');
            assert.equal(match.selector.priority, 3);
        });
    });
});
