export class CompanysDisplayForm {
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
        return this.currenPageNum
    }

    splitIntoChunks() {
        while (this.#randomNumber.length !== 0) {
            this.#companyData.push(this.#randomNumber.splice(0, 24));
        }
    }

    updatePageNum(targetName) {
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
        return this.currenPageNum
    }

    getLogoTemplat = () => {
        const logoTemplate = this.#companyData[this.currenPageNum].map((cur, idx) => {
            return `
            <li class="list-${idx}">
            <div class = "subscribe-container"><button>구독하기</button></div>
            <img src = "static/company-logo/grid-${cur}.png">
            </li>
            `;
        });
        return logoTemplate.join("");
    };
}
