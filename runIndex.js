const WEEK = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const PRESS_NAME_TEXT = '<span class="press-text">연합뉴스</span>';
const NEWS_TITLE_TEXT = '<span class="news-title-text"></span>';
const MAX_NEWS_TITLE_INDEX = 10;
const PREVIOUS_CLASS_NAME = 'auto-rolling-text prev';
const CURRENT_CLASS_NAME = 'auto-rolling-text cur';
const NEXT_CLASS_NAME = 'auto-rolling-text next';

const leftArrowButton = document.querySelector(".left-arrow-button");
const rightArrowButton = document.querySelector(".right-arrow-button");

let pressLogoTableIndex = 0;
let newsTitleIndex = 1;

const increaseIndex = (index) => {index++;};
const decreaseIndex = (index) => {index--;};

const createNewNode = (className, titles) => {
  const newNode = document.createElement("div");
  const pressNameTag = new DOMParser().parseFromString(PRESS_NAME_TEXT, "text/xml").documentElement;
  const newsTitleTag = new DOMParser().parseFromString(NEWS_TITLE_TEXT, "text/xml").documentElement;

  newNode.classList.add(...className.split(" "));
  newNode.appendChild(pressNameTag);
  newsTitleTag.textContent += titles[newsTitleIndex];
  newNode.appendChild(newsTitleTag);

  newsTitleIndex++;
  if (newsTitleIndex === MAX_NEWS_TITLE_INDEX) newsTitleIndex = 1;
  return newNode;
}

const renderNewsTitle = async (tag, titles) => {
  const texts = tag.getElementsByClassName("auto-rolling-text");
  const prev = texts[0].childElementCount === 0 ? createNewNode(PREVIOUS_CLASS_NAME, titles) : texts[0];
  const current = texts[1].childElementCount === 0 ? createNewNode(CURRENT_CLASS_NAME, titles) : texts[1];
  const next = texts[2].childElementCount === 0 ? createNewNode(NEXT_CLASS_NAME, titles) : texts[2];
  const newNext = createNewNode(NEXT_CLASS_NAME, titles);

  if (texts[0].childElementCount === 0) tag.replaceChild(prev, texts[0]);
  if (texts[1].childElementCount === 0) tag.replaceChild(current, texts[1]);
  if (texts[2].childElementCount === 0) tag.replaceChild(next, texts[2]);

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
  const textBoxes = document.querySelectorAll(".auto-rolling-textbox");
  const titlesPath = "data/news.json";
  const response = await fetch(titlesPath);
  const titles = await response.json().then((json) => json.titles);

  textBoxes.forEach((textBox) => {
    renderNewsTitle(textBox, titles);
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
  if ( pressLogoTableIndex > 0 ) decreaseIndex(pressLogoTableIndex);
  renderPressTable();
});
rightArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex < 3 ) increaseIndex(pressLogoTableIndex);
  renderPressTable();
});
document.addEventListener('DOMContentLoaded', () => {
  setInterval(renderNewsTitles, 4000); 
});