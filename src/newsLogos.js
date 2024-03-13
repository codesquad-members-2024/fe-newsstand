const PAGE_SIZE = 24;
let recentNews = 0;

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
    const spanTag = document.createElement("span");

    const subscribeBtn = document.createElement("button");
    subscribeBtn.classList.add("subscribe-btn");
    subscribeBtn.textContent = "+ 구독하기";

    spanTag.appendChild(subscribeBtn);
    newsGroupLogo.appendChild(imgTag);
    newsGroupLogo.appendChild(spanTag);
  }
  
  newsgroupGrid.appendChild(newsGroupLogo);
}

function showGrid(page) {
  document.querySelector(".newsgroup-grid").style.display = "";
  document.querySelector(".newsgroup-list").style.display = "none";
  
  document.querySelector(".list-left-btn").style.visibility = "hidden"; // 버튼은 hidden, grid list는 none
  document.querySelector(".list-right-btn").style.visibility = "hidden";

  console.log('show grid ' + page);

  document.querySelector(".newsgroup-grid").innerHTML = '';
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
  document.querySelector(".newsgroup-grid").style.display = "none";
  document.querySelector(".newsgroup-grid").innerHTML = '';
  document.querySelector(".newsgroup-list").style.display = "";

  document.querySelector(".grid-left-btn").style.visibility = 'hidden';
  document.querySelector(".grid-right-btn").style.visibility = "hidden";

  document.querySelector(".list-left-btn").style.visibility = "visible";
  document.querySelector(".list-right-btn").style.visibility = "visible";

  const newsGroupList = document.querySelector(".newsgroup-list");
  const listHeader = document.createElement("div");
  listHeader.classList.add("newsgroup-list-header");
  const listArea = document.createElement("div");
  listArea.classList.add("newsgroup-list-area");

  newsGroupList.append(listHeader, listArea);
}

showGrid(0);