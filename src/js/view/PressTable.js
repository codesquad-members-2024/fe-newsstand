import { addNews, deleteNews, loadNews } from "../api/NewsApi.js";
import { renderGridView } from "./GridView.js";
import { renderListView } from "./ListView.js";
import { renderSubscribeSnackBar } from "./Notification.js";
import Utils from "./Utils.js";

const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const INITIAL_VIEW_PAGE = 0;
const EMPTY = 0;
const INCREMENT = 1;
const DECREMENT = -1;
const PAGE_TURNING_DELAY = 20000;

const ACTIVE_FILL_PROPERTY = "#4362D0";

export const ST = Object.freeze({
  PRESS_CONTAINER: ".press-container",
  PRESS_TABLE: ".press-container__view",
  ALL_PRESS: ".press-container__all-press",
  SUBSCRIBED_PRESS: ".press-container__subscribed-press",
  GRID_VIEW_ICON: ".press-container__view-icon.grid",
  LIST_VIEW_ICON: ".press-container__view-icon.list",
  LEFT_ARROW: ".press-container__left-arrow",
  RIGHT_ARROW: ".press-container__right-arrow",
  TAB: ".press-container__tab",
  SUBSCRIPTION_TOGGLE_BUTTON: ".press-container__subscription-toggle-button",
  UNSUBSCRIBE_ALERT: ".notification__unsubscribe-alert",
  UNSUBSCRIBE_SUBMIT: ".notification__unsubscribe-submit",
  UNSUBSCRIBE_CANCEL: ".notification__unsubscribe-cancel",
});

export const Clickable = {
  leftArrowButton: document.querySelector(ST.LEFT_ARROW),
  rightArrowButton: document.querySelector(ST.RIGHT_ARROW),
  gridViewIcon: document.querySelector(ST.GRID_VIEW_ICON),
  listViewIcon: document.querySelector(ST.LIST_VIEW_ICON),
  allPressMenu: document.querySelector(ST.ALL_PRESS),
  subscribedPressMenu: document.querySelector(ST.SUBSCRIBED_PRESS),
};

export const Pages = {
  grid: INITIAL_VIEW_PAGE,
  subscribedGrid: INITIAL_VIEW_PAGE,
  list: INITIAL_VIEW_PAGE,
  subscribedList: INITIAL_VIEW_PAGE,
};

export const NewsModel = {
  news: [],
  categories: [],
  subscribedNews: [],
  logos: [],
};

const pressContainer = document.querySelector(ST.PRESS_CONTAINER);

let autoRender = null;

const handleGridViewIconActivePrevious = () => {
  if (RenderUtils.isPressMenuActive(Clickable.allPressMenu)) {
    Pages.grid = Pages.grid > FIRST_PAGE ? Pages.grid + DECREMENT : Pages.grid;
    renderGridView(Pages.grid, "all");
  }
  if (RenderUtils.isPressMenuActive(Clickable.subscribedPressMenu)) {
    Pages.subscribedGrid =
      Pages.subscribedGrid > FIRST_PAGE
        ? Pages.subscribedGrid + DECREMENT
        : Pages.subscribedGrid;
    renderGridView(Pages.subscribedGrid, "subscribed");
  }
};

const handleListViewIconActivePrevious = () => {
  if (RenderUtils.isPressMenuActive(Clickable.allPressMenu)) {
    Pages.list =
      Pages.list > FIRST_PAGE
        ? Pages.list + DECREMENT
        : NewsModel.news.length + DECREMENT;
    renderListView(Pages.list, "all");
  }
  if (RenderUtils.isPressMenuActive(Clickable.subscribedPressMenu)) {
    Pages.subscribedList =
      Pages.subscribedList > FIRST_PAGE
        ? Pages.subscribedList + DECREMENT
        : NewsModel.subscribedNews.length + DECREMENT;
    renderListView(Pages.subscribedList, "subscribed");
  }
};

const handleGridViewIconActiveNext = () => {
  if (RenderUtils.isPressMenuActive(Clickable.allPressMenu)) {
    Pages.grid = Pages.grid < LAST_PAGE ? Pages.grid + INCREMENT : Pages.grid;
    renderGridView(Pages.grid, "all");
  }
  if (RenderUtils.isPressMenuActive(Clickable.subscribedPressMenu)) {
    Pages.subscribedGrid =
      Pages.subscribedGrid < LAST_PAGE
        ? Pages.subscribedGrid + INCREMENT
        : Pages.subscribedGrid;
    renderGridView(Pages.subscribedGrid, "subscribed");
  }
};

const handleListViewIconActiveNext = () => {
  if (RenderUtils.isPressMenuActive(Clickable.allPressMenu)) {
    Pages.list =
      Pages.list === NewsModel.news.length + DECREMENT
        ? INITIAL_VIEW_PAGE
        : Pages.list + INCREMENT;
    renderListView(Pages.list, "all");
  }
  if (RenderUtils.isPressMenuActive(Clickable.subscribedPressMenu)) {
    Pages.subscribedList =
      Pages.subscribedList >= NewsModel.subscribedNews.length + DECREMENT
        ? INITIAL_VIEW_PAGE
        : Pages.subscribedList + INCREMENT;
    renderListView(Pages.subscribedList, "subscribed");
  }
};

