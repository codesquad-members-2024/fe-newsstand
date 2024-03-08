const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
let currentPage = 0;

rightBtn.addEventListener('click', ()=>{
  console.log(currentPage);
  handleRightButtonClick();
});

leftBtn.addEventListener('click', ()=>{
  console.log(currentPage);
  handleLeftButtonClick();
});

function handleRightButtonClick() {
  if (currentPage < 3) {
    currentPage++;
  }
  showLogos(currentPage);
  }

function handleLeftButtonClick() {
  if (currentPage > 1) {
    currentPage--;
  }
  showLogos(currentPage);
  }
