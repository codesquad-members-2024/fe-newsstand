function NewsStand() {
    // 다음페이지를 누르면 24씩++ 해 보여주려는 변수
    let newsListCount = 0
    const getLogoTemplat = () => {
        const logoTemplate = []
        for (let i = newsListCount; i < newsListCount + 24; i++) {
            logoTemplate.push(`
            <li class="list-${i}">
            <img src = "static/company-logo/grid-${i}.png">
            </li>
            `);
        }
        return logoTemplate.join("")
    };
    const renderCompanyLogo = () => {
        const logoTemplate = getLogoTemplat();
        const companyDisplayBox = document.querySelector(".company-display");
        companyDisplayBox.innerHTML = logoTemplate
    };
    return { renderCompanyLogo };
}

const newsStand = NewsStand();
newsStand.renderCompanyLogo();
