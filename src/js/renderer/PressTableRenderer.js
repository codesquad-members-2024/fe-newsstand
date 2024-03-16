const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;
const INITIAL_VIEW_PAGE = 0;
const RANDOM_SECTOR = 0.5;
const EMPTY = 0;
const INCREMENT = 1;
const DECREMENT = -1;
const PAGE_TURNING_DELAY = 20000;
const EMPTY_IN_PERCENTAGE = 0;
const FULL_IN_PERCENTAGE = 100;
const FILL_SECTOR = 0.1;

const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";
const NEWS_PATH = "src/data/news.json";
const ST = Object.freeze({
  PRESS_CONTAINER: ".press-container",
  PRESS_TABLE: ".press-container__view",
  VIEW_ICON: ".press-container__view-icon",
  LEFT_ARROW: ".press-container__left-arrow",
  RIGHT_ARROW: ".press-container__right-arrow",
});

const pressContainer = document.querySelector(ST.PRESS_CONTAINER);
const pressTable = document.querySelector(ST.PRESS_TABLE);
const leftArrowButton = document.querySelector(ST.LEFT_ARROW);
const rightArrowButton = document.querySelector(ST.RIGHT_ARROW);

const viewIconNodes = Array.from(document.querySelectorAll(ST.VIEW_ICON));
const viewIcons = viewIconNodes.reduce((icons, icon) => {
  const title = icon.getAttribute("title");
  if (title === "grid-view") icons.gridViewIcon = icon;
  if (title === "list-view") icons.listViewIcon = icon;
  return icons;
}, {});
const { gridViewIcon, listViewIcon } = viewIcons;

const news = [];
const categories = [];

let gridViewPage = INITIAL_VIEW_PAGE;
let listViewPage = INITIAL_VIEW_PAGE;
let logos = [];

let startAutoRender = null;
let fillColorInInterval = null;

const isIconActive = (icon) => {
  const activeValue = icon
    .querySelector("path")
    .attributes.getNamedItem("fill").nodeValue;

  return activeValue === ACTIVE_FILL_PROPERTY;
};

const fillIcon = (icon, fillProperty) => {
  const path = icon.querySelector("path");

  path.setAttribute("fill", fillProperty);
};

