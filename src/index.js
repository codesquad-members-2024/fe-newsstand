import { CompanysDisplayForm } from "./Components/CompanysDisplayForm.js";
import { DateCalculator } from "./Components/DateCalculator.js";
import { TopNewsForm } from "./Components/TopNewsForm.js";
import { GridModeForm } from "./Components/gridModeForm.js";
import { FIRST_PAGE_NUM, LAST_PAGE_NUM, TOP_NEWS_DELAY_TIME } from "./contants.js";

function NewsStand() {
    const status = {subscribeStatus: false, listMode: false}
    const companysDisplayForm = new CompanysDisplayForm();
    const topNewsForm = new TopNewsForm()
    const gridModeForm = GridModeForm()
    
    const gridModeContainer = document.querySelector(".company-list-container")
    const listModeContainer = document.querySelector(".list-mode-main-container")
    const renderCompanyLogo = () => {
        const logoTemplate = companysDisplayForm.getLogoTemplat();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const renderCurrentDate = () => {
        const dateCalculator = DateCalculator();
        const [year, month, date, day] = dateCalculator.getCurrentDate();
        const dateHtmlBox = document.querySelector(".header__title-container__date");
        dateHtmlBox.innerHTML = `
        ${year}. ${month}. ${date}. ${day}
        `;
    };

    const pageDisabled = (curPageNum) => {
        const leftBtnBox = document.querySelector(".left-btn");
        const lightBtnBox = document.querySelector(".light-btn");
        switch (curPageNum) {
            case FIRST_PAGE_NUM:
                leftBtnBox.style.display = "none";
                break;
            case LAST_PAGE_NUM:
                lightBtnBox.style.display = "none";
                break;
            default:
                leftBtnBox.style.display = "flex";
                lightBtnBox.style.display = "flex";
                break;
        }
    };

    const checkLocationType = (event) => {
        const curPageNum = companysDisplayForm.updatePageNum(event.target.className);
        renderCompanyLogo();
        pageDisabled(curPageNum);
    };

    const reloadPage = () => location.reload();

    const activateMode = (className) => {
        const listModeContainer = document.querySelector(".sort-mode-container__show-list-mode")
        const gridModeContainer = document.querySelector(".sort-mode-container__show-grid-mode")
        if(className === "sort-mode-container__show-list-mode"){
            status.listMode = true
            listModeContainer.setAttribute("src", "/static/ikon/list-view-on.png")
            gridModeContainer.setAttribute("src", "/static/ikon/list-view-off.png")
        } else {
            status.listMode = false
            listModeContainer.setAttribute("src", "/static/ikon/list-view-off.png")
            gridModeContainer.setAttribute("src", "/static/ikon/list-view-on.png") 
        }
        isDisplayVisible()
    }

    const sortDisplay = (event) => {
        activateMode(event.target.className)
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const updatePageBtn = document.querySelector(".company-list-container");
        updatePageBtn.addEventListener("click", checkLocationType);

        const sortModeBtn = document.querySelector(".sort-mode-container")
        sortModeBtn.addEventListener("click", sortDisplay)
    };

    const renderTopNews = (topNewsTemplate) => {
        const topNewsContainer = Array.from(document.querySelector(".top-news-container").children)
        topNewsContainer.forEach((node, idx) => {
            node.innerHTML = topNewsTemplate[idx]
        });
    }

    const showCompanyListComponent = async() => {
        gridModeContainer.style.display = "flex"
        listModeContainer.style.display = "none"
        const curPageNum = await companysDisplayForm.main();
        pageDisabled(curPageNum);
        renderCompanyLogo();
    }

    const showListModeComponent = () => {
        gridModeContainer.style.display = "none"
        listModeContainer.style.display = "flex"
        gridModeForm.getListModeTemplate()

    }

    const isDisplayVisible = () => {
        if(status.subscribeStatus === false && status.listMode === false) showCompanyListComponent()
        if(status.subscribeStatus === false && status.listMode === true) showListModeComponent()
    }

    const main = async() => {
        renderCurrentDate();
        await topNewsForm.initData()
        await gridModeForm.initData()
        activateMode("sort-mode-container__show-grid-mode")
        isDisplayVisible()
        renderTopNews(topNewsForm.getTopNewsTemplate())
        setInterval(() => {
            renderTopNews(topNewsForm.getTopNewsTemplate())
        }, TOP_NEWS_DELAY_TIME);
    };
    
    setEventHandler();
    return { main };
}

const newsStand = NewsStand();
newsStand.main();
