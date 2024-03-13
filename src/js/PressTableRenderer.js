const FIRST_PAGE = 0;
const LAST_PAGE = 3;
const LOGO_COUNT_PER_PAGE = 24;
const INITIAL_VIEW_INDEX = 0;
const RANDOM_SECTOR = 0.5;
const NO_ELEMENT = 0;
const ACTIVE_FILL_PROPERTY = "#4362D0";
const INACTIVE_FILL_PROPERTY = "#879298";
const NEWS_PATH = "src/data/news.json";

const pressTable = document.querySelector(".press-container__view");
const leftArrowButton = document.querySelector(".press-container__left-arrow");
const rightArrowButton = document.querySelector(".press-container__right-arrow");
const viewIcons = Array.from(document.querySelectorAll(".press-container__view-icon"));
const gridViewIcon = viewIcons.find((icon) => icon.attributes.getNamedItem("title").nodeValue === "grid-view");
const listViewIcon = viewIcons.find((icon) => icon.attributes.getNamedItem("title").nodeValue === "list-view");
const news = [];
const categories = [];

let gridViewIndex = INITIAL_VIEW_INDEX;
let listViewIndex = INITIAL_VIEW_INDEX;
let logos = [];

const isIconActive = (icon) => {
  const activeValue = icon.querySelector("path").attributes.getNamedItem("fill").nodeValue;

  return activeValue === ACTIVE_FILL_PROPERTY;
}

const fillIcon = (icon, fillProperty) => {
  const path = icon.querySelector("path");

  path.setAttribute("fill", fillProperty);
}

const shuffle = (array) => {
  const result = array

  return result.sort(() => Math.random() - RANDOM_SECTOR);
}

const initializeNews = async () => {
  const newsList = await fetch(NEWS_PATH).then((response) => response.json());

  newsList.forEach((newsElement) => {
    news.push(newsElement);
  });
  initializeLogos();
  initializeCategories();
}

const initializeLogos = () => {
  const logoInfo = news.map((newsElement) => { return { src: newsElement.logoImageSrc, name: newsElement.pressName } });

  logos = shuffle(logoInfo);
}

const initializeCategories = () => {
  const categoryList = news.map((newsElement) => newsElement.category);
  const categoryNames = new Set([]);
  
  categoryList.forEach((category) => {
    categoryNames.add(category);
  });
  categoryNames.forEach((category) => {
    categories.push({ categoryName: category, count:categoryList.filter((name) => name === category).length });
  });
}

const createSubscribeButton = () => {
  const button = document.createElement("button");
  const plusImage = document.createElement("img");
  const subscribeText = document.createTextNode("구독하기");

  plusImage.src = "src/img/PlusSymbol.svg";
  plusImage.style.cssText = "width: 12px; height: 12px; margin-left: -4px; margin-right: 2px";
  
  button.classList.add("press-container__subscribe-button");
  button.appendChild(plusImage);
  button.appendChild(subscribeText);

  return button;
}

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

const renderActiveCategory = (category) => {
  return `<div class="press-container__active-category"><div>${category.categoryName}</div><div>1 / ${category.count}</div></div>`;
}

const renderInactiveCategory = (category) => {
  return `<div class="press-container__category">${category.categoryName}</div>`
}

const renderCategoryTab = (activeCategory) => {
  const div = document.createElement("div");

  div.classList.add("press-container__category-tab");
  div.innerHTML = categories.reduce((acc, cur) => acc + (cur === activeCategory ? renderActiveCategory(cur) : renderInactiveCategory(cur)), "");

  return div;
}

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
}

// ToDo
const renderNewsContent = (index) => {
  const container = document.createElement("div");

  return container;
}

const renderDetailedNews = (index) => {
  const detailedNews = document.createElement("div");
  const newsInfo = renderNewsInfo(index);
  const newsContents = renderNewsContent(index);

  detailedNews.setAttribute("class", "press-container__detailed-news");
  detailedNews.appendChild(newsInfo);
  detailedNews.appendChild(newsContents);

  return detailedNews;
}

const renderListView = async (index) => {
  if (news.length === NO_ELEMENT) await initializeNews();
  const categoryTab = renderCategoryTab(index);
  const detailedNews = renderDetailedNews(index);

  pressTable.setAttribute("class", "press-container__view list");
  pressTable.innerHTML = "";
  pressTable.appendChild(categoryTab);
  pressTable.appendChild(detailedNews);
  
  setVisibilityOfArrowButtons();
}

gridViewIcon.addEventListener("click", () => {
  fillIcon(gridViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(listViewIcon, INACTIVE_FILL_PROPERTY);
  renderGridView();
});
listViewIcon.addEventListener("click", () => {
  fillIcon(listViewIcon, ACTIVE_FILL_PROPERTY);
  fillIcon(gridViewIcon, INACTIVE_FILL_PROPERTY);
  renderListView(listViewIndex);
});

leftArrowButton.addEventListener("click", () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex > FIRST_PAGE ? --gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    listViewIndex = listViewIndex > INITIAL_VIEW_INDEX ? --listViewIndex : listViewIndex;
    renderListView(listViewIndex);
  }
});
rightArrowButton.addEventListener("click", () => {
  if (isIconActive(gridViewIcon)) {
    gridViewIndex = gridViewIndex < LAST_PAGE ? ++gridViewIndex : gridViewIndex;
    renderGridView();
  }
  if (isIconActive(listViewIcon)) {
    listViewIndex = listViewIndex < news.length - 1 ? ++listViewIndex : listViewIndex; 
    renderListView(listViewIndex);
  }
});

export default renderGridView;
