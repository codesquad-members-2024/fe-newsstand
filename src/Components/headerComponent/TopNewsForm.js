import jsonParse from "../../util/jsonParse.js";
import { TOP_NEWS_DELAY_TIME } from "../../util/contants.js";
function TopNewsForm() {
    const topNewsData = [
        { newsData: [], className: "first-top-news" },
        { newsData: [], className: "second-top-news" },
    ];

    const initData = async() => {
        const newsData = await jsonParse.parseJson("companiesNewsInfo");
        const processedNewsData = spliceCompanyString(newsData);
        topNewsData.forEach(cur => cur.newsData = processedNewsData.splice(0, 5));
    }

    const spliceCompanyString = (newsData) => {
        return newsData.map((element) => {
            const pressName = element.press.split("언론사")[0].trim();
            element.press = pressName;
            return element;
        });
    }

    const updateNewsData = () => {
        topNewsData.forEach(curNews => {
            const preNewsData = curNews.newsData.shift();
            curNews.newsData.push(preNewsData);    
        })
    }

    const renderTopNews = async() => {
        const topNewsTemplate = await getTopNewsTemplate()
        const topNewsContainer = Array.from(document.querySelector(".top-news-container").children)
        topNewsContainer.forEach((node, idx) => {
            node.innerHTML = topNewsTemplate[idx]
        });
    }

    const rollingNews = () => {
        setInterval(() => {
            renderTopNews()
        }, TOP_NEWS_DELAY_TIME);
    }

    const getTopNewsTemplate = async() => {
        updateNewsData();
        const [firstTopNewsTemplate, secondTopNewsTemplate] = topNewsData.map((curNews) => {
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

    
    return {initData, renderTopNews, rollingNews };
}

const topNewsForm = new TopNewsForm();
export default topNewsForm;
