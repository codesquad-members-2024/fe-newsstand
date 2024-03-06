export const jsonParser = {
    async getJson() {
        const news = await fetch("/topNews.json")
        const data = await news.json()
        return data
    },

    
};
