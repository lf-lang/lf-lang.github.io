import { hasLocalStorage } from "./hasLocalStorage";

const targetLanguages = ["c", "cpp", "py", "ts", "rs"];

export function getTargetLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('target')
}

export const setTargetLanguage = (selected: string) => {
  // Despite the following line, setTargetLanguage should still do its job in the browser.
  // See https://github.com/gatsbyjs/gatsby/issues/309 for details.
  if (typeof window === 'undefined') return;
  console.log("Setting target language to " + selected);
  window.history.replaceState(null, '', `?target=${selected}`);
  hasLocalStorage && localStorage.setItem("last-selected-target-language", selected)
  for (const target of targetLanguages) {
    const id = `lf-target-button-${target}`;
    const element = document.getElementById(id);
    if (element != null) element.className = target === selected ? "highlight" : ""
  }
  for (var target of targetLanguages) {
    for (var element of Array.from(document.getElementsByClassName('language-lf-' + target) as HTMLCollectionOf<HTMLElement>)) {
      if (element.classList.contains('language-lf-' + selected)) {
        element.style.display = "";
      } else {
        element.style.display = "none";
      }
    }
    for (var element of Array.from(document.getElementsByClassName('lf-' + target) as HTMLCollectionOf<HTMLElement>)) {
      if (element.classList.contains("lf-" + selected)) {
        element.style.display = "";
      } else {
        element.style.display = "none";
      }
    }
  }
}
