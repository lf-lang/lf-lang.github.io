import { useEffect, useState } from "react";
import { HighlighterGeneric, BuiltinLanguage, BuiltinTheme } from "shikiji";
import { loadShikiji } from "./shikijiloader";
import { useColorMode } from "@docusaurus/theme-common";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

declare global {
  interface Window {
    LFWebsite: {
      shikijiInstance?: HighlighterGeneric<BuiltinLanguage, BuiltinTheme>;
    };
  }
}

export const ShikijiLFHighlighter = ({
  children,
  ...props
}: { children: string } & Record<string, unknown>) => {
  // This is more robust than useIsBrowser; the latter sometimes cannot handle ``` codeblocks.
  const isBrowser = ExecutionEnvironment.canUseDOM;
  const { colorMode, setColorMode } = useColorMode();
  // Sadly we only do highlighting in browser......
  // Show unhighlighted code first for SEO???
  const [code, setCode] = useState(`<div>${children}</div>`);

  // React cannot handle short-circuiting, so we'll have to put this outside of the if below.
  // You can try moving it in but you will discover https://stackoverflow.com/a/57931828/22274983
  useEffect(() => {
    (async () => {
      if (!isBrowser) return;
      const shiki = await loadShikiji();
      setCode(
        shiki.codeToHtml(children, {
          lang: "Lingua Franca",
          theme:
            colorMode === "light"
              ? "material-theme-lighter"
              : "material-theme-darker",
        }),
      );
    })();
  }, [colorMode]);

  if (isBrowser) {
    return <div dangerouslySetInnerHTML={{ __html: code }} />;
  } else {
    return <div>{children}</div>;
  }
};
