import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

async function getPressImages(page) {
    let images = [];
    let newImages = await page.$$eval('.news_logo', elements => elements.map(element => ({
        src: element.getAttribute('src'),
        alt: element.getAttribute('alt'),
        isSubscribe: false
    })));
    images.push(...newImages)
    for(let i = 0; i < 3; i++)  {
        await page.click('.ContentPagingView-module__btn_next___ZBhby');
        const newImages = await page.$$eval('.news_logo', elements => elements.map(element => ({
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            isSubscribe: false
        })));
        images.push(...newImages);
    }
    return images;
}

function saveToJson(images) {
    const imagesJson = JSON.stringify(images, null, 2);
    writeFileSync('./data/images.json', imagesJson);
}

async function getPressImageList() {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto('https://www.naver.com/');
    const images = await getPressImages(page);
    await browser.close();
    saveToJson(images);
    return { images };
}

getPressImageList()