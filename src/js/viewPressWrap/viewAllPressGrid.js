import { store } from "../../../data/store.js";
import { makePressBoxesInGridWrap } from "../../utils/htmlGenerators.js";

const LAST_PAGE = 3;
const FIRST_PAGE = 0;
let nextEventBinding;
let prevEventBinding;

export async function initAllPressGridView(subsGridData, pageData) {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  const gridWrap = document.querySelector(".grid");
  const pressArr = await getLogoImgSrc();

  viewPressLogo(pageData, pressArr, gridWrap, subsGridData);

  const nextEventHandler = (event) =>
    gotoNextGridPage(event, pageData, pressArr, gridWrap, subsGridData);
  nextButton.removeEventListener("click", nextEventBinding);
  nextEventBinding = nextEventHandler;
  nextButton.addEventListener("click", nextEventBinding);

  const prevEventHandler = (event) =>
    gotoPrevGridPage(event, pageData, pressArr, gridWrap, subsGridData);
  prevButton.addEventListener("click", prevEventBinding);
  prevEventBinding = prevEventHandler;
  prevButton.addEventListener("click", prevEventBinding);
}

function nextEventHandler(event) {
  gotoNextGridPage(event, pageData, pressArr, gridWrap, subsGridData);
}

export async function getLogoImgSrc() {
  try {
    const response = await fetch("./data/gridPress.json");
    const imgData = await response.json();
    const shuffledImgData = imgData.sort(() => Math.random() - 0.5);
    return shuffledImgData;
  } catch (err) {
    console.error("JSON 파일을 가져오는 도중 에러 발생.", err);
  }
}

function viewPressLogo(pageData, logoSrcArr, gridWrap, subsGridData) {
  const startIndex = pageData.currentPage * pageData.itemsPerPage;
  const endIndex = startIndex + pageData.itemsPerPage;

  const pressBoxesHtml = logoSrcArr
    .slice(startIndex, endIndex)
    .map((pressObj) => {
      const subsOrUnsubs = decideToSubsOrUnSubs(pressObj, subsGridData);
      const pressBoxesHtml = makePressBoxesInGridWrap(pressObj, subsOrUnsubs);
      return pressBoxesHtml;
    })
    .join("");

  gridWrap.innerHTML = pressBoxesHtml;
  renderBtnByGridPage(pageData);
}

function decideToSubsOrUnSubs(pressObj, subsGridData) {
  const currentPressName = pressObj.pressName;
  const subsPressNameArr = subsGridData.map((subsObj) => subsObj.pressName);
  const findingDuplicate = subsPressNameArr.filter(
    (subsPress) => subsPress === currentPressName
  );
  const subsORUnsubs =
    findingDuplicate.length <= 0 ? "+ 구독하기" : "- 해지하기";
  return subsORUnsubs;
}

function gotoNextGridPage(event, pageData, pressArr, gridWrap, subsGridData) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "off") {
    pageData.currentPage++;
    clearPressGrid();
    viewPressLogo(pageData, pressArr, gridWrap, subsGridData);
  } else {
    return;
  }
}

function gotoPrevGridPage(event, pageData, pressArr, gridWrap, subsGridData) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "off") {
    pageData.currentPage--;
    clearPressGrid();
    viewPressLogo(pageData, pressArr, gridWrap, subsGridData);
  } else {
    return;
  }
}

function clearPressGrid() {
  const pressBoxes = document.querySelectorAll(".press-box");
  for (const pressBox of pressBoxes) {
    pressBox.remove();
  }
}

function renderBtnByGridPage(pageData) {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  if (pageData.currentPage === LAST_PAGE) nextButton.classList.add("hidden");
  if (pageData.currentPage !== FIRST_PAGE)
    prevButton.classList.remove("hidden");
  if (pageData.currentPage !== LAST_PAGE) nextButton.classList.remove("hidden");
  if (pageData.currentPage === FIRST_PAGE) prevButton.classList.add("hidden");
}
