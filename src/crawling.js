import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

export class NewsCrawlingData {
    #topNewsData;
    #newsData
    constructor() {
        // contrastEconomy
        // broadcastCommunication
        // IT
        // EnglishPaper
        // sportsRomance
        // magazine
        // area
    }

    async main() {
        await this.parsing("뉴스");
        this.creatJson("topNews", this.#topNewsData);
    }
    

    async getHTML(keyword) {
        try {
            return await axios.get(
                "https://search.naver.com/search.naver?where=news&ie=UTF-8&query=" +
                    encodeURI(keyword)
            );
        } catch (err) {
            console.log(err);
        }
    }

    async parsing(keyword) {
        const html = await this.getHTML(keyword);
        const $ = cheerio.load(html.data);
        const $titlist = $(".news_area");

        const informations = [];
        $titlist.each((idx, node) => {
            informations.push({
                link: $(node).find(".news_contents a").attr("href"),
                title: $(node).find(".news_tit:eq(0)").text(),
                press: $(node).find(".info_group > a").text(),
                time: $(node).find(".info_group > span").text(),
                contents: $(node).find(".dsc_wrap").text(),
            });
        });
        this.#topNewsData = informations;
    }

    creatJson(tableName, data) {
        fs.writeFile( `${tableName}.json`, JSON.stringify(data), function(err) {
            console.log( 'json파일 생성완료' );
        });
    }
}
const newsDataCrawling = new NewsCrawlingData();
await newsDataCrawling.main();
