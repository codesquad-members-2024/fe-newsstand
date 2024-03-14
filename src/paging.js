import { newsLogos, listCat } from "./data.js";
import { showGrid, showList } from "./logos.js";

let currentPage = 0;
let currentCat = 0;

const gridLeftBtn = document.querySelector(".grid-left-btn");
const gridRightBtn = document.querySelector(".grid-right-btn");
const listLeftBtn = document.querySelector(".list-left-btn");
const listRightBtn = document.querySelector(".list-right-btn");

const gridViewBtn = document.querySelector(".grid-view-btn");
const listViewBtn = document.querySelector(".list-view-btn");

function gridViewClick() {
  currentPage = 0;
  showGrid(currentPage);
}

function listViewClick() {
  currentCat = 0;
  showList(currentCat);
}

function gridRightButtonClick() {
  if (currentPage < newsLogos.length) {
    currentPage++;
  }
  showGrid(currentPage);
}

function gridLeftButtonClick() {
  if (currentPage > 0) {
    currentPage--;
  }
  showGrid(currentPage);
}

function listRightButtonClick() {
  if (currentCat < listCat.length) {
    currentCat++;
  }
  showList(currentCat);
}

function listLeftButtonClick() {
  if (currentCat > 0) {
    currentCat--;
  }
  showList(currentCat);
}

listViewBtn.addEventListener("click", () => {
  listViewClick();
});

gridViewBtn.addEventListener("click", gridViewClick);

gridRightBtn.addEventListener("click", gridRightButtonClick);

gridLeftBtn.addEventListener("click", gridLeftButtonClick);

listRightBtn.addEventListener("click", listRightButtonClick);

listLeftBtn.addEventListener("click", listLeftButtonClick);
