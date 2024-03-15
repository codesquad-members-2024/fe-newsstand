import dateView from "./Components/headerComponent/DateView.js";
import topNewsForm from "./Components/headerComponent/TopNewsForm.js";
import { GridViewForm } from "./Components/GridViewForm.js";
import { ListViewForm } from "./Components/ListViewForm.js";
import { activate, reloadPage } from "./util/active.js";
import { INITIAL_VIEW } from "./util/contants.js";

function NewsStand() {
    const status = {subscribeStatus: false, listMode: false}

    const activateMode = (className) => {
        if(className === "sort-mode-container__show-list-mode"){
            status.listMode = true            
        } else {
            status.listMode = false
        }
        activate(status.listMode)
        isDisplayVisible()
    }

    const setEventHandler = () => {
        const newStandMainLogo = document.querySelector(".header__title-container");
        newStandMainLogo.addEventListener("click", reloadPage);

        const sortModeBtn = document.querySelector(".sort-mode-container")
        sortModeBtn.addEventListener("click", (e) => {
            activateMode(e.target.className)
        })
    };

    const isDisplayVisible = () => {
        if(status.listMode === false) {
            const gridViewForm = new GridViewForm()
            gridViewForm.main(status.subscribeStatus)
        }
        if(status.listMode === true) {
            const listViewForm = new ListViewForm();
            listViewForm.main(status.subscribeStatus)
        }
    }

    const main = async() => {
        dateView.renderCurrentDate()
        await topNewsForm.initData()
        topNewsForm.renderTopNews()
        topNewsForm.rollingNews()
        activateMode(INITIAL_VIEW)
    };
    
    setEventHandler();
    return { main };
}

const newsStand = NewsStand();
newsStand.main();
