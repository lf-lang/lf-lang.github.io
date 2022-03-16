#!/usr/bin/env ts-node

/* With twoslash
   env CI=213 yarn workspace handbook-epub build
*/
const toHAST = require(`mdast-util-to-hast`);
const hastToHTML = require(`hast-util-to-html`);
const {
  recursiveReadDirSync,
} = require("../../lingua-franca/lib/utils/recursiveReadDirSync");

import { readFileSync, lstatSync } from "fs";
const remark = require("remark");
import { join } from "path";
import { read as readMarkdownFile } from "gray-matter";
var lf = require("../../documentation/scripts/linguaFrancaUtils");

// Reference: https://github.com/AABoyles/LessWrong-Portable/blob/master/build.js

export const generateV2Markdowns = () => {
  const markdowns = new Map<string, ReturnType<typeof readMarkdownFile>>();

  // Grab all the md + yml info from the handbook files on disk
  // and add them to ^
  // prettier-ignore
  const handbookPath = join( __dirname, "..", "..", "documentation", "copy", "en", "topics");

  recursiveReadDirSync(handbookPath).forEach((path) => {
    const filePath = join(__dirname, "..", "..", path);
    if (lstatSync(filePath).isDirectory() || !filePath.endsWith("md")) {
      return;
    }

    const md = readMarkdownFile(filePath);
    // prettier-ignore
    if (!md.data.permalink) {
      throw new Error(
        `${filePath} in the handbook did not have a permalink in the yml header`,
      );
    }
    const id = md.data.permalink;
    markdowns.set(id, md);
  });

  return markdowns;
};

// NOTE: This is used for generating PDF and epub, but not HTML that is displayed.
export const getHTML = async (code: string, settings?: any) => {
  const markdownAST: Node = remark().parse(code);

  const hAST = toHAST(markdownAST, { allowDangerousHtml: true });
  const html = hastToHTML(hAST, { allowDangerousHtml: true });
  return lf.postProcessHTML(html);
};

export function replaceAllInString(_str: string, obj: any) {
  let str = _str;

  Object.keys(obj).forEach((before) => {
    str = str.replace(new RegExp(before, "g"), obj[before]);
  });
  return str;
}

export const getGitSHA = () => {
  const gitRoot = join(__dirname, "..", "..", "..", ".git");
  const rev = readFileSync(join(gitRoot, "HEAD"), "utf8").trim();
  if (rev.indexOf(":") === -1) {
    return rev;
  } else {
    return readFileSync(join(gitRoot, rev.substring(5)), "utf8");
  }
};

