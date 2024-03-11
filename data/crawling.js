const pupppeteer = require("puppeteer");
const fs = require("fs");

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
    const imgObj = { src: imgSrc };
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
    const imgObj = { src: imgSrc };
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
    const imgObj = { src: imgSrc };
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
