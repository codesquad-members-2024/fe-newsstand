export class SubscriptionController {
    constructor() {
        this.subscripteList = new Set();
    }
    subscribe(press) {
        this.subscripteList.add(press);
    }
    unsubscribe(press) {
        this.subscripteList.delete(press);
    }
    isSubscribeGridButton(press) {
        const hasSubscription = this.subscripteList.has(press)
            ? `<button class = "subscribe" id = "subscribe" name = "${press}"> + 해지하기</button>`
            : `<button class = "subscribe" id = "subscribe" name = "${press}"> + 구독하기</button>`;
        return hasSubscription;
    }

    isSubscribeListButton(press) {
        const hasSubscription = this.subscripteList.has(press)
            ? `<button class="subscribe-btn" id = "subscribe" name = "${press}">x</button>`
            : `<button class="subscribe-btn" id = "subscribe" name = "${press}">+ 구독하기</button>`;
        return hasSubscription;
    }
}
