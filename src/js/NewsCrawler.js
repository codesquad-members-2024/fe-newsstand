import fs from "fs";
import puppeteer from "puppeteer";

const URL = "https://naver.com/";
const BROWSER_WIDTH = 1280;
const BROWSER_HEIGHT = 1024;
const ST = Object.freeze({
  NEWS_STAND: ".ContentHeaderView-module__tab_text___IuWnG",
  LIST_VIEW: ".ContentPagingView-module__btn_view_list___j7eNR",
  NEXT_BUTTON: ".ContentPagingView-module__btn_next___ZBhby",
  PRESS_LOGO: ".MediaNewsView-module__news_logo___LwMpl > img",
  NEXT_PAGE: ".ContentPagingView-module__btn_next___ZBhby",
  EDITED_TIME: ".MediaNewsView-module__time___fBQhP",
  CATEGORY: ".MediaOptionView-module__link_item___thVcT",
  THUMBNAIL: ".MediaNewsView-module__link_thumb___rmMr4 > span > img",
  HEADLINE: ".MediaNewsView-module__desc_title___IObEv",
});

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
  return await page.$$eval(ST.CATEGORY, (elements) => {
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
  const [pressName, logoImageSrc, editedTime, category, thumbnailSrc, headlineTitle, headlineHref, sideNews] = await Promise.all([
    crawlAttribute(page, ST.PRESS_LOGO, "alt"),
    crawlAttribute(page, ST.PRESS_LOGO, "src"),
    crawlText(page, ST.EDITED_TIME),
    crawlActiveCategory(page),
    crawlAttribute(page, ST.THUMBNAIL, "src"),
    crawlText(page, ST.HEADLINE),
    crawlAttribute(page, ST.HEADLINE, "href"),
    crawlSideNews(page)
  ]);

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
  let ariaSelected = await isAriaSelected(page, ST.NEWS_STAND);
  let logoAlt = await crawlAttribute(page, ST.PRESS_LOGO, "alt");
  await page.click(ST.NEXT_PAGE);

  while (ariaSelected) {
    const renderedLogoName = await crawlAttribute(page, ST.PRESS_LOGO, "alt");

    if (logoAlt !== renderedLogoName && ariaSelected) {
      logoAlt = renderedLogoName;
      news.push(await crawlAndConvertSeperateNews(page));
      page.click(ST.NEXT_BUTTON);
    }
    ariaSelected = await isAriaSelected(page, ST.NEWS_STAND);
  }

  return news;
}

const crawlNews = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let newsResult;

  await page.goto(URL);
  await page.setViewport({ width: BROWSER_WIDTH, height: BROWSER_HEIGHT });
  await page.click(ST.LIST_VIEW);
  newsResult = await crawlNewsList(page);

  fs.writeFileSync("src/data/news.json", JSON.stringify(newsResult));
  browser.close();
};

export default crawlNews;
