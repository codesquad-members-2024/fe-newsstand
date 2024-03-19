import { addNews, loadNews } from "../api/NewsApi.js";
import {
  renderSubscribeSnackBar,
  renderUnsubscribeAlert,
} from "./NotificationRenderer.js";
import Utils from "./Utils.js";

const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;
const INITIAL_VIEW_PAGE = 0;
const EMPTY = 0;
const INCREMENT = 1;
const DECREMENT = -1;
const PAGE_TURNING_DELAY = 20000;
const EMPTY_IN_PERCENTAGE = 0;
const FULL_IN_PERCENTAGE = 100;
const FILL_SECTOR = 0.1;

const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";
const ST = Object.freeze({
  PRESS_CONTAINER: ".press-container",
  PRESS_TABLE: ".press-container__view",
  ALL_PRESS: ".press-container__all-press",
  SUBSCRIBED_PRESS: ".press-container__subscribed-press",
  VIEW_ICON: ".press-container__view-icon",
  LEFT_ARROW: ".press-container__left-arrow",
  RIGHT_ARROW: ".press-container__right-arrow",
  TAB: ".press-container__tab",
  SUBSCRIBE_BUTTON: ".press-container__subscribe-button",
});

const pressContainer = document.querySelector(ST.PRESS_CONTAINER);
const pressTable = document.querySelector(ST.PRESS_TABLE);
const allPressMenu = document.querySelector(ST.ALL_PRESS);
const subscribedPressMenu = document.querySelector(ST.SUBSCRIBED_PRESS);
const leftArrowButton = document.querySelector(ST.LEFT_ARROW);
const rightArrowButton = document.querySelector(ST.RIGHT_ARROW);

const viewIconNodes = [...document.querySelectorAll(ST.VIEW_ICON)];
const viewIcons = viewIconNodes.reduce((icons, icon) => {
  const title = icon.getAttribute("title");
  if (title === "grid-view") icons.gridViewIcon = icon;
  if (title === "list-view") icons.listViewIcon = icon;
  return icons;
}, {});
const { gridViewIcon, listViewIcon } = viewIcons;

const news = [];
const categories = [];
const subscribedNews = [];

let gridViewPage = INITIAL_VIEW_PAGE;
let subscribedGridPage = INITIAL_VIEW_PAGE;
let listViewPage = INITIAL_VIEW_PAGE;
let subscribedListPage = INITIAL_VIEW_PAGE;
let logos = [];

let startAutoRender = null;
let fillColorInInterval = null;

const findNewsIndex = (newsElement) => {
  return news.findIndex(({ pressName }) => newsElement.pressName === pressName);
};

const activateGridView = () => {
  Utils.fillIcon(gridViewIcon, ACTIVE_FILL_PROPERTY);
  Utils.fillIcon(listViewIcon, INACTIVE_FILL_PROPERTY);
  if (Utils.isPressMenuActive(allPressMenu)) renderGridView(gridViewPage);
  if (Utils.isPressMenuActive(subscribedPressMenu))
    renderGridViewSubscribed(subscribedGridPage);
};

const activateListView = () => {
  Utils.fillIcon(listViewIcon, ACTIVE_FILL_PROPERTY);
  Utils.fillIcon(gridViewIcon, INACTIVE_FILL_PROPERTY);
  if (Utils.isPressMenuActive(allPressMenu)) renderListView(listViewPage);
  if (Utils.isPressMenuActive(subscribedPressMenu))
    renderListViewSubscribed(subscribedListPage);
};

const activateAllPress = () => {
  Utils.setPressMenuAsSelected(allPressMenu);
  Utils.setPressMenuAsUnselected(subscribedPressMenu);
  if (Utils.isIconActive(gridViewIcon)) renderGridView(gridViewPage);
  if (Utils.isIconActive(listViewIcon)) renderListView(listViewPage);
};

const activateSubscribedPress = () => {
  Utils.setPressMenuAsSelected(subscribedPressMenu);
  Utils.setPressMenuAsUnselected(allPressMenu);
  if (Utils.isIconActive(gridViewIcon))
    renderGridViewSubscribed(subscribedGridPage);
  if (Utils.isIconActive(listViewIcon))
    renderListViewSubscribed(subscribedListPage);
};

const handleGridViewIconActivePrevious = () => {
  let previousPage;

  if (Utils.isPressMenuActive(allPressMenu)) {
    previousPage =
      gridViewPage > FIRST_PAGE ? gridViewPage + DECREMENT : gridViewPage;
    renderGridView(previousPage);
    clearInterval(startAutoRender);
  }
  if (Utils.isPressMenuActive(subscribedPressMenu)) {
    previousPage =
      subscribedGridPage > FIRST_PAGE
        ? subscribedGridPage + DECREMENT
        : subscribedGridPage;
    renderGridViewSubscribed(previousPage);
    clearInterval(startAutoRender);
  }
};

