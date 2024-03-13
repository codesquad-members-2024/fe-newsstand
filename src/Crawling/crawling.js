import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";
import fs from "fs";

const util = {
    NAVER_URL: "https://naver.com",
    companiesNameList: [],
    NAVER_LOGO_PAGE: {FIRST_PAGE: 0, LAST_PAGE: 4}
}

async function getNewPage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 900, height: 1000 })
    return page;
}
const creatJson = (tableName, data) => {
    fs.writeFile(
        `${tableName}.json`,
        JSON.stringify(data),
        function (err) {
            if (err) {
                console.error("파일 생성 중 오류 발생:", err);
            } else {
                console.log("json파일 생성완료");
            }
        }
    );
}

const getLogo = async (page) => {
    const newsLogos = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".news_logo"), (img) => ({
            img: img.src,
            companyName: img.alt,
        }));
    });
    return newsLogos;
};

const creatCompaniesInfoJson = async (page) => {
    const data = [];
    await page.goto(util.NAVER_URL, { waitUntil: "networkidle0" });

    for (let i = util.NAVER_LOGO_PAGE.FIRST_PAGE; i < util.NAVER_LOGO_PAGE.LAST_PAGE; i++) {
        data.push(...(await getLogo(page)));
        page.click(".ContentPagingView-module__btn_next___ZBhby");
    }
    creatJson("companiesInfo", data);
    data.forEach(item => util.companiesNameList.push(item.companyName));
};

const getCompaniesNewsData = async (page) => {
    const newsData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".news_area"), (e) => {
            const pressElement = e.querySelector("a.info.press");
            const hrefElement = e.querySelector("div.news_contents > a.dsc_thumb");

            const press = pressElement ? pressElement.innerText : "";
            const href = hrefElement ? hrefElement.getAttribute("href") : "";
            const title = e.querySelector("div.news_contents > a.news_tit").innerText;
            const time = e.querySelector("div.info_group > span").innerText;

            return { press, href, title, time };
        });
    });
    return newsData;
};

const getCategoryNewsData = async (page) => {
    const newsData = await page.evaluate(() => {
        return {
            category: document.querySelector(".ContentPagingView-module__point___U2tUD").innerText,
            companyName: document.querySelector(".MediaNewsView-module__news_logo___LwMpl > img")?.getAttribute("alt"),
            companyHref: document.querySelector(".MediaNewsView-module__news_logo___LwMpl")?.getAttribute("href"),
            companyImg: document.querySelector(".MediaNewsView-module__news_logo___LwMpl > img")?.getAttribute("src"),
            editDate: document.querySelector(".MediaNewsView-module__news_text___hi3Xf").innerText,
            mainNewsSrc: document.querySelector(".MediaNewsView-module__link_thumb___rmMr4")?.getAttribute("href"),
            mainNewsImg: document.querySelector("a.MediaNewsView-module__link_thumb___rmMr4 > span > img")?.getAttribute("src"),
            mainNewsTitle: document.querySelector(".MediaNewsView-module__desc_title___IObEv")?.innerText,
            subNewsInfo: Array.from(document.querySelectorAll(".MediaNewsView-module__link_item___x0z7x"), (e) => {
                return {
                    href: e.href,
                    text: e.innerText
                }
            }),
        };
    });
    return newsData;
};

const creatCategoryInfoJson = async (page) => {
    const data = [];
    let status = true;
    await page.goto(util.NAVER_URL, { waitUntil: "networkidle0" });
    await page.click("button.ContentPagingView-module__btn_view_list___j7eNR");

    while (status) {
        try {
            data.push(await getCategoryNewsData(page));
            await page.click("button.ContentPagingView-module__btn_next___ZBhby");
            await setTimeout(500);
        } catch (error) {
            console.error("Error occurred during crawling:", error.message);
            status = false;
        }
    }

    creatJson("category", data);
};

const creatCompaniesNewsInfoJson = async (page) => {
    const data = []
    for (const companyName of util.companiesNameList) {
        await page.goto(
            `https://search.naver.com/search.naver?where=news&query=${companyName}&sm=tab_clk.jou&sort=0&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=&office_section_code=&news_office_checked=&nso=&is_sug_officeid=1&office_category=0&service_area=0`,
            { waitUntil: "networkidle0" }
        );
        data.push(...(await getCompaniesNewsData(page)));
    }
    creatJson("companiesNewsInfo", data);
}

const crawling = async () => {
    // await creatCompaniesInfoJson(await getNewPage());
    // await creatCompaniesNewsInfoJson(await getNewPage());
    await creatCategoryInfoJson(await getNewPage());
};

crawling();