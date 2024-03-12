const jsonParse = {
    async parseJson(tableName) {
        const news = await fetch(`${tableName}.json`);
        const data = await news.json();
        return data
    },
    // spliceCompanyString(data) {
    //     data.forEach((element) => {
    //         const pressName = element.press.split("언론사")[0].trim();
    //         element.press = pressName;
    //     });
    // },

    creatJson(tableName, data) {
        fs.writeFile(
            `${tableName}.json`,
            JSON.stringify(data),
            function (err) {
                if (err) {
                    console.error("파일 생성 중 오류 발생:", err);
                } else {
                    console.log("json파일 생성완료");
                }
            }
        );
    },
};

export default jsonParse