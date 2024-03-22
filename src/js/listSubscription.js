import { pressData } from "../../data/categoryDictionary.js";
import {
  getSubscriptionData,
  postSubscriptionData,
  deleteSubscriptionData,
} from "../utils/pressDataApi.js";
import { store } from "../../data/store.js";
import { showSnackbar } from "../utils/snackbarFactory.js";

const STORE_CHANGE_TIME = 100;

export function handleListSubsOnClick() {
  const listWrap = document.querySelector(".grid");
  listWrap.addEventListener("click", listSubsCallback);
}

function listSubsCallback(event) {
  if (
    event.target.innerText === "+ 구독하기" &&
    event.target.classList.contains("subs-btn")
  ) {
    subscribeListPress(event);
  } else if (
    event.target.innerText === "- 해지하기" &&
    event.target.classList.contains("subs-btn")
  ) {
    unsubscribeListPress(event);
  }
}

function subscribeListPress(event) {
  event.stopPropagation();
  event.preventDefault();
  const pressInfoBox = event.target.parentNode;
  const imgEl = pressInfoBox.querySelector("img");
  const clickedPressName = imgEl.getAttribute("alt");
  const pressDataArr = pressData
    .map((categoryObj) => categoryObj.pressList)
    .flat();
  const subscribedPress = pressDataArr.find(
    (obj) => obj.pressName === clickedPressName
  );

  postSubscriptionData("listSubs", subscribedPress);
  showSnackbar("내가 구독한 언론사에 추가되었습니다.");
  store.setState({ viewType: "list", subsType: "on" });
}

async function unsubscribeListPress(event) {
  event.stopPropagation();
  event.preventDefault();
  const pressInfoBox = event.target.parentNode;
  const imgEl = pressInfoBox.querySelector("img");
  const pressName = imgEl.getAttribute("alt");
  const subsData = await getSubscriptionData("listSubs");
  const pressId = subsData.find((Obj) => Obj.pressName === pressName).id;

  deleteSubscriptionData("listSubs", pressId);
  showSnackbar("구독 해지되었습니다.");
  setTimeout(() => {
    store.setState({ viewType: "list", subsType: "on" });
  }, STORE_CHANGE_TIME);
}
