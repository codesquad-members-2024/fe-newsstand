const increase = (index) => ++index;
const decrease = (index) => --index;

const changeTableIndex = (counterFn) => {
  let index = 0;

  return () => {
    index = counterFn(index);
    return index;
  }
}

const getTableIndex = () => changeTableIndex((index) => index)();

const renderPressTable = async () => {
  const pressTable = document.querySelector(".press-table");
  const imagePath = "img/PressLogo.png";
  const settingPath = "data/pressLogoTable.json";
  const response = await fetch(settingPath);
  const settings = await response.json();

  pressTable.innerHTML = '';
  Array.from({ length: settings.cellCountPerPage }).forEach((_, index) => {
    const newImageTag = document.createElement("img");
    const cellIndex = getTableIndex() * settings.cellCountPerPage + index;
    const cell = settings.cells[cellIndex];

    newImageTag.style.width = `${cell.width}px`;
    newImageTag.style.height = `${cell.height}px`;
    newImageTag.style.background = `url(${imagePath}) ${cell.left}px ${cell.top}px`;
    pressTable.appendChild(newImageTag);
  });
}

renderPressTable();