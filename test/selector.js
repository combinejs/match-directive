/* global before, describe, it */

const assert      = require('chai').assert,
      expect      = require('chai').expect,
      Selector    = require('../selector'),
      CombineNode = require('@combinejs/node');

describe('MatchSelector', function() {

    describe('TYPE_INDEX', function() {

        it('if zero index throw error', function() {
            expect(function() {
                new Selector('0');
            }).to.throw('invalid match expression');
        });

        it('check priority', function() {
            let selector = new Selector('777');
            assert.equal(selector.priority, 3);
        });

        it('match test', function() {
            let selector = new Selector('1');
            let ctxNode  = new CombineNode('CtxNode');

            assert.equal(selector.test(0, ctxNode), true);
        });

        it('match auto test', function() {
            let ctxNode = new CombineNode('CtxNode');

            for (let expr = 1; expr < 33; ++expr) {
                let selector = new Selector(expr.toString(10));

                for (let index = 0; index < 32; ++index) {
                    let isMatch = (expr === index + 1);
                    assert.equal(selector.test(index, ctxNode), isMatch);
                }
            }
        });
    });

    describe('TYPE_NEGATIVE_INDEX', function() {

        it('if zero index throw error', function() {
            expect(function() {
                new Selector('-0');
            }).to.throw('invalid match expression');
        });

        it('check priority', function() {
            let selector = new Selector('-1');
            assert.equal(selector.priority, 2);
        });

        it('match test', function() {
            let selector = new Selector('-2');
            let ctxNode  = new CombineNode('CtxNode');

            for (let i = 0; i < 3; ++i) {
                ctxNode.addChild(new CombineNode('ctxChild' + i));
            }

            assert.equal(selector.test(1, ctxNode), true);
        });

        it('match auto test', function() {
            for (let count = 1; count < 33; ++count) {
                let ctxNode = new CombineNode('CtxNode');

                for (let i = 0; i < count; ++i) {
                    ctxNode.addChild(new CombineNode('ctxChild' + i));
                }

                for (let expr = -count; expr < 0; ++expr) {
                    let selector = new Selector(expr.toString(10));

                    for (let index = 0; index < count; ++index) {
                        let isMatch = (index === count + expr);
                        assert.equal(selector.test(index, ctxNode), isMatch);
                    }
                }

            }
        });
    });

    describe('TYPE_PERIODIC_AN_B', function() {

        it('if zero index throw error', function() {
            expect(function() {
                new Selector('0n+1');
            }).to.throw('invalid match expression');

            expect(function() {
                new Selector('0n');
            }).to.throw('invalid match expression');

            expect(function() {
                new Selector('2n-0');
            }).to.throw('invalid match expression');
        });

        it('check priority', function() {
            let selector = new Selector('4n');
            assert.equal(selector.priority, 1);

            selector = new Selector('4n+4');
            assert.equal(selector.priority, 1);
        });

        it('match test', function() {
            let ctxNode = new CombineNode('CtxNode');

            let selector = new Selector('2n+1');
            assert.equal(selector.test(2, ctxNode), true);

            selector = new Selector('4n');
            assert.equal(selector.test(3, ctxNode), true);
        });

        it('match auto test', function() {
            let ctxNode = new CombineNode('CtxNode');

            for (let a = -4; a < 5; ++a) {
                for (let b = -4; b < 5; ++b) {
                    if (a !== 0) {
                        let expr = '';

                        if (b !== 0) {
                            let digit = b > 0 ? '+' : '';
                            expr = `${a}n${digit}${b}`;
                        } else {
                            expr = `${a}n`;
                        }

                        let selector = new Selector(expr);

                        for (let index = 0; index < 32; ++index) {
                            let isMatch = false;

                            for (var n = 1; n < 128; ++n) {
                                if ((index + 1) === (a * n + b)) {
                                    isMatch = true;
                                }
                            }

                            assert.equal(selector.test(index, ctxNode), isMatch);
                        }
                    }
                }
            }
        });
    });

    describe('TYPE_EVERY', function() {

        it('priority', function() {
            let selector = new Selector('*');
            assert.equal(selector.priority, 0);
        });

        it('selector test', function() {
            let selector = new Selector('*');
            let ctxNode  = new CombineNode('CtxNode');

            assert.equal(selector.test(0, ctxNode), true);

            for (let i = 0; i < 128; ++i) {
                assert.equal(selector.test(i, ctxNode), true);
            }
        });
    });

    describe('Throw errors then instancing with invalid expression', function() {

        it('then instancing with invalid expression', function() {

            expect(function() {
                new Selector('invalid')
            }).to.throw('invalid match expression');

            expect(function() {
                new Selector([])
            }).to.throw('selector expression must be String');

            expect(function() {
                new Selector({})
            }).to.throw('selector expression must be String');

            expect(function() {
                new Selector()
            }).to.throw('selector expression must be String');
        });

        it('then testing when negative index, or isNotNumber', function() {
            let selector = new Selector('-2');
            let cxtNode  = new CombineNode('ctxNode');

            expect(function() {
                selector.test(-1, cxtNode);
            }).to.throw('index must be positive or zero number');

            expect(function() {
                selector.test('-1', cxtNode);
            }).to.throw('index must be positive or zero number');

            expect(function() {
                selector.test([], cxtNode);
            }).to.throw('index must be positive or zero number');
        });

        it('then testing when no present ctxNode', function() {
            let selector = new Selector('2n+1');

            expect(function() {
                selector.test(0);
            }).to.throw('ctxNode must be instanceof CombineNode');

            expect(function() {
                selector.test(0, {});
            }).to.throw('ctxNode must be instanceof CombineNode');
        })
    });
});
