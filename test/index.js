/* global before, beforeEach, describe, it */

const assert          = require('chai').assert,
      fs              = require('fs'),
      MatchDirective  = require('../index'),
      combineParse    = require('@combinejs/parser');
      CombineNode     = require('@combinejs/node');


require('@combinejs/directives-provider').define('match', MatchDirective);

describe('MatchDirective testing', function() {

    describe('match by one rule', function() {

        describe('match by one-level tree with index rule', function () {

            let mixin = combineParse(fs.readFileSync('./test/one-level-match-by-index.comb').toString());
            let ctx   = combineParse(fs.readFileSync('./test/ctx-three-children.comb').toString());

            it('find second child of root by rule match=2', function () {
                let [node] = MatchDirective.matchNodeByPath(mixin, [1], ctx);
                assert.equal(node.name, 'child2');
            });

            it('find N-child of root by rule match=N', function () {
                for (let index = 0; index < 3; ++index) {
                    let [node] = MatchDirective.matchNodeByPath(mixin, [index], ctx);
                    assert.equal(node.name, `child${(index + 1)}`);
                }
            });
        });

        describe('match by two-level tree with index rule', function () {

            let mixin = combineParse(fs.readFileSync('./test/two-level-match-by-index.comb').toString());
            let ctx   = combineParse(fs.readFileSync('./test/ctx-three-children.comb').toString());

            it('find third child of first child of root by rule match=[1,3]', function () {
                let [node] = MatchDirective.matchNodeByPath(mixin, [0, 2], ctx);
                assert.equal(node.name, 'child13');
            });

            it('find N child of M child of root by rule match=[M,N]', function () {
                for (let index = 0; index < 3; ++index) {
                    for (let subIndex = 0; index < 3; ++index) {
                        let [node] = MatchDirective.matchNodeByPath(mixin, [index, subIndex], ctx);
                        assert.equal(node.name, `child${(index + 1)}${(subIndex + 1)}`);
                    }
                }
            });
        });

        describe('match by three-level tree with index rule', function () {

            let mixin = combineParse(fs.readFileSync('./test/three-level-match-by-index.comb').toString());
            let ctx   = combineParse(fs.readFileSync('./test/ctx-three-children.comb').toString());

            it('find third child of first child of second child of root by rule match=[2,1,3]', function () {
                let [node] = MatchDirective.matchNodeByPath(mixin, [1, 0, 2], ctx);
                assert.equal(node.name, 'child213');
            });

            it('find N child of M child of L child of root by rule match=[L,M,N]', function () {
                for (let index = 0; index < 3; ++index) {
                    for (let subIndex = 0; index < 3; ++index) {
                        for (let subSubIndex = 0; index < 3; ++index) {
                            let [node] = MatchDirective.matchNodeByPath(
                                mixin,
                                [index, subIndex, subSubIndex],
                                ctx
                            );

                            assert.equal(node.name, `child${(index + 1)}${(subIndex + 1)}${(subSubIndex + 1)}`);
                        }
                    }
                }
            });
        });
    });

    describe('match by mixed rules', function() {

        describe('match by one-level tree with mixed rules', function () {

            let mixin = combineParse(fs.readFileSync('./test/one-level-match-by-mixed.comb').toString());
            let ctx   = combineParse(fs.readFileSync('./test/ctx-two-children.comb').toString());

            it('check priority order by index2', function () {
                let nodes = MatchDirective.matchNodeByPath(mixin, [1], ctx);

                assert.deepEqual(nodes.map(node => ~~node.name.slice(-1)), [0, 1, 2, 3]);
            });
        });

        describe('match by two-level tree with mixed rules', function () {

            let mixin = combineParse(fs.readFileSync('./test/two-level-match-by-mixed.comb').toString());
            let ctx   = combineParse(fs.readFileSync('./test/ctx-two-children.comb').toString());

            it('check priority order by index [2,2]', function () {
                let nodes = MatchDirective.matchNodeByPath(mixin, [1, 1], ctx);

                let expectedPriority = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

                assert.deepEqual(nodes.map(node => ~~node.name.slice(8)), expectedPriority);
            });
        });
    });
});
