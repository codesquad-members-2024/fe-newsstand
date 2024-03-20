import jsonParse from "../../util/jsonParse.js";
import { TOP_NEWS_DELAY_TIME, LIGHT_ANIMATION_END_TIME } from "../../util/contants.js";
import { delay } from "../../util/contants.js";
function TopNewsForm() {
    const topNewsData = [
        { newsData: [], className: "first-top-news" },
        { newsData: [], className: "second-top-news" },
    ];

    const initData = async() => {
        const newsData = await jsonParse.parseJson("companiesNewsInfo");
        const processedNewsData = jsonParse.spliceCompanyString(newsData, 'press');
        topNewsData.forEach(cur => cur.newsData = processedNewsData.splice(0, 5));
    }

    const updateNewsData = () => {
        topNewsData.forEach(curNews => {
            const preNewsData = curNews.newsData.shift();
            curNews.newsData.push(preNewsData);    
        })
    }

    const renderTopNews = async() => {
        const topNewsTemplate = await getTopNewsTemplate()
        const topNewsContainer = [...document.querySelector(".top-news-container").children]
        topNewsContainer.forEach((node, idx) => {
            node.innerHTML = topNewsTemplate[idx]
        });
    }

    const addAnimationClass = () => {
        const topNewsAnimationContainer = document.querySelectorAll("#top-news-animation")
        topNewsAnimationContainer.forEach(curNewsContainer => curNewsContainer.classList.add("topNews-animation"))
    }

    const rollingNews = async () => {
        let test = setInterval(async () => {
            addAnimationClass();
            await delay(LIGHT_ANIMATION_END_TIME);
            renderTopNews();
        }, TOP_NEWS_DELAY_TIME);

        const topNewsAnimationContainer = document.querySelector(".top-news-container");
        topNewsAnimationContainer.addEventListener("mouseover", () => clearInterval(test))
        topNewsAnimationContainer.addEventListener("mouseleave", rollingNews)
    };



    const getTopNewsTemplate = async() => {
        updateNewsData();
        const [firstTopNewsTemplate, secondTopNewsTemplate] = topNewsData.map((curNews) => {
            const [newsCur, newsNext] = [curNews.newsData[0], curNews.newsData[1]];
            return `
            <div class="${curNews.className}" id ="top-news-animation">
                <div class="company-name">${newsCur.press}</div>
                <div class="detail"><a href="${newsCur.href}">
                        ${newsCur.title}
                    </a>
                </div>
            </div>
            <div class="${curNews.className}" id ="top-news-animation">
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

    rollingNews()
    return {initData, renderTopNews, rollingNews };
}

const topNewsForm = new TopNewsForm();
export default topNewsForm;
