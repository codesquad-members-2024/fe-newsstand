export class GetTopNews{
    #firstTopNewsData
    #secondTopNewsData
    constructor () {
        this.#firstTopNewsData = []
        this.#secondTopNewsData = []
    }

    async initData() {
        await this.parseJson()
    }

    async parseJson () {
        const news = await fetch("/topNews.json");
        const data = await news.json();
        this.spliceCompanyString(data)
        this.#firstTopNewsData.push(...data.splice(0, 5))
        this.#secondTopNewsData.push(...data)
    };

    spliceCompanyString(data) {
        data.forEach(element => {
            const pressName = element.press.split('언론사')[0].trim();
            element.press = pressName
        })
    }

    updateNewsData () {
        const firstData = this.#firstTopNewsData.shift()
        this.#firstTopNewsData.push(firstData)
        const secondData = this.#secondTopNewsData.shift()
        this.#secondTopNewsData.push(secondData)
    }

    getTopNewsTemplate () {
        this.updateNewsData()
        const [firstNewsCur, firstNewsNext] = [this.#firstTopNewsData[0], this.#firstTopNewsData[1]]
        const [secondNewsCur, secondNewsNext] = [this.#secondTopNewsData[0], this.#secondTopNewsData[1]]
        const firstTopNewsTemplate = `
        <div class="top-news-display-board margin-right">
            <div class="first-top-news">
                <div class="company-name">${firstNewsCur.press}</div>
                <div class="detail"><a href="${firstNewsCur.link}">
                        ${firstNewsCur.title}
                    </a>
                </div>
            </div>
            <div class="first-top-news">
                <div class="company-name">${firstNewsNext.press}</div>
                <div class="detail"><a href="${firstNewsNext.link}">
                        ${firstNewsNext.title}
                    </a>
                </div>
            </div>
        </div>
        `
        const secondTopNewsTemplate = `
        <div class="top-news-display-board">
            <div class="second-top-news">
                <div class="company-name">${secondNewsCur.press}</div>
                <div class="detail"><a href="${secondNewsCur.link}">
                        ${secondNewsCur.title}
                    </a>
                </div>
            </div>
            <div class="second-top-news">
                <div class="company-name">${secondNewsNext.press}</div>
                <div class="detail"><a href="${secondNewsNext.link}">
                        ${secondNewsNext.title}
                    </a>
                </div>
            </div>
        </div>
        `
        return [firstTopNewsTemplate, secondTopNewsTemplate]
    }

};