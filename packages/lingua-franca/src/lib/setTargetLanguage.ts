import { hasLocalStorage } from "./hasLocalStorage";

const targetLanguages = ["lfc", "lfcpp", "lfpython", "lfts", "lfrust"];
const defaultTargetLanguage = "lfc";

export const setTargetLanguage = (selected) => {
  console.log("Setting target language to " + selected);
  hasLocalStorage && localStorage.setItem("last-selected-target-language", selected)
  var list = targetLanguages;
  var show = new Set();
  for (var target of list) {
    // console.log(target)
    for (var element of document.getElementsByClassName('language-' + target)) {
      // console.log(element)
      if (selected == target || show.has(element)) {
        element.style.display = "block";
        show.add(element);
      } else {
        element.style.display = "none";
      }
    }
    for (var element of document.getElementsByClassName(target)) {
      // console.log(element)
      if (selected == target || show.has(element)) {
        element.style.display = "inline";
        show.add(element);
      } else {
        element.style.display = "none";
      }
    }
  }
}
