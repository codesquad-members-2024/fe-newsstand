import { breakingNews } from "../../data/breakingNews.js";

const BOX1_RANGE = [0, 5];
const BOX2_RANGE = [5, 10];
const ROLL_INTERVAL = 5000;
const TIME_DIFFERENCE = 1000;
const START_INDEX = 0;

const headlineBox1 = document.querySelector(".rolling-box-1");
const headlineBox2 = document.querySelector(".rolling-box-2");

export function initAndRollNews() {
  initRollingNews(headlineBox1, BOX1_RANGE);
  initRollingNews(headlineBox2, BOX2_RANGE);

  rollHeadlinesByDelay(headlineBox1, 0);
  rollHeadlinesByDelay(headlineBox2, TIME_DIFFERENCE);
}

function initRollingNews(headlineBox, BOX_RANGE) {
  const [startIndex, lastIndex] = BOX_RANGE;
  const ulEl = document.createElement("ul");
  headlineBox.appendChild(ulEl);
  breakingNews.slice(startIndex, lastIndex).forEach((newsObj) => {
    const liEl = document.createElement("li");
    const aEl = document.createElement("a");
    aEl.href = newsObj.href;
    aEl.innerText = newsObj.title;
    ulEl.appendChild(liEl);
    liEl.appendChild(aEl);
  });

  const newsList = ulEl.querySelectorAll("li");
  applyClasses(newsList);
}

function applyClasses(newsList) {
  const classes = ["prev", "current", "next"];
  for (let i = START_INDEX; i < classes.length; i++) {
    newsList[i].classList.add(classes[i]);
  }
}

function rollHeadlinesByDelay(headlineBox, delay) {
  setTimeout(() => {
    let intervalId = setInterval(() => {
      rollingCallback(headlineBox);
    }, ROLL_INTERVAL);

    headlineBox.addEventListener("mouseenter", () => {
      clearInterval(intervalId);
    });

    headlineBox.addEventListener("mouseleave", () => {
      intervalId = setInterval(() => {
        rollingCallback(headlineBox);
      }, ROLL_INTERVAL);
    });
  }, delay);
}

function rollingCallback(headlineBox) {
  headlineBox.querySelector(".prev").classList.remove("prev");

  const current = headlineBox.querySelector(".current");
  current.classList.remove("current");
  current.classList.add("prev");

  const next = headlineBox.querySelector(".next");
  if (next.nextElementSibling === null) {
    headlineBox.querySelector("ul li:first-child").classList.add("next");
  } else {
    next.nextElementSibling.classList.add("next");
  }
  next.classList.remove("next");
  next.classList.add("current");
}
