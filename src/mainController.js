import newsStandStateManager from "./status.js"
import { GridViewForm } from "./Components/GridViewForm.js"
import { ListViewForm } from "./Components/ListViewForm.js"
import { SubscriptionModel } from "./subscribeMVC/SubscriptionModel.js"

function MainController() {
    const subscriptionModel = new SubscriptionModel()

    const reloadPage = () => location.reload();

    const updateActive = (subscribeMode, viewMode, mainContainerDisplay) => {
        const subscribeModeContainer = [...document.querySelectorAll(".subscribe-mode-container > button")]
        const viewModeContainer = [...document.querySelectorAll(".sort-mode-container > img")]
        const mainContainer = [...document.querySelectorAll("main")]
        subscribeModeContainer.forEach((curContainer,idx) => curContainer.style.fontWeight = `${subscribeMode[idx]}`)
        viewModeContainer.forEach((curContainer,idx) => curContainer.setAttribute("src", `${viewMode[idx]}`))
        mainContainer.forEach((curContainer,idx) => curContainer.style.display = `${mainContainerDisplay[idx]}`)
    }

    const updateView = (status, subscribeMode, viewMode, mainContainerDisplay) => {
        newsStandStateManager.setStatus(status.isSubscribe, status.isListMode)
        updateActive(subscribeMode, viewMode, mainContainerDisplay)
        renderMainView()
    }

    const navAnimationMap = {
        SHOW_All_COMPANY(){
            const status = {isSubscribe: false, isListMode: false}
            const subscribeMode = ["bold", "normal"]
            const viewMode = ["/static/ikon/list-view-off.png", "/static/ikon/grid-view-on.png"]
            const mainContainerDisplay = ["flex", "none"]
            updateView(status, subscribeMode, viewMode, mainContainerDisplay)
        },
        SHOW_SUBSCRIBED_COMPANY(){
            const status = {isSubscribe: true, isListMode: true}
            const subscribeMode = ["normal", "bold"]
            const viewMode = ["/static/ikon/list-view-on.png", "/static/ikon/grid-view-off.png"]
            const mainContainerDisplay = ["none", "flex"]
            updateView(status, subscribeMode, viewMode, mainContainerDisplay)
        },
        SHOW_LIST_MODE(){
            const newsStandStatus = newsStandStateManager.getStatus();
            const status = {isSubscribe: newsStandStatus.subscribeStatus, isListMode: true}
            const subscribeMode = {}
            const viewMode = ["/static/ikon/list-view-on.png", "/static/ikon/grid-view-off.png"]
            const mainContainerDisplay = ["none", "flex"]
            updateView(status, subscribeMode, viewMode, mainContainerDisplay)
        },
        SHOW_GRID_MODE(){
            const newsStandStatus = newsStandStateManager.getStatus();
            const status = {isSubscribe: newsStandStatus.subscribeStatus, isListMode: false}
            const subscribeMode = {}
            const viewMode = ["/static/ikon/list-view-off.png", "/static/ikon/grid-view-on.png"]
            const mainContainerDisplay = ["flex", "none"]
            updateView(status, subscribeMode, viewMode, mainContainerDisplay)
        }
    }

    const executeNavigation = (event) => {
        const navType = event.target.dataset.navType;
        navAnimationMap[navType]();
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const mainNavigation = document.querySelector(".main-navigation")
        mainNavigation.addEventListener("click", executeNavigation)

        // const subscribeBtn = document.querySelectorAll("main");
        // subscribeBtn.forEach(curContainer => curContainer.addEventListener("click", (e) => {
        //     if (e.target.id === "subscribe" || e.target.id === "unsubscribe") return goToListView(e.target);
        //     return;
        // }))
    };

    const renderMainView = () => {
        const {subscribeStatus, listMode} = newsStandStateManager.getStatus()
        renderViewBasedOnMode(subscribeStatus,listMode)
    }

    const renderViewBasedOnMode = (subscribeStatus, listMode) => {
        if(listMode === false) {
            const gridViewForm = new GridViewForm(subscriptionModel)
            gridViewForm.main(subscribeStatus)
        }
        if(listMode === true) {
            const listViewForm = new ListViewForm(subscriptionModel);
            listViewForm.main(subscribeStatus)
        }
    }

    setEventHandler();
    return { renderMainView };
}
const mainController = MainController();
export default mainController