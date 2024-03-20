import { store } from "../../data/store.js";
import { getLogoImgSrc, initAllPressGridView } from "./viewPressGrid.js";
import { initAllPressListView } from "./viewPressList.js";
import { makeInnerBoxesInMain } from "../utils/htmlGenerators.js";

store.addObserver(convertAllPressGrid);
store.addObserver(convertAllPressList);

const pressWrap = document.querySelector(".press-wrap");

export function initPressView() {
  convertAllPressGrid();
}

function convertAllPressGrid() {
  const state = store.getState();

  if (state.viewType === "grid" && state.subsType === "off") {
    pressWrap.classList.add("grid");
    pressWrap.classList.remove("list");
    let currentPage = 0;
    const itemsPerPage = 24;
    const pageData = { currentPage, itemsPerPage };
    getLogoImgSrc()
      .then((pressArr) => {
        initAllPressGridView(pressArr, pageData);
      })
      .catch((err) => {
        console.log("데이터 불러오는 중 오류 발생", err);
      });
  }
}

function convertAllPressList() {
  const state = store.getState();
  if (state.viewType === "list" && state.subsType === "off") {
    pressWrap.classList.add("list");
    pressWrap.classList.remove("grid");
    pressWrap.innerHTML = makeInnerBoxesInMain();
    initAllPressListView();
  }
}

function convertSubscribedPressGrid() {
  const state = store.getState();
}

function convertSubscribedPressList() {}
