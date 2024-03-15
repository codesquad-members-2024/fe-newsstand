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

  let html = "";
  newsListDataArr.forEach((eachNews) => {
    html += `<li><a href="${eachNews.link}">${eachNews.title}</a></li>`;
  });
  html += `<div>${eachPressObj.pressName}에서 직접 편집한 뉴스입니다.</div>`;
  return html;
}
