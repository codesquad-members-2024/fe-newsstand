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
        selectCategory.classList.add("nav-animation");
        this.showTotalPageNum(escapedId)
    },
    updateCounter(curPageNum, totalPageNum) {
        const activeItem = document.querySelector(".item > .active")
        activeItem.innerText = `${curPageNum + 1}/${totalPageNum}`
    },

    isAnimationTimeOut() {}, 
    // setTimeout으로 20초를 센다. 20초 전에 이 함수가 실행되면(False를 반환한다) 애니메이션 재실행
    // 20초가 지나면 페이지를 넘긴다.(true 반환)

    resetAnimation() {}, 
    // isAnimationTimeOut boolean값으로 네비 애니메이션을 다시 실행할지 경정하는 함수.

    


};
