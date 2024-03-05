const WEEK = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

const leftArrowButton = document.querySelector(".left-arrow-button");
const rightArrowButton = document.querySelector(".right-arrow-button");

let pressLogoTableIndex = 0;

const increaseIndex = () => {pressLogoTableIndex++;};
const decreaseIndex = () => {pressLogoTableIndex--;};

const setVisibilityOfArrowButtons = () => {
  if ( pressLogoTableIndex === 0 ) {
    leftArrowButton.style.visibility = "hidden";
    return;
  }
  if ( pressLogoTableIndex === 3 ) {
    rightArrowButton.style.visibility = "hidden";
    return;
  }

  leftArrowButton.style.visibility = "visible";
  rightArrowButton.style.visibility = "visible";
}

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-table");
  const imagePath = "img/PressLogo.png";
  const settingPath = "data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = '';
  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newImageTag = document.createElement("img");
    const cellIndex = pressLogoTableIndex * settings.cellCountPerPage + index;
    const cell = settings.cells[cellIndex];

    newImageTag.style.width = `${cell.width}px`;
    newImageTag.style.height = `${cell.height}px`;
    newImageTag.style.background = `url(${imagePath}) ${cell.left}px ${cell.top}px`;
    pressTable.appendChild(newImageTag);
  });

  setVisibilityOfArrowButtons();
}

const renderCurrentDate = () => {
  const currentDateTag = document.querySelector(".currentDate");
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const day = WEEK[currentDate.getDay()];

  currentDateTag.innerHTML = `${year}. ${month.toString().padStart(2, "0")}. ${date.toString().padStart(2, "0")}. ${day}`;
}

renderCurrentDate();
renderPressTable();
leftArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex > 0 ) decreaseIndex();
  renderPressTable();
});
rightArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex < 3 ) increaseIndex();
  renderPressTable();
});