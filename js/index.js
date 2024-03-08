const PAGE = {
  gridPage: 1,
  contentsPerPage: 24,
  contentsNumberOfPage: 4,
  numberOfHeadLineSection: 2,
};

function headLineCreate() {
  let navHtml = '';
  for (let index = 0; index < PAGE.numberOfHeadLineSection; index++) {
    navHtml += `<div class="nav-contents-container">
      <div class="nav-contents-press-name">연합 뉴스</div>
      <div class="nav-contents-headline">'면허정지'에도 꿈쩍않는 전공의…대학들은 "2천명 이상 증...</div>
    </div>`;
  }
  const target = document.getElementById('nav-container');
  target.innerHTML = navHtml;
}

async function dataShuffle(jsonArray) {
  returnjsonArray.sort(() => Math.random() - 0.5);
}

/** 랜덤한 언론사 데이터를 페이지 별로 나누기 */
async function shuffleAndDivideByPage() {
  const jsonArray = await readJsonFile('pressData');
  const jsonShuffleData = await dataShuffle(jsonArray);

  let jsonArrPerPage = [];

  for (let i = 0; i < jsonShuffleData.length; i += PAGE.contentsPerPage) {
    let dataPerPage = jsonShuffleData.slice(i, i + PAGE.contentsPerPage);
    if (jsonArrPerPage.length >= 4) {
      return jsonArrPerPage;
    }
    jsonArrPerPage.push(dataPerPage);
  }

  return jsonArrPerPage;
}

function arrowHandlingByPage() {
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');
  if (PAGE.gridPage === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (PAGE.gridPage === PAGE.contentsNumberOfPage) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
}

/** */
async function pressLogoCreate() {
  arrowHandlingByPage();
  let mainNewsHtml = '';
  let jsonArrPerPage = await shuffleAndDivideByPage();

  for (pressObj of jsonArrPerPage[PAGE.gridPage - 1]) {
    mainNewsHtml += `<li>
      <a href="#" class="media-subscription-news-view">
      <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="news_logo" />
      </a>
      </li>`;
  }

  const target = document.getElementById('press-logo-container');
  target.innerHTML = mainNewsHtml;
}

/** json데이터 fetch */
async function readJsonFile(fileName) {
  const filePath = `./${fileName}.json`;
  const response = await fetch(filePath);
  const jsonData = await response.json();

  return jsonData; //object (json)
}

async function headlineNewsCreate() {
  const jsonData = await readJsonFile('headlinesData');
  // const obj = JSON.parse(jsonData); //JSON.parse(): JSON 문자열을 JavaScript 객체로 변환(jsonData는 이미 객체임)
}

function pageClick(event) {
  let page = PAGE.gridPage;
  let target = event.target;

  // id가 없을 경우
  if (target.id !== null || target.id === '') {
    target = target.parentNode;
  }

  if (target.id === 'angle-right') {
    if (PAGE.gridPage === PAGE.contentsNumberOfPage) return;
    PAGE.gridPage++;
  }

  if (target.id === 'angle-left') {
    if (PAGE.gridPage === 0) return;
    PAGE.gridPage--;
  }

  pressLogoCreate();
}

function clickEvents() {
  const angleRight = document.getElementById('angle-right');
  const angleLeft = document.getElementById('angle-left');

  angleRight.addEventListener('click', (event) => pageClick(event));
  angleLeft.addEventListener('click', (event) => pageClick(event));
}

/** 날짜 */
function dateCreate() {
  const date = new Date();
  const today = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(date);

  document.getElementById('header-date').innerHTML = today;
}

dateCreate();
headLineCreate();
pressLogoCreate();
headlineNewsCreate();
clickEvents();
