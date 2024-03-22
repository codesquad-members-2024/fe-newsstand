import { viewHeader } from "./header.js";
import { initAndRollNews } from "./rollingNews.js";
import { initViewer, initSubsTap } from "./viewerAndTap.js";
import { initPressView } from "./pressWrap.js";
import { handleGridSubsOnClick } from "./gridSubscription.js";
import { handleListSubsOnClick } from "./listSubscription.js";

function main() {
  viewHeader();
  initAndRollNews();
  initViewer();
  initSubsTap();
  initPressView();
  handleGridSubsOnClick();
  handleListSubsOnClick();
}

main();
