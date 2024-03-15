function DateView() {
    const DAYS = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
    const date = new Date();

    const renderCurrentDate = () => {
        const curDate = getCurrentDate();
        const dateContainer = document.querySelector("header > .header__title-container__date");
        dateContainer.innerHTML = `
        ${curDate.curYear}. ${curDate.curMonth}. ${curDate.curDate}. ${curDate.curDay}
        `;
    };

    const getCurrentDate = () => {
        return {
            curYear: date.getFullYear(),
            curMonth: date.getMonth() + 1,
            curDate: date.getDate(),
            curDay: DAYS[date.getDay()],
        };
    };
    return { renderCurrentDate };
}

const dateView = new DateView()
export default dateView


