import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { LanguageRegistration, getHighlighter } from "shikiji";
import { targets } from "@site/src/components/LinguaFrancaMultiTargetUtils";
import LFTextMateLanguageDefinition from "./lflang.tmLanguage.json";
import { HighlighterGeneric, BuiltinLanguage, BuiltinTheme } from "shikiji";

declare global {
  interface Window {
    LFWebsite: {
      shikijiInstance?: HighlighterGeneric<BuiltinLanguage, BuiltinTheme>;
    };
  }
}

export const loadShikiji = async () => {
  if (window.LFWebsite?.shikijiInstance != null) {
    return window.LFWebsite.shikijiInstance;
  }
  const shikiji = await getHighlighter({
    themes: ["material-theme-lighter", "material-theme-darker"],
    langs: [
      ...targets,
      // I can't get TS not complain, but trust me bro! It will work......
      LFTextMateLanguageDefinition as unknown as LanguageRegistration,
    ],
  });
  if (window.LFWebsite == null) {
    window.LFWebsite = {};
  }
  window.LFWebsite.shikijiInstance = shikiji;
  return shikiji;
};

if (ExecutionEnvironment.canUseDOM) {
  // As soon as the site loads in the browser, check if a Shikiji instance is created. If not, create one and save to global.

  // Don't catch. Let it throw~ let it throw~
  loadShikiji().then((v) => {
    if (v != null) {
      console.log("Shikiji is loaded.");
    } else {
      throw Error("Shikiji not loaded correctly.");
    }
  });
}
