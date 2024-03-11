import fs from "fs";

const PRESS_LOGOS_WIDTH = 932;
const PRESS_LOGOS_HEIGHT = 1554;
const ROW_COUNT = 16;
const COLUMN_COUNT = 6;
const CELL_COUNT_PER_PAGE = 24;
const NO_ELEMENT = 0;

const isEmpty = (json) => {
  return Object.keys(json).length === NO_ELEMENT;
};

const addWidthHeightSettings = (json) => {
  json.width = PRESS_LOGOS_WIDTH;
  json.height = PRESS_LOGOS_HEIGHT;
  json.cellCountPerPage = CELL_COUNT_PER_PAGE;
};

const addCellsIntoTable = (json) => {
  const cells = [];
  const pressLogoWidth = PRESS_LOGOS_WIDTH / COLUMN_COUNT;
  const pressLogoHeight = PRESS_LOGOS_HEIGHT / ROW_COUNT;
  const rows = Array.from({ length: ROW_COUNT });
  const columns = Array.from({ length: COLUMN_COUNT });

  rows.forEach((_, rowIndex) => {
    columns.forEach((_, columnIndex) => {
      cells.push({
        top: -rowIndex * pressLogoHeight,
        left: -columnIndex * pressLogoWidth,
        width: pressLogoWidth,
        height: pressLogoHeight,
      });
    });
  });

  json.cells = cells;
};

const crawlLogos = () => {
  const path = "src/data/pressLogoTable.json";
  const pressLogoTableFile = fs.readFileSync(path, "utf-8");
  const pressLogoTable =
    pressLogoTableFile === "" ? {} : JSON.parse(pressLogoTableFile);

  if (isEmpty(pressLogoTable)) {
    addWidthHeightSettings(pressLogoTable);
    addCellsIntoTable(pressLogoTable);
  }

  fs.writeFileSync(path, JSON.stringify(pressLogoTable));
};

export default crawlLogos;