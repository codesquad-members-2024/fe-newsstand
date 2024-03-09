import jsonParse from "../jsonParse.js";
export class CompanysDisplayForm {
    #randomImg;
    #companyData;
    constructor() {
        this.currenPageNum = 0;
        this.#companyData = [];
    }

    async main() {
        const newsData = await jsonParse.parseJson("topNews")
        this.#randomImg = newsData.sort(() => Math.random() - 0.5)
        this.splitIntoChunks();
        return this.currenPageNum
    }

    splitIntoChunks() {
        while (this.#randomImg.length !== 0) {
            this.#companyData.push(this.#randomImg.splice(0, 24));
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
            <img class = "logo-img" src = "${cur.img}" alt = ${cur.companyName}>
            <button class = "subscribe"> + 구독하기</button>
            </li>
            `;
        });
        return logoTemplate.join("");
    };
}
