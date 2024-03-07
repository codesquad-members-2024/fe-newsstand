const newsLogos = [
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png",
  "https://s.pstatic.net/static/newsstand/2019/logo/011.png"
];

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

for (const logoURL of newsLogos) {
  const newsLogo = createNewsLogo(logoURL);
  document.querySelector('.newsgroup').appendChild(newsLogo);
}