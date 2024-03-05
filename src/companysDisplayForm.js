export class GetRandomCompany {
    #randomNumber;
    #companyData;
    constructor() {
        this.currenPageNum = 0;
        this.#companyData = [];
        this.#randomNumber = new Array(96)
            .fill()
            .map((_, idx) => idx)
            .sort(() => Math.random() - 0.5);
    }

    main() {
        this.splitIntoChunks();
        return this.#companyData[this.currenPageNum];
    }

    splitIntoChunks() {
        while (this.#randomNumber.length !== 0) {
            this.#companyData.push(this.#randomNumber.splice(0, 24));
        }
    }

    updatePageNum(targetName) {
        // if (this.currenPageNum === 0 || this.currenPageNum === 3) 
        switch (targetName) {
            case "left-btn":
                this.currenPageNum--;
                break;
            case "light-btn":
                this.currenPageNum++;
                break;
            default:
                break;
        }
        return this.#companyData[this.currenPageNum]
    }
}
