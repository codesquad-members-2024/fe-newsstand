import { initPressGridView, switchToGridByViewer } from "./viewPressGrid.js";
import { handleReload, viewDate } from "./viewHeader.js";
import { initAndRollNews } from "./viewRollingNews.js";
import { switchToListByViewer } from "./viewPressList.js";

function main() {
  handleReload();
  viewDate();
  initPressGridView();
  initAndRollNews();
  switchToListByViewer();
  switchToGridByViewer();
}

main();
