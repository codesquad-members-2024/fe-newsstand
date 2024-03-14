import { VISIBILITY } from "../utils/Constants.js";

function controlSwiper(firstPageIdx, lastPageIdx, render) {
	const [left, right] = document.querySelectorAll(".swiper");
	let idx = firstPageIdx;

	left.addEventListener("click", () => {
		if (!idx) idx = firstPageIdx;
		else idx -= 1;
		render(idx);
		controlVisibility(idx, { left, right }, { firstPageIdx, lastPageIdx });
	});
	right.addEventListener("click", () => {
		if (idx > lastPageIdx - 1) idx = lastPageIdx;
		else idx += 1;
		render(idx);
		controlVisibility(idx, { left, right }, { firstPageIdx, lastPageIdx });
	});

	controlVisibility(firstPageIdx, { left, right }, { firstPageIdx, lastPageIdx });
}

function controlVisibility(idx, { left, right }, { firstPageIdx, lastPageIdx }) {
	toggleVisibility(right, VISIBILITY.visible);
	toggleVisibility(left, VISIBILITY.visible);
	if (idx === firstPageIdx) {
		toggleVisibility(left, VISIBILITY.hidden);
		return;
	}
	if (idx === lastPageIdx) {
		toggleVisibility(right, VISIBILITY.hidden);
		return;
	}
}

function toggleVisibility(direction, flag) {
	if (flag === VISIBILITY.hidden) {
		direction.style.visibility = "hidden";
		direction.style.opacity = "0";
		return;
	}
	if (flag === VISIBILITY.visible) {
		direction.style.visibility = "visible";
		direction.style.opacity = "100";
		return;
	}
}

export default controlSwiper;
