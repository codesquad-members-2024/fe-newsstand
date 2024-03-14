import jsonParse from "../util/jsonParse.js";
function ListViewForm() {
    const curPageIdxInfo = {
        curCategoryIdx: 0,
        curCategoryDataIdx: 0,
        curCategoryTotalNum: 0,
    };
    const categoryList = [
        { category: "종합/경제", data: [] },
        { category: "방송/통신", data: [] },
        { category: "IT", data: [] },
        { category: "영자지", data: [] },
        { category: "스포츠/연예", data: [] },
        { category: "매거진/전문지", data: [] },
        { category: "지역", data: [] },
    ];

    const main = async () => {
        await initData();
        renderNav();
        renderNews();
        switchCategory(categoryList[0].category)
    };

    const renderNews = () => {
        const mainNewsContainer = document.querySelector(".main-news-container");
        const subNewsContainer = document.querySelector(".sub-news-container");
        const mainNewsTemplate = getMainNewsTemplate();
        const subNewsTemplate = getSubNewsTemplate();
        mainNewsContainer.innerHTML = mainNewsTemplate;
        subNewsContainer.innerHTML = subNewsTemplate;
    };

    const getSubNewsTemplate = () => {
        const curNewsData = categoryList[curPageIdxInfo.curCategoryIdx]
                            .data[curPageIdxInfo.curCategoryDataIdx].subNewsInfo;
        const subNewsTemplateTe = curNewsData.reduce((acc, cur) => {
            return (acc + `
            <a href = "${cur.href}"><div class="sub-news">${cur.text}</div></a>
            `);
        }, "");
        return (subNewsTemplateTe +
            `<div class="edit-company-name">${
                categoryList[curPageIdxInfo.curCategoryIdx].data[curPageIdxInfo.curCategoryDataIdx].companyName
            } 언론사에서 직접 편집한 뉴스입니다.</div>`
        );
    };

    const getMainNewsTemplate = () => {
        const curNewsData =
            categoryList[curPageIdxInfo.curCategoryIdx].data[
                curPageIdxInfo.curCategoryDataIdx
            ];
        return `
        <div class="main-news-header">
            <a href = "${curNewsData.companyHref}" ><img  src = "${curNewsData.companyImg}" id="list-view__company-logo"></img></a>
            <div class="edit-date">${curNewsData.editDate}</div>
            <button class="subscribe-btn" name = "${curNewsData.companyName}">+ 구독하기</button>
        </div>
        <a href = "${curNewsData.mainNewsSrc}" class="main-news-img"><img src="${curNewsData.mainNewsImg}" class="main-news-src"></img></a>
        <div class="main-news-title">${curNewsData.mainNewsTitle}</div>
        `;
    };

    const renderNav = () => {
        const navTemplate = getNavTemplate();
        const navContainer = document.querySelector(".list");
        navContainer.innerHTML = navTemplate;
    };

    const initData = async () => {
        const newsData = await jsonParse.parseJson("category");
        const modifyData = spliceCompanyString(newsData);
        spliteData(modifyData);
        curPageIdxInfo.curCategoryTotalNum = categoryList[curPageIdxInfo.curCategoryIdx].data.length
    };

    const spliteData = (data) => {
        categoryList.forEach((curCategory) => {
            data.forEach((curNewsData) => {
                if (curNewsData.category.includes(curCategory.category)) {
                    curCategory.data.push(curNewsData);
                }
            });
        });
    };

    const spliceCompanyString = (newsData) => {
        return newsData.map((curNewsData) => {
            const spliceName = curNewsData.category.split("언론사")[0];
            curNewsData.category = spliceName;
            return curNewsData;
        });
    };

    const getNavTemplate = () => {
        const navTemplate = categoryList.reduce((acc, cur, idx) => {
            return (acc + `
            <div class="item" id = "${cur.category}">
            <span>${cur.category}</span><div class = "totalPage">1/82</div>
            </div>
            `);
        }, "");
        return navTemplate;
    };

    const isEndOfPage = () => {
        if(curPageIdxInfo.curCategoryTotalNum === curPageIdxInfo.curCategoryDataIdx) {
            sortCategoryList(categoryList[curPageIdxInfo.curCategoryIdx + 1].category)
        } else if (curPageIdxInfo.curCategoryDataIdx < 0) { 
            sortCategoryList(categoryList[categoryList.length - 1].category)
        }
        swicthNavAnimation(categoryList[curPageIdxInfo.curCategoryIdx].category)
    }

    const swicthNavAnimation = (id) => {
        const escapedId = id.replace('/', '\\/');
        const allNav = document.querySelectorAll(".item")
        const selectCategory = document.querySelector(`#${escapedId}`);
        allNav.forEach(curCategory => curCategory.classList.remove("nav-animation"))
        selectCategory.classList.add('nav-animation');
    }

    const sortCategoryList = (id) => {
        while(categoryList[0].category !== id) {
            const prevCategoryData = categoryList.shift()
            categoryList.push(prevCategoryData)
        }
        curPageIdxInfo.curCategoryDataIdx = 0
        curPageIdxInfo.curCategoryTotalNum = categoryList[curPageIdxInfo.curCategoryIdx].data.length
    }

    const switchCategory = (id) => {
        swicthNavAnimation(id)
        sortCategoryList(id)
        renderNews()
    }
    const updatePageNum = (targetName) => {
        switch (targetName) {
            case "list-view-left-btn":
                curPageIdxInfo.curCategoryDataIdx--
                break;
            case "list-view-light-btn":
                curPageIdxInfo.curCategoryDataIdx++
                break;
            default:
                break;
        }
        isEndOfPage()
    }

    const checkLocationType = (event) => {
        updatePageNum(event.target.className);
        renderNews()
    };
    
    const setEventHandler = () => {
        const updatePageBtn = document.querySelector(".list-mode-main-container");
        updatePageBtn.addEventListener("click", checkLocationType);  

        const categoryContainer = document.querySelector(".list");
        categoryContainer.addEventListener("click", (e) => {
            if (e.target.tagName === "SPAN") return switchCategory(e.target.closest(".item").id)
            return switchCategory(e.target.id)
        });  
    }
    setEventHandler()
    return { main };
}

const listViewForm = new ListViewForm();
export default listViewForm;
