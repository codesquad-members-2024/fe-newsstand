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

function showLogos(page) {
  const startIndex = page * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const logosUrl = shuffleLogos.slice(startIndex, endIndex);

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

showLogos(0);
