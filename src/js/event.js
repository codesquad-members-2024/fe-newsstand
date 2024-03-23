import { newsLogos, listCategory } from "../data/newsdata.js";
import { renderGrid, renderSubMediaGrid, renderList } from "./renderer.js";
import { uploadSubscription, deleteSubscription, downloadSubscriptions } from "./subscription.js";

let currentPage = 0;
let currentCategory = 0;

const clickHandler = {
  gridViewClick() {
    currentPage = 0;
    renderGrid(currentPage);
  },

  listViewClick() {
    currentCategory = 0;
    renderList(currentCategory);
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
    if (currentCategory < listCategory.length) {
      currentCategory++;
    }
    renderList(currentCategory);
  },

  listLeftButtonClick() {
    if (currentCategory > 0) {
      currentCategory--;
    }
    renderList(currentCategory);
  },

  clickCategory(event) {
    const listCat = event.target.closest(".newsgroup-list-category");
    listCat.classList.add("clicked");
    setTimeout(() => {
      listCat.classList.remove("clicked");
    }, 5000);
  },
};

function clickEvent() {
  const [allMedia, subscribedMedia] = document.querySelector(".press-title").children;
  const [listViewBtn, gridViewBtn] = document.querySelectorAll(".view-btn > button");
  const newsgroup = document.querySelector(".newsgroup");
  const listClick = document.querySelectorAll(".newsgroup-list-category");

  allMedia.addEventListener("click", clickHandler.gridViewClick);
  subscribedMedia.addEventListener("click", renderSubMediaGrid);

  gridViewBtn.addEventListener("click", clickHandler.gridViewClick);
  listViewBtn.addEventListener("click", clickHandler.listViewClick);

  listClick.forEach((button) => {
    button.addEventListener("click", clickHandler.clickCategory);
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
    if (event.target.classList.contains("subscribe-btn")) {
      const subscribeBtn = event.target;
      const newsGroupLogo = subscribeBtn.closest(".newsgroup-grid_logo");
      const newsGroupList = subscribeBtn.closest(".newsgroup-list-top");

      const view = newsGroupLogo ? newsGroupLogo : newsGroupList;

      const imgElement = view.querySelector("img");
      const imgSrc = imgElement.getAttribute("src");
      
      console.log(downloadSubscriptions());

      if (subscribeBtn.innerText === "+ 구독하기") {
        subscribeBtn.innerText = "+ 해지하기";
        uploadSubscription(imgSrc);
      } else {
        subscribeBtn.innerText = "+ 구독하기";
        downloadSubscriptions().then((subscriptions) => {
          const subscription = subscriptions.find(
            (subscription) => subscription.imgSrc === imgSrc
          );
          const imgId = subscription.id;
          deleteSubscription(imgId);
        });
      }
    }
  });
}

export { clickHandler, clickEvent };
