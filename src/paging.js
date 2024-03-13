const leftBtn = document.querySelector('.grid-left-btn');
const rightBtn = document.querySelector('.grid-right-btn');
const listViewBtn = document.querySelector('.list-view-btn');
const gridViewBtn = document.querySelector('.grid-view-btn');

let currentPage = 0;

listViewBtn.addEventListener('click', ()=>{
  listViewClick();
});

gridViewBtn.addEventListener('click', ()=>{
  gridViewClick();
});

function listViewClick() {
  showList();
}

function gridViewClick() {
  currentPage = 0;
  showGrid(currentPage);
}

rightBtn.addEventListener('click', ()=>{
  handleRightButtonClick();
});

leftBtn.addEventListener('click', ()=>{
  handleLeftButtonClick();
});

function handleRightButtonClick() {
  if (currentPage < newsLogos.length) {
    currentPage++;
  }
  showGrid(currentPage);
}

function handleLeftButtonClick() {
  if (currentPage > 0) {
    currentPage--;
  }
  showGrid(currentPage);
}
