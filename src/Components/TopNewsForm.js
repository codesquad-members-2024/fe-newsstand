export class TopNewsForm {
    #topNewsData;
    constructor() {
        this.#topNewsData = [
            { newsData: [], className: "first-top-news" },
            { newsData: [], className: "second-top-news" },
        ];
    }

    async initData() {
        await this.parseJson();
    }

    async parseJson() {
        const news = await fetch("/topNews.json");
        const data = await news.json();
        this.spliceCompanyString(data);
        this.#topNewsData.forEach(cur => cur.newsData.push(...data.splice(0, 5)))
    }

    spliceCompanyString(data) {
        data.forEach((element) => {
            const pressName = element.press.split("언론사")[0].trim();
            element.press = pressName;
        });
    }

    updateNewsData() {
        this.#topNewsData.forEach(curNews => {
            const data = curNews.newsData.shift();
            curNews.newsData.push(data);    
        })
    }

    getTopNewsTemplate() {
        this.updateNewsData();
        const [firstTopNewsTemplate, secondTopNewsTemplate] = this.#topNewsData.map((curNews, idx) => {
            const [newsCur, newsNext] = [curNews.newsData[0], curNews.newsData[1]];
            return `
            <div class="${curNews.className}">
                <div class="company-name">${newsCur.press}</div>
                <div class="detail"><a href="${newsCur.link}">
                        ${newsCur.title}
                    </a>
                </div>
            </div>
            <div class="${curNews.className}">
                <div class="company-name">${newsNext.press}</div>
                <div class="detail"><a href="${newsNext.link}">
                        ${newsNext.title}
                    </a>
                </div>
            </div>
            `
        })
        return [firstTopNewsTemplate, secondTopNewsTemplate];
    }
}
