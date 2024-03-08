const WEEK = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];
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
const RANDOM_SECTOR = 0.5;
const PREVIOUS_CLASS_NAME = "rolling__text prev";
const CURRENT_CLASS_NAME = "rolling__text cur";
const NEXT_CLASS_NAME = "rolling__text next";
const PRESS_NAME_EXAMPLE = "연합뉴스";
const LOGO_IMAGE_PATH = "img/PressLogo.png";

const pageLogoIcon = document.querySelector(".top-container__icon");
const leftArrowButton = document.querySelector(".press-container__left-arrow");
const rightArrowButton = document.querySelector(".press-container__right-arrow");

let pressLogoTableIndex = INITIAL_PRESS_LOGO_INDEX;
let newsTitleIndex = INITIAL_NEWS_TITLE_INDEX;

const pageReload = () => {
  location.reload();
}

const shuffle = (array) => {
  array.sort(() => Math.random() - RANDOM_SECTOR);
}

const isEmptyNode = (node) => node.childElementCount === NO_ELEMENT;

const createSubscribeButton = () => {
  const button = document.createElement("button");
  const plusImage = document.createElement("img");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "img/PlusSymbol.svg";
  plusImage.style.cssText = "width: 12px; height: 12px; margin-left: -4px; margin-right: 2px"
  
  button.classList.add("press-container__subscribe-button");
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
}

const createNewNode = (className, titles) => {
  const newNode = document.createElement("div");
  const pressNameTag = document.createElement("span");
  const newsTitleTag = document.createElement("span");

  pressNameTag.classList.add("rolling__press-text");
  pressNameTag.textContent += PRESS_NAME_EXAMPLE;
  newsTitleTag.classList.add("rolling__news-title-text");

  newNode.classList.add(...className.split(" "));
  newNode.appendChild(pressNameTag);
  newsTitleTag.textContent += titles[newsTitleIndex];
  newNode.appendChild(newsTitleTag);

  newsTitleIndex++;
  if (newsTitleIndex === MAX_NEWS_TITLE_INDEX)
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

const addImagesIntoTable = (settings, table) => {
  const cells = settings.cells;
  shuffle(cells);

  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newDivTag = document.createElement("div");
    const newImageTag = document.createElement("img");
    const subscribeButton = createSubscribeButton();
    const cellIndex = pressLogoTableIndex * settings.cellCountPerPage + index;
    const cell = cells[cellIndex];

    newImageTag.style.cssText = `
      width:${cell.width}px;
      height:${cell.height}px;
      background:url(${LOGO_IMAGE_PATH}) ${cell.left}px ${cell.top}px;
    `;
    newDivTag.classList.add("press-container__logo");
    newDivTag.appendChild(newImageTag);
    newDivTag.appendChild(subscribeButton);

    table.appendChild(newDivTag);
  });
};

const setVisibilityOfArrowButtons = () => {
  if (pressLogoTableIndex === FIRST_PAGE) {
    leftArrowButton.style.visibility = "hidden";
    return;
  }
  if (pressLogoTableIndex === LAST_PAGE) {
    rightArrowButton.style.visibility = "hidden";
    return;
  }

  leftArrowButton.style.visibility = "visible";
  rightArrowButton.style.visibility = "visible";
};

const renderCurrentDate = () => {
  const currentDateTag = document.querySelector(".top-container__date-text");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + INCREMENT;
  const date = currentDate.getDate();
  const day = WEEK[currentDate.getDay()];

  currentDateTag.innerHTML = `${year}. ${month
    .toString()
    .padStart(CHAR_COUNT, "0")}. ${date
    .toString()
    .padStart(CHAR_COUNT, "0")}. ${day}`;
};

const renderNewsTitles = async () => {
  const textBoxes = Array.from(
    document.querySelectorAll(".rolling__text-box")
  );
  const titlesPath = "data/news.json";
  const response = await fetch(titlesPath);
  const titles = await response.json().then((json) => json.titles);

  if (textBoxes.some((textBox) => isEmptyNode(textBox))) {
    textBoxes.forEach((textBox) => {
      renderNewsTitle(textBox, titles);
    });
  }
  textBoxes.forEach((textBox, index) => {
    setTimeout(() => renderNewsTitle(textBox, titles), index * ONE_SECOND);
  });
};

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-container__logo-table");
  const settingPath = "data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = "";
  addImagesIntoTable(settings, pressTable);
  setVisibilityOfArrowButtons();
};

renderCurrentDate();
renderNewsTitles();
renderPressTable();
pageLogoIcon.addEventListener("click", pageReload);
leftArrowButton.addEventListener("click", () => {
  if (pressLogoTableIndex > FIRST_PAGE) pressLogoTableIndex--;
  renderPressTable();
});
rightArrowButton.addEventListener("click", () => {
  if (pressLogoTableIndex < LAST_PAGE) pressLogoTableIndex++;
  renderPressTable();
});
setInterval(renderNewsTitles, ROLLING_DELAY);
