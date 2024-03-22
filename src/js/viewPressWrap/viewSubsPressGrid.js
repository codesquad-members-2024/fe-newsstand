import { makePressBoxesInGridWrap } from "../../utils/htmlGenerators.js";
import { store } from "../../../data/store.js";

const FIRST_PAGE = 0;

export function initSubsPressGridView(subsGridData) {
  const gridWrap = document.querySelector(".grid");
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");

  let currentPage = 0;
  const itemsPerPage = 24;
  const lastPage =
    subsGridData.length % 24 === 0
      ? Math.floor(subsGridData.length / 24) - 1
      : Math.floor(subsGridData.length / 24);
  const pageData = { currentPage, itemsPerPage, lastPage };

  viewPressLogo(pageData, subsGridData, gridWrap);

  nextButton.addEventListener("click", (event) =>
    gotoNextGridPage(event, pageData, gridWrap, subsGridData)
  );

  prevButton.addEventListener("click", (event) =>
    gotoPrevGridPage(event, pageData, gridWrap, subsGridData)
  );
}

function viewPressLogo(pageData, logoSrcArr, gridWrap) {
  const startIndex = pageData.currentPage * pageData.itemsPerPage;
  const endIndex = startIndex + pageData.itemsPerPage;

  const slicedLogoArr = logoSrcArr.slice(startIndex, endIndex);
  const numOfEmptyPressBoxes = pageData.itemsPerPage - slicedLogoArr.length;

  const pressBoxesHtml = slicedLogoArr
    .map((pressObj) => {
      const subsOrUnsubs = "- 해지하기";
      const pressBoxesHtml = makePressBoxesInGridWrap(pressObj, subsOrUnsubs);
      return pressBoxesHtml;
    })
    .join("");

  let emptyPressBoxesHtml = "";
  for (let i = 0; i < numOfEmptyPressBoxes; i++) {
    emptyPressBoxesHtml += '<div class="press-box"></div>';
  }

  const html = pressBoxesHtml + emptyPressBoxesHtml;
  gridWrap.innerHTML = html;
  renderBtnByGridPage(pageData);
}

function gotoNextGridPage(event, pageData, gridWrap, subsGridData) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "on") {
    pageData.currentPage++;
    clearPressGrid();
    viewPressLogo(pageData, subsGridData, gridWrap);
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

function gotoPrevGridPage(event, pageData, gridWrap, subsGridData) {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "on") {
    pageData.currentPage--;
    clearPressGrid();
    viewPressLogo(pageData, subsGridData, gridWrap);
  } else {
    return;
  }
}

function renderBtnByGridPage(pageData) {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  if (pageData.currentPage === pageData.lastPage)
    nextButton.classList.add("hidden");
  if (pageData.currentPage !== FIRST_PAGE)
    prevButton.classList.remove("hidden");
  if (pageData.currentPage !== pageData.lastPage)
    nextButton.classList.remove("hidden");
  if (pageData.currentPage === FIRST_PAGE) prevButton.classList.add("hidden");
}
