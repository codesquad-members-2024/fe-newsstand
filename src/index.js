import { GetRandomCompany } from "./companysDisplayForm.js";
function NewsStand() {
    const getRandomCompany = new GetRandomCompany()
    // 다음페이지를 누르면 24씩++ 해 보여주려는 변수
    const DAY = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const getLogoTemplat = (curPage) => {
        const logoTemplate = curPage.map((cur, idx) => {
            return `
            <li class="list-${idx}">
            <img src = "static/company-logo/grid-${cur}.png">
            </li>
            `
        })
        return logoTemplate.join("");
    };
    const renderCompanyLogo = (pageData) => {
        const logoTemplate = getLogoTemplat(pageData);
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate;
    };

    const getCurrentDate = () => {
        const date = new Date();
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            DAY[date.getDay()],
        ];
    };

    const renderCurrentDate = () => {
        const dateHtmlBox = document.querySelector(".date")
        const [year, month, date, DAY] = getCurrentDate();
        dateHtmlBox.innerHTML = `
        ${year}. ${month}. ${date}. ${DAY}
        `
    };

    const typeCheckLocation = (event) => {
        const updatePageData = getRandomCompany.updatePageNum(event.target.className)
        renderCompanyLogo(updatePageData)
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".news-stand-box");
        newStandMainLogo.addEventListener("click", () => location.reload())

        const updatePageBtn = document.querySelector(".company-list-box");
        updatePageBtn.addEventListener("click", typeCheckLocation)
    }

    const main = () => {
        const initPageNum = getRandomCompany.main()
        renderCompanyLogo(initPageNum);
        renderCurrentDate();
        setEventHandler()
    };
    return { main, renderCurrentDate };
}

const newsStand = NewsStand();
newsStand.main();