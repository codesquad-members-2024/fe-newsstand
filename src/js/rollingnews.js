import { rollingnewsTitle } from "../data/newsdata.js";

let recentNews = 0;

function createRollingNews(position, index) {
  const rollingNewsPosition = document.querySelector(
    ".rollingnews-" + position
  );
  rollingNewsPosition.innerHTML = "";

  const bTag = document.createElement("b");
  const spanTag = document.createElement("span");

  bTag.textContent = "연합뉴스";
  spanTag.textContent = rollingnewsTitle[index % rollingnewsTitle.length];

  bTag.appendChild(spanTag);
  rollingNewsPosition.appendChild(bTag);
}

function rollLeftNews() {
  createRollingNews("left", recentNews++);
}

function rollRightNews() {
  createRollingNews("right", recentNews++);
}

export { rollLeftNews, rollRightNews };
