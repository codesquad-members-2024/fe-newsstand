import Utils from "./Utils.js";

const INITIAL_NEWS_TITLE_INDEX = 1;
const ONE_SECOND = 1000;
const PREVIOUS_CLASS_NAME = "rolling__text prev";
const CURRENT_CLASS_NAME = "rolling__text cur";
const NEXT_CLASS_NAME = "rolling__text next";

let newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;

const createNewNode = (className, titles) => {
  const newNode = Utils.createElementWithClass("div", className);
  const pressNameTag = Utils.createElementWithClass("span", "rolling__press-text");
  const newsTitleTag = Utils.createElementWithClass("a", "rolling__news-title-text");

  pressNameTag.textContent += titles[newsTitleIndex].pressName;
  newsTitleTag.textContent += titles[newsTitleIndex].headline.title;
  newsTitleTag.href = titles[newsTitleIndex].headline.href;
  Utils.appendChildren(newNode, [pressNameTag, newsTitleTag]);

  newsTitleIndex++;
  if (newsTitleIndex === titles.length)
    newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;

  return newNode;
};

const initializeRollingNode = (tag, className, titles) => {
  const cssSelector = className
    .split(" ")
    .map((name) => `.${name}`)
    .join("");
  let node = tag.querySelector(cssSelector);

  if (node === null) {
    node = createNewNode(className, titles);
    tag.appendChild(node);
  }

  return node;
};

const initializeRollingNodes = (tag, titles) => {
  const prev = initializeRollingNode(tag, PREVIOUS_CLASS_NAME, titles);
  const current = initializeRollingNode(tag, CURRENT_CLASS_NAME, titles);
  const next = initializeRollingNode(tag, NEXT_CLASS_NAME, titles);
  const newNext = createNewNode(NEXT_CLASS_NAME, titles);

  return { prev: prev, current: current, next: next, newNext: newNext };
};

const renderNewsTitle = async (tag, titles) => {
  const { prev, current, next, newNext } = initializeRollingNodes(tag, titles);

  tag.removeChild(prev);
  current.setAttribute("class", PREVIOUS_CLASS_NAME);
  next.setAttribute("class", CURRENT_CLASS_NAME);
  tag.appendChild(newNext);
};

const renderNewsTitles = async () => {
  const textBoxes = [...document.querySelectorAll(".rolling__text-box")];
  const titles = await Utils.parseTitles("src/data/news.json");

  if (Utils.hasEmptyNode(textBoxes))
    textBoxes.forEach((textBox) => renderNewsTitle(textBox, titles));

  textBoxes.forEach((textBox, index) =>
    setTimeout(() => renderNewsTitle(textBox, titles), index * ONE_SECOND)
  );
};

export default renderNewsTitles;
