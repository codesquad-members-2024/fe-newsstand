import listViewForm from "./ListViewForm.js";
export const navAnimation = {
    showTotalPageNum(id) {
        const totalPageContainer = document.querySelector(`#${id} > .item__totalPage`)
        const allTotalPageContainer = document.querySelectorAll(".item__totalPage")
        allTotalPageContainer.forEach(curContainer => curContainer.classList.remove("active"))
        totalPageContainer.classList.add("active")
    },

    swicthNavAnimation(id) {
        const escapedId = id.replace("/", "\\/");
        const allNav = document.querySelectorAll(".item");
        const selectCategory = document.querySelector(`#${escapedId}`);
        allNav.forEach((curCategory) => curCategory.classList.remove("nav-animation"));
        void selectCategory.offsetWidth;
        selectCategory.classList.add("nav-animation");
        this.showTotalPageNum(escapedId)
        return selectCategory
    },

    updateCounter(curPageNum, totalPageNum) {
        const activeItem = document.querySelector(".item > .active")
        activeItem.innerText = `${curPageNum + 1}/${totalPageNum}`
    },
};
