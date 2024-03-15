import { pressData } from "../../data/categoryDictionary.js";
import {
  makePressInfoHtml,
  makeMainNewsHtml,
  makeNewsListHtml,
} from "./htmlGenerators.js";

let currentPage = 0;
let totalPage = 0;
let currentCategory = "";
let timer;
const START_INDEX = 0;
const TIME_TO_TURN_PAGE = 20000;

const mainEl = document.querySelector("main");
const listWrap = mainEl.querySelector(".press-list-wrap");
const categoryNav = mainEl.querySelector(".category");
const pressInfoBox = mainEl.querySelector(".press-info");
const mainNewsBox = mainEl.querySelector(".news-list-left");
const newsListBox = mainEl.querySelector(".news-list-right ul");
const nextButton = mainEl.querySelector(".right-button");
const prevButton = mainEl.querySelector(".left-button");

export function switchToListByViewer() {
  const listViewer = document.querySelector(".viewer-list");
  const girdViewer = document.querySelector(".viewer-grid");
  const gridWrap = document.querySelector(".press-grid-wrap");

  listViewer.addEventListener("click", (event) => {
    listViewer.classList.toggle("on");
    girdViewer.classList.toggle("on");
    listWrap.classList.toggle("display-none");
    gridWrap.classList.toggle("display-none");
    nextButton.classList.remove("hidden");
    prevButton.classList.remove("hidden");
  });
}

export function initPressListView() {
  initializeListView();

  nextButton.addEventListener("click", () => {
    gotoNextListPage();
    resetTimer();
  });
  prevButton.addEventListener("click", gotoPrevListPage);
  categoryNav.addEventListener("click", gotoCategory);

  resetTimer();
}

function initializeListView() {
  currentCategory = pressData[START_INDEX].category;
  totalPage = pressData[START_INDEX].pressList.length - 1;
  displayListCurrentPage(currentCategory, currentPage);
}

function displayListCurrentPage(currentCategory, index) {
  const currentPressData = pressData.find(
    (item) => item.category === currentCategory
  );
  const currentPressList = currentPressData.pressList;
  const currentPressObj = currentPressList[index];

  const pressInfoHtml = makePressInfoHtml(currentPressObj);
  const mainNewsHtml = makeMainNewsHtml(currentPressObj);
  const newsListHtml = makeNewsListHtml(currentPressObj);
  pressInfoBox.innerHTML = pressInfoHtml;
  mainNewsBox.innerHTML = mainNewsHtml;
  newsListBox.innerHTML = newsListHtml;
  applyStyleToSelectedCategory();
}

function applyStyleToSelectedCategory() {
  const categoryLists = categoryNav.querySelectorAll(".category-list");
  categoryLists.forEach((category) => {
    const categoryText = category.querySelector(".category-text");
    if (categoryText.textContent === currentCategory) {
      category.classList.add("selected");
      removePressCountSpan(category);
      addPressCountSpan(category);
    } else {
      category.classList.remove("selected");
      removePressCountSpan(category);
    }
  });
}

function addPressCountSpan(category) {
  const spanEl = document.createElement("span");
  const divEl = document.createElement("div");
  spanEl.classList.add("press-count");
  spanEl.innerText = `${currentPage + 1}/${totalPage + 1}`;
  divEl.classList.add("progress");
  category.appendChild(spanEl);
  category.appendChild(divEl);
}

function removePressCountSpan(category) {
  const pressCountSpan = category.querySelector(".press-count");
  const progressDiv = category.querySelector(".progress");
  if (pressCountSpan) category.removeChild(pressCountSpan);
  if (progressDiv) category.removeChild(progressDiv);
}

const gotoNextListPage = () => {
  if (!listWrap.classList.contains("display-none")) {
    currentPage++;
    convertCategoryByLastPage();
    displayListCurrentPage(currentCategory, currentPage);
  }
};

const gotoPrevListPage = () => {
  if (!listWrap.classList.contains("display-none")) {
    currentPage--;
    convertCategoryByFirstPage();
    displayListCurrentPage(currentCategory, currentPage);
  }
};

function convertCategoryByLastPage() {
  if (currentPage > totalPage) {
    const currentPressIndex = pressData.findIndex(
      (item) => item.category === currentCategory
    );
    const nextPressIndex =
      currentPressIndex + 1 >= pressData.length
        ? START_INDEX
        : currentPressIndex + 1;
    const nextPressObj = pressData[nextPressIndex];
    currentCategory = nextPressObj.category;
    currentPage = START_INDEX;
    totalPage = nextPressObj.pressList.length - 1;
  }
}

function convertCategoryByFirstPage() {
  if (currentPage < START_INDEX) {
    const currentPressIndex = pressData.findIndex(
      (item) => item.category === currentCategory
    );
    const prevPressIndex =
      currentPressIndex - 1 < START_INDEX
        ? pressData.length - 1
        : currentPressIndex - 1;
    const prevPressObj = pressData[prevPressIndex];
    currentCategory = prevPressObj.category;
    currentPage = prevPressObj.pressList.length - 1;
    totalPage = prevPressObj.pressList.length - 1;
  }
}

const gotoCategory = (event) => {
  if (event.target.classList.contains("category-text")) {
    const clickedCategoryText = event.target.textContent;
    const selectedCategoryObj = pressData.find(
      (item) => item.category === clickedCategoryText
    );
    currentCategory = clickedCategoryText;
    currentPage = START_INDEX;
    totalPage = selectedCategoryObj.pressList.length - 1;
    displayListCurrentPage(currentCategory, currentPage);
  }
};

function resetTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(gotoNextPageAndSetTimer, TIME_TO_TURN_PAGE);
}

function gotoNextPageAndSetTimer() {
  gotoNextListPage();
  resetTimer();
}
