import { newsLogos, listCat } from "./data.js";

const PAGE_SIZE = 24;
const shuffleLogos = shuffle(newsLogos.flat());

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function createNewsLogo(index) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  const newsGroupLogo = document.createElement("div");
  newsGroupLogo.classList.add("newsgroup-grid_logo");

  if (index < shuffleLogos.length) {
    const imgTag = document.createElement("img");
    imgTag.src = shuffleLogos[index];

    const subscribeBtn = document.createElement("button");
    subscribeBtn.classList.add("subscribe-btn");
    subscribeBtn.textContent = "+ 구독하기";

    const spanTag = document.createElement("span");
    spanTag.appendChild(subscribeBtn);
    newsGroupLogo.append(imgTag, spanTag);
  }

  newsgroupGrid.appendChild(newsGroupLogo);
}

function createList(index) {
  const listLeft = document.querySelector(".newsgroup-list-left");
  const listRight = document.querySelector(".newsgroup-list-right");

  const item = listCat[index];
  const imgTag = document.createElement("img");
  imgTag.src = item.url;
  const pTagleft = document.createElement("p");
  pTagleft.textContent = item.description[0];
  const descDiv = document.createElement("div");
  for (let i = 1; i < item.description.length; i++) {
    const pTag = document.createElement("p");
    pTag.textContent = item.description[i];
    descDiv.appendChild(pTag);
  }

  listLeft.appendChild(imgTag);
  listLeft.appendChild(pTagleft);
  listRight.appendChild(descDiv);
}

function showGrid(page) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  newsgroupGrid.style.display = "";
  newsgroupGrid.innerHTML = "";
  document.querySelector(".newsgroup-list").style.display = "none";
  document.querySelector(".list-left-btn").style.visibility = "hidden";
  document.querySelector(".list-right-btn").style.visibility = "hidden";
  document.querySelector(".grid-left-btn").style.visibility = "visible";
  document.querySelector(".grid-right-btn").style.visibility = "visible";

  for (let index = 0; index < PAGE_SIZE; index++) {
    createNewsLogo(page * PAGE_SIZE + index);
  }

  if (page === 0)
    document.querySelector(".grid-left-btn").style.visibility = "hidden";
  else if (page === newsLogos.length - 1)
    document.querySelector(".grid-right-btn").style.visibility = "hidden";
}

function showList(cat) {
  const newsgroupList = document.querySelector(".newsgroup-list");
  newsgroupList.style.display = "";

  const newsgroupListleft = document.querySelector(".newsgroup-list-left");
  const newsgroupListright = document.querySelector(".newsgroup-list-right");
  newsgroupListleft.innerHTML = '';
  newsgroupListright.innerHTML = '';

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

export { showGrid, showList };
