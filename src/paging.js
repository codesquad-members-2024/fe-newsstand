import { newsLogos } from "./data.js";
import { showGrid, showList } from "./logos.js";

let currentPage = 0;

const gridLeftBtn = document.querySelector('.grid-left-btn'); 
const gridRightBtn = document.querySelector('.grid-right-btn');
const listLeftBtn = document.querySelector('.list-left-btn');
const listRightBtn = document.querySelector('.list-right-btn');

const listViewBtn = document.querySelector('.list-view-btn');
const gridViewBtn = document.querySelector('.grid-view-btn');

function listViewClick() {
  showList();
}

function gridViewClick() {
  currentPage = 0;
  showGrid(currentPage);
}

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

listViewBtn.addEventListener('click', ()=>{
  listViewClick();
});

gridViewBtn.addEventListener('click', ()=>{
  gridViewClick();
});

gridRightBtn.addEventListener('click', ()=>{
  handleRightButtonClick();
});

gridLeftBtn.addEventListener('click', ()=>{
  handleLeftButtonClick();
});

listRightBtn.addEventListener('click', ()=>{
  // list right
});

listLeftBtn.addEventListener('click', ()=>{
  // list left
});