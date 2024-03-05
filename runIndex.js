const leftArrowButton = document.querySelector(".left-arrow-button");
const rightArrowButton = document.querySelector(".right-arrow-button");

let pressLogoTableIndex = 0;

const increaseIndex = () => {pressLogoTableIndex++;};
const decreaseIndex = () => {pressLogoTableIndex--;};

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
}

renderPressTable();
leftArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex > 0 ) decreaseIndex();
  renderPressTable();
});
rightArrowButton.addEventListener('click', () => {
  if ( pressLogoTableIndex < 3 ) increaseIndex();
  renderPressTable();
});