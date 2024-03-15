const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;
const INITIAL_VIEW_INDEX = 0;
const RANDOM_SECTOR = 0.5;
const NO_ELEMENT = 0;
const DECREMENT = -1;
const PAGE_TURNING_DELAY = 20000;
const EMPTY_IN_PERCENTAGE = 0;
const FULL_IN_PERCENTAGE = 100;
const FILL_SECTOR = 0.1;

const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";
const NEWS_PATH = "src/data/news.json";

const pressContainer = document.querySelector(".press-container");
const pressTable = document.querySelector(".press-container__view");
const leftArrowButton = document.querySelector(".press-container__left-arrow");
const rightArrowButton = document.querySelector(".press-container__right-arrow");

const viewIconNodes = Array.from(document.querySelectorAll(".press-container__view-icon"));
const viewIcons = viewIconNodes.reduce((icons, icon) => {
  const title = icon.getAttribute("title");
  if (title === "grid-view") icons.gridViewIcon = icon;
  if (title === "list-view") icons.listViewIcon = icon;
  return icons;
}, {});
const { gridViewIcon, listViewIcon } = viewIcons;

const news = [];
const categories = [];

let gridViewIndex = INITIAL_VIEW_INDEX;
let listViewIndex = INITIAL_VIEW_INDEX;
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
  renderGridView();
};

const activateListView = () => {
  fillIcon(listViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(gridViewIcon, INACTIVE_FILL_PROPERTY);
  renderListView(listViewIndex);
};

const renderPreviousPage = () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex > FIRST_PAGE ? --gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    listViewIndex = listViewIndex === INITIAL_VIEW_INDEX ? news.length + DECREMENT : --listViewIndex;
    renderListView(listViewIndex);
  }
};

const renderNextPage = () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex < LAST_PAGE ? ++gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    listViewIndex = listViewIndex === news.length + DECREMENT ? INITIAL_VIEW_INDEX : ++listViewIndex; 
    renderListView(listViewIndex);
  }
};

const shuffle = (array) => {
  const result = array;

  return result.sort(() => Math.random() - RANDOM_SECTOR);
};

const initializeNews = async () => {
  const newsList = await fetch(NEWS_PATH).then((response) => response.json());

  newsList.forEach((newsElement) => {
    news.push(newsElement);
  });
  initializeLogos();
  initializeCategories();
};

const initializeLogos = () => {
  const logoInfo = news.map((newsElement) => {
    return { src: newsElement.logoImageSrc, name: newsElement.pressName };
  });

  logos = shuffle(logoInfo);
};

const initializeCategories = () => {
  const categoryList = news.map((newsElement) => newsElement.category);
  const categoryNames = new Set([]);

  categoryList.forEach((category) => categoryNames.add(category));
  categoryNames.forEach((category) =>
    categories.push({
      categoryName: category,
      firstIndex: categoryList.findIndex((name) => name === category),
      count: categoryList.filter((name) => name === category).length,
    }));
};

const initializeStartAutoRender = () => {
  if ( startAutoRender !== null ) {
    clearInterval(startAutoRender);
    startAutoRender = null;
  }
  startAutoRender = setInterval(renderNextPage, PAGE_TURNING_DELAY);
}

const isInCategoryRange = (category, index) => {
  return category.firstIndex <= index && category.firstIndex + category.count > index;
}

const findActiveCategory = (index) => {
  return categories.find((categoryElement) => isInCategoryRange(categoryElement, index));
}

const createSubscribeButton = () => {
  const button = document.createElement("button");
  const plusImage = document.createElement("img");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  plusImage.style.cssText =
    "width: 12px; height: 12px; margin-left: -4px; margin-right: 2px";

  button.classList.add("press-container__subscribe-button");
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
};

const addImagesIntoTable = (table) => {
  Array.from({ length: LOGO_COUNT_PER_PAGE }).forEach((_, index) => {
    const newDivTag = document.createElement("div");
    const newImageTag = document.createElement("img");
    const subscribeButton = createSubscribeButton();
    const cellIndex = gridViewIndex * LOGO_COUNT_PER_PAGE + index;

    newImageTag.setAttribute("src", logos[cellIndex].src);
    newImageTag.setAttribute("name", logos[cellIndex].name);
    newDivTag.classList.add("press-container__logo");
    newDivTag.appendChild(newImageTag);
    newDivTag.appendChild(subscribeButton);

    table.appendChild(newDivTag);
  });
};

const setVisibilityOfArrowButtons = () => {
  if (isIconActive(gridViewIcon)) {
    leftArrowButton.style.visibility = gridViewIndex === FIRST_PAGE ? "hidden" : "visible";
    rightArrowButton.style.visibility = gridViewIndex === LAST_PAGE ? "hidden" : "visible";
  }
  if (isIconActive(listViewIcon)) {
    leftArrowButton.style.visibility = "visible";
    rightArrowButton.style.visibility = "visible";
  }
};

