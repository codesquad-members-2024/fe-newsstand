let currentPage = 1;
let totalPage = 81;

export function switchToListByViewer() {
  const listViewer = document.querySelector(".viewer-list");
  const girdViewer = document.querySelector(".viewer-grid");
  const listWrap = document.querySelector(".press-list-wrap");
  const gridWrap = document.querySelector(".press-grid-wrap");

  listViewer.addEventListener("click", (event) => {
    listViewer.classList.add("on");
    girdViewer.classList.remove("on");
    listWrap.classList.remove("display-none");
    gridWrap.classList.add("display-none");
  });
}

function initPressListView() {
  //초기 pressListView 화면 보여주기
}

function loadAndSetNewsPages() {
  // 상황1. 페이지 끝까지 도달한 경우 2. category nav를 클릭한 경우
  //카테고리에 따른 데이터 불러오기
  //데이터에 따른 페이지 설정
}

function renderPagesByCategory() {
  //다음 또는 이전 버튼을 눌렀을 때
  //20초가 지난 경우
}
