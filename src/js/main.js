import { renderGrid } from "./renderer.js";
import { rollLeftNews, rollRightNews } from "./rollingnews.js";
import { clickEvent } from "./event.js";
import init from "./newsstand.js";

function main() {
  init();

  rollLeftNews();
  rollRightNews();
  setInterval(rollLeftNews, 5000);
  setTimeout(() => setInterval(rollRightNews, 5000), 1000);

  renderGrid(0);
  clickEvent();
}

main();
