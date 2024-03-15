import { showGrid } from "./logos.js";
import rollingNews from "./rollingnews.js";
import clickEvent from "./paging.js";

function initNewsstand() {
  const refreshButton = document.querySelector(".refresh-btn");

  const daysOfWeek = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const date = new Date();
  const dayName = daysOfWeek[date.getDay()];
  document.querySelector(
    ".date"
  ).innerHTML = `${date.toLocaleDateString()} ${dayName}`;

  refreshButton.addEventListener("click", function () {
    location.reload();
  });
}

function main() {
  initNewsstand();
  showGrid(0);
  setInterval(rollingNews("left"), 5000);
  setTimeout(() => setInterval(rollingNews("right"), 5000), 1000);
  clickEvent();
}

main();
