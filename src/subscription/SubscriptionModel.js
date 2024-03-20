class SubscriptionModel {
    constructor() {
        this.subscripteList = new Set();
    }
    subscribe(press) {
        this.subscripteList.add(press);
    }
    unsubscribe(press) {
        this.subscripteList.delete(press);
    }

    getSubscripeList() {
        return [...this.subscripteList]
    }

    isSubscribeGridButton(press) {
        const hasSubscription = this.subscripteList.has(press)
            ? `<button class = "subscribe" id = "unsubscribe" name = "${press}"> + 해지하기</button>`
            : `<button class = "subscribe" id = "subscribe" name = "${press}"> + 구독하기</button>`;
        return hasSubscription;
    }

    isSubscribeListButton(press) {
        const hasSubscription = this.subscripteList.has(press)
            ? `<button class="subscribe-btn subscribe" id = "unsubscribe" name = "${press}">x</button>`
            : `<button class="subscribe-btn subscribe" id = "subscribe" name = "${press}">+ 구독하기</button>`;
        return hasSubscription;
    }
}

const subscriptionModel = new SubscriptionModel()
export default subscriptionModel
