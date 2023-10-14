import { hasLocalStorage } from "./hasLocalStorage";

const targetLanguages = ["c", "cpp", "py", "ts", "rs"];

export function getTargetLanguage(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('target')
}

export const setTargetLanguage = (selected: string) => {
  // Despite the following line, setTargetLanguage should still do its job in the browser.
  // See https://github.com/gatsbyjs/gatsby/issues/309 for details.
  if (typeof window === 'undefined') return
  const aliases = target => [`language-lf-${target}`, `lf-${target}`]
  const affectedElements: HTMLElement[] = targetLanguages
    .flatMap(aliases)
    .flatMap(className => Array.from(
      document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>
    ))
  if (!affectedElements.length) return
  console.log("Setting target language to " + selected)
  window.history.replaceState(null, '', `?target=${selected}${window.location.hash}`)
  hasLocalStorage && localStorage.setItem("last-selected-target-language", selected)
  for (const target of targetLanguages) {
    const id = `lf-target-button-${target}`
    const element = document.getElementById(id)
    if (element != null) element.className = target === selected ? "highlight" : ""
  }
  for (const element of affectedElements) {
    element.style.display = aliases(selected).some(s => element.classList.contains(s)) ? "" : "none"
  }
}
