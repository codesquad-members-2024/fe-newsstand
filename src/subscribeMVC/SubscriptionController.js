import { delay } from "../util/active.js"
export const onSubscribeButtonClick = async(target, subscriptionModel) => {
    const subscribeModal = document.querySelector(".subscribe-modal")
    const targetPress = target.name
    const isSubscribe = target.id
    if (isSubscribe === "subscribe")  {
        subscriptionModel.subscribe(targetPress)
        subscribeModal.innerHTML = `<div class="subscribe-container">${targetPress}언론사가 내가 구독한 언론사에 추가되었습니다.</div>`
        subscribeModal.style.display = "flex"
        await delay(1000)
        subscribeModal.style.display = "none"
    } else if (isSubscribe === "unsubscribe") {
        subscriptionModel.unsubscribe(targetPress)
        subscribeModal.innerHTML = `
        <div class="unsubscribe-container">${targetPress}을(를) 구독해지하시겠습니까?</div>
        <div class = "answer-container">
        <button class = "yes-btn">예</button>
        <button class = "no-btn">아니요</button>
        </div>
        `
        subscribeModal.style.display = "flex"
    }
}

const subscribeActive = () => {
    
}