import { activateSubscribedPress } from './Events.js';
import Utils from "./Utils.js";

const SNACKBAR_DELAY = 5000;

const removeSnackBar = (pressTable, snackBar) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      pressTable.removeChild(snackBar);
      activateSubscribedPress();
    }, SNACKBAR_DELAY);
  });
}

export const renderSubscribeSnackBar = async (pressTable) => {
  const snackBar = Utils.createElementWithClass("div", "notification__subscribe-snackbar");

  snackBar.textContent = "내가 구독한 언론사에 추가되었습니다.";
  pressTable.appendChild(snackBar);
  await removeSnackBar(pressTable, snackBar);
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
      <div class="notification__unsubscribe-submit" press-name="${pressName}">예, 해지합니다
      </div>
      <div class="notification__unsubscribe-cancel">아니오
      </div>
    </div>`;

  pressTable.appendChild(alert);
}