const handleListViewIconActivePrevious = () => {
  let previousPage;

  if (Utils.isPressMenuActive(allPressMenu)) {
    previousPage =
      listViewPage > FIRST_PAGE ? listViewPage + DECREMENT : news.length + DECREMENT;
    renderListView(previousPage);
  }
  if (Utils.isPressMenuActive(subscribedPressMenu)) {
    previousPage =
      subscribedListPage > FIRST_PAGE
        ? subscribedListPage + DECREMENT
        : subscribedNews.length + DECREMENT;
    renderListViewSubscribed(previousPage);
  }
};

const renderPreviousPage = () => {
  if (Utils.isIconActive(gridViewIcon)) {
    handleGridViewIconActivePrevious();
  }
  if (Utils.isIconActive(listViewIcon)) {
    handleListViewIconActivePrevious();
  }
};

const handleGridViewIconActiveNext = () => {
  let nextPage;

  if (Utils.isPressMenuActive(allPressMenu)) {
    nextPage =
      gridViewPage < LAST_PAGE ? gridViewPage + INCREMENT : gridViewPage;
    renderGridView(nextPage);
    clearInterval(startAutoRender);
  }
  if (Utils.isPressMenuActive(subscribedPressMenu)) {
    nextPage =
      subscribedGridPage < LAST_PAGE
        ? subscribedGridPage + INCREMENT
        : subscribedGridPage;
    renderGridViewSubscribed(nextPage);
    clearInterval(startAutoRender);
  }
};

const handleListViewIconActiveNext = () => {
  let nextPage;

  if (Utils.isPressMenuActive(allPressMenu)) {
    nextPage =
      listViewPage === news.length + DECREMENT
        ? INITIAL_VIEW_PAGE
        : listViewPage + INCREMENT;
    renderListView(nextPage);
  }
  if (Utils.isPressMenuActive(subscribedPressMenu)) {
    nextPage =
      subscribedListPage === subscribedNews.length + DECREMENT
        ? INITIAL_VIEW_PAGE
        : subscribedListPage + INCREMENT;
    renderListViewSubscribed(nextPage);
  }
};

const renderNextPage = () => {
  if (Utils.isIconActive(gridViewIcon)) {
    handleGridViewIconActiveNext();
  }
  if (Utils.isIconActive(listViewIcon)) {
    handleListViewIconActiveNext();
  }
};

const initializeNews = async () => {
  const newsList = await loadNews("news");

  news.push(...newsList);
  initializeLogos();
  initializeCategories();
};

const initializeLogos = () => {
  logos = Utils.shuffle(
    news.map(({ logoImageSrc: src, pressName: name }) => ({ src, name }))
  );
};

const initializeCategories = () => {
  categories.length = EMPTY;

  const categoryInfo = news.reduce((acc, { category }, index) => {
    if (!acc[category]) {
      acc[category] = { categoryName: category, firstIndex: index, count: EMPTY };
    }
    acc[category].count += INCREMENT;
    return acc;
  }, {});

  categories.push(...Object.values(categoryInfo));
};

const initializeStartAutoRender = () => {
  if (startAutoRender !== null) {
    clearInterval(startAutoRender);
    startAutoRender = null;
  }
  startAutoRender = setInterval(renderNextPage, PAGE_TURNING_DELAY);
};

const updateSubscribedNews = async () => {
  subscribedNews.length = 0;
  const loadedSubscribedNews = await loadNews("subscribe");

  subscribedNews.push(...loadedSubscribedNews);
};

const createSubscribeButton = (pressName) => {
  const button = Utils.createElementWithClass("button", "press-container__subscribe-button");
  const plusImage = Utils.createElementWithClass("img", "press-container__plus-image");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  button.setAttribute("press-name", pressName);
  Utils.appendChildren(button, [plusImage, subscribeText]);

  return button;
};

const createLogo = (src, name) => {
  const logo = Utils.createElementWithClass("div", "press-container__logo");
  const image = document.createElement("img");
  const subscribeButton = createSubscribeButton(name);

  image.src = src;
  image.setAttribute("name", name);
  Utils.appendChildren(logo, [image, subscribeButton]);

  return logo;
};

const createLogosInTable = (table, page) => {
  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const logoIndex = page * LOGO_COUNT_PER_PAGE + index;
    const logo = createLogo(logos[logoIndex].src, logos[logoIndex].name);

    table.appendChild(logo);
  });
};

const toggleArrowVisibility = () => {
  const isGridViewActive = Utils.isIconActive(gridViewIcon);
  const isListViewActive = Utils.isIconActive(listViewIcon);

  if (isGridViewActive) {
    Utils.updateArrowButtonVisibility(leftArrowButton, gridViewPage === FIRST_PAGE);
    Utils.updateArrowButtonVisibility(rightArrowButton, gridViewPage === LAST_PAGE);
  }
  if (isListViewActive) {
    Utils.updateArrowButtonVisibility(leftArrowButton, false);
    Utils.updateArrowButtonVisibility(rightArrowButton, false);
  }
};

