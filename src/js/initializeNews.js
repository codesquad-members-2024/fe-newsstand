import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

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
  const path = "src/data/news.json";
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

export default initializeNews;
