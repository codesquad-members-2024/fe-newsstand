import { newsLogos, listCat } from "../data/newsdata.js";
import { renderGrid, renderList } from "./renderer.js";

let currentPage = 0;
let currentCat = 0;

const clickHandler = {
  gridViewClick() {
    currentPage = 0;
    renderGrid(currentPage);
  },

  listViewClick() {
    currentCat = 0;
    renderList(currentCat);
  },

  gridRightButtonClick() {
    if (currentPage < newsLogos.length) {
      currentPage++;
    }
    renderGrid(currentPage);
  },

  gridLeftButtonClick() {
    if (currentPage > 0) {
      currentPage--;
    }
    renderGrid(currentPage);
  },

  listRightButtonClick() {
    if (currentCat < listCat.length) {
      currentCat++;
    }
    renderList(currentCat);
  },

  listLeftButtonClick() {
    if (currentCat > 0) {
      currentCat--;
    }
    renderList(currentCat);
  },

  clickCat() {
    const listCat = document.querySelector(".newsgroup-list-cat");
    listCat.innerHTML += '<div class="newsgroup-list-click"></div>';
  },
};

function clickEvent() {
  const gridViewBtn = document.querySelector(".grid-view-btn");
  const listViewBtn = document.querySelector(".list-view-btn");
  const gridLeftBtn = document.querySelector(".grid-left-btn");
  const gridRightBtn = document.querySelector(".grid-right-btn");
  const listLeftBtn = document.querySelector(".list-left-btn");
  const listRightBtn = document.querySelector(".list-right-btn");
  const listClick = document.querySelector(".newsgroup-list-cat");

  gridViewBtn.addEventListener("click", clickHandler.gridViewClick);
  listViewBtn.addEventListener("click", clickHandler.listViewClick);

  gridRightBtn.addEventListener("click", clickHandler.gridRightButtonClick);
  gridLeftBtn.addEventListener("click", clickHandler.gridLeftButtonClick);

  listRightBtn.addEventListener("click", clickHandler.listRightButtonClick);
  listLeftBtn.addEventListener("click", clickHandler.listLeftButtonClick);

  listClick.addEventListener("click", clickHandler.clickCat);
}

export default clickEvent;
