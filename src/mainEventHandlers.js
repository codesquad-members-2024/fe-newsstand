import newsStandStateManager from "./status.js"

function NewsStand() {
    const status = {subscribeStatus: false, listMode: false}
    const subscriptionModel = new SubscriptionModel()
    const activateMode = (className) => {
        if(className === "sort-mode-container__show-list-mode"){
            status.listMode = true            
        } else {
            status.listMode = false
        }
        activate(status.listMode)
        isDisplayVisible()
    }

    const initSubscribeButtonClick = (className) => {
        if(className === "subscribe-mode-container__show-subscribed-company"){
            status.subscribeStatus = true
            status.listMode = true            
        } else {
            status.subscribeStatus = false
            status.listMode = false
        }
        activate(status.listMode)
        subscribeButtonActivate(status.subscribeStatus)
        isDisplayVisible()
    }

    const goToListView = async(target) => {
        await onSubscribeButtonClick(target, subscriptionModel)
        status.listMode = true
        status.subscribeStatus = true
        activateMode("sort-mode-container__show-list-mode")
        subscribeButtonActivate(status.subscribeStatus)
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const sortModeBtn = document.querySelector(".sort-mode-container")
        sortModeBtn.addEventListener("click", (e) => {
            activateMode(e.target.className)
        })

        const subscribeMode = document.querySelector(".subscribe-mode-container")
        subscribeMode.addEventListener("click", (e) => {
            initSubscribeButtonClick(e.target.className)
        })

        const subscribeBtn = document.querySelectorAll("main");
        subscribeBtn.forEach(curContainer => curContainer.addEventListener("click", (e) => {
            if (e.target.id === "subscribe" || e.target.id === "unsubscribe") return goToListView(e.target);
            return;
        }))
    };

    const isDisplayVisible = () => {
        if(status.listMode === false) {
            const gridViewForm = new GridViewForm(subscriptionModel)
            gridViewForm.main(status.subscribeStatus)
        }
        if(status.listMode === true) {
            const listViewForm = new ListViewForm(subscriptionModel);
            listViewForm.main(status.subscribeStatus)
        }
    }

    const main = async() => {
        dateView.renderCurrentDate()
        await topNewsForm.initData()
        topNewsForm.renderTopNews()
        activateMode(INITIAL_VIEW)
    };
    
    setEventHandler();
    return { main};
}
const newsStand = NewsStand();
newsStand.main();