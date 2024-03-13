// import { showGrid, showList } from "./newsLogos";

const gridLeftBtn = document.querySelector('.grid-left-btn'); // grid btn
const gridRightBtn = document.querySelector('.grid-right-btn');
const listLeftBtn = document.querySelector('.list-left-btn'); // list btn
const listRightBtn = document.querySelector('.list-right-btn');

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

gridRightBtn.addEventListener('click', ()=>{
  handleRightButtonClick();
});

gridLeftBtn.addEventListener('click', ()=>{
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
