import { SelectHTMLAttributes } from "react";
import { hasLocalStorage } from "./hasLocalStorage";
import { setTargetLanguage } from "./setTargetLanguage";

const defaultTargetLanguage = "lfc";

export const setInitialTargetLanguage = () => {
  var lang:string = (hasLocalStorage && localStorage.getItem("last-selected-target-language")) 
      || defaultTargetLanguage;
  console.log("Setting initial target language to " + lang);

  if (lang != defaultTargetLanguage) {
      let selector = document.getElementById("targetSelector") as any;
      console.log("************* selector: " + selector);
      if (selector != null) selector.value = lang;
      setTargetLanguage(lang);
  }
}
