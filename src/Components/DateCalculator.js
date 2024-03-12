export function DateCalculator() {
    const DAYS = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
    ];
    const date = new Date();

    const getCurrentDate = () => {
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            DAYS[date.getDay()],
        ];
    };
    return {getCurrentDate}
}
