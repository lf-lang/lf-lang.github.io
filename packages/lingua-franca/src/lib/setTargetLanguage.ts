import { hasLocalStorage } from "./hasLocalStorage";

const targetLanguages = ["lf-c", "lf-cpp", "lf-py", "lf-ts", "lf-rs"];

export const setTargetLanguage = (selected) => {
  console.log("Setting target language to " + selected);
  hasLocalStorage && localStorage.setItem("last-selected-target-language", selected)
  for (var target of targetLanguages) {
    for (var element of document.getElementsByClassName('language-' + target)) {
      if (element.classList.contains('language-' + selected)) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
    for (var element of document.getElementsByClassName(target)) {
      if (element.classList.contains(selected)) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    }
  }
}
