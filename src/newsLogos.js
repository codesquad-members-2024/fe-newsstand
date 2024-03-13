// import { newsLogos } from "./data.js";

const PAGE_SIZE = 24;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const shuffleLogos = newsLogos.flat();
shuffle(shuffleLogos);

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

function showGrid(page) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  newsgroupGrid.style.display = "";
  newsgroupGrid.innerHTML = '';
  document.querySelector(".newsgroup-list").style.display = "none";
  document.querySelector(".list-left-btn").style.visibility = "hidden";
  document.querySelector(".list-right-btn").style.visibility = "hidden";

  for (let index = 0; index < PAGE_SIZE; index++) {
    createNewsLogo(page * PAGE_SIZE + index);
  }

  document.querySelector(".grid-left-btn").style.visibility = "visible";
  document.querySelector(".grid-right-btn").style.visibility = "visible";

  if (page === 0)
    document.querySelector(".grid-left-btn").style.visibility = "hidden";
  else if (page === (newsLogos.length) - 1)
    document.querySelector(".grid-right-btn").style.visibility = "hidden";
}

function showList(page) {
  document.querySelector(".newsgroup-list").style.display = "";
  document.querySelector(".newsgroup-grid").style.display = "none";

  document.querySelector(".grid-left-btn").style.visibility = 'hidden';
  document.querySelector(".grid-right-btn").style.visibility = "hidden";

  document.querySelector(".list-left-btn").style.visibility = "visible";
  document.querySelector(".list-right-btn").style.visibility = "visible";
}

showGrid(0);

