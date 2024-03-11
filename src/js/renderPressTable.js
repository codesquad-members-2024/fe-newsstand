const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const INITIAL_PRESS_LOGO_INDEX = 0;
const RANDOM_SECTOR = 0.5;
const LOGO_IMAGE_PATH = "src/img/PressLogo.png";

const leftArrowButton = document.querySelector(".press-container__left-arrow");
const rightArrowButton = document.querySelector(".press-container__right-arrow");

let pressLogoTableIndex = INITIAL_PRESS_LOGO_INDEX;

const shuffle = (array) => {
  array.sort(() => Math.random() - RANDOM_SECTOR);
}

const createSubscribeButton = () => {
  const button = document.createElement("button");
  const plusImage = document.createElement("img");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  plusImage.style.cssText = "width: 12px; height: 12px; margin-left: -4px; margin-right: 2px"
  
  button.classList.add("press-container__subscribe-button");
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
}

const addImagesIntoTable = (settings, table) => {
  const cells = settings.cells;
  shuffle(cells);

  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newDivTag = document.createElement("div");
    const newImageTag = document.createElement("img");
    const subscribeButton = createSubscribeButton();
    const cellIndex = pressLogoTableIndex * settings.cellCountPerPage + index;
    const cell = cells[cellIndex];

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
  if (pressLogoTableIndex === FIRST_PAGE) {
    leftArrowButton.style.visibility = "hidden";
    return;
  }
  if (pressLogoTableIndex === LAST_PAGE) {
    rightArrowButton.style.visibility = "hidden";
    return;
  }

  leftArrowButton.style.visibility = "visible";
  rightArrowButton.style.visibility = "visible";
};

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-container__view");
  const settingPath = "src/data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = "";
  addImagesIntoTable(settings, pressTable);
  setVisibilityOfArrowButtons();
};

leftArrowButton.addEventListener("click", () => {
  if (pressLogoTableIndex > FIRST_PAGE) pressLogoTableIndex--;
  renderPressTable();
});
rightArrowButton.addEventListener("click", () => {
  if (pressLogoTableIndex < LAST_PAGE) pressLogoTableIndex++;
  renderPressTable();
});

export default renderPressTable;
