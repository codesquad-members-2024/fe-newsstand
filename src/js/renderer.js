import { newsLogos, listCategory } from "../data/newsdata.js";
import { clickHandler } from "./event.js";

const PAGE_SIZE = 24;
const shuffleLogos = shuffle(newsLogos.flat());
let timer = null;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function createGrid(index) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  const newsGroupLogo = document.createElement("div");
  newsGroupLogo.classList.add("newsgroup-grid_logo");

  if (index < shuffleLogos.length) {
    const imgTag = `<img src="${shuffleLogos[index]}">`;
    const subscribeBtn = `<button class="subscribe-btn">+ 구독하기</button>`;
    const spanTag = `<span>${subscribeBtn}</span>`;

    newsGroupLogo.innerHTML = imgTag + spanTag;
  }
  newsgroupGrid.appendChild(newsGroupLogo);
}

function renderGrid(page) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  const [listViewBtn, gridViewBtn] = document.querySelectorAll(".view-btn > button");
  listViewBtn.querySelector("img").src = "./img/list_off.png";
  gridViewBtn.querySelector("img").src = "./img/grid_on.png";

  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  newsgroupGrid.style.display = "";
  newsgroupGrid.innerHTML = "";
  document.querySelector(".newsgroup-list").style.display = "none";
  document.querySelector(".list-left-btn").style.visibility = "hidden";
  document.querySelector(".list-right-btn").style.visibility = "hidden";
  document.querySelector(".grid-left-btn").style.visibility = "visible";
  document.querySelector(".grid-right-btn").style.visibility = "visible";

  if (page === 0)
    document.querySelector(".grid-left-btn").style.visibility = "hidden";
  else if (page === newsLogos.length - 1)
    document.querySelector(".grid-right-btn").style.visibility = "hidden";

  for (let index = 0; index < PAGE_SIZE; index++) {
    createGrid(page * PAGE_SIZE + index);
  }
}

function renderSubMediaGrid(page) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  newsgroupGrid.style.display = "";
  newsgroupGrid.innerHTML = "";
  document.querySelector(".newsgroup-list").style.display = "none";
  document.querySelector(".list-left-btn").style.visibility = "hidden";
  document.querySelector(".list-right-btn").style.visibility = "hidden";
  document.querySelector(".grid-left-btn").style.visibility = "hidden";
  document.querySelector(".grid-right-btn").style.visibility = "hidden";

  for (let index = 0; index < PAGE_SIZE; index++) {
    createGrid(page * PAGE_SIZE + index);
  }
}

function createList(index) {
  const [listViewBtn, gridViewBtn] = document.querySelectorAll(".view-btn > button");
  listViewBtn.querySelector("img").src = "./img/list_on.png";
  gridViewBtn.querySelector("img").src = "./img/grid_off.png";

  const listTop = document.querySelector(".newsgroup-list-top");
  const listLeft = document.querySelector(".newsgroup-list-left");
  const listRight = document.querySelector(".newsgroup-list-right");

  const item = listCategory[index];

  const logoImgTag = `<img src="${item.logoImageSrc}">`;
  const spanTag = `<span>${item.editedTime}</span>`;
  const subscribeBtn = `<button class="subscribe-btn">+ 구독하기</button>`;
  const imgTag = `<img src="${item.url}">`;
  const pTagleft = `<p>${item.description[0]}</p>`;

  const descDiv = document.createElement("div");

  for (let i = 1; i < item.description.length; i++) {
    const pTag = document.createElement("p");
    pTag.textContent = item.description[i];
    descDiv.appendChild(pTag);
  }

  listTop.innerHTML = logoImgTag + spanTag + subscribeBtn;
  listLeft.innerHTML = imgTag + pTagleft;
  listRight.appendChild(descDiv);
}

function renderList(cat) {
  const newsgroupList = document.querySelector(".newsgroup-list");
  newsgroupList.style.display = "";
  const newsgroupListTop = document.querySelector(".newsgroup-list-top");
  const newsgroupListleft = document.querySelector(".newsgroup-list-left");
  const newsgroupListright = document.querySelector(".newsgroup-list-right");
  newsgroupListTop.innerHTML = "";
  newsgroupListleft.innerHTML = "";
  newsgroupListright.innerHTML = "";

  document.querySelector(".newsgroup-grid").style.display = "none";
  document.querySelector(".grid-left-btn").style.visibility = "hidden";
  document.querySelector(".grid-right-btn").style.visibility = "hidden";
  document.querySelector(".list-left-btn").style.visibility = "visible";
  document.querySelector(".list-right-btn").style.visibility = "visible";

  if (cat === 0)
    document.querySelector(".list-left-btn").style.visibility = "hidden";
  else if (cat === listCategory.length - 1)
    document.querySelector(".list-right-btn").style.visibility = "hidden";

  createList(cat);

  // auto page transition
  if (cat === listCategory.length - 1) 
    timer = setTimeout(() => clickHandler.listViewClick(), 5000);
  else 
  timer = setTimeout(() => clickHandler.listRightButtonClick(), 5000);
}

export { renderGrid, renderSubMediaGrid, renderList };
