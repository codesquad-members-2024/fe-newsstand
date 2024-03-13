// import { rollingnewsTitle } from "./data.js";

let recentNews = 0;

function createRollingNews(position, index) {
  const rollingNewsPosition = document.querySelector('.rollingnews-' + position);
  rollingNewsPosition.innerHTML = '';

  const bTag = document.createElement('b');
  const spanTag = document.createElement('span');

  bTag.textContent = "연합뉴스";
  spanTag.textContent = rollingnewsTitle[index % rollingnewsTitle.length];

  bTag.appendChild(spanTag);
  rollingNewsPosition.appendChild(bTag);
}

function rollingNews() {
  createRollingNews('left', recentNews++);
  createRollingNews('right', recentNews++);
}

const interval = setInterval(rollingNews, 5000);

// export default rollingNews;