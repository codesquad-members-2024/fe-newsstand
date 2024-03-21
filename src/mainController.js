import newsStandStateManager from "./status.js"
import { GridViewForm } from "./Components/GridViewForm.js"
import { ListViewForm } from "./Components/ListViewForm.js"
import { setSubscribeEventHandler } from "./subscription/subscribeController.js";
import subscriptionModel from "./subscription/SubscriptionModel.js";

function MainController() {
    const gridViewForm = new GridViewForm()
    const listViewForm = new ListViewForm();
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

    const isSubscribed = () => {
        const subscribeList = subscriptionModel.getSubscripeList()
        if (subscribeList.length === 0) return false
        return true
    }
    
    const navigationMap = {
        SHOW_All_COMPANY(){
            const status = {isSubscribe: false, isListMode: false}
            const subscribeMode = ["bold", "normal"]
            const viewMode = ["/static/ikon/list-view-off.png", "/static/ikon/grid-view-on.png"]
            const mainContainerDisplay = ["flex", "none"]
            updateView(status, subscribeMode, viewMode, mainContainerDisplay)
        },
        SHOW_SUBSCRIBED_COMPANY(){
            if(!isSubscribed()) return alert("구독한 언론사가 없습니다.")
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
        if (navigationMap[navType]) {
            navigationMap[navType]();
        } else {
            return;
        }
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const mainNavigation = document.querySelector(".main-navigation")
        mainNavigation.addEventListener("click", executeNavigation)
    };

    const renderMainView = () => {
        const {subscribeStatus, listMode} = newsStandStateManager.getStatus()
        renderViewBasedOnMode(subscribeStatus,listMode)
    }

    const renderViewBasedOnMode = (subscribeStatus, listMode) => {
        if(listMode === false) gridViewForm.main(subscribeStatus)
        if(listMode === true) listViewForm.main(subscribeStatus)
    }

    setSubscribeEventHandler()
    setEventHandler();
    return { renderMainView, navigationMap };
}
const mainController = MainController();
export default mainController