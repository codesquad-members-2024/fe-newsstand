const jsonParse = {
    async parseJson(tableName) {
        const news = await fetch(`src/Crawling/${tableName}.json`);
        const data = await news.json();
        return data
    },

    spliceCompanyString(newsData, property){
        return newsData.map((curNewsData) => {
            const slicedString = curNewsData[property].split("언론사")[0].trim();
            curNewsData[property] = slicedString;
            return curNewsData;
        });
    },
};

export default jsonParse