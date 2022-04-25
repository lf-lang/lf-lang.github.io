import { hasLocalStorage } from "./hasLocalStorage";

const targetLanguages = ["c", "cpp", "py", "ts", "rs"];

export const setTargetLanguage = (selected) => {
  console.log("Setting target language to " + selected);
  hasLocalStorage && localStorage.setItem("last-selected-target-language", selected)
  for (var target of targetLanguages) {
    for (var element of Array.from(document.getElementsByClassName('language-lf-' + target) as HTMLCollectionOf<HTMLElement>)) {
      if (element.classList.contains('language-' + selected)) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
    for (var element of Array.from(document.getElementsByClassName('lf-' + target) as HTMLCollectionOf<HTMLElement>)) {
      if (element.classList.contains(selected)) {
        element.style.display = "inline";
      } else {
        element.style.display = "none";
      }
    }
  }
}
