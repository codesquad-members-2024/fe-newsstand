import fs from "fs";
import puppeteer from "puppeteer";

const URL = "https://naver.com/";
const BROWSER_WIDTH = 1280;
const BROWSER_HEIGHT = 1024;
const NEWS_STAND_BUTTON_SELECTOR = ".ContentHeaderView-module__tab_text___IuWnG";
const LIST_VIEW_BUTTON_SELECTOR = ".ContentPagingView-module__btn_view_list___j7eNR";
const NEXT_BUTTON_SELECTOR = ".ContentPagingView-module__btn_next___ZBhby";
const PRESS_LOGO_SELECTOR = ".MediaNewsView-module__news_logo___LwMpl > img";
const NEXT_PAGE_SELECTOR = ".ContentPagingView-module__btn_next___ZBhby";
const EDITED_TIME_SELECTOR = ".MediaNewsView-module__time___fBQhP";
const CATEGORY_SELECTOR = ".MediaOptionView-module__link_item___thVcT";
const THUMBNAIL_SELECTOR = ".MediaNewsView-module__link_thumb___rmMr4 > span > img";
const HEADLINE_SELECTOR = ".MediaNewsView-module__desc_title___IObEv";

const isAriaSelected = async (page, selector) => {
  return await crawlAttribute(page, selector, "aria-selected") === "true";
};

const crawlAttribute = async (page, selector, attribute) => {
  try {
    return await page.$eval(
      selector,
      (element, attribute) => element.getAttribute(attribute),
      attribute
    );
  } catch (error) {
    return "";
  }
};

const crawlText = async (page, selector) => {
  return await page.$eval(selector, (element) => element.textContent);
};

const crawlActiveCategory = async (page) => {
  return await page.$$eval(CATEGORY_SELECTOR, (elements) => {
    return elements.find(
      (element) => element.getAttribute("aria-selected") === "true"
    ).textContent;
  });
};

const crawlSideNews = async (page) => {
  return await page.$$eval(
    ".MediaNewsView-module__desc_list___uQ3r1 > li > a",
    (elements) => {
      return elements.map((element) => {
        return { title: element.textContent, href: element.getAttribute("href") };
      });
    }
  );
};

const crawlAndConvertSeperateNews = async (page) => {
  const pressName = await crawlAttribute(page, PRESS_LOGO_SELECTOR, "alt");
  const logoImageSrc = await crawlAttribute(page, PRESS_LOGO_SELECTOR, "src");
  const editedTime = await crawlText(page, EDITED_TIME_SELECTOR);
  const category = await crawlActiveCategory(page);
  const thumbnailSrc = await crawlAttribute(page, THUMBNAIL_SELECTOR, "src");
  const headlineTitle = await crawlText(page, HEADLINE_SELECTOR);
  const headlineHref = await crawlAttribute(page, HEADLINE_SELECTOR, "href");
  const sideNews = await crawlSideNews(page);

  return {
    pressName: pressName,
    logoImageSrc: logoImageSrc,
    editedTime: editedTime,
    category: category,
    headline: {
      thumbnailSrc: thumbnailSrc,
      title: headlineTitle,
      href: headlineHref,
    },
    sideNews: sideNews,
  };
};

const crawlNewsList = async (page) => {
  const news = [];
  let ariaSelected = await isAriaSelected(page, NEWS_STAND_BUTTON_SELECTOR);
  let logoAlt = await crawlAttribute(page, PRESS_LOGO_SELECTOR, "alt");
  await page.click(NEXT_PAGE_SELECTOR);

  while (ariaSelected) {
    const renderedLogoName = await crawlAttribute(page, PRESS_LOGO_SELECTOR, "alt");

    if (logoAlt !== renderedLogoName && ariaSelected) {
      logoAlt = renderedLogoName;
      news.push(await crawlAndConvertSeperateNews(page));
      page.click(NEXT_BUTTON_SELECTOR);
    }
    ariaSelected = await isAriaSelected(page, NEWS_STAND_BUTTON_SELECTOR);
  }

  return news;
}

const crawlNews = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let newsResult;

  await page.goto(URL);
  await page.setViewport({ width: BROWSER_WIDTH, height: BROWSER_HEIGHT });
  await page.click(LIST_VIEW_BUTTON_SELECTOR);
  newsResult = await crawlNewsList(page);

  fs.writeFileSync("src/data/news.json", JSON.stringify(newsResult));
  browser.close();
};

export default crawlNews;
