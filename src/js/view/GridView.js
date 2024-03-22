import {
  RenderUtils,
  Clickable,
  NewsModel,
  Pages,
  Subscription,
  ST,
  AutoRenderHandler
} from "./PressTable.js";
import Utils from "./Utils.js";

const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;

const pressTable = document.querySelector(ST.PRESS_TABLE);

const toggleArrowVisibility = () => {
  if (RenderUtils.isPressMenuActive(Clickable.subscribedPressMenu)) {
    Utils.updateArrowButtonVisibility(Clickable.leftArrowButton, Pages.subscribedGrid === FIRST_PAGE);
    Utils.updateArrowButtonVisibility(Clickable.rightArrowButton, Pages.subscribedGrid === LAST_PAGE);
    return;
  }

  Utils.updateArrowButtonVisibility(Clickable.leftArrowButton, Pages.grid === FIRST_PAGE);
  Utils.updateArrowButtonVisibility(Clickable.rightArrowButton, Pages.grid === LAST_PAGE);
};

const createLogo = (src, name) => {
  const logo = Utils.createElementWithClass("div", "press-container__logo");
  const image = document.createElement("img");
  const subscriptionToggleButton = Subscription.isSubscribed(name)
    ? Subscription.createUnsubscribeButton(name)
    : Subscription.createSubscribeButton(name);

  image.src = src;
  image.setAttribute("name", name);
  Utils.appendChildren(logo, [image, subscriptionToggleButton]);

  return logo;
};

const createLogosInTable = (table, page) => {
  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const logoIndex = page * LOGO_COUNT_PER_PAGE + index;
    const logo = createLogo(NewsModel.logos[logoIndex].src, NewsModel.logos[logoIndex].name);

    table.appendChild(logo);
  });
};

const createSubscribedLogosInTable = async (table, page) => {
  await Subscription.updateSubscribedNews();

  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const logoIndex = page * LOGO_COUNT_PER_PAGE + index;
    const subscribedNewsPage = NewsModel.subscribedNews[logoIndex];
    const logo =
      subscribedNewsPage !== undefined
        ? createLogo(
            subscribedNewsPage.logoImageSrc,
            subscribedNewsPage.pressName
          )
        : Utils.createElementWithClass("div", "press-container__logo");

    table.appendChild(logo);
  });
};

export const renderGridView = async (page, viewType) => {
  AutoRenderHandler.stop();
  RenderUtils.clearPressTableContent("grid");

  if (viewType === "all") createLogosInTable(pressTable, page);
  if (viewType === "subscribed") await createSubscribedLogosInTable(pressTable, page);
  toggleArrowVisibility();
};
