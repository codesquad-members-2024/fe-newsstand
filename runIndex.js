const WEEK = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const INITIAL_PRESS_LOGO_INDEX = 0;
const INITIAL_NEWS_TITLE_INDEX = 1;
const MAX_NEWS_TITLE_INDEX = 10;
const INCREMENT = 1;
const NO_ELEMENT = 0;
const ONE_SECOND = 1000;
const ROLLING_DELAY = 5000;
const CHAR_COUNT = 2;
const PREVIOUS_CLASS_NAME = 'auto-rolling-text prev';
const CURRENT_CLASS_NAME = 'auto-rolling-text cur';
const NEXT_CLASS_NAME = 'auto-rolling-text next';
const PRESS_NAME_EXAMPLE = '연합뉴스';
const LOGO_IMAGE_PATH = "img/PressLogo.png";

const leftArrowButton = document.querySelector(".left-arrow-button");
const rightArrowButton = document.querySelector(".right-arrow-button");

let pressLogoTableIndex = INITIAL_PRESS_LOGO_INDEX;
let newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;

const isEmptyNode = (node) => node.childElementCount === NO_ELEMENT;

const createNewNode = (className, titles) => {
  const newNode = document.createElement("div");
  const pressNameTag = document.createElement("span");
  const newsTitleTag = document.createElement("span");

  pressNameTag.classList.add('press-text');
  pressNameTag.textContent += PRESS_NAME_EXAMPLE;
  newsTitleTag.classList.add('news-title-text');

  newNode.classList.add(...className.split(" "));
  newNode.appendChild(pressNameTag);
  newsTitleTag.textContent += titles[newsTitleIndex];
  newNode.appendChild(newsTitleTag);

  newsTitleIndex++;
  if (newsTitleIndex === MAX_NEWS_TITLE_INDEX) newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;
  return newNode;
}

const initializeAutoRollingNode = (tag, className, titles) => {
  const cssSelector = className.split(" ").map((name) => `.${name}`).join("");
  let node = tag.querySelector(cssSelector);
  if (node === null) {
    node = createNewNode(className, titles);
    tag.appendChild(node);
  }

  return node;
}

const initializeAutoRollingNodes = (tag, titles) => {
  const prev = initializeAutoRollingNode(tag, PREVIOUS_CLASS_NAME, titles);
  const current = initializeAutoRollingNode(tag, CURRENT_CLASS_NAME, titles);
  const next = initializeAutoRollingNode(tag, NEXT_CLASS_NAME, titles);
  const newNext = createNewNode(NEXT_CLASS_NAME, titles);
  
  return { prev: prev, current: current, next: next, newNext: newNext };
}

const renderNewsTitle = async (tag, titles) => {
  const { prev, current, next, newNext } = initializeAutoRollingNodes(tag, titles);

  tag.removeChild(prev);
  current.classList.remove('cur');
  current.classList.add('prev');
  next.classList.remove('next');
  next.classList.add('cur');

  tag.appendChild(newNext);
}

const addImagesIntoTable = (settings, table) => {
  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newImageTag = document.createElement("img");
    const cellIndex = pressLogoTableIndex * settings.cellCountPerPage + index;
    const cell = settings.cells[cellIndex];

    newImageTag.style.cssText = `
      width:${cell.width}px;
      height:${cell.height}px;
      background:url(${LOGO_IMAGE_PATH}) ${cell.left}px ${cell.top}px;
    `;
    table.appendChild(newImageTag);
  });
}

const setVisibilityOfArrowButtons = () => {
  if ( pressLogoTableIndex === FIRST_PAGE ) {
    leftArrowButton.style.visibility = "hidden";
    return;
  }
  if ( pressLogoTableIndex === LAST_PAGE ) {
    rightArrowButton.style.visibility = "hidden";
    return;
  }

  leftArrowButton.style.visibility = "visible";
  rightArrowButton.style.visibility = "visible";
}

const renderCurrentDate = () => {
  const currentDateTag = document.querySelector(".currentDate");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + INCREMENT;
  const date = currentDate.getDate();
  const day = WEEK[currentDate.getDay()];

  currentDateTag.innerHTML = `${year}. ${month.toString().padStart(CHAR_COUNT, "0")}. ${date.toString().padStart(CHAR_COUNT, "0")}. ${day}`;
}

const renderNewsTitles = async () => {
  const textBoxes = Array.from(document.querySelectorAll(".auto-rolling-textbox"));
  const titlesPath = "data/news.json";
  const response = await fetch(titlesPath);
  const titles = await response.json().then((json) => json.titles);

  if (textBoxes.some((textBox) => isEmptyNode(textBox))) {
    textBoxes.forEach((textBox) => {renderNewsTitle(textBox, titles)});
  }
  textBoxes.forEach((textBox, index) => {
    setTimeout(() => renderNewsTitle(textBox, titles), index * ONE_SECOND);
  });
}

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-table");
  const settingPath = "data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = '';
  addImagesIntoTable(settings, pressTable);
  setVisibilityOfArrowButtons();
}

renderCurrentDate();
renderNewsTitles();
renderPressTable();
leftArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex > FIRST_PAGE ) pressLogoTableIndex--;
  renderPressTable();
});
rightArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex < LAST_PAGE ) pressLogoTableIndex++;
  renderPressTable();
});
setInterval(renderNewsTitles, ROLLING_DELAY);