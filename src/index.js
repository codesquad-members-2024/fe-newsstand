import { GetRandomCompany } from "./companysDisplayForm.js";
import { DateCalculator } from "./DateCalculator.js";
function NewsStand() {
    const getRandomCompany = new GetRandomCompany();
    
    const renderCompanyLogo = () => {
        const logoTemplate = getRandomCompany.getLogoTemplat();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const renderCurrentDate = () => {
        const dateCalculator = new DateCalculator()
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
            case 0:
                leftBtnBox.style.display = "none";
                break;
            case 3:
                lightBtnBox.style.display = "none";
                break;
            default:
                leftBtnBox.style.display = "flex";
                lightBtnBox.style.display = "flex";
                break;
        }
    };

    const checkLocationType = (event) => {
        const curPageNum = getRandomCompany.updatePageNum(event.target.className);
        renderCompanyLogo();
        pageDisabled(curPageNum);
    };

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".news-stand-box");
        newStandMainLogo.addEventListener("click", () => location.reload());

        const updatePageBtn = document.querySelector(".company-list-box");
        updatePageBtn.addEventListener("click", checkLocationType);
    };

    const main = () => {
        const curPageNum = getRandomCompany.main();
        renderCompanyLogo();
        pageDisabled(curPageNum);
        renderCurrentDate();
        setEventHandler();
    };
    return { main };
}

const newsStand = NewsStand();
newsStand.main();
