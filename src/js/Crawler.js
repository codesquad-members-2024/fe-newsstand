import crawlNews from "./NewsCrawler.js";
import crawlLogos from "./LogoCrawler.js"

const crawl = () => {
  crawlLogos();
  crawlNews();
}

crawl();