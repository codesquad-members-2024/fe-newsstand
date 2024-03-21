import jsonParse from "../util/jsonParse.js";
import { navAnimation } from "./navAnimation.js";
import subscriptionModel from "../subscription/SubscriptionModel.js";
export function ListViewForm() {
    let curCategoryIdx = 0
    let curCategoryDataIdx = 0
    let curCategoryTotalNum = 0
    const categoryList = [];

    const main = async (subscribeStatus) => {
        await initData(subscribeStatus);
        renderNav(subscribeStatus);
        renderNews();
        switchCategory(categoryList[0].category)
    };

    const renderNav = (subscribeStatus) => {
        const navTemplate = getNavTemplate(subscribeStatus);
        const navContainer = document.querySelector(".list");
        navContainer.innerHTML = navTemplate;
    };

    const getNavTemplate = (subscribeStatus) => {
        const navTemplate = categoryList.reduce((acc, cur) => {
            return (acc + `
            <div class="item" id = "${cur.category}">
            <span>${cur.category}</span>
            <div class = "item__totalPage">${subscribeStatus ? `>` : `1/${cur.data.length}`}</div>
            <div class = "item__after"></div>
            </div>
            `);
        }, "");
        return navTemplate;
    };

    const renderNews = () => {
        const mainNewsContainer = document.querySelector(".main-news-container");
        const subNewsContainer = document.querySelector(".sub-news-container");
        const mainNewsTemplate = getMainNewsTemplate();
        const subNewsTemplate = getSubNewsTemplate();
        mainNewsContainer.innerHTML = mainNewsTemplate;
        subNewsContainer.innerHTML = subNewsTemplate;
    };

    const getMainNewsTemplate = () => {
        const curNewsData = categoryList[curCategoryIdx].data[curCategoryDataIdx];
        return `
        <div class="main-news-header">
            <a href = "${curNewsData.companyHref}" ><img src = "${curNewsData.companyImg}" id="list-view__company-logo"></img></a>
            <div class="edit-date">${curNewsData.editDate}</div>
            ${subscriptionModel.isSubscribe(curNewsData.companyName) ? 
                `<button class="subscribe-btn subscribe" id = "unsubscribe" name = "${curNewsData.companyName}">x</button>`
                : `<button class="subscribe-btn subscribe" id = "subscribe" name = "${curNewsData.companyName}">+ 구독하기</button>`}
        </div>
        <a href = "${curNewsData.mainNewsSrc}" class="main-news-img"><img src="${curNewsData.mainNewsImg}" class="main-news-src"></img></a>
        <div class="main-news-title">${curNewsData.mainNewsTitle}</div>
        `;
    };

    const getSubNewsTemplate = () => {
        const curNewsData = categoryList[curCategoryIdx].data[curCategoryDataIdx].subNewsInfo;
        const subNewsTemplateTe = curNewsData.reduce((acc, cur) => {
            return (acc + `
            <a href = "${cur.href}"><div class="sub-news">${cur.text}</div></a>
            `);
        }, "");
        return (subNewsTemplateTe +
            `<div class="edit-company-name">${
                categoryList[curCategoryIdx].data[curCategoryDataIdx].companyName
            } 언론사에서 직접 편집한 뉴스입니다.</div>`
        );
    };

    const initData = async (subscribeStatus) => {
        categoryList.splice(0);
        const newsData = await jsonParse.parseJson("category");
        const modifyData = jsonParse.spliceCompanyString(newsData, 'category');
        spliteData(modifyData, subscribeStatus);
        curCategoryTotalNum = categoryList[curCategoryIdx].data.length
    };

    const spliteData = (allNewsInfo, subscribeStatus) => {
        if(subscribeStatus === false) return categoryDataSplite(allNewsInfo)
        return subscribeDataSplite(allNewsInfo)
    };

    const subscribeDataSplite = (allNewsInfo) => {
        const curSubscribeList = subscriptionModel.getSubscripeList()
        curSubscribeList.forEach(curSubscribePress => {
            const pressNewsData = allNewsInfo.find(curNews => curNews.companyName === curSubscribePress)
            categoryList.push({ category: curSubscribePress, data: [pressNewsData] })
        })
    }
    
    const categoryDataSplite = (allNewsInfo) => {
        const category = ["종합/경제", "방송/통신", "IT", "영자지", "스포츠/연예", "매거진/전문지", "지역"];
        category.forEach((curCategory) => {
            const newsData = []
            allNewsInfo.forEach((curNewsData) => {
                if (curNewsData.category.includes(curCategory)) {
                    newsData.push(curNewsData);
                }
            });
            categoryList.push({ category: curCategory, data: [...newsData] })
        });
    }

    const isEndOfPage = () => {
        if(curCategoryTotalNum === curCategoryDataIdx) {
            sortCategoryList(categoryList[curCategoryIdx + 1]?.category)
        } else if (curCategoryDataIdx < 0) { 
            sortCategoryList(categoryList[categoryList.length - 1].category)
        }
        navAnimation.swicthNavAnimation(categoryList[curCategoryIdx].category)
    }

    const sortCategoryList = (id) => {
        if (id === undefined) {
            curCategoryDataIdx = 0
            curCategoryTotalNum = categoryList[curCategoryIdx].data.length
            return;
        }
        while(categoryList[0].category !== id) {
            const prevCategoryData = categoryList.shift()
            categoryList.push(prevCategoryData)
        }
        curCategoryDataIdx = 0
        curCategoryTotalNum = categoryList[curCategoryIdx].data.length
    }

    const switchCategory = (id) => {
        const curAnimationNav = navAnimation.swicthNavAnimation(id)
        sortCategoryList(id)
        renderNews()
        navAnimation.updateCounter(curCategoryDataIdx, curCategoryTotalNum, )
        curAnimationNav.addEventListener("animationend", () => {
            updatePageNum("list-view-light-btn");
            renderNews()
        });
    }

    const updatePageNum = (targetName) => {
        switch (targetName) {
            case "list-view-left-btn":
                curCategoryDataIdx--
                break;
            case "list-view-light-btn":
                curCategoryDataIdx++
                break;
            default:
                break;
        }
        isEndOfPage()
        navAnimation.updateCounter(curCategoryDataIdx, curCategoryTotalNum)
    }

    const checkLocationType = (event) => {
        const className = event.target.className
        updatePageNum(className);
        renderNews()
    };
    
    const setEventHandler = () => {
        const lightBtn = document.querySelector(".list-view-light-btn");
        lightBtn.addEventListener("click", checkLocationType);  

        const leftBtn = document.querySelector(".list-view-left-btn");
        leftBtn.addEventListener("click", checkLocationType);  

        const categoryContainer = document.querySelector(".list");
        categoryContainer.addEventListener("click", (e) => {
            if (e.target.className === "list") return;
            if (e.target.tagName === "SPAN") return switchCategory(e.target.closest(".item").id)
            return switchCategory(e.target.id)
        });
    }
    setEventHandler()
    return { main };
}
