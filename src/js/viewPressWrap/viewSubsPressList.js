import {
  makePressInfoHtml,
  makeMainNewsHtml,
  makeNewsListHtml,
  makePressNavHtml,
} from "../../utils/htmlGenerators.js";
import { store } from "../../../data/store.js";

let currentCategory = "";
const START_INDEX = 0;

export function initSubsPressListView(subsListData) {
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  const categoryNav = document.querySelector(".category");

  nextButton.classList.remove("hidden");
  prevButton.classList.remove("hidden");

  initializeListView(subsListData);
}

function initializeListView(subsListData) {
  currentCategory = subsListData[subsListData.length - 1].pressName;
  displayListCurrentPage(subsListData);
}

async function displayListCurrentPage(subsListData) {
  const categoryNav = document.querySelector(".category");
  const pressInfoBox = document.querySelector(".press-info");
  const mainNewsBox = document.querySelector(".news-list-left");
  const newsListBox = document.querySelector(".news-list-right ul");

  const currentPressObj = subsListData.find(
    (obj) => obj.pressName === currentCategory
  );
  const subsOrUnsubs = "- 해지하기";

  const navBarHtml = makePressNavHtml(subsListData);
  const pressInfoHtml = makePressInfoHtml(currentPressObj, subsOrUnsubs);
  const mainNewsHtml = makeMainNewsHtml(currentPressObj);
  const newsListHtml = makeNewsListHtml(currentPressObj);

  categoryNav.innerHTML = navBarHtml;
  pressInfoBox.innerHTML = pressInfoHtml;
  mainNewsBox.innerHTML = mainNewsHtml;
  newsListBox.innerHTML = newsListHtml;
}
