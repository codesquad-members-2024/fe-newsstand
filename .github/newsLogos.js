function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

const shuffleLogos = newsLogos.flat();
shuffle(shuffleLogos);

function createNewsLogo(logoURL) {
  const newsLogo = document.createElement("div");
  newsLogo.classList.add("news_logo");
  newsLogo.style.borderRight = "1px solid rgba(0, 0, 0, 0.8)";
  newsLogo.style.borderBottom = "1px solid rgba(0, 0, 0, 0.8)";
  newsLogo.style.padding = "10px";
  newsLogo.style.fontSize = "30px";
  newsLogo.style.textAlign = "center";
  newsLogo.style.background = "white";
  newsLogo.style.position = "relative";

  const aTag = document.createElement("a");
  aTag.href = "#";

  const imgTag = document.createElement("img");
  imgTag.src = logoURL;
  imgTag.style.visibility = "visible";
  imgTag.style.position = "absolute";
  imgTag.style.top = "50%";
  imgTag.style.left = "50%";
  imgTag.style.transform = "translate(-50%, -50%)";

  const spanTag = document.createElement("span");

  const subscribeBtn = document.createElement("button");
  subscribeBtn.classList.add("subscribe-btn");
  subscribeBtn.textContent = "+ 구독하기";

  spanTag.appendChild(subscribeBtn);
  aTag.appendChild(imgTag);
  aTag.appendChild(spanTag);
  newsLogo.appendChild(aTag);

  return newsLogo;
}

function showLogos(page) {
  const logosPerPage = 24;
  const startIndex = (page - 1) * logosPerPage;
  const endIndex = startIndex + logosPerPage;
  const logosToShow = shuffleLogos.slice(startIndex, endIndex);

  const buttonsHTML = document.querySelector('.newsgroup .right-btn').outerHTML + document.querySelector('.newsgroup .left-btn').outerHTML;

  // 버튼 요소들을 제외한 나머지로 빈 문자열로 설정
  document.querySelector('.newsgroup').innerHTML = buttonsHTML;

  logosToShow.forEach((logoURL) => {
    const newsLogo = createNewsLogo(logoURL);
    document.querySelector('.newsgroup').appendChild(newsLogo);
  });
}


showLogos(1);