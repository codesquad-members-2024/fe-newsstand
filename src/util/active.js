
export const activate = (mode) => {
    const gridViewContainer = document.querySelector(".gird-mode-main-container")
    const listViewContainer = document.querySelector(".list-mode-main-container")
    const listModeContainer = document.querySelector(".sort-mode-container__show-list-mode")
    const gridModeContainer = document.querySelector(".sort-mode-container__show-grid-mode")

    if(mode === true){
        listModeContainer.setAttribute("src", "/static/ikon/list-view-on.png")
        gridModeContainer.setAttribute("src", "/static/ikon/grid-view-off.png")
        gridViewContainer.style.display = "none"
        listViewContainer.style.display = "flex"
    } else {
        listModeContainer.setAttribute("src", "/static/ikon/list-view-off.png")
        gridModeContainer.setAttribute("src", "/static/ikon/grid-view-on.png")
        gridViewContainer.style.display = "flex"
        listViewContainer.style.display = "none"
    }
}

export const reloadPage = () => location.reload();

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));