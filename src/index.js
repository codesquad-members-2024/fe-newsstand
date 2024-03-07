import { CompanysDisplayForm } from "./Components/CompanysDisplayForm.js";
import { DateCalculator } from "./Components/DateCalculator.js";
import { TopNewsForm } from "./Components/TopNewsForm.js";
import { FIRST_PAGE_NUM, LAST_PAGE_NUM, TOP_NEWS_DELAY_TIME } from "./contants.js";

function NewsStand() {
    const companysDisplayForm = new CompanysDisplayForm();
    const topNewsForm = new TopNewsForm()
    const renderCompanyLogo = () => {
        const logoTemplate = companysDisplayForm.getLogoTemplat();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const renderCurrentDate = () => {
        const dateCalculator = new DateCalculator();
        const [year, month, date, day] = dateCalculator.getCurrentDate();
        const dateHtmlBox = document.querySelector(".date");
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
        const curPageNum = companysDisplayForm.updatePageNum(
            event.target.className
        );
        renderCompanyLogo();
        pageDisabled(curPageNum);
    };

    const reloadPage = () => location.reload();

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".news-stand-box");
        newStandMainLogo.addEventListener("click", reloadPage);

        const updatePageBtn = document.querySelector(".company-list-box");
        updatePageBtn.addEventListener("click", checkLocationType);
    };


    const renderTopNews = (topNewsTemplate) => {
        const topNewsContainer = Array.from(document.querySelector(".top-news-box").children)
        topNewsContainer.forEach((node, idx) => {
            node.innerHTML = topNewsTemplate[idx]
        });
    }

    const renderComponent = () => {
        renderCurrentDate();
        renderCompanyLogo();
        setInterval(() => {
            renderTopNews(topNewsForm.getTopNewsTemplate())
        }, TOP_NEWS_DELAY_TIME);
    }

    const main = async() => {
        const curPageNum = companysDisplayForm.main();
        await topNewsForm.initData()
        pageDisabled(curPageNum);
        renderTopNews(topNewsForm.getTopNewsTemplate())
        renderComponent()
        setEventHandler();
    };

    return { main };
}

const newsStand = NewsStand();
newsStand.main();
