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
