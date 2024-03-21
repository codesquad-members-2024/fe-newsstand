import jsonParse from "../util/jsonParse.js";
import { FIRST_PAGE_NUM, LAST_PAGE_NUM } from "../util/contants.js";
import { GRID_VIEW_BATCHSIZE } from "../util/contants.js";
import subscriptionModel from "../subscription/SubscriptionModel.js";
export function GridViewForm () {
    let currenPageNum = 0;
    let firstPageNum = 0;
    let lastPageNum = 0;
    const companyData = [];

    const main = async (subscribeStatus) => {
        const newsData = await initData(subscribeStatus)
        splitIntoChunks(newsData);
        renderGridView()
        pageDisabled(currenPageNum)
    }

    const setEventHandler = () => {
        const updatePageBtn = document.querySelector(".gird-mode-main-container");
        updatePageBtn.addEventListener("click", checkLocationType);
    }

    const checkLocationType = (event) => {
        const curPageNum = updatePageNum(event.target.className);
        renderGridView();
        pageDisabled(curPageNum);
    };

    const pageDisabled = (curPageNum) => {
        const leftBtnBox = document.querySelector(".left-btn");
        const lightBtnBox = document.querySelector(".light-btn");
    
        if (curPageNum === firstPageNum) leftBtnBox.style.display = "none";
        if (curPageNum === lastPageNum) lightBtnBox.style.display = "none";
        if (curPageNum === firstPageNum && curPageNum === lastPageNum) {
            leftBtnBox.style.display = "none";
            lightBtnBox.style.display = "none";
        } 
        if (curPageNum !== firstPageNum && curPageNum !== lastPageNum) {
            leftBtnBox.style.display = "flex";
            lightBtnBox.style.display = "flex";
        }
    };

    const renderGridView = () => {
        const logoTemplate = getGridTemplate();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const fillNewsData = (subscribePressInfo) => {
        const filledData = [...subscribePressInfo];
        while (filledData.length % 24 !== 0) {
            filledData.push({ img: "", companyName: "" });
        }
        return filledData;
    };
    
    const initData = async(subscribeStatus) => {
        companyData.splice(0);
        const newsData = await jsonParse.parseJson("companiesInfo")
        if (subscribeStatus) {
            const subscribeList = subscriptionModel.getSubscripeList()
            const subscribePressInfo = subscribeList.map(curPress => {
                return newsData.find(curNewsInfo => curPress === curNewsInfo.companyName)
            })
            return fillNewsData(subscribePressInfo)
        } else {
            newsData.sort(() => Math.random() - 0.5)
            return newsData    
        }
    }

    const splitIntoChunks = (newsData) => {
        while (newsData.length !== 0) {
            companyData.push(newsData.splice(0, GRID_VIEW_BATCHSIZE));
        }
        lastPageNum = companyData.length - 1
    }

    const updatePageNum = (targetName) => {
        switch (targetName) {
            case "left-btn":
                currenPageNum--;
                break;
            case "light-btn":
                currenPageNum++;
                break;
            default:
                break;
        }
        return currenPageNum
    }

    const getGridTemplate = () => {
        const logoTemplate = companyData[currenPageNum].reduce((acc, cur, idx) => {
            if (cur.img === "" ||  cur.companyName === "") {
                return acc + `
                <li class="list-${idx}">
                </li>
                `;
            } else {
                return acc + `
                <li class="list-${idx}">
                <img class = "logo-img" src = "${cur.img}" alt = ${cur.companyName}>
                ${subscriptionModel.isSubscribe(cur.companyName) ? 
                    `<button class = "subscribe" id = "unsubscribe" name = "${cur.companyName}"> + 해지하기</button>`
                    : `<button class = "subscribe" id = "subscribe" name = "${cur.companyName}"> + 구독하기</button>`}
                </li>
                `;
            }
        }, "");
        return logoTemplate;
    };

    setEventHandler()
    return {main}
}

