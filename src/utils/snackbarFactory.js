const SNACKBAR_DURATION = 2000;

export function showSnackbar(text) {
  const snackbar = document.querySelector(".snackbar");
  snackbar.textContent = text;
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, SNACKBAR_DURATION);
}
