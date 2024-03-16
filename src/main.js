import { renderGrid } from "./js/renderer.js";
import rollingNews from "./js/rollingnews.js";
import clickEvent from "./js/paging.js";
import initNewsstand from "./js/newsstand.js";

function main() {
  initNewsstand();
  renderGrid(0);
  setInterval(rollingNews("left"), 5000);
  setTimeout(() => setInterval(rollingNews("right"), 5000), 1000);
  clickEvent();
}

main();
