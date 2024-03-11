import { viewPressGrid } from "./viewPressGrid.js";
import { handleReload, viewDate } from "./viewHeader.js";

function main() {
  handleReload();
  viewDate();
  viewPressGrid();
}

main();
