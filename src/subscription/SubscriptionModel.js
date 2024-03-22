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

    isSubscribe(press) {
        return this.subscripteList.has(press)
    }
}

const subscriptionModel = new SubscriptionModel()
export default subscriptionModel
