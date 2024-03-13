const jsonParse = {
    async parseJson(tableName) {
        const news = await fetch(`src/Crawling/${tableName}.json`);
        const data = await news.json();
        return data
    },
};

export default jsonParse