const EMPTY = 0;
const RANDOM_SECTOR = 0.5;

const isEmptyNode = (node) => {
  return node.childElementCount === EMPTY;
}

const Utils = Object.freeze({
  hasEmptyNode(nodes) {
    return nodes.some((node) => isEmptyNode(node));
  },

  shuffle(array) {
    return array.slice().sort(() => Math.random() - RANDOM_SECTOR);
  },

  appendChildren(parent, children) {
    children.forEach((child) => parent.appendChild(child));
  },

  updateArrowButtonVisibility(button, condition) {
    button.style.visibility = condition ? "hidden" : "visible";
  },

  createElementWithClass(elementType, className) {
    const element = document.createElement(elementType);
    element.classList.add(...className.split(" "));

    return element;
  },
});

export default Utils;