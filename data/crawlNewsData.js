const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const naverURL = "https://www.naver.com";
const gridBtn = ".ContentPagingView-module__btn_view_list___j7eNR";
const brandMark = ".MediaNewsView-module__news_top___KTy0M a img";
const mainImgCl = ".MediaNewsView-module__desc_left___jU94v a span img";
const mainACl =
  ".MediaNewsView-module__desc_left___jU94v .MediaNewsView-module__desc_title___IObEv";

async function crawling() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(naverURL);

  await page.click(gridBtn);

  const pressObj = await getPressInfo(page, brandMark);

  const mainNewsObj = await getMainNewsInfo(page, mainImgCl, mainACl);

  console.log({ pressObj, mainNewsObj });

  browser.close();
}

async function getPressInfo(page, selector) {
  const pressObj = {};
  const brandMarks = await page.$$(selector);
  for (const bm of brandMarks) {
    const imgSrc = await bm.evaluate((el) => el.getAttribute("src"));
    const alt = await bm.evaluate((el) => el.getAttribute("alt"));
    pressObj["pressName"] = alt;
    pressObj["brandMark"] = imgSrc;
  }
  return pressObj;
}

async function getMainNewsInfo(page, imgSelector, aSelector) {
  const mainNewsObj = {};
  await page.waitForSelector(imgSelector);
  const mainImg = await page.$$(imgSelector);
  for (const img of mainImg) {
    const thumb = await img.evaluate((el) => el.getAttribute("src"));
    const title = await img.evaluate((el) => el.getAttribute("alt"));
    mainNewsObj["thumbImg"] = thumb;
    mainNewsObj["title"] = title;
  }

  await page.waitForSelector(aSelector);
  const mainNewsLink = await page.$$(aSelector);
  for (const link of mainNewsLink) {
    const href = await link.evaluate((el) => el.getAttribute("href"));
    mainNewsObj["link"] = href;
  }
  return mainNewsObj;
}

crawling();