const activateGridView = () => {
  fillIcon(gridViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(listViewIcon, INACTIVE_FILL_PROPERTY);
  renderGridView(gridViewPage);
};

const activateListView = () => {
  fillIcon(listViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(gridViewIcon, INACTIVE_FILL_PROPERTY);
  renderListView(listViewPage);
};

const renderPreviousPage = () => {
  if (isIconActive(gridViewIcon)) {
    gridViewPage = gridViewPage > FIRST_PAGE ? --gridViewPage : gridViewPage;
    renderGridView(gridViewPage);
    clearInterval(startAutoRender);
  }
  if (isIconActive(listViewIcon)) {
    listViewPage = listViewPage === INITIAL_VIEW_PAGE ? news.length + DECREMENT : --listViewPage;
    renderListView(listViewPage);
  }
};

const renderNextPage = () => {
  if (isIconActive(gridViewIcon)) {
    gridViewPage = gridViewPage < LAST_PAGE ? ++gridViewPage : gridViewPage;
    renderGridView(gridViewPage);
    clearInterval(startAutoRender);
  }
  if (isIconActive(listViewIcon)) {
    listViewPage = listViewPage === news.length + DECREMENT ? INITIAL_VIEW_PAGE : ++listViewPage;
    renderListView(listViewPage);
  }
};

const shuffle = (array) => {
  const result = array;

  return result.sort(() => Math.random() - RANDOM_SECTOR);
};

const appendChildren = (parent, children) => {
  children.forEach(child => parent.appendChild(child));
}

const initializeNews = async () => {
  const newsList = await fetch(NEWS_PATH).then((response) => response.json());

  news.push(...newsList);
  initializeLogos();
  initializeCategories();
};

const initializeLogos = () => {
  logos = shuffle(
    news.map(({ logoImageSrc: src, pressName: name }) => ({ src, name }))
  );
};

const initializeCategories = () => {
  categories.length = EMPTY;

  const categoryMap = news.reduce((acc, { category }, index) => {
    if (!acc[category]) {
      acc[category] = { categoryName: category, firstIndex: index, count: EMPTY };
    }
    acc[category].count += INCREMENT;
    return acc;
  }, {});

  Object.values(categoryMap).forEach(category => categories.push(category));
};

const initializeStartAutoRender = () => {
  if (startAutoRender !== null) {
    clearInterval(startAutoRender);
    startAutoRender = null;
  }
  startAutoRender = setInterval(renderNextPage, PAGE_TURNING_DELAY);
};

const isInCategoryRange = (category, page) => {
  return (
    category.firstIndex <= page &&
    category.firstIndex + category.count > page
  );
};

const findActiveCategory = (page) => {
  return categories.find((categoryElement) => isInCategoryRange(categoryElement, page));
};

const createSubscribeButton = () => {
  const button = createElementWithClass("button", "press-container__subscribe-button");
  const plusImage = createElementWithClass("img", "press-container__plus-image");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
};

const createLogo = (src, name) => {
  const logo = createElementWithClass("div", "press-container__logo");
  const image = document.createElement("img");
  const subscribeButton = createSubscribeButton();

  image.src = src;
  image.setAttribute("name", name);
  logo.appendChild(image);
  logo.appendChild(subscribeButton);

  return logo;
};

const addImagesIntoTable = (table, page) => {
  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const cellIndex = page * LOGO_COUNT_PER_PAGE + index;
    const logo = createLogo(logos[cellIndex].src, logos[cellIndex].name);

    table.appendChild(logo);
  });
};

const updateArrowButtonVisibility = (button, condition) => {
  button.style.visibility = condition ? "hidden" : "visible";
};

const toggleArrowVisibility = () => {
  const isGridViewActive = isIconActive(gridViewIcon);
  const isListViewActive = isIconActive(listViewIcon);

  if (isGridViewActive) {
    updateArrowButtonVisibility(leftArrowButton, gridViewPage === FIRST_PAGE);
    updateArrowButtonVisibility(rightArrowButton, gridViewPage === LAST_PAGE);
  }
  if (isListViewActive) {
    updateArrowButtonVisibility(leftArrowButton, false);
    updateArrowButtonVisibility(rightArrowButton, false);
  }
};

const renderGridView = async (page) => {
  if (logos.length === EMPTY) await initializeNews();

  pressTable.setAttribute("class", "press-container__view grid");
  pressTable.innerHTML = "";
  addImagesIntoTable(pressTable, page);
  toggleArrowVisibility(page);
};

const renderActiveCategory = (category, page) => {
  return `<div class="press-container__active-category">
    <div class="press-container__progress"></div>
    <div class="press-container__category-description">
      <div>${category.categoryName}</div>
      <div>${page - category.firstIndex + 1} <span style="opacity: 0.7;">/ ${category.count}</span></div>
    </div>
  </div>`;
};

const renderInactiveCategory = (category) => {
  return `<div class="press-container__category">${category.categoryName}</div>`;
};

const animateActiveCategory = () => {
  const activeCategory = document.querySelector(".press-container__progress");
  const intervalSector = FULL_IN_PERCENTAGE / FILL_SECTOR;
  let width = EMPTY_IN_PERCENTAGE;

  const fillColor = () => {
    if (width >= FULL_IN_PERCENTAGE) clearInterval(fillColorInInterval);
    else {
      width += FILL_SECTOR;
      activeCategory.style.width = width + "%";
    }
  };
  if (fillColorInInterval !== null) {
    clearInterval(fillColorInInterval);
    fillColorInInterval = null;
  }
  fillColorInInterval = setInterval(fillColor, PAGE_TURNING_DELAY / intervalSector);
}

