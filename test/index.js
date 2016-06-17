const assert   = require('chai').assert,
    expect     = require('chai').expect,
    Match = require('../index'),
    Node     = require('@combinejs/node');

let rootNode, childs;

before(function() {
    rootNode = new Node('Root');
    childs = [];

    for (let i = 0; i < 5; ++i) {
        childs[i] = new Node('child_' + i);
        rootNode.addChild(childs[i]);

        for (let k = 0; k < 5; ++k) {
            let subChild = new Node(`child_${i}_${k}`);
            childs[i].addChild(subChild);
        }
    }
});

describe('match directive testing', function() {

    describe('test 1', function() {

        it('instance', function() {
            let match = new Match('2');
            assert.equal(match.selector.priority, 3);
        });
    });
});