const renderGridView = async () => {
  if (logos.length === NO_ELEMENT) await initializeNews();

  pressTable.setAttribute("class", "press-container__view grid");
  pressTable.innerHTML = "";
  addImagesIntoTable(pressTable);
  setVisibilityOfArrowButtons();
};

const renderActiveCategory = (category, index) => {
  return `<div class="press-container__active-category">
    <div class="press-container__progress-bar">
      <div>
        <div class="press-container__progress"></div>
        <div class="press-container__category-description">
          <div>${category.categoryName}</div>
          <div>${index - category.firstIndex + 1} <span style="opacity: 0.7;">/ ${category.count}</span></div>
        </div>
      </div>
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
  }
  if (fillColorInInterval !== null) {
    clearInterval(fillColorInInterval);
    fillColorInInterval = null;
  }
  fillColorInInterval = setInterval(fillColor, PAGE_TURNING_DELAY / intervalSector);
}

const renderCategoryTab = (index) => {
  const activeCategory = findActiveCategory(index);
  const div = document.createElement("div");

  div.classList.add("press-container__category-tab");
  div.innerHTML = categories.reduce(
    (acc, cur) =>
      acc +
      (cur === activeCategory
        ? renderActiveCategory(cur, index)
        : renderInactiveCategory(cur)),
    ""
  );

  return div;
};

const renderNewsInfo = (index) => {
  const newsInfo = document.createElement("div");
  const image = document.createElement("img");
  const editedTime = document.createElement("span");
  const subscribeButton = createSubscribeButton();

  newsInfo.classList.add("press-container__news-info");
  editedTime.classList.add("press-container__edited-time");
  image.setAttribute("src", news[index].logoImageSrc);
  editedTime.innerHTML = news[index].editedTime;
  subscribeButton.style.cssText = "display:block; margin-left:16px";
  newsInfo.appendChild(image);
  newsInfo.appendChild(editedTime);
  newsInfo.appendChild(subscribeButton);

  return newsInfo;
};

const renderSideNews = (index, element) => {
  news[index].sideNews.forEach((newsElement) => {
    const title = document.createElement("a");

    title.setAttribute("class", "press-container__sidenews-title");
    title.setAttribute("href", newsElement.href);
    title.innerHTML = newsElement.title;
    element.appendChild(title);
  });
};

function createElementWithClass(elementType, className) {
  const element = document.createElement(elementType);
  element.setAttribute("class", className);
  return element;
}

const renderNewsContent = (index) => {
  const container = createElementWithClass("div", "press-container__news-content");
  const headline = createElementWithClass("div", "press-container__headline");
  const sideNews = createElementWithClass("div", "press-container__sidenews");
  const thumbnail = createElementWithClass("img", "press-container__headline-thumbnail");
  const headlineTitle = createElementWithClass("a", "press-container__headline-title");
  const noteMessage = document.createElement("span");

  thumbnail.setAttribute("src", news[index].headline.thumbnailSrc);
  thumbnail.setAttribute("href", news[index].headline.href);
  headlineTitle.innerHTML = news[index].headline.title;
  headlineTitle.setAttribute("href", news[index].headline.href);

  renderSideNews(index, sideNews);
  
  noteMessage.innerHTML = `${news[index].pressName} 언론사에서 직접 편집한 뉴스입니다.`;
  sideNews.appendChild(noteMessage);
  headline.appendChild(thumbnail);
  headline.appendChild(headlineTitle);
  container.appendChild(headline);
  container.appendChild(sideNews);

  return container;
};

const renderDetailedNews = (index) => {
  const detailedNews = document.createElement("div");
  const newsInfo = renderNewsInfo(index);
  const newsContents = renderNewsContent(index);

  detailedNews.setAttribute("class", "press-container__detailed-news");
  detailedNews.appendChild(newsInfo);
  detailedNews.appendChild(newsContents);

  return detailedNews;
};

const renderListView = async (index) => {
  if (news.length === NO_ELEMENT) await initializeNews();
  const categoryTab = renderCategoryTab(index);
  const detailedNews = renderDetailedNews(index);

  pressTable.setAttribute("class", "press-container__view list");
  pressTable.innerHTML = "";
  pressTable.appendChild(categoryTab);
  pressTable.appendChild(detailedNews);

  setVisibilityOfArrowButtons();
  animateActiveCategory();
  initializeStartAutoRender();
};

pressContainer.addEventListener("click", (e) => {
  if (e.target === gridViewIcon) activateGridView();
  if (e.target === listViewIcon) activateListView();
  if (e.target === leftArrowButton) renderPreviousPage();
  if (e.target === rightArrowButton) renderNextPage();
});

export default activateGridView;
