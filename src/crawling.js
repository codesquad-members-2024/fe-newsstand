import puppeteer from "puppeteer";
import fs from "fs";
const LOGO = "https://naver.com";
const CATEGORY_QUERY_ID = [1, 2, 3, 5, 7, 6];
const companyNameList = []

async function getNewPage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({width: 900, height: 1000})
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

const creatCompanyInfoJson = async (page) => {
    const data = [];
    await page.goto(LOGO, { waitUntil: "networkidle0" });

    for (let i = 0; i < 4; i++) {
        data.push(...(await getLogo(page)));
        page.click(".ContentPagingView-module__btn_next___ZBhby");
    }
    creatJson("topNews", data);
    data.forEach(item => companyNameList.push(item.companyName));
};

const getCategoryData = async (page) => {
        const newsLogos = await page.evaluate(() => {
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
        return newsLogos;
    };

const creatCategoetInfoJson = async (page) => {
    const data = []
    for (const categoryId of CATEGORY_QUERY_ID) {
        await page.goto(
            `https://search.naver.com/search.naver?where=news&query=%EB%89%B4%EC%8A%A4&sm=tab_opt&sort=0&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=0&office_section_code=&news_office_checked=&nso=&is_sug_officeid=0&office_category=${categoryId}&service_area=0`,
            { waitUntil: "networkidle0" }
        );
        data.push({"category": categoryId, data: await getCategoryData(page)});
    }
    creatJson("category", data);
}

const creatCompanyNewsJson = async (page) => {
    const data = []
    for (const companyName of companyNameList) {
        await page.goto(
            `https://search.naver.com/search.naver?where=news&query=${companyName}&sm=tab_clk.jou&sort=0&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=&office_section_code=&news_office_checked=&nso=&is_sug_officeid=1&office_category=0&service_area=0`,
            { waitUntil: "networkidle0" }
        );
        data.push(...(await getCategoryData(page)));
    }
    creatJson("company", data);
}

const crawling = async () => {
    await creatCompanyInfoJson(await getNewPage());
    await creatCategoetInfoJson(await getNewPage());
    await creatCompanyNewsJson(await getNewPage());
};

crawling();


