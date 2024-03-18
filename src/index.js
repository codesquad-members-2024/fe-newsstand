import dateView from "./Components/headerComponent/DateView.js";
import topNewsForm from "./Components/headerComponent/TopNewsForm.js";
import { GridViewForm } from "./Components/GridViewForm.js";
import { ListViewForm } from "./Components/ListViewForm.js";
import { activate, reloadPage } from "./util/active.js";
import { INITIAL_VIEW } from "./util/contants.js";
import { SubscriptionController } from "./SubscriptionController.js";

function NewsStand() {
    const status = {subscribeStatus: false, listMode: false}
    const subscriptionController = new SubscriptionController()
    const activateMode = (className) => {
        if(className === "sort-mode-container__show-list-mode"){
            status.listMode = true            
        } else {
            status.listMode = false
        }
        activate(status.listMode)
        isDisplayVisible()
    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const onSubscribeButtonClick = async(target) => {
        const subscribeModal = document.querySelector(".subscribe-modal")
        const isSubscribeText = target.innerText
        const targetPress = target.name
        if (isSubscribeText.includes("구독하기"))  {
            subscriptionController.subscribe(targetPress)
            subscribeModal.style.display = "flex"
            await delay(5000)
            subscribeModal.style.display = "none"
        }
        if (isSubscribeText.includes("해지하기")) return subscriptionController.unsubscribe(targetPress)
        
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const sortModeBtn = document.querySelector(".sort-mode-container")
        sortModeBtn.addEventListener("click", (e) => {
            activateMode(e.target.className)
        })

        const subscribeBtn = document.querySelectorAll("main");
        subscribeBtn.forEach(curContainer => curContainer.addEventListener("click", (e) => {
            if (e.target.id === "subscribe") return onSubscribeButtonClick(e.target);
            return;
        }))
    };

    const isDisplayVisible = () => {
        if(status.listMode === false) {
            const gridViewForm = new GridViewForm(subscriptionController)
            gridViewForm.main(status.subscribeStatus)
        }
        if(status.listMode === true) {
            const listViewForm = new ListViewForm(subscriptionController);
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
    return { main };
}

const newsStand = NewsStand();
newsStand.main();
