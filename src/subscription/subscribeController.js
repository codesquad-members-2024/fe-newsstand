import { SUBSCRIBE_MODAL_DELAY, delay } from "../util/contants.js";
import subscriptionModel from "./SubscriptionModel.js";
import mainController from "../mainController.js";

const subscribeModal = document.querySelector(".subscribe-modal");

const showModal = () => (subscribeModal.style.display = "flex");
const hideModal = () => (subscribeModal.style.display = "none");

const getModaltemplate = (press, isSubscribe) => {
    if (isSubscribe === true) {
        return `
        <div class="subscribe-container">${press}언론사가 내가 구독한 언론사에 추가되었습니다.</div>
        `;
    } else {
        return `
        <div class="unsubscribe-container">${press}을(를) 구독해지하시겠습니까?</div>
        <div class = "answer-container">
        <button class = "yes-btn">예</button>
        <button class = "no-btn">아니요</button>
        </div>
        `;
    }
};

const subscribeMap = {
    async subscribe(press) {
        subscriptionModel.subscribe(press);
        subscribeModal.innerHTML = getModaltemplate(press, true);
        showModal();
        await delay(SUBSCRIBE_MODAL_DELAY);
        hideModal();
        mainController.navigationMap.SHOW_SUBSCRIBED_COMPANY();
    },
    unsubscribe(press) {
        subscribeModal.innerHTML = getModaltemplate(press, false);
        showModal();
        const unsubscribeContainer =
            document.querySelector(".answer-container");
        unsubscribeContainer.addEventListener("click", (e) => {
            handleUnsubscribeResponse(e, press);
        });
    },
};

const subscribeToPress = (event) => {
    const targetId = event.target.id;
    const targetPress = event.target.name;
    if (targetId !== "subscribe" && targetId !== "unsubscribe") return;
    subscribeMap[targetId](targetPress);
};

const handleUnsubscribeResponse = (event, press) => {
    const className = event.target.className;
    if (className === "yes-btn") {
        subscriptionModel.unsubscribe(press);
        hideModal();
        subscriptionModel.getSubscripeList().length === 0
            ? mainController.navigationMap.SHOW_All_COMPANY()
            : mainController.navigationMap.SHOW_SUBSCRIBED_COMPANY();
    } else {
        hideModal();
    }
};

export const setSubscribeEventHandler = () => {
    const subscribeBtns = document.querySelectorAll("main");
    subscribeBtns.forEach((curContainer) => {
        curContainer.addEventListener("click", subscribeToPress);
    });
};
