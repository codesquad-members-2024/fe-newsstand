const reader = new FileReader();

function viewPressLogo() {
  const pressGridEl = document.querySelector(".press-grid");

  for (let i = 1; i <= 24; i++) {
    const newPressBox = document.createElement("div");
    const newsLogo = document.createElement("img");
    newsLogo.src =
      "https://s.pstatic.net/static/newsstand/2020/logo/light/0604/014.png";
    newPressBox.classList.add("press-box");
    newPressBox.appendChild(newsLogo);
    pressGridEl.appendChild(newPressBox);
  }

  console.log(pressGridEl);
}

viewPressLogo();
