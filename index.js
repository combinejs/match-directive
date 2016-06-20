/**
 * @module
 *
 * вспомогательная директива в примесях, определяющая правила для наложения разных деревьев
 * Этот модуль экпортирует функцию, которая находит самый подходящий узел в примеси для заданной позиции
 * узла в дереве на которое накладывается примесь
 */

let Selector = require('./lib/selector.js');

class MatchDirective {
    constructor(value) {
        this.selector = new Selector(value);
    }
}

MatchDirective.matchNodeByPath = function(mixinRoot, path, destRoot) {
    return matchNodeByPath([mixinRoot], path, destRoot);
};

module.exports = MatchDirective;

/**
 * Рекурсивная функция, которая среди всех потомков переданных узлов (использую match директивы)
 * ищет те элементы, которые подходят под переданный путь (это массив индексов в каждом уровне) и
 * возвращает их в порядке возврастания приоритета
 *
 * @param nodeList {CombineNode[]}       узлы в порядке возврастания приоритетам
 * @param path {Number[]} path      адрес узла (последовательность индексов на каждом уровне дерева)
 * @param destRoot {CombineNode}
 *
 * @returns {CombineNode[]}              найденные узлы по возврастанию приоритета
 */
function matchNodeByPath(nodeList, path, destRoot) {
    if (nodeList.length === 0 || path.length === 0) return nodeList;

    return matchNodeByPath(
        Array.prototype.concat.apply([], nodeList.map(
            node => matchChildNodes(node, path[0], destRoot)
        )),
        path.slice(1),
        destRoot.getChilds()[path[0]]
    );
}

/**
 * Среди всех прямых потомков узла (изпользуя их директивы match) найти те элементы,
 * которые подходят под переданную позицию и вернуть их в порядке возврастания приоритета.
 *
 * @param node {CombineNode}     узел, среди прямых потомков которого будем искать
 * @param index {Number}    позиция предпологаемого элемента
 * @param ctxNode {CombineNode}
 *
 * @returns {CombineNode[]}      найденные узлы по возврастанию приоритета
 */
function matchChildNodes(node, index, ctxNode) {
    let priorityBuckets = new Array(Selector.MAX_PRIORITY + 1).fill(1).map(()=>[]);

    for (let childNode of node.getChilds()) {
        if (childNode.hasDirective('match')) {
            let selector = childNode.getDirective('match').selector;

            if (selector.test(index, ctxNode)) {
                priorityBuckets[selector.priority].push(childNode);
            }
        }
    }

    return Array.prototype.concat.apply([], priorityBuckets);
}

