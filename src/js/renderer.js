import { newsLogos, listCat } from "../data/newsdata.js";

const PAGE_SIZE = 24;
const shuffleLogos = shuffle(newsLogos.flat());

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
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  newsgroupGrid.style.display = "";
  newsgroupGrid.innerHTML = "";
  document.querySelector(".newsgroup-list").style.display = "none";
  document.querySelector(".list-left-btn").style.visibility = "hidden";
  document.querySelector(".list-right-btn").style.visibility = "hidden";
  document.querySelector(".grid-left-btn").style.visibility = "visible";
  document.querySelector(".grid-right-btn").style.visibility = "visible";

  for (let index = 0; index < PAGE_SIZE; index++) {
    createGrid(page * PAGE_SIZE + index);
  }

  if (page === 0)
    document.querySelector(".grid-left-btn").style.visibility = "hidden";
  else if (page === newsLogos.length - 1)
    document.querySelector(".grid-right-btn").style.visibility = "hidden";
}

function createList(index) {
  const listTop = document.querySelector(".newsgroup-list-top");
  const listLeft = document.querySelector(".newsgroup-list-left");
  const listRight = document.querySelector(".newsgroup-list-right");

  const item = listCat[index];

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
  else if (cat === listCat.length - 1)
    document.querySelector(".list-right-btn").style.visibility = "hidden";

  createList(cat);
}

export { renderGrid, renderList };
