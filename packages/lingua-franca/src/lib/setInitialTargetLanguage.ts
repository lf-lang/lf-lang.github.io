import { hasLocalStorage } from "./hasLocalStorage";
import { getTargetLanguage, setTargetLanguage } from "./setTargetLanguage";

const defaultTargetLanguage = "c";

export const setInitialTargetLanguage = () => {
  const target:string = getTargetLanguage()
      || (hasLocalStorage && localStorage.getItem("last-selected-target-language"))
      || defaultTargetLanguage;
  setTargetLanguage(target);
  return target;
}
