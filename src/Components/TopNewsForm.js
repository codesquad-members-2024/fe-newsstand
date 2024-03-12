import jsonParse from "../jsonParse.js";
export class TopNewsForm {
    #topNewsData;
    constructor() {
        this.#topNewsData = [
            { newsData: [], className: "first-top-news" },
            { newsData: [], className: "second-top-news" },
        ];
    }

    async initData() {
        const newsData = await jsonParse.parseJson("company");
        this.#topNewsData.forEach(cur => cur.newsData = newsData.splice(0, 5));
    }

    spliceCompanyString(newsData) {
        const modifyList = newsData.map((element) => {
            const pressName = element.press.split("언론사")[0].trim();
            element.press = pressName;
            return element
        });
        return modifyList
    }

    updateNewsData() {
        this.#topNewsData.forEach(curNews => {
            const preNewsData = curNews.newsData.shift();
            curNews.newsData.push(preNewsData);    
        })
    }

    getTopNewsTemplate() {
        this.updateNewsData();
        const [firstTopNewsTemplate, secondTopNewsTemplate] = this.#topNewsData.map((curNews) => {
            const [newsCur, newsNext] = [curNews.newsData[0], curNews.newsData[1]];
            return `
            <div class="${curNews.className}">
                <div class="company-name">${newsCur.press}</div>
                <div class="detail"><a href="${newsCur.href}">
                        ${newsCur.title}
                    </a>
                </div>
            </div>
            <div class="${curNews.className}">
                <div class="company-name">${newsNext.press}</div>
                <div class="detail"><a href="${newsNext.href}">
                        ${newsNext.title}
                    </a>
                </div>
            </div>
            `
        })
        return [firstTopNewsTemplate, secondTopNewsTemplate];
    }
}
