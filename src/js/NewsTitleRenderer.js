const INITIAL_NEWS_TITLE_INDEX = 1;
const NO_ELEMENT = 0;
const ONE_SECOND = 1000;
const PREVIOUS_CLASS_NAME = "rolling__text prev";
const CURRENT_CLASS_NAME = "rolling__text cur";
const NEXT_CLASS_NAME = "rolling__text next";

let newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;

const isEmptyNode = (node) => node.childElementCount === NO_ELEMENT;

const parseTitles = async (path) => {
  const response = await fetch(path);
  const titles = await response.json().then((json) =>
    json.map((newsElement) => {
      return {
        pressName: newsElement.pressName,
        headline: newsElement.headline,
      };
    }).flat());

  return titles;
}

const createNewNode = (className, titles) => {
  const newNode = document.createElement("div");
  const pressNameTag = document.createElement("span");
  const newsTitleTag = document.createElement("span");

  pressNameTag.classList.add("rolling__press-text");
  pressNameTag.textContent += titles[newsTitleIndex].pressName;
  newsTitleTag.classList.add("rolling__news-title-text");

  newNode.classList.add(...className.split(" "));
  newNode.appendChild(pressNameTag);
  newsTitleTag.textContent += titles[newsTitleIndex].headline.title;
  newNode.appendChild(newsTitleTag);

  newsTitleIndex++;
  if (newsTitleIndex === titles.length)
    newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;
  return newNode;
};

const initializeAutoRollingNode = (tag, className, titles) => {
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

const initializeAutoRollingNodes = (tag, titles) => {
  const prev = initializeAutoRollingNode(tag, PREVIOUS_CLASS_NAME, titles);
  const current = initializeAutoRollingNode(tag, CURRENT_CLASS_NAME, titles);
  const next = initializeAutoRollingNode(tag, NEXT_CLASS_NAME, titles);
  const newNext = createNewNode(NEXT_CLASS_NAME, titles);

  return { prev: prev, current: current, next: next, newNext: newNext };
};

const renderNewsTitle = async (tag, titles) => {
  const { prev, current, next, newNext } = initializeAutoRollingNodes(
    tag,
    titles
  );

  tag.removeChild(prev);
  current.classList.remove("cur");
  current.classList.add("prev");
  next.classList.remove("next");
  next.classList.add("cur");
  tag.appendChild(newNext);
};

const renderNewsTitles = async () => {
  const textBoxes = Array.from(document.querySelectorAll(".rolling__text-box"));
  const titles = await parseTitles("src/data/news.json");

  if (textBoxes.some((textBox) => isEmptyNode(textBox))) {
    textBoxes.forEach((textBox) => {
      renderNewsTitle(textBox, titles);
    });
  }
  textBoxes.forEach((textBox, index) => {
    setTimeout(() => renderNewsTitle(textBox, titles), index * ONE_SECOND);
  });
};

export default renderNewsTitles;
