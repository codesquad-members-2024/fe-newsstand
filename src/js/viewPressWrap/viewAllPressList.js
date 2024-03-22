import { pressData } from "../../../data/categoryDictionary.js";
import {
  makePressInfoHtml,
  makeMainNewsHtml,
  makeNewsListHtml,
  makeCategoryNavHtml,
} from "../../utils/htmlGenerators.js";
import { getSubscriptionData } from "../../utils/pressDataApi.js";
import { store } from "../../../data/store.js";

let currentPage = 1;
let totalPage = 0;
let currentCategory = "";
let timer;
const START_INDEX = 0;
const START_PAGE_NUM = 1;
const TIME_TO_TURN_PAGE = 20000;

export function initAllPressListView() {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  const categoryNav = document.querySelector(".category");

  nextButton.classList.remove("hidden");
  prevButton.classList.remove("hidden");

  initializeListView();
  nextButton.removeEventListener("click", handleNextBtn);
  nextButton.addEventListener("click", handleNextBtn);
  prevButton.removeEventListener("click", handlePrevBtn);
  prevButton.addEventListener("click", handlePrevBtn);

  categoryNav.addEventListener("click", gotoCategory);

  resetTimer();
}

function handleNextBtn() {
  gotoNextListPage();
  resetTimer();
}

function handlePrevBtn() {
  gotoPrevListPage();
  resetTimer();
}

function initializeListView() {
  currentCategory = pressData[START_INDEX].category;
  totalPage = pressData[START_INDEX].pressList.length;
  displayListCurrentPage();
}

async function displayListCurrentPage() {
  const categoryNav = document.querySelector(".category");
  const pressInfoBox = document.querySelector(".press-info");
  const mainNewsBox = document.querySelector(".news-list-left");
  const newsListBox = document.querySelector(".news-list-right ul");

  const currentPressObj = getCurrentPressObj();
  const subscribedList = await getSubscriptionData("listSubs");
  const subsOrUnsubs = decideToSubsOrUnSubs(currentPressObj, subscribedList);

  const navBarHtml = makeCategoryNavHtml(pressData);
  const pressInfoHtml = makePressInfoHtml(currentPressObj, subsOrUnsubs);
  const mainNewsHtml = makeMainNewsHtml(currentPressObj);
  const newsListHtml = makeNewsListHtml(currentPressObj);

  categoryNav.innerHTML = navBarHtml;
  pressInfoBox.innerHTML = pressInfoHtml;
  mainNewsBox.innerHTML = mainNewsHtml;
  newsListBox.innerHTML = newsListHtml;
  applyStyleToSelectedCategory();
}

function getCurrentPressObj() {
  const currentPressData = pressData.find(
    (item) => item.category === currentCategory
  );
  const currentPressList = currentPressData.pressList;
  const currentPressObj = currentPressList[currentPage - 1];
  return currentPressObj;
}

function decideToSubsOrUnSubs(currentPressObj, subscribedListPress) {
  const currentPressName = currentPressObj.pressName;
  const filteredArr = subscribedListPress.filter(
    (pressObj) => pressObj.pressName === currentPressName
  );
  const subsOrUnsubs = filteredArr.length <= 0 ? "+ 구독하기" : "- 해지하기";
  return subsOrUnsubs;
}

function applyStyleToSelectedCategory() {
  const categoryNav = document.querySelector(".category");
  const categoryLists = categoryNav.querySelectorAll(".category-list");
  categoryLists.forEach((category) => {
    const categoryText = category.querySelector(".category-text");
    if (categoryText.textContent === currentCategory) {
      category.classList.add("selected");
      removePressCountAndProgress(category);
      addPressCountAndProgress(category);
    } else {
      category.classList.remove("selected");
      removePressCountAndProgress(category);
    }
  });
}

function addPressCountAndProgress(category) {
  const spanEl = document.createElement("span");
  const divEl = document.createElement("div");
  spanEl.classList.add("press-count");
  spanEl.innerText = `${currentPage}/${totalPage}`;
  divEl.classList.add("progress");
  category.append(spanEl, divEl);
}

function removePressCountAndProgress(category) {
  const pressCountSpan = category.querySelector(".press-count");
  const progressDiv = category.querySelector(".progress");
  if (pressCountSpan) category.removeChild(pressCountSpan);
  if (progressDiv) category.removeChild(progressDiv);
}

function gotoNextListPage() {
  const state = store.getState();
  if (state.viewType === "list" && state.subsType === "off") {
    currentPage++;
    convertCategoryByLastPage();
    displayListCurrentPage(currentCategory, currentPage);
  } else {
    return;
  }
}

function gotoPrevListPage() {
  const state = store.getState();
  if (state.viewType === "list" && state.subsType === "off") {
    currentPage--;
    convertCategoryByFirstPage();
    displayListCurrentPage(currentCategory, currentPage);
  } else {
    return;
  }
}

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
    currentPage = START_PAGE_NUM;
    totalPage = nextPressObj.pressList.length;
  } else {
    return;
  }
}

function convertCategoryByFirstPage() {
  if (currentPage < START_PAGE_NUM) {
    const currentPressIndex = pressData.findIndex(
      (item) => item.category === currentCategory
    );
    const prevPressIndex =
      currentPressIndex - 1 < START_INDEX
        ? pressData.length - 1
        : currentPressIndex - 1;
    const prevPressObj = pressData[prevPressIndex];
    currentCategory = prevPressObj.category;
    currentPage = prevPressObj.pressList.length;
    totalPage = prevPressObj.pressList.length;
  } else {
    return;
  }
}

function gotoCategory(event) {
  if (event.target.classList.contains("category-text")) {
    const clickedCategoryText = event.target.textContent;
    const selectedCategoryObj = pressData.find(
      (item) => item.category === clickedCategoryText
    );
    currentCategory = clickedCategoryText;
    currentPage = START_PAGE_NUM;
    totalPage = selectedCategoryObj.pressList.length;
    resetTimer();
    displayListCurrentPage(currentCategory, currentPage);
  } else {
    return;
  }
}

function resetTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(gotoNextPageAndSetTimer, TIME_TO_TURN_PAGE);
}

function gotoNextPageAndSetTimer() {
  gotoNextListPage();
  resetTimer();
}
