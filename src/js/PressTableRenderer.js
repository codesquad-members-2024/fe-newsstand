const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;
const INITIAL_GRID_VIEW_INDEX = 0;
const RANDOM_SECTOR = 0.5;
const LOGO_IMAGE_PATH = "src/img/PressLogo.png";
const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";

const pressTable = document.querySelector(".press-container__view");
const leftArrowButton = document.querySelector(".press-container__left-arrow");
const rightArrowButton = document.querySelector(".press-container__right-arrow");
const viewIcons = Array.from(document.querySelectorAll(".press-container__view-icon"));
const gridViewIcon = viewIcons.find((icon) => icon.attributes.getNamedItem("title").nodeValue === "grid-view");
const listViewIcon = viewIcons.find((icon) => icon.attributes.getNamedItem("title").nodeValue === "list-view");

let gridViewIndex = INITIAL_GRID_VIEW_INDEX;
let logos = [];

const isIconActive = (icon) => {
  const activeValue = icon.querySelector("path").attributes.getNamedItem("fill").nodeValue;

  return activeValue === ACTIVE_FILL_PROPERTY;
}

const fillIcon = (icon, fillProperty) => {
  const path = icon.querySelector("path");

  path.setAttribute("fill", fillProperty);
}

const shuffle = (array) => {
  const result = array

  return result.sort(() => Math.random() - RANDOM_SECTOR);
}

const initializeLogos = async () => {
  const settingPath = "src/data/pressLogoTable.json";
  const cells = await fetch(settingPath).then((response) => response.json()).then((json) => json.cells);

  logos = shuffle(cells);
}

const createSubscribeButton = () => {
  const button = document.createElement("button");
  const plusImage = document.createElement("img");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  plusImage.style.cssText = "width: 12px; height: 12px; margin-left: -4px; margin-right: 2px";
  
  button.classList.add("press-container__subscribe-button");
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
}

const addImagesIntoTable = (table) => {
  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const newDivTag = document.createElement("div");
    const newImageTag = document.createElement("img");
    const subscribeButton = createSubscribeButton();
    const cellIndex = gridViewIndex * LOGO_COUNT_PER_PAGE + index;
    const cell = logos[cellIndex];

    newImageTag.style.cssText = `
      width:${cell.width}px;
      height:${cell.height}px;
      background:url(${LOGO_IMAGE_PATH}) ${cell.left}px ${cell.top}px;
    `;
    newDivTag.classList.add("press-container__logo");
    newDivTag.appendChild(newImageTag);
    newDivTag.appendChild(subscribeButton);

    table.appendChild(newDivTag);
  });
};

const setVisibilityOfArrowButtons = () => {
  if (isIconActive(gridViewIcon)) {
    leftArrowButton.style.visibility = gridViewIndex === FIRST_PAGE ? "hidden" : "visible";
    rightArrowButton.style.visibility = gridViewIndex === LAST_PAGE ? "hidden" : "visible";
  }
  if (isIconActive(listViewIcon)) {
    leftArrowButton.style.visibility = "visible";
    rightArrowButton.style.visibility = "visible";
  }
};

const renderGridView = async () => {
  if (logos.length === 0) {
    await initializeLogos();
  }

  pressTable.innerHTML = "";
  addImagesIntoTable(pressTable);
  setVisibilityOfArrowButtons();
};

const renderListView = async () => {
  
  pressTable.innerHTML = "";
  setVisibilityOfArrowButtons();
}

gridViewIcon.addEventListener("click", () => {
  fillIcon(gridViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(listViewIcon, INACTIVE_FILL_PROPERTY);
  renderGridView();
})
listViewIcon.addEventListener("click", () => {
  fillIcon(listViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(gridViewIcon, INACTIVE_FILL_PROPERTY);
  renderListView();
})

leftArrowButton.addEventListener("click", () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex > FIRST_PAGE ? --gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    renderListView();
  }
});
rightArrowButton.addEventListener("click", () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex < LAST_PAGE ? ++gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    renderListView();
  }
});

export default renderGridView;
