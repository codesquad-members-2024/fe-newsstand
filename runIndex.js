const WEEK = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const MAX_NEWS_TITLE_INDEX = 10;
const PREVIOUS_CLASS_NAME = 'auto-rolling-text prev';
const CURRENT_CLASS_NAME = 'auto-rolling-text cur';
const NEXT_CLASS_NAME = 'auto-rolling-text next';

const leftArrowButton = document.querySelector(".left-arrow-button");
const rightArrowButton = document.querySelector(".right-arrow-button");

let pressLogoTableIndex = 0;
let newsTitleIndex = 1;

const createNewNode = (className, titles) => {
  const newNode = document.createElement("div");
  const pressNameTag = document.createElement("span");
  const newsTitleTag = document.createElement("span");

  pressNameTag.classList.add("press-text");
  pressNameTag.textContent += '연합뉴스';
  newsTitleTag.classList.add("news-title-text");

  newNode.classList.add(...className.split(" "));
  newNode.appendChild(pressNameTag);
  newsTitleTag.textContent += titles[newsTitleIndex];
  newNode.appendChild(newsTitleTag);

  newsTitleIndex++;
  if (newsTitleIndex === MAX_NEWS_TITLE_INDEX) newsTitleIndex = 1;
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

const setVisibilityOfArrowButtons = () => {
  if ( pressLogoTableIndex === 0 ) {
    leftArrowButton.style.visibility = "hidden";
    return;
  }
  if ( pressLogoTableIndex === 3 ) {
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
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const day = WEEK[currentDate.getDay()];

  currentDateTag.innerHTML = `${year}. ${month.toString().padStart(2, "0")}. ${date.toString().padStart(2, "0")}. ${day}`;
}

const renderNewsTitles = async () => {
  const textBoxes = Array.from(document.querySelectorAll(".auto-rolling-textbox"));
  const titlesPath = "data/news.json";
  const response = await fetch(titlesPath);
  const titles = await response.json().then((json) => json.titles);

  if (textBoxes.some((textBox) => textBox.childElementCount === 0)) {
    textBoxes.forEach((textBox) => {renderNewsTitle(textBox, titles)});
  }
  textBoxes.forEach((textBox, index) => {
    setTimeout(() => renderNewsTitle(textBox, titles), index * 1000);
  });
}

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-table");
  const imagePath = "img/PressLogo.png";
  const settingPath = "data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = '';
  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newImageTag = document.createElement("img");
    const cellIndex = pressLogoTableIndex * settings.cellCountPerPage + index;
    const cell = settings.cells[cellIndex];

    newImageTag.style.width = `${cell.width}px`;
    newImageTag.style.height = `${cell.height}px`;
    newImageTag.style.background = `url(${imagePath}) ${cell.left}px ${cell.top}px`;
    pressTable.appendChild(newImageTag);
  });

  setVisibilityOfArrowButtons();
}

renderCurrentDate();
renderNewsTitles();
renderPressTable();
leftArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex > 0 ) pressLogoTableIndex--;
  renderPressTable();
});
rightArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex < 3 ) pressLogoTableIndex++;
  renderPressTable();
});
setInterval(renderNewsTitles, 5000);