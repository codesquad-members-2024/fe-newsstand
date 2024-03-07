export class DateCalculator {
    #DAYS;
    constructor() {
        this.#DAYS = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일",];
        this.date = new Date();
    }

    getCurrentDate = () => {
        return [
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            this.date.getDate(),
            this.#DAYS[this.date.getDay()],
        ];
    };
}
