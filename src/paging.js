import { newsLogos, listCat } from "./data.js";
import { showGrid, showList } from "./show.js";

let currentPage = 0;
let currentCat = 0;

const clickFuntions = {
  gridViewClick() {
    currentPage = 0;
    showGrid(currentPage);
  },

  listViewClick() {
    currentCat = 0;
    showList(currentCat);
  },

  gridRightButtonClick() {
    if (currentPage < newsLogos.length) {
      currentPage++;
    }
    showGrid(currentPage);
  },

  gridLeftButtonClick() {
    if (currentPage > 0) {
      currentPage--;
    }
    showGrid(currentPage);
  },

  listRightButtonClick() {
    if (currentCat < listCat.length) {
      currentCat++;
    }
    showList(currentCat);
  },

  listLeftButtonClick() {
    if (currentCat > 0) {
      currentCat--;
    }
    showList(currentCat);
  },

  clickCat() {
    const listCat = document.querySelector(".newsgroup-list-cat");
    const listCatClick = document.createElement("div");
    listCatClick.classList.add("newsgroup-list-click");
    listCat.appendChild(listCatClick);
  },
};

function clickEvent() {
  const gridViewBtn = document.querySelector(".grid-view-btn");
  const listViewBtn = document.querySelector(".list-view-btn");
  const gridLeftBtn = document.querySelector(".grid-left-btn");
  const gridRightBtn = document.querySelector(".grid-right-btn");
  const listLeftBtn = document.querySelector(".list-left-btn");
  const listRightBtn = document.querySelector(".list-right-btn");
  const listClick = document.querySelector(".newsgroup-list-click");

  gridViewBtn.addEventListener("click", clickFuntions.gridViewClick);
  listViewBtn.addEventListener("click", clickFuntions.listViewClick);

  gridRightBtn.addEventListener("click", clickFuntions.gridRightButtonClick);
  gridLeftBtn.addEventListener("click", clickFuntions.gridLeftButtonClick);

  listRightBtn.addEventListener("click", clickFuntions.listRightButtonClick);
  listLeftBtn.addEventListener("click", clickFuntions.listLeftButtonClick);

  // listClick.addEventListener("click", clickFuntions.clickCat);
}

export default clickEvent;
