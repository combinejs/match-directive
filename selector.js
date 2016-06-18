/**
 * @module
 *
 * Match directive helper class, like css selector
 */
const CombineNode = require('@combinejs/node');

const TYPE_INDEX          = Symbol(),
      TYPE_NEGATIVE_INDEX = Symbol(),
      TYPE_PERIODIC_AN_B  = Symbol(),
      TYPE_EVERY          = Symbol();

class Selector {
    /**
     * Create new instance of selector
     *
     * @param expr {String}
     */
    constructor(expr) {
        if (typeof expr !== 'string') {
            throw new Error('selector expression must be String');
        }

        this._params = {a: null, b: null};

        let TYPE_PERIODIC_AN_B_REGEXP = /^(-?[1-9]\d*)n([+|-][1-9]\d*)?$/;

        switch (true) {
            case /^[1-9]\d*$/.test(expr):
                this._type     = TYPE_INDEX;
                this._params.a = parseInt(expr, 10);
                this._priority = 3;
                break;

            case /^-[1-9]\d*$/.test(expr):
                this._type     = TYPE_NEGATIVE_INDEX;
                this._params.a = parseInt(expr);
                this._priority = 2;
                break;

            case TYPE_PERIODIC_AN_B_REGEXP.test(expr):
                this._type     = TYPE_PERIODIC_AN_B;
                let [, a, b] = expr.match(TYPE_PERIODIC_AN_B_REGEXP);

                if (b === undefined) {
                    b = 0;
                }

                this._params.a = parseInt(a);
                this._params.b = parseInt(b);
                this._priority = 1;
                break;

            case /^\*$/.test(expr):
                this._type     = TYPE_EVERY;
                this._priority = 0;
                break;
            default:
                throw new Error('invalid match expression');
        }
    }

    /**
     * Testing selector for children index
     *
     * @param index {Number} index of child
     * @param ctxNode {CombineNode} context node need for some selectors
     *
     * @returns {boolean}
     */
    test(index, ctxNode) {
        if (typeof index !== 'number' || index < 0) {
            throw Error('index must be positive or zero number');
        }

        if (! ctxNode || ! (ctxNode instanceof CombineNode)) {
            throw Error('ctxNode must be instanceof CombineNode');
        }

        switch (this._type) {
            case TYPE_INDEX:
                return index === this._params.a - 1;

            case TYPE_NEGATIVE_INDEX:
                return ctxNode.getChilds().length + this._params.a === index;

            case TYPE_PERIODIC_AN_B:
                let n = ((index + 1) - this._params.b) / this._params.a;
                return Number.isInteger(n) && n > 0;

            case TYPE_EVERY:
                return true;
        }
    }

    get priority() {
        return this._priority;
    }
}

Selector.MAX_PRIORITY = 3;

module.exports = Selector;