const renderCategoryTab = (page) => {
  const activeCategory = findActiveCategory(page);
  const div = createElementWithClass("div", "press-container__category-tab");

  div.innerHTML = categories.reduce(
    (acc, cur) =>
      acc +
      (cur === activeCategory
        ? renderActiveCategory(cur, page)
        : renderInactiveCategory(cur)),
    ""
  );

  return div;
};

const renderNewsInfo = (page) => {
  const newsInfo = createElementWithClass("div", "press-container__news-info");
  const image = document.createElement("img");
  const editedTime = createElementWithClass("span", "press-container__edited-time");
  const subscribeButton = createSubscribeButton();

  image.src = news[page].logoImageSrc;
  editedTime.innerHTML = news[page].editedTime;
  subscribeButton.style.cssText = "display:block; margin-left:16px";
  newsInfo.appendChild(image);
  newsInfo.appendChild(editedTime);
  newsInfo.appendChild(subscribeButton);

  return newsInfo;
};

const renderSideNews = (page, container) => {
  const fragment = document.createDocumentFragment();

  news[page].sideNews.forEach(({ href, title }) => {
    const linkElement = createElementWithClass("a", "press-container__sidenews-title");
    linkElement.href = href;
    linkElement.textContent = title;
    fragment.appendChild(linkElement);
  });

  container.appendChild(fragment);
};

function createElementWithClass(elementType, className) {
  const element = document.createElement(elementType);
  element.setAttribute("class", className);

  return element;
}

const renderNewsContent = (page) => {
  const { headline, pressName } = news[page];
  const container = createElementWithClass("div", "press-container__news-content");
  const headlineContainer = createElementWithClass("div", "press-container__headline");
  const sideNews = createElementWithClass("div", "press-container__sidenews");
  const thumbnail = createElementWithClass("img", "press-container__headline-thumbnail");
  const headlineTitle = createElementWithClass("a", "press-container__headline-title");
  const noteMessage = document.createElement("span");

  thumbnail.src = headline.thumbnailSrc;
  headlineTitle.href = headline.href;
  headlineTitle.innerHTML = headline.title;

  renderSideNews(page, sideNews);
  noteMessage.innerHTML = `${pressName} 언론사에서 직접 편집한 뉴스입니다.`;

  appendChildren(sideNews, [noteMessage]);
  appendChildren(headlineContainer, [thumbnail, headlineTitle]);
  appendChildren(container, [headlineContainer, sideNews]);

  return container;
};

const renderDetailedNews = (page) => {
  const detailedNews = createElementWithClass("div", "press-container__detailed-news");
  const newsInfo = renderNewsInfo(page);
  const newsContents = renderNewsContent(page);

  detailedNews.appendChild(newsInfo);
  detailedNews.appendChild(newsContents);

  return detailedNews;
};

const renderListView = async (page) => {
  if (news.length === EMPTY) await initializeNews();
  const categoryTab = renderCategoryTab(page);
  const detailedNews = renderDetailedNews(page);

  pressTable.setAttribute("class", "press-container__view list");
  pressTable.innerHTML = "";
  pressTable.appendChild(categoryTab);
  pressTable.appendChild(detailedNews);

  toggleArrowVisibility();
  animateActiveCategory();
  initializeStartAutoRender();
};

pressContainer.addEventListener("click", (e) => {
  if (e.target.closest(ST.VIEW_ICON) === gridViewIcon) activateGridView();
  if (e.target.closest(ST.VIEW_ICON) === listViewIcon) activateListView();
  if (e.target.closest(ST.LEFT_ARROW) === leftArrowButton) renderPreviousPage();
  if (e.target.closest(ST.RIGHT_ARROW) === rightArrowButton) renderNextPage();
});

export default activateGridView;
