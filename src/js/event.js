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

  clickCat(event) {
    const listCat = event.target.closest(".newsgroup-list-cat");
    listCat.classList.add("clicked");
    setTimeout(() => {
      listCat.classList.remove("clicked");
    }, 5000);
  },
};

function clickEvent() {
  const [listViewBtn, gridViewBtn] =
    document.querySelectorAll(".view-btn > button");
  const newsgroup = document.querySelector(".newsgroup");
  const listClick = document.querySelectorAll(".newsgroup-list-cat");

  gridViewBtn.addEventListener("click", clickHandler.gridViewClick);
  listViewBtn.addEventListener("click", clickHandler.listViewClick);

  listClick.forEach((button) => {
    button.addEventListener("click", clickHandler.clickCat);
  });

  newsgroup.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (button) {
      switch (button.className) {
        case "grid-right-btn":
          clickHandler.gridRightButtonClick();
          break;
        case "grid-left-btn":
          clickHandler.gridLeftButtonClick();
          break;
        case "list-right-btn":
          clickHandler.listRightButtonClick();
          break;
        case "list-left-btn":
          clickHandler.listLeftButtonClick();
          break;
        default:
          break;
      }
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("subscribe-btn")) { // contains DOM에 button에 있을 때
      const subscribeBtn = event.target;
      if (subscribeBtn.innerText === "+ 구독하기") {
        subscribeBtn.innerText = "+ 해지하기";
      } else {
        subscribeBtn.innerText = "+ 구독하기";
      }
    }
  });
}

export default clickEvent;
