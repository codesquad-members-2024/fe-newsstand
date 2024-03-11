const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
let currentPage = 0;

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
  showLogos(currentPage);
  }

function handleLeftButtonClick() {
  if (currentPage > 0) {
    currentPage--;
  }
  showLogos(currentPage);
  }
