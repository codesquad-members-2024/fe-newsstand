import { store } from "../../data/store.js";
const LAST_PAGE = 3;
const FIRST_PAGE = 0;

export function initAllPressGridView(pressArr, pageData) {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  const gridWrap = document.querySelector(".grid");

  viewPressLogo(pageData, pressArr, gridWrap);

  nextButton.addEventListener("click", (event) =>
    gotoNextGridPage(event, pageData, pressArr, gridWrap)
  );

  prevButton.addEventListener("click", (event) =>
    gotoPrevGridPage(event, pageData, pressArr, gridWrap)
  );
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

function viewPressLogo(pageData, logoSrcArr, gridWrap) {
  const startIndex = pageData.currentPage * pageData.itemsPerPage;
  const endIndex = startIndex + pageData.itemsPerPage;

  const pressBoxesHtml = logoSrcArr
    .slice(startIndex, endIndex)
    .map((pressObj) => {
      return `<div class="press-box">
    <img class="press-logo" src="${pressObj.brandMark}" alt="${pressObj.pressName}">
    <span class="subs pointer">+ 구독하기</span>
  </div>`;
    })
    .join("");

  gridWrap.innerHTML = pressBoxesHtml;
  renderBtnByGridPage(pageData);
}

function gotoNextGridPage(event, pageData, pressArr, gridWrap) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "off") {
    pageData.currentPage++;
    clearPressGrid();
    viewPressLogo(pageData, pressArr, gridWrap);
  } else {
    return;
  }
}

function gotoPrevGridPage(event, pageData, pressArr, gridWrap) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "off") {
    pageData.currentPage--;
    clearPressGrid();
    viewPressLogo(pageData, pressArr, gridWrap);
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