export const Setup = {
  async initializeNews() {
    const newsList = await loadNews("news");

    NewsModel.news.push(...newsList);
    this.initializeLogos();
    this.initializeCategories();
  },

  initializeLogos() {
    NewsModel.logos = Utils.shuffle(
      NewsModel.news.map(({ logoImageSrc: src, pressName: name }) => ({
        src,
        name,
      }))
    );
  },

  initializeCategories() {
    NewsModel.categories.length = EMPTY;

    const categoryInfo = NewsModel.news.reduce((acc, { category }, index) => {
      if (!acc[category]) {
        acc[category] = {
          categoryName: category,
          firstIndex: index,
          count: EMPTY,
        };
      }
      acc[category].count += INCREMENT;
      return acc;
    }, {});

    NewsModel.categories.push(...Object.values(categoryInfo));
  },
};

export const Subscription = {
  isSubscribed(name) {
    return NewsModel.subscribedNews.some(({ pressName }) => pressName === name);
  },

  async updateSubscribedNews() {
    NewsModel.subscribedNews.length = EMPTY;
    const loadedSubscribedNews = await loadNews("subscribe");

    NewsModel.subscribedNews.push(...loadedSubscribedNews);
  },

  createSubscribeButton(pressName) {
    const button = Utils.createElementWithClass(
      "button",
      "press-container__subscription-toggle-button"
    );
    const plusImage = Utils.createElementWithClass(
      "img",
      "press-container__plus-image"
    );
    const subscribeText = document.createTextNode("구독하기");

    plusImage.src = "src/img/PlusSymbol.svg";
    button.setAttribute("press-name", pressName);
    button.setAttribute("data-action", "subscribe");
    Utils.appendChildren(button, [plusImage, subscribeText]);

    return button;
  },

  createUnsubscribeButton(pressName) {
    const button = Utils.createElementWithClass(
      "button",
      "press-container__subscription-toggle-button"
    );
    const plusImage = Utils.createElementWithClass(
      "img",
      "press-container__plus-image"
    );

    plusImage.src = "src/img/PlusSymbol.svg";
    button.setAttribute("press-name", pressName);
    button.setAttribute("data-action", "unsubscribe");
    Utils.appendChildren(button, [plusImage]);

    return button;
  },

  async subscribeNews(pressName) {
    const pressTable = document.querySelector(ST.PRESS_TABLE);
    const newsToAdd = NewsModel.news.find(
      (newsElement) => newsElement.pressName === pressName
    );

    await addNews(newsToAdd, "subscribe");
    await renderSubscribeSnackBar(pressTable);
    await this.updateSubscribedNews();
  },

  async unsubscribeNews(pressName) {
    const newsToDelete = NewsModel.subscribedNews.find(
      (newsElement) => newsElement.pressName === pressName
    );

    await deleteNews(newsToDelete.id, "subscribe");
    await this.updateSubscribedNews();
  }
};

export const RenderUtils = {
  isIconActive(icon) {
    const activeValue = icon.querySelector("path").getAttribute("fill");

    return activeValue === ACTIVE_FILL_PROPERTY;
  },

  isPressMenuActive(pressMenu) {
    const activeValue = pressMenu.getAttribute("aria-selected");

    return activeValue === "true";
  },

  fillIcon(icon, fillProperty) {
    const path = icon.querySelector("path");

    path.setAttribute("fill", fillProperty);
  },

  clearPressTableContent(viewType) {
    const pressTable = document.querySelector(ST.PRESS_TABLE);

    pressTable.classList.remove("press-container__view", "list", "grid");
    pressTable.classList.add("press-container__view", viewType);
    pressTable.innerHTML = "";
  },
};

export const TogglePage = {
  renderPreviousPage() {
    if (RenderUtils.isIconActive(Clickable.gridViewIcon)) {
      handleGridViewIconActivePrevious();
    }
    if (RenderUtils.isIconActive(Clickable.listViewIcon)) {
      handleListViewIconActivePrevious();
    }
  },

  renderNextPage() {
    if (RenderUtils.isIconActive(Clickable.gridViewIcon)) {
      handleGridViewIconActiveNext();
    }
    if (RenderUtils.isIconActive(Clickable.listViewIcon)) {
      handleListViewIconActiveNext();
    }
  },
};

export const AutoRenderHandler = {
  start() {
    if (autoRender !== null) {
      clearInterval(autoRender);
      autoRender = null;
    }
    autoRender = setInterval(TogglePage.renderNextPage, PAGE_TURNING_DELAY);
  },

  stop() {
    clearInterval(autoRender);
  }
}