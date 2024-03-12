import fs from "fs";
import puppeteer from "puppeteer";

const crawlByPuppeteer = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const newsStandButtonSelector = ".ContentHeaderView-module__tab_text___IuWnG";

  await page.goto('https://naver.com/');
  await page.setViewport({width: 1280, height: 1024});
  await page.click('.ContentPagingView-module__btn_view_list___j7eNR');
  const newsStandButton = await page.waitForSelector(newsStandButtonSelector);
  let ariaSelected = await isAriaSelected(page, newsStandButtonSelector);
  const newsStandText = await getTextContent(page, newsStandButtonSelector);
  let current = await getTextContent(page, ".ContentPagingView-module__content_page___ZM2wA > span.current");
  let logoAlt = await page.$eval(".MediaNewsView-module__news_logo___LwMpl > img", element => element.getAttribute("alt"));
  const news = [];

  page.click(".ContentPagingView-module__btn_next___ZBhby");
  while (ariaSelected) {
    if (logoAlt !== await page.$eval(".MediaNewsView-module__news_logo___LwMpl > img", element => element.getAttribute("alt"))) {
      logoAlt = await page.$eval(".MediaNewsView-module__news_logo___LwMpl > img", element => element.getAttribute("alt"));

      const pressName = logoAlt;
      const logoImageSrc = await page.$eval(".MediaNewsView-module__news_logo___LwMpl > img", element => element.getAttribute("src"));
      const editedTime = await page.$eval(".MediaNewsView-module__time___fBQhP", element => element.textContent);
      const category = await page.$$eval(".MediaOptionView-module__link_item___thVcT", elements => {
        return elements.find(element => element.getAttribute("aria-selected") === "true").textContent;
      });
      const thumbnailHref = await page.$eval(".MediaNewsView-module__desc_left___jU94v > a", element => element.getAttribute("href"));
      const headlineTitle = await page.$eval(".MediaNewsView-module__desc_title___IObEv", element => element.textContent);
      const headlineHref = await page.$eval(".MediaNewsView-module__desc_title___IObEv", element => element.getAttribute("href"));
      const sideNews = await page.$$eval(".MediaNewsView-module__desc_list___uQ3r1 > li > a", elements => {
        return elements.map(element => {
          return { title: element.textContent, href: element.getAttribute("href") };
        });
      });
      news.push({ pressName: pressName, logoImageSrc: logoImageSrc, editedTime: editedTime, category: category, headline: { thumbnailHref: thumbnailHref, title: headlineTitle, href: headlineHref }, sideNews: sideNews });
      
      page.click(".ContentPagingView-module__btn_next___ZBhby");
    }

    ariaSelected = await isAriaSelected(page, newsStandButtonSelector);
  }


  fs.writeFileSync("src/data/news.json", JSON.stringify(news));
  browser.close();
}

crawlByPuppeteer();

export default crawlNews;
