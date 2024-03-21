import { renderGridView } from "./GridView.js";
import { renderListView } from "./ListView.js";
import renderNewsTitles from "./NewsTitle.js";
import { renderUnsubscribeAlert } from "./Notification.js";
import {
  Clickable,
  NewsModel,
  Pages,
  RenderUtils,
  ST,
  Subscription,
  TogglePage,
} from "./PressTable.js";

const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";
const PAGE_LOGO_ST = ".top-container__icon";
const ROLLING_DELAY = 5000;
const EMPTY = 0;

const pressContainer = document.querySelector(ST.PRESS_CONTAINER);
const pressTable = document.querySelector(ST.PRESS_TABLE);
const allPressMenu = document.querySelector(ST.ALL_PRESS);
const subscribedPressMenu = document.querySelector(ST.SUBSCRIBED_PRESS);

let rollNewsInInterval = null;

const setPressMenuAsSelected = (pressMenu) => {
  pressMenu.setAttribute("aria-selected", "true");
};

const setPressMenuAsUnselected = (pressMenu) => {
  pressMenu.setAttribute("aria-selected", "false");
};

const activateGridView = () => {
  RenderUtils.fillIcon(Clickable.gridViewIcon, ACTIVE_FILL_PROPERTY);
  RenderUtils.fillIcon(Clickable.listViewIcon, INACTIVE_FILL_PROPERTY);
  if (RenderUtils.isPressMenuActive(allPressMenu))
    renderGridView(Pages.grid, "all");
  if (RenderUtils.isPressMenuActive(subscribedPressMenu))
    renderGridView(Pages.subscribedGrid, "subscribed");
};

const activateListView = () => {
  RenderUtils.fillIcon(Clickable.listViewIcon, ACTIVE_FILL_PROPERTY);
  RenderUtils.fillIcon(Clickable.gridViewIcon, INACTIVE_FILL_PROPERTY);
  if (RenderUtils.isPressMenuActive(allPressMenu))
    renderListView(Pages.list, "all");
  if (RenderUtils.isPressMenuActive(subscribedPressMenu))
    renderListView(Pages.subscribedList, "subscribed");
};

const activateAllPress = () => {
  setPressMenuAsSelected(allPressMenu);
  setPressMenuAsUnselected(subscribedPressMenu);
  if (RenderUtils.isIconActive(Clickable.gridViewIcon))
    renderGridView(Pages.grid, "all");
  if (RenderUtils.isIconActive(Clickable.listViewIcon))
    renderListView(Pages.list, "all");
};

const activateSubscribedPress = () => {
  setPressMenuAsSelected(subscribedPressMenu);
  setPressMenuAsUnselected(allPressMenu);
  if (RenderUtils.isIconActive(Clickable.gridViewIcon))
    renderGridView(Pages.subscribedGrid, "subscribed");
  if (RenderUtils.isIconActive(Clickable.listViewIcon))
    renderListView(Pages.subscribedList, "subscribed");
};

const handlePageReloadClick = () => location.reload();

const hadnleRollingStart = () => {
  if (rollNewsInInterval !== null) {
    clearInterval(rollNewsInInterval);
    rollNewsInInterval = null;
  }
  rollNewsInInterval = setInterval(renderNewsTitles, ROLLING_DELAY);
};

const handleRollingStop = () => clearInterval(rollNewsInInterval);

const handleTabClick = (target) => {
  const index = Number(target.getAttribute("index"));

  if (RenderUtils.isPressMenuActive(allPressMenu)) {
    Pages.list = index;
    renderListView(index, "all");
  }
  if (RenderUtils.isPressMenuActive(subscribedPressMenu)) {
    Pages.subscribedList = index;
    renderListView(index, "subscribed");
  }
};

const handleSubscriptionClick = async (target) => {
  const button = target.closest(ST.SUBSCRIPTION_TOGGLE_BUTTON);
  const subscriptionType = button.getAttribute("data-action");
  const pressName = button.getAttribute("press-name");

  if (subscriptionType === "subscribe")
    await Subscription.subscribeNews(pressName);
  if (subscriptionType === "unsubscribe")
    renderUnsubscribeAlert(pressTable, pressName);
};

const handleUnsubscribeSubmitClick = async (target) => {
  const alert = pressTable.querySelector(ST.UNSUBSCRIBE_ALERT);
  const pressName = target
    .closest(ST.UNSUBSCRIBE_SUBMIT)
    .getAttribute("press-name");

  await Subscription.unsubscribeNews(pressName);
  pressTable.removeChild(alert);
  Pages.subscribedList =
    Pages.subscribedList === 0 ? Pages.subscribedList : --Pages.subscribedList;
  if (NewsModel.subscribedNews.length !== EMPTY)
    RenderUtils.isIconActive(Clickable.gridViewIcon)
      ? renderGridView(Pages.subscribedGrid, "subscribed")
      : renderListView(Pages.subscribedList, "subscribed");
  else activateAllPress();
};

const handleUnsubscribeCancelClick = () => {
  const alert = pressTable.querySelector(ST.UNSUBSCRIBE_ALERT);

  pressTable.removeChild(alert);
};

const handleClick = async ({ target }) => {
  if (target.closest(PAGE_LOGO_ST)) handlePageReloadClick();
  if (target.closest(ST.GRID_VIEW_ICON)) activateGridView();
  if (target.closest(ST.LIST_VIEW_ICON)) activateListView();
  if (target.closest(ST.ALL_PRESS)) activateAllPress();
  if (target.closest(ST.SUBSCRIBED_PRESS)) activateSubscribedPress();
  if (target.closest(ST.LEFT_ARROW)) TogglePage.renderPreviousPage();
  if (target.closest(ST.RIGHT_ARROW)) TogglePage.renderNextPage();
  if (target.closest(ST.TAB)) handleTabClick(target);
  if (target.closest(ST.SUBSCRIPTION_TOGGLE_BUTTON))
    await handleSubscriptionClick(target);
  if (target.closest(ST.UNSUBSCRIBE_SUBMIT))
    await handleUnsubscribeSubmitClick(target);
  if (target.closest(ST.UNSUBSCRIBE_CANCEL)) handleUnsubscribeCancelClick();
};

pressContainer.addEventListener("click", await handleClick);

export {
  hadnleRollingStart,
  handleRollingStop,
  activateGridView,
  activateSubscribedPress,
};
