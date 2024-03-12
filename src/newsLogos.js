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
  document.querySelector(".newsgroup-grid").style.visibility = "visible";

  console.log('show grid ' + page);

  document.querySelector(".newsgroup-grid").innerHTML = '';
  for (let index = 0; index < PAGE_SIZE; index++) {
    createNewsLogo(page * PAGE_SIZE + index);
  }
  
  document.querySelector(".left-btn").style.visibility = "visible";
  document.querySelector(".right-btn").style.visibility = "visible";

  if (page === 0)
    document.querySelector(".left-btn").style.visibility = "hidden";
  else if (page === (newsLogos.length) - 1)
    document.querySelector(".right-btn").style.visibility = "hidden";
}

function showList(page) {
  document.querySelector(".newsgroup-grid").style.visibility = "hidden";
  document.querySelector(".newsgroup-grid").innerHTML = '';
  document.querySelector(".left-btn").style.visibility = "hidden";
  document.querySelector(".right-btn").style.visibility = "hidden";

  const newsGroupList = document.querySelector(".newsgroup-list");

  // newsGroupList.style.border = "1px solid rgba(0, 0, 0, 0.8)";

}

showGrid(0);