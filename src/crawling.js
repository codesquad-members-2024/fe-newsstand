import axios from "axios";
import cheerio from "cheerio";

export class NewsCrawlingData {
    #topNewsData;
    constructor() {
        this.#topNewsData = this.parsing("뉴스");
        // contrastEconomy
        // broadcastCommunication
        // IT
        // EnglishPaper
        // sportsRomance
        // magazine
        // area
    }

    async getHTML (keyword) {
        try {
            return await axios.get(
                "https://search.naver.com/search.naver?where=news&ie=UTF-8&query=" +
                    encodeURI(keyword)
            );
        } catch (err) {
            console.log(err);
        }
    };

    async parsing (keyword) {
        const html = await this.getHTML(keyword); // 수정된 부분
        const $ = cheerio.load(html.data);
        const $titlist = $(".news_area");
    
        let informations = [];
        $titlist.each((idx, node) => {
            informations.push({
                link: $(node).find(".news_contents a").attr("href"),
                title: $(node).find(".news_tit:eq(0)").text(),
                press: $(node).find(".info_group > a").text(),
                time: $(node).find(".info_group > span").text(),
                contents: $(node).find(".dsc_wrap").text(),
            });
            console.log(informations);
        });
    };
}
const newsDataCrawling = new NewsCrawlingData()
