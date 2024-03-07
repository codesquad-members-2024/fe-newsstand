import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

const PRESS_LOGOS_WIDTH = 932;
const PRESS_LOGOS_HEIGHT = 1554;
const ROW_COUNT = 16;
const COLUMN_COUNT = 6;
const CELL_COUNT_PER_PAGE = 24;
const NO_ELEMENT = 0;
const INCREMENT = 1;
const URL =
  "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR%3Ako";
const USER_AGENT_CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

const isEmpty = (json) => {
  return Object.keys(json).length === NO_ELEMENT;
};

const parseStringFromDate = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + INCREMENT
  }-${date.getDate()}`;
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

const initializePressTable = () => {
  const path = "data/pressLogoTable.json";
  const pressLogoTableFile = fs.readFileSync(path, "utf-8");
  const pressLogoTable =
    pressLogoTableFile === "" ? {} : JSON.parse(pressLogoTableFile);

  if (isEmpty(pressLogoTable)) {
    addWidthHeightSettings(pressLogoTable);
    addCellsIntoTable(pressLogoTable);
  }

  fs.writeFileSync(path, JSON.stringify(pressLogoTable));
};

const crawlNewsTitles = async (json) => {
  const response = await axios.get(URL, {
    headers: {
      "User-Agent": USER_AGENT_CHROME,
    },
  });
  const doc = response.data;
  let $ = cheerio.load(doc);
  const titles = [];

  $(".gPFEn").each((i, element) => {
    titles.push($(element).text());
  });

  json.titles = titles;
};

const initializeNews = async () => {
  const path = "data/news.json";
  const newsFile = fs.readFileSync(path, "utf-8");
  const newsTitles = newsFile === "" ? {} : JSON.parse(newsFile);
  const currentDate = new Date();

  if (
    isEmpty(newsTitles) ||
    newsTitles.date !== parseStringFromDate(currentDate)
  ) {
    newsTitles.date = parseStringFromDate(currentDate);
    await crawlNewsTitles(newsTitles);
  }

  fs.writeFileSync(path, JSON.stringify(newsTitles));
};

initializePressTable();
initializeNews();
