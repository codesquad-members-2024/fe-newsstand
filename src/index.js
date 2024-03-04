function NewsStand() {
    // 다음페이지를 누르면 24씩++ 해 보여주려는 변수
    let newsListCount = 0;
    const DAY = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const getLogoTemplat = () => {
        const logoTemplate = [];
        for (let i = newsListCount; i < newsListCount + 24; i++) {
            logoTemplate.push(`
            <li class="list-${i}">
            <img src = "static/company-logo/grid-${i}.png">
            </li>
            `);
        }
        return logoTemplate.join("");
    };
    const renderCompanyLogo = () => {
        const logoTemplate = getLogoTemplat();
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

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".news-stand-box");
        newStandMainLogo.addEventListener("click", () => location.reload())
    }

    const main = () => {
        renderCompanyLogo();
        renderCurrentDate();
        setEventHandler()
    };
    return { main, renderCurrentDate };
}

const newsStand = NewsStand();
newsStand.main();