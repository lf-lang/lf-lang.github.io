import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { LanguageRegistration, getHighlighter } from "shiki";
import LFTextMateLanguageDefinition from "./lflang.tmLanguage.json";
import { HighlighterGeneric, BuiltinLanguage, BuiltinTheme } from "shiki";

declare global {
  interface Window {
    LFWebsite: {
      shikijiInstance?: HighlighterGeneric<BuiltinLanguage, BuiltinTheme>;
    };
  }
}

export const loadShiki = async () => {
  if (window.LFWebsite?.shikijiInstance != null) {
    return window.LFWebsite.shikijiInstance;
  }
  const shiki = await getHighlighter({
    themes: ["material-theme-lighter", "material-theme-darker"],
    langs: [
      LFTextMateLanguageDefinition as unknown as LanguageRegistration,
    ],
  });
  if (window.LFWebsite == null) {
    window.LFWebsite = {};
  }
  window.LFWebsite.shikijiInstance = shiki;
  return shiki;
};

if (ExecutionEnvironment.canUseDOM) {
  // As soon as the site loads in the browser, check if a Shikiji instance is created. If not, create one and save to global.

  // Don't catch. Let it throw~ let it throw~
  loadShiki().then((v) => {
    if (v != null) {
      console.log("Shiki loaded.");
    } else {
      throw Error("Shiki did loaded correctly.");
    }
  });
}
