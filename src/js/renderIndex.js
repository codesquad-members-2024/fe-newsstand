import renderCurrentDate from "./renderCurrentDate.js";
import renderNewsTitles from "./renderNewsTitles.js";
import renderPressTable from "./renderPressTable.js";

const ROLLING_DELAY = 5000;

const pageReload = () => { location.reload() }

const renderIndex = () => {
  const pageLogoIcon = document.querySelector(".top-container__icon");

  renderCurrentDate();
  renderNewsTitles();
  renderPressTable();
  pageLogoIcon.addEventListener("click", pageReload);
  setInterval(renderNewsTitles, ROLLING_DELAY);
}

renderIndex();