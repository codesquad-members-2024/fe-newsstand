import { store } from "../../data/store.js";

store.addObserver(renderViewer);
store.addObserver(renderSubsTap);

export function initViewer() {
  const viewerBox = document.querySelector(".viewer");

  viewerBox.addEventListener("click", function (event) {
    if (event.target.classList.contains("viewer-grid")) {
      store.setState({ viewType: "grid" });
      console.log(store.getState());
    } else if (event.target.classList.contains("viewer-list")) {
      store.setState({ viewType: "list" });
      console.log(store.getState());
    }
  });

  // 초기 렌더링 실행
  renderViewer(store.getState());
}

function renderViewer(state) {
  const viewType = state.viewType;
  const gridViewer = document.querySelector(".viewer-grid");
  const listViewer = document.querySelector(".viewer-list");
  if (viewType === "grid") {
    gridViewer.classList.add("on");
    listViewer.classList.remove("on");
  } else if (viewType === "list") {
    listViewer.classList.add("on");
    gridViewer.classList.remove("on");
  }
}

export function initSubsTap() {
  const subsTapBox = document.querySelector(".tap");

  subsTapBox.addEventListener("click", function (event) {
    if (event.target.classList.contains("tap-all")) {
      store.setState({ subsType: "off" });
      console.log(store.getState());
    } else if (event.target.classList.contains("tap-subs")) {
      store.setState({ subsType: "on" });
      console.log(store.getState());
    }
  });

  renderSubsTap(store.getState());
}

function renderSubsTap(state) {
  const subsType = state.subsType;
  const allTap = document.querySelector(".tap-all");
  const subsTap = document.querySelector(".tap-subs");
  if (subsType === "on") {
    subsTap.classList.add("on");
    allTap.classList.remove("on");
  } else if (subsType === "off") {
    allTap.classList.add("on");
    subsTap.classList.remove("on");
  }
}
