import {
  getSubscriptionData,
  postSubscriptionData,
  deleteSubscriptionData,
} from "../utils/pressDataApi.js";
import { store } from "../../data/store.js";
import { showSnackbar } from "../utils/snackbarFactory.js";

const STORE_CHANGE_TIME = 100;

export function handleGridSubsOnClick() {
  const gridWrap = document.querySelector(".grid");
  gridWrap.addEventListener("click", gridSubsCallback);
}

function gridSubsCallback(event) {
  if (
    event.target.innerText === "+ 구독하기" &&
    event.target.classList.contains("subs")
  ) {
    subscribeGridPress(event);
  } else if (
    event.target.innerText === "- 해지하기" &&
    event.target.classList.contains("subs")
  ) {
    unsubscribGridPress(event);
  }
}

function subscribeGridPress(event) {
  event.stopPropagation();
  event.preventDefault();
  const pressBox = event.target.parentNode;
  const imgEl = pressBox.querySelector(".press-logo");
  const pressName = imgEl.getAttribute("alt");
  const brandMark = imgEl.getAttribute("src");
  const pressData = { pressName: pressName, brandMark: brandMark };

  postSubscriptionData("gridSubs", pressData);
  showSnackbar("내가 구독한 언론사에 추가되었습니다.");
  store.setState({ viewType: "grid", subsType: "on" });
}

async function unsubscribGridPress(event) {
  event.stopPropagation();
  event.preventDefault();
  const pressBox = event.target.parentNode;
  const imgEl = pressBox.querySelector(".press-logo");
  const pressName = imgEl.getAttribute("alt");
  const subsData = await getSubscriptionData("gridSubs");
  const pressId = subsData.find((Obj) => Obj.pressName === pressName).id;

  deleteSubscriptionData("gridSubs", pressId);
  showSnackbar("구독 해지되었습니다.");
  setTimeout(() => {
    store.setState({ viewType: "grid", subsType: "on" });
  }, STORE_CHANGE_TIME);
}