const renderGridView = async (page) => {
  if (logos.length === EMPTY) await initializeNews();

  gridViewPage = page;
  Utils.clearPressTableContent(pressTable, "grid");
  createLogosInTable(pressTable, page);
  toggleArrowVisibility();
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
  const activeCategory = Utils.findActiveCategory(categories, page);
  const categoryTabBlock = Utils.createElementWithClass("div", "press-container__tab-block");

  categoryTabBlock.innerHTML = categories.reduce(
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
  const subscribeButton = createSubscribeButton(news[page].pressName);

  image.src = news[page].logoImageSrc;
  editedTime.textContent = news[page].editedTime;
  subscribeButton.style.cssText = "display:block; margin-left:16px";
  Utils.appendChildren(newsInfo, [image, editedTime, subscribeButton]);

  return newsInfo;
};

const renderSideNews = (page, container) => {
  const fragment = document.createDocumentFragment();

  news[page].sideNews.forEach(({ href, title }) => {
    const linkElement = Utils.createElementWithClass("a", "press-container__sidenews-title");
    linkElement.href = href;
    linkElement.textContent = title;
    fragment.appendChild(linkElement);
  });

  container.appendChild(fragment);
};

const renderNewsContent = (page) => {
  const { headline, pressName } = news[page];
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

const renderListView = async (page) => {
  if (news.length === EMPTY) await initializeNews();
  const categoryTab = renderCategoryTabBlock(page);
  const detailedNews = renderDetailedNews(page);

  listViewPage = page;
  Utils.clearPressTableContent(pressTable, "list");
  Utils.appendChildren(pressTable, [categoryTab, detailedNews]);

  toggleArrowVisibility();
  animateActiveTab();
  initializeStartAutoRender();
};

const renderActiveSubscribedNews = (page) => {
  return `<div class="press-container__active-tab">
    <div class="press-container__progress"></div>
    <div class="press-container__tab-description">
      <div>${subscribedNews[page].pressName}</div>
    </div>
  </div>`;
};

const renderInactiveSubscribedNews = (page) => {
  return `<div class="press-container__tab" index="${page}">${subscribedNews[page].pressName}</div>`;
};

const renderPressTabBlock = (page) => {
  const activeTab = subscribedNews[page];
  const pressTabBlock = Utils.createElementWithClass("div", "press-container__tab-block");

  pressTabBlock.innerHTML = subscribedNews.reduce(
    (acc, cur, index) =>
      acc +
      (cur === activeTab
        ? renderActiveSubscribedNews(index)
        : renderInactiveSubscribedNews(index)),
    ""
  );

  return pressTabBlock;
};

const renderListViewSubscribed = async (page) => {
  if (subscribedNews.length === EMPTY) await updateSubscribedNews();
  const newsPage = findNewsIndex(subscribedNews[page]);
  const pressTab = renderPressTabBlock(page);
  const detailedNews = renderDetailedNews(newsPage);

  subscribedListPage = page;
  Utils.clearPressTableContent(pressTable, "list");
  Utils.appendChildren(pressTable, [pressTab, detailedNews]);

  toggleArrowVisibility();
  animateActiveTab();
  initializeStartAutoRender();
};

const subscribeNews = async (pressName) => {
  const newsToAdd = news.find(
    (newsElement) => newsElement.pressName === pressName
  );

  addNews(newsToAdd, "subscribe");
  renderSubscribeSnackBar(pressTable);
  await updateSubscribedNews();
};

const unsubscribeNews = async (pressName) => {};

const handleViewIconClick = (target) => {
  const viewIcon = target.closest(ST.VIEW_ICON);

  if (viewIcon === gridViewIcon) activateGridView();
  if (viewIcon === listViewIcon) activateListView();
};

const handleTabClick = (target) => {
  const index = Number(target.getAttribute("index"));

  if (Utils.isPressMenuActive(allPressMenu)) renderListView(index);
  if (Utils.isPressMenuActive(subscribedPressMenu)) renderListViewSubscribed(index);
}

const handleSubscribeButton = async (target) => {
  const targetNewsName = target
    .closest(ST.SUBSCRIBE_BUTTON)
    .getAttribute("press-name");
  
  await subscribeNews(targetNewsName);
}

const handleClick = async ({ target }) => {
  if (target.closest(ST.VIEW_ICON)) handleViewIconClick(target);
  if (target.closest(ST.ALL_PRESS)) activateAllPress();
  if (target.closest(ST.SUBSCRIBED_PRESS)) activateSubscribedPress();
  if (target.closest(ST.LEFT_ARROW)) renderPreviousPage();
  if (target.closest(ST.RIGHT_ARROW)) renderNextPage();
  if (target.closes(ST.TAB)) handleTabClick(target);
  if (target.closest(ST.SUBSCRIBE_BUTTON)) await handleSubscribeButton(target);
};

pressContainer.addEventListener("click", await handleClick);

export { activateGridView, updateSubscribedNews };
