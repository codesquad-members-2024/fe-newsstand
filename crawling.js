// const axios = require("axios");
// const cheerio = require("cheerio");
const pupppeteer = require("puppeteer");
const fs = require("fs");

// const getHTML = async (url) => {
//   try {
//     return await axios.get(url);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const parsing = async (url) => {
//   const html = await getHTML(url);
//   const $ = cheerio.load(html.data);
//   const $news_logo = $(
//     ".MediaSubscriptionView-module__news_thumb___IA4y2 > img"
//   );
//   console.log($news_logo);

//   const newsLogos = [];
//   $news_logo.each((idx, element) => {
//     const src = $(element).attr("src");
//     console.log(src);
//   });
// };

// parsing("https://www.naver.com/");

async function main() {
  const browser = await pupppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.naver.com/");

  const ehList1 = await page.$$(
    ".MediaSubscriptionView-module__news_thumb___IA4y2"
  );
  const imgSrcArr = [];
  for (let eh of ehList1) {
    const imgSrc = await eh.$eval("img", function (el) {
      return el.src;
    });
    const imgObj = { img: imgSrc };
    imgSrcArr.push(imgObj);
  }

  await page.click(".ContentPagingView-module__btn_next___ZBhby");
  const ehList2 = await page.$$(
    ".MediaSubscriptionView-module__news_thumb___IA4y2"
  );
  for (let eh of ehList2) {
    const imgSrc = await eh.$eval("img", function (el) {
      return el.src;
    });
    const imgObj = { img: imgSrc };
    imgSrcArr.push(imgObj);
  }

  await page.click(".ContentPagingView-module__btn_next___ZBhby");
  const ehList3 = await page.$$(
    ".MediaSubscriptionView-module__news_thumb___IA4y2"
  );
  for (let eh of ehList3) {
    const imgSrc = await eh.$eval("img", function (el) {
      return el.src;
    });
    const imgObj = { img: imgSrc };
    imgSrcArr.push(imgObj);
  }

  await page.click(".ContentPagingView-module__btn_next___ZBhby");
  const ehList4 = await page.$$(
    ".MediaSubscriptionView-module__news_thumb___IA4y2"
  );
  for (let eh of ehList4) {
    const imgSrc = await eh.$eval("img", function (el) {
      return el.src;
    });
    const imgObj = { src: imgSrc };
    imgSrcArr.push(imgObj);
  }

  const jsonImgData = JSON.stringify(imgSrcArr);
  fs.writeFileSync("logoImg.json", jsonImgData);

  browser.close();
}

main();
