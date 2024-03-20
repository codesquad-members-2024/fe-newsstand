import dateView from "./Components/headerComponent/DateView.js";
import topNewsForm from "./Components/headerComponent/TopNewsForm.js";
import mainController from "./mainController.js";

const main = async() => {
    dateView.renderCurrentDate()
    await topNewsForm.initData()
    topNewsForm.renderTopNews()
    mainController.renderMainView()
};

main();