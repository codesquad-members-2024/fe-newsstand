import { store } from "../../data/store.js";
import { initAllPressGridView } from "./viewPressWrap/viewAllPressGrid.js";
import { initAllPressListView } from "./viewPressWrap/viewAllPressList.js";
import { initSubsPressGridView } from "./viewPressWrap/viewSubsPressGrid.js";
import { initSubsPressListView } from "./viewPressWrap/viewSubsPressList.js";
import { makeInnerBoxesInListWrap } from "../utils/htmlGenerators.js";
import { getSubscriptionData } from "../utils/pressDataApi.js";

store.addObserver(convertAllPressGrid);
store.addObserver(convertAllPressList);
store.addObserver(convertSubscribedPressGrid);
store.addObserver(convertSubscribedPressList);

const pressWrap = document.querySelector(".press-wrap");

export async function initPressView() {
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
    getSubscriptionData("gridSubs")
      .then((subsGridData) => {
        initAllPressGridView(subsGridData, pageData);
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
    pressWrap.innerHTML = makeInnerBoxesInListWrap();
    initAllPressListView();
  }
}

function convertSubscribedPressGrid() {
  const state = store.getState();
  if (state.viewType === "grid" && state.subsType === "on") {
    pressWrap.classList.add("grid");
    pressWrap.classList.remove("list");
    getSubscriptionData("gridSubs")
      .then((subsGridData) => {
        initSubsPressGridView(subsGridData);
      })
      .catch((err) => {
        console.log("데이터 불러오는 중 오류 발생", err);
      });
  }
}

function convertSubscribedPressList() {
  const state = store.getState();
  if (state.viewType === "list" && state.subsType === "on") {
    pressWrap.classList.add("list");
    pressWrap.classList.remove("grid");
    pressWrap.innerHTML = makeInnerBoxesInListWrap();
    getSubscriptionData("listSubs")
      .then((subsListData) => {
        initSubsPressListView(subsListData);
      })
      .catch((err) => {
        console.log("데이터 불러오는 중 오류 발생", err);
      });
  }
}
