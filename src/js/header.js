const DAYOFWEEK_INDEX = 3;

function refreshPageOnLogoClick() {
  const newsStandLogo = document.querySelector(".newsStand-logo");
  newsStandLogo.addEventListener("click", (event) => {
    location.reload();
  });
}

function getTodayDate() {
  const date = new Date();
  const dayOfWeek = new Intl.DateTimeFormat("ko", {
    dateStyle: "full",
  })
    .format(date)
    .split(" ")[DAYOFWEEK_INDEX];
  const yearMonthDay = new Intl.DateTimeFormat("ko-KR").format(date);
  const todayDate = `${yearMonthDay} ${dayOfWeek}`;
  return todayDate;
}

export function viewHeader() {
  refreshPageOnLogoClick();
  const dateEl = document.querySelector(".date");
  const dateStr = getTodayDate();
  dateEl.innerText = dateStr;
}
