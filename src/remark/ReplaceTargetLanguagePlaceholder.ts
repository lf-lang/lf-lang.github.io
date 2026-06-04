import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Parent } from "unist";

const PLACEHOLDER = "$target-language$";

const targetLanguageJsx = {
  type: "mdxJsxTextElement",
  name: "TargetLanguage",
  attributes: [],
  children: [],
  data: { _mdxExplicitJsx: true },
};

/**
 * Replaces legacy `$target-language$` placeholders (from the old handbook
 * preprocessor) with an inline <TargetLanguage /> MDX element.
 */
export const replaceTargetLanguagePlaceholder: Plugin = () => {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (
        index == null ||
        parent == null ||
        !("children" in parent) ||
        typeof node.value !== "string" ||
        !node.value.includes(PLACEHOLDER)
      ) {
        return;
      }

      const parts = node.value.split(PLACEHOLDER);
      const newChildren: Parent["children"] = [];
      parts.forEach((part, i) => {
        if (part.length > 0) {
          newChildren.push({ type: "text", value: part });
        }
        if (i < parts.length - 1) {
          newChildren.push({ ...targetLanguageJsx });
        }
      });

      (parent as Parent).children.splice(index, 1, ...newChildren);
    });
  };
};
