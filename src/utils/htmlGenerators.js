export function makeInnerBoxesInMain() {
  return `<nav class="category center"></nav>
  <div class="press-info center"></div>
  <div class="news-list flex-space">
      <div class="news-list-left"></div>
      <div class="news-list-right">
          <ul></ul>
      </div>
  </div>`;
}

export function makeCategoryNavHtml(pressData) {
  const selectedCategory = pressData[0].category;
  const selectedCategoryHtml = `<div class="category-list center selected">
  <a href="#" class="category-text">${selectedCategory}</a>
  <div class="progress"></div>
</div>`;
  const restOfCategoryHtml = pressData
    .slice(1, pressData.length)
    .map((pressObj) => {
      return `<div class="category-list center"><a href="#" class="category-text">${pressObj.category}</a></div>`;
    })
    .join("");
  const allCategoriesHtml = selectedCategoryHtml + restOfCategoryHtml;
  return allCategoriesHtml;
}

export function makePressInfoHtml(eachPressObj) {
  const html = `<span><img src="${eachPressObj.brandMark}"></span>
    <span class="edit-date">${eachPressObj.editDate}</span>
    <button class="subs-btn">+ 구독하기</button>`;
  return html;
}

export function makeMainNewsHtml(eachPressObj) {
  const mainNewsData = eachPressObj.mainNews;
  const html = `<div><a href="${mainNewsData.link}"><img src="${mainNewsData.thumb}" alt="thumb"></a></div>
    <a href="${mainNewsData.link}">${mainNewsData.title}</a>`;
  return html;
}

export function makeNewsListHtml(eachPressObj) {
  const newsListDataArr = eachPressObj.newsList;
  let newsListHtml = newsListDataArr
    .map((eachNews) => {
      return `<li><a href="${eachNews.link}">${eachNews.title}</a></li>`;
    })
    .join("");
  newsListHtml += `<div>${eachPressObj.pressName}에서 직접 편집한 뉴스입니다.</div>`;
  return newsListHtml;
}
