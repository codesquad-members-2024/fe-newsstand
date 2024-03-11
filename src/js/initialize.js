import initializeNews from "./initializeNews.js";
import initializePressTable from "./initializePressTable.js"

const initialize = () => {
  initializePressTable();
  initializeNews();
}

initialize();