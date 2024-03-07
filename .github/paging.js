document.addEventListener('DOMContentLoaded', function () {
  let currentPage = 1;

  function handleRightButtonClick() {
    if (currentPage < 4) {
      currentPage++;
      showLogos(currentPage);
    }
  }

  function handleLeftButtonClick() {
    if (currentPage > 1) {
      currentPage--;
      showLogos(currentPage);
    }
  }

  // 이벤트 리스너 추가
  document.querySelector('.right-btn').addEventListener('click', handleRightButtonClick);
  
  document.querySelector('.left-btn').addEventListener('click', handleLeftButtonClick);
});