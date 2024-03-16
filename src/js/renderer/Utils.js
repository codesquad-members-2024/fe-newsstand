const EMPTY = 0;
const RANDOM_SECTOR = 0.5;

const ACTIVE_FILL_PROPERTY = "#4362D0";

const isEmptyNode = (node) => {
  return node.childElementCount === EMPTY;
}

const isInCategoryRange = (category, page) => {
  return (
    category.firstIndex <= page &&
    category.firstIndex + category.count > page
  );
};

const Utils = Object.freeze({
  hasEmptyNode(nodes) {
    return nodes.some((node) => isEmptyNode(node));
  },

  async parseTitles (path) {
    const titles = await fetch(path)
      .then((response) => response.json())
      .then((news) => 
        news.map(({ pressName, headline }) => ({ pressName, headline }))
      );

    return titles;
  },

  isIconActive(icon) {
    const activeValue = icon
      .querySelector("path")
      .attributes.getNamedItem("fill").nodeValue;

    return activeValue === ACTIVE_FILL_PROPERTY;
  },

  fillIcon(icon, fillProperty) {
    const path = icon.querySelector("path");

    path.setAttribute("fill", fillProperty);
  },

  shuffle(array) {
    return array
      .slice()
      .sort(() => Math.random() - RANDOM_SECTOR);
  },

  appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
  },

  findActiveCategory(categories, page) {
    return categories.find((categoryElement) => isInCategoryRange(categoryElement, page));
  },

  updateArrowButtonVisibility(button, condition) {
    button.style.visibility = condition ? "hidden" : "visible";
  },
  
  createElementWithClass(elementType, className) {
    const element = document.createElement(elementType);
    element.classList.add(...className.split(" "));

    return element;
  }
});

export default Utils;