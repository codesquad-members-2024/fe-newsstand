import {
  AutoRenderHandler,
  Clickable,
  NewsModel, RenderUtils, ST, Subscription
} from "./PressTable.js";
import Utils from "./Utils.js";

const INCREMENT = 1;
const PAGE_TURNING_DELAY = 20000;
const EMPTY_IN_PERCENTAGE = 0;
const FULL_IN_PERCENTAGE = 100;
const FILL_SECTOR = 0.1;

const pressTable = document.querySelector(".press-container__view");

let fillColorInInterval = null;

const isInCategoryRange = (category, page) => {
  return (
    category.firstIndex <= page &&
    category.firstIndex + category.count > page
  );
};

const findNewsIndex = (newsElement) => {
  return NewsModel.news.findIndex(({ pressName }) => newsElement.pressName === pressName);
};

const findActiveCategory = (categories, page) => {
  return categories.find((categoryElement) => isInCategoryRange(categoryElement, page));
};

const toggleArrowVisibility = () => {
  if (RenderUtils.isIconActive(Clickable.listViewIcon)) {
    Utils.updateArrowButtonVisibility(Clickable.leftArrowButton, false);
    Utils.updateArrowButtonVisibility(Clickable.rightArrowButton, false);
  }
};

const renderActiveCategory = (category, page) => {
  return `<div class="press-container__active-tab">
    <div class="press-container__progress"></div>
    <div class="press-container__tab-description">
      <div>${category.categoryName}</div>
      <div>${
        page - category.firstIndex + INCREMENT
      } <span style="opacity: 0.7;">/ ${category.count}</span></div>
    </div>
  </div>`;
};

const renderInactiveCategory = (category) => {
  return `<div class="press-container__tab" index="${category.firstIndex}">${category.categoryName}</div>`;
};

const animateActiveTab = () => {
  const activeTab = document.querySelector(".press-container__progress");
  const intervalSector = FULL_IN_PERCENTAGE / FILL_SECTOR;
  let width = EMPTY_IN_PERCENTAGE;

  const fillColor = () => {
    if (width >= FULL_IN_PERCENTAGE) clearInterval(fillColorInInterval);
    else {
      width += FILL_SECTOR;
      activeTab.style.width = width + "%";
    }
  };
  if (fillColorInInterval !== null) {
    clearInterval(fillColorInInterval);
    fillColorInInterval = null;
  }
  fillColorInInterval = setInterval(
    fillColor,
    PAGE_TURNING_DELAY / intervalSector
  );
};

const renderCategoryTabBlock = (page) => {
  const activeCategory = findActiveCategory(NewsModel.categories, page);
  const categoryTabBlock = Utils.createElementWithClass(
    "div",
    "press-container__tab-block"
  );

  categoryTabBlock.innerHTML = NewsModel.categories.reduce(
    (acc, cur) =>
      acc +
      (cur === activeCategory
        ? renderActiveCategory(cur, page)
        : renderInactiveCategory(cur)),
    ""
  );

  return categoryTabBlock;
};

const renderNewsInfo = (page) => {
  const newsInfo = Utils.createElementWithClass("div", "press-container__news-info");
  const image = document.createElement("img");
  const editedTime = Utils.createElementWithClass("span", "press-container__edited-time");
  const newsPage = NewsModel.news[page];
  const subscriptionToggleButton = Subscription.isSubscribed(newsPage.pressName)
    ? Subscription.createUnsubscribeButton(newsPage.pressName)
    : Subscription.createSubscribeButton(newsPage.pressName);
  
  image.src = newsPage.logoImageSrc;
  editedTime.textContent = newsPage.editedTime;
  subscriptionToggleButton.style.cssText = "display: block; margin-left: 16px;";
  Utils.appendChildren(newsInfo, [image, editedTime, subscriptionToggleButton]);

  return newsInfo;
};

const renderSideNews = (page, container) => {
  const fragment = document.createDocumentFragment();
  const newsPage = NewsModel.news[page];

  newsPage.sideNews.forEach(({ href, title }) => {
    const linkElement = Utils.createElementWithClass("a", "press-container__sidenews-title");

    linkElement.href = href;
    linkElement.textContent = title;
    fragment.appendChild(linkElement);
  });

  container.appendChild(fragment);
};

const renderNewsContent = (page) => {
  const { headline, pressName } = NewsModel.news[page];
  const container = Utils.createElementWithClass("div", "press-container__news-content");
  const headlineContainer = Utils.createElementWithClass("div", "press-container__headline");
  const sideNews = Utils.createElementWithClass("div", "press-container__sidenews");
  const thumbnail = Utils.createElementWithClass("img", "press-container__headline-thumbnail");
  const headlineTitle = Utils.createElementWithClass("a", "press-container__headline-title");
  const noteMessage = document.createElement("span");

  thumbnail.src = headline.thumbnailSrc;
  headlineTitle.href = headline.href;
  headlineTitle.innerHTML = headline.title;

  renderSideNews(page, sideNews);
  noteMessage.textContent = `${pressName} 언론사에서 직접 편집한 뉴스입니다.`;

  Utils.appendChildren(sideNews, [noteMessage]);
  Utils.appendChildren(headlineContainer, [thumbnail, headlineTitle]);
  Utils.appendChildren(container, [headlineContainer, sideNews]);

  return container;
};

const renderDetailedNews = (page) => {
  const detailedNews = Utils.createElementWithClass("div", "press-container__detailed-news");
  const newsInfo = renderNewsInfo(page);
  const newsContents = renderNewsContent(page);

  Utils.appendChildren(detailedNews, [newsInfo, newsContents]);

  return detailedNews;
};

const renderActiveSubscribedNews = (page) => {
  return `<div class="press-container__active-tab">
    <div class="press-container__progress"></div>
    <div class="press-container__tab-description">
      <div>${NewsModel.subscribedNews[page].pressName}</div>
    </div>
  </div>`;
};

const renderInactiveSubscribedNews = (page) => {
  return `<div class="press-container__tab" index="${page}">${NewsModel.subscribedNews[page].pressName}</div>`;
};

const renderPressTabBlock = (page) => {
  const activeTab = NewsModel.subscribedNews[page];
  const pressTabBlock = Utils.createElementWithClass("div", "press-container__tab-block");

  pressTabBlock.innerHTML = NewsModel.subscribedNews.reduce(
    (acc, cur, index) =>
      acc +
      (cur === activeTab
        ? renderActiveSubscribedNews(index)
        : renderInactiveSubscribedNews(index)),
    ""
  );

  return pressTabBlock;
};

export const renderListView = async (page, viewType) => {
  let tabBlock, detailedNews;

  await Subscription.updateSubscribedNews();
  RenderUtils.clearPressTableContent("list");
  if (viewType === "all") {
    tabBlock = renderCategoryTabBlock(page);
    detailedNews = renderDetailedNews(page);
  }
  if (viewType === "subscribed") {
    const newsPage = findNewsIndex(NewsModel.subscribedNews[page]);
    tabBlock = renderPressTabBlock(page);
    detailedNews = renderDetailedNews(newsPage);
  }

  Utils.appendChildren(pressTable, [tabBlock, detailedNews]);

  toggleArrowVisibility();
  animateActiveTab();
  AutoRenderHandler.start();
};
