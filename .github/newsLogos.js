function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const shuffleLogos = newsLogos.flat();
shuffle(shuffleLogos);

function createNewsLogo(logosUrl) {
  const newsgroupGrid = document.querySelector(".newsgroup-grid");
  const newsGroupLogo = document.createElement("div");
  newsGroupLogo.classList.add("newsgroup-grid_logo");

  const imgTag = document.createElement("img");
  imgTag.src = logosUrl;
  const spanTag = document.createElement("span");

  const subscribeBtn = document.createElement("button");
  subscribeBtn.classList.add("subscribe-btn");
  subscribeBtn.textContent = "+ 구독하기";

  spanTag.appendChild(subscribeBtn);
  newsGroupLogo.appendChild(imgTag);
  newsGroupLogo.appendChild(spanTag);
  newsgroupGrid.appendChild(newsGroupLogo);
}

function showLogos(page) {
  const logosPerPage = 24;
  const startIndex = page * logosPerPage;
  const endIndex = startIndex + logosPerPage;
  const logosUrl = shuffleLogos.slice(startIndex, endIndex);

  document.querySelector(".newsgroup-grid").innerHTML = '';
  logosUrl.forEach(url => {
    createNewsLogo(url);
  });
}

showLogos(0);
