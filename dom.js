const h = require('virtual-dom/h');
const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');

function dom(element, props={}, ...children) {
    switch (typeof element) {
        case 'string': return h(element, props, children);
        case 'function':
            const properties = Object.assign({}, props || {}, {children});
            if (element.prototype) {
                const component = new element(properties);
                return Object.assign(component.render(), {
                    xRender: () => component.render()
                });
            } else {
                return Object.assign(element(properties), {
                    xRender: () => element(properties)
                });
            }
    }
}

function getDynamicRoot(containerNode, elementTree, onChange) {
    let currentTree = elementTree;
    const rootNode = createElement(currentTree);
    containerNode.appendChild(rootNode);
    onChange(tree => {
        const patches = diff(currentTree, tree);
        patch(rootNode, patches);
        currentTree = tree;
    });
}

module.exports = {dom, getDynamicRoot};