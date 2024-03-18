import Utils from "./Utils.js";

export const renderSubscribeSnackBar = (pressTable) => {
  const snackBar = Utils.createElementWithClass("div", "notification__subscribe-snackbar");

  snackBar.textContent = "내가 구독한 언론사에 추가되었습니다.";
  pressTable.appendChild(snackBar);
  setTimeout(() => {
    pressTable.removeChild(snackBar);
  }, 5000);
}

export const renderUnsubscribeAlert = (pressTable, pressName) => {
  const alert = Utils.createElementWithClass("div", "notification__unsubscribe-alert");
  
  
  alert.innerHTML = `<div class="notification__unsubscribe-content">
      <span><strong>${pressName}</strong>을(를)
      </span>
      <span>구독해지 하시겠습니까?
      </span>
    </div>
    <div class="notification__unsubscribe-clickable">
      <div class="notification__unsubscribe-submit">예, 해지합니다
      </div>
      <div class="notification__unsubscribe-cancel">아니오
      </div>
    </div>`;

  pressTable.appendChild(alert);
}