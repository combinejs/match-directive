const assert   = require('chai').assert,
      expect     = require('chai').expect,
      Selector = require('../selector'),
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

describe('selector testing', function() {

    describe('selector TYPE_INDEX', function() {

        it('priority', function() {
            let selector = new Selector('1');
            assert.equal(selector.priority, 3);
        });

        it('selector test', function() {
            let selector = new Selector('1');
            assert.equal(selector.test(1, rootNode), true);

            selector = new Selector('2');
            assert.equal(selector.test(2, rootNode), true);

            selector = new Selector('3');
            assert.equal(selector.test(3, rootNode), true);
        });
    });

    describe('selector TYPE_RIGHT_INDEX', function() {

        it('priority', function() {
            let selector = new Selector('-1');
            assert.equal(selector.priority, 2);
        });

        it('selector test', function() {
            let selector = new Selector('-1');
            assert.equal(selector.test(4, rootNode), true);

            selector = new Selector('-2');
            assert.equal(selector.test(3, rootNode), true);

            selector = new Selector('-3');
            assert.equal(selector.test(2, rootNode), true);
        });
    });

    describe('selector TYPE_PERIODIC_AN_B', function() {

        it('priority', function() {
            let selector = new Selector('2n+1');
            assert.equal(selector.priority, 1);
        });

        it('selector test', function() {
            let selector = new Selector('2n+1');
            assert.equal(selector.test(3, rootNode), true);
            assert.equal(selector.test(5, rootNode), true);
            assert.equal(selector.test(7, rootNode), true);

            selector = new Selector('3n-1');
            assert.equal(selector.test(2, rootNode), true);
            assert.equal(selector.test(5, rootNode), true);
            assert.equal(selector.test(8, rootNode), true);


            selector = new Selector('4n-1');
            assert.equal(selector.test(3, rootNode), true);
            assert.equal(selector.test(7, rootNode), true);
            assert.equal(selector.test(11, rootNode), true);
        });
    });

    describe('selector TYPE_EVERY', function() {

        it('priority', function() {
            let selector = new Selector('*');
            assert.equal(selector.priority, 0);

            selector = new Selector('n');
            assert.equal(selector.priority, 0);
        });

        it('selector test', function() {
            let selector = new Selector('*');
            assert.equal(selector.test(1, rootNode), true);
            assert.equal(selector.test(2, rootNode), true);
            assert.equal(selector.test(3, rootNode), true);
            assert.equal(selector.test(4, rootNode), true);
            assert.equal(selector.test(5, rootNode), true);
            assert.equal(selector.test(6, rootNode), true);
            assert.equal(selector.test(50, rootNode), true);
            assert.equal(selector.test(100, rootNode), true);
        });
    });

    describe('selector INVALID', function() {

        it('instancing', function() {
            expect(function(){
                new Selector('invalid')
            }).to.throw('invalid match expression');
        });
    });
});
