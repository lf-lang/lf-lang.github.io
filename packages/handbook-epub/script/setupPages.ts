#!/usr/bin/env ts-node

/* With twoslash
   env CI=213 yarn workspace handbook-epub build
*/
import toHAST from "mdast-util-to-hast";
import hastToHTML from "hast-util-to-html";
import rrds from "../../lingua-franca/lib/utils/recursiveReadDirSync.cjs";
const { recursiveReadDirSync } = rrds;

import { readFileSync, lstatSync } from "fs";
import remark from "remark";
import grayMatter from "gray-matter";
const { read: readMarkdownFile } = grayMatter;
import * as lf from "../../documentation/scripts/linguaFrancaUtils.cjs";

import processAST from "lf-syntax-highlighting";

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(dirname(__filename)));

// Reference: https://github.com/AABoyles/LessWrong-Portable/blob/master/build.js

export const generateV2Markdowns = () => {
  const markdowns = new Map<string, ReturnType<typeof readMarkdownFile>>();

  // Grab all the md + yml info from the handbook files on disk
  // and add them to ^
  // prettier-ignore
  const handbookPath = join( __dirname, "..", "..", "documentation", "copy", "en", "topics");

  recursiveReadDirSync(handbookPath).forEach((path) => {
    if (lstatSync(path).isDirectory() || !path.endsWith("md")) {
      return;
    }

    var md = readMarkdownFile(path);
    // prettier-ignore
    if (!md.data.permalink) {
      throw new Error(
        `${path} in the handbook did not have a permalink in the yml header`,
      );
    }
    const id = md.data.permalink;
    markdowns.set(id, md);
  });

  return markdowns;
};

// NOTE: This is used for generating PDF and epub, but not HTML that is displayed.
export const getHTML = async (code: string, settings?: any) => {
  let markdownAST = remark().parse(code);
  markdownAST = await processAST({markdownAST});
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

