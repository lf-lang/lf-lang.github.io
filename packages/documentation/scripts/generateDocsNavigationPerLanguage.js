// @ts-check
// prettier-ignore
const { readdirSync, statSync, existsSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { format } = require("prettier");
const { enRoot, getFilePaths } = require("./generateTypesForFilesInDocs");
const { read: readMarkdownFile } = require("gray-matter");

// This file is the definitive sidebar navigation source. It takes either:
//
// a  { file: 'path; }
// a  { href: "url" title: "Button title", oneliner: "some info" }
// or { title: "Button title", items: SubItems }
//
// For files we use the same language lookup system the rest of the site uses,
// to leave titles, hrefs etc to be done on the document itself

// The results are a generated TS function in put into the file:
// packages/lingua-franca/src/lib/documentationNavigation.ts
// where it's used in the website / epub / etc
//

/* 
  Run this after any changes to propagate:
     yarn workspace documentation create-handbook-nav
*/

/** @type {HandbookNavItem[]} */
// prettier-ignore
const handbookPages = [
  {
    title: "Topics",
    summary: "A great first read for your daily Lingua Franca work.",
    chronological: true,
    items: [
      { file: "topics/Overview.md" },
      { file: "topics/Tutorial.md" },
      {
        title: "Writing Reactors",
        chronological: true,
        items: [
            { file: "topics/Getting Started.md" },
            { file: "topics/Composing Reactors.md" },
        ],
      },
      {
        title: "Tooling",
        chronological: true,
        items: [
            { file: "topics/Code Plugin.md"},
            { file: "topics/Epoch IDE.md"},
            { file: "topics/Command Line Tools.md" },
            { file: "topics/Setup for C.md" },
            { file: "topics/Setup for Cpp.md" },
            { file: "topics/Setup for Python.md" },
            { file: "topics/Setup for TypeScript.md" },
            { file: "topics/Setup for Rust.md" },
        ],
      },
      {
        title: "Reference",
        chronological: true,
        items: [
            { file: "topics/Target Specification.md" },
        ],
      },
      {
        title: "Language Specification",
        chronological: true,
        items: [
          { file: "topics/language-specification/Language Specification.md" },
          { file: "topics/language-specification/Multiports and Banks.md" },
        ]
      },
      {
        title: "Downloading and Building",
        chronological: true,
        items: [
          { file: "topics/download-and-build/Downloading and Building.md" },
          { file: "topics/download-and-build/Developer Eclipse Setup with Oomph.md" },
          { file: "topics/download-and-build/Developer IntelliJ Setup (for Kotlin).md" },
        ]
      },
      { file: "topics/Writing Reactors in C.md" },
      { file: "topics/Writing Reactors in C++.md" },
      { file: "topics/Writing Reactors in TypeScript.md" },
      { file: "topics/Writing Reactors in Python.md" },
      { file: "topics/Regression Tests.md" },
      { file: "topics/Contributing.md" },
    ],
  },
  {
    title: "Preliminary Development",
    summary: "Capabilities Under Development",
    items: [
      { file: "preliminary/Distributed Execution.md" },
      { file: "preliminary/Import System.md" },
      { file: "preliminary/Tracing.md" },
      { file: "preliminary/Containerized Execution.md" },
      { file: "preliminary/Generic Types, Interfaces, and Inheritance.md" },
      { file: "preliminary/Target-Supported Features.md" },
      { file: "preliminary/Writing Reactors in Rust (WIP).md" },
    ],
  },
  {
    title: "Less Developed Topics",
    summary: "Less Developed Topics in Progress",
    items: [
      { file: "less-developed/Running Benchmarks.md" },
      { file: "less-developed/Tools.md" },
      { file: "less-developed/Timing Analysis.md" },
      { file: "less-developed/Related Work.md" },
      { file: "less-developed/Future Proof Package and Import System.md" },
      { file: "less-developed/RFC Modal Models (first draft).md" },
    ],
  },
  
]

const copyPath = join(__dirname, "..", "copy");
const langs = readdirSync(copyPath).filter((f) =>
  statSync(join(copyPath, f)).isDirectory()
);

/** @type { Record<string, Map<string, import("gray-matter").GrayMatterFile<string>>> }>} */
const langInfo = {};

// Fill up a series of sets of language Maps which have the markdown info available in
for (const lang of langs) {
  const langMap = new Map();
  langInfo[lang] = langMap;

  const allEnPages = getFilePaths(enRoot);
  for (const page of allEnPages) {
    const relativeToLangPath = page.replace(enRoot, "");
    const localPage = join(copyPath, lang + relativeToLangPath);
    if (existsSync(localPage)) {
      const info = readMarkdownFile(localPage);
      if (lang !== "en") {
        validateNonEnglishMarkdownFile(info, lang, localPage);
      }
      validateMarkdownFile(info, localPage);
      // Looks like: path/to/file.md
      langMap.set(relativeToLangPath.slice(1).replace(/\\/g, "/"), info);
    }
  }
}

const codeForTheHandbook = [
  `
export function getDocumentationNavForLanguage(langRequest: string): SidebarNavItem[] {
  const langs = ['${langs.join("', '")}']
  const lang = langs.includes(langRequest) ? langRequest : "en"
  const navigations: Record<string, SidebarNavItem[]> = {} 
`,
];

for (const lang of langs) {
  codeForTheHandbook.push(`navigations.${lang} = [`);

  handbookPages.forEach((section, sectionIndex) => {
    // Section metadata:
    codeForTheHandbook.push(`{ 
      title: "${section.title}",
      oneline: "${section.summary}",
      id: "${section.title.toLowerCase().replace(/\s/g, "-")}",
      chronological: ${section.chronological || false},
    `);

    /** @param {{ items?: HandbookNavSubItem[] }} itemable */
    function addItems(itemable) {
      // Lots of 2nd level navs dont have subnav, bail for them
      if ("items" in itemable === false) return;

      codeForTheHandbook.push("items: [");
      for (const subItem of itemable.items) {
        codeForTheHandbook.push(`{ `);

        // Is it a special link?
        if ("href" in subItem) {
          codeForTheHandbook.push(`
        title: "${subItem.title}",
        id: "${toID(sectionIndex, subItem.title)}",
        permalink: "${subItem.href}",
        oneline: "${subItem.oneliner}"
      },`);
        } else if ("items" in subItem) {
          //Is is a sub-sub-section?
          codeForTheHandbook.push(`
            title: "${subItem.title}",
            id: "${toID(sectionIndex, subItem.title)}",
            oneline: "${subItem.oneliner}",
            chronological: ${subItem.chronological || false},
          `);
          addItems(subItem);
          codeForTheHandbook.push(",");
        } else if ("file" in subItem) {
          // It's a file reference
          const subNavInfo =
            langInfo[lang].get(subItem.file) ||
            langInfo["en"].get(subItem.file);

          if (!subNavInfo) throwForUnfoundFile(subItem, lang, langInfo["en"]);

          codeForTheHandbook.push(`
            title: "${subNavInfo.data.short || subNavInfo.data.title}",
            id: "${toID(sectionIndex, subNavInfo.data.title)}",
            permalink: "${subNavInfo.data.permalink}",
            oneline: "${subNavInfo.data.oneline}",
          `);

          const isLast =
            itemable.items.indexOf(subItem) === itemable.items.length - 1;
          const suffix = isLast ? "" : ",";
          codeForTheHandbook.push(`}${suffix} `);
        }
      }
      // closes the outer 'items'
      codeForTheHandbook.push("]\n }");
    }

    // Set up the 1st level of recursion for the 2nd level items
    addItems(section);

    // close subnav items
    const isLast = handbookPages.indexOf(section) === section.items.length - 1;
    const suffix = isLast ? "," : ",";
    codeForTheHandbook.push(`${suffix}`);
  });
  // close sections
  codeForTheHandbook.push(`]`);
}

codeForTheHandbook.push(`
  return navigations[lang]
}`);

// prettier-ignore
const pathToFileWeEdit = join(__dirname, "..", "..", "lingua-franca", "src", "lib", "documentationNavigation.ts");
const startMarker = "/** ---INSERT--- */";
const endMarker = "/** ---INSERT-END--- */";
const oldCode = readFileSync(pathToFileWeEdit, "utf8");
const newCode =
  oldCode.split(startMarker)[0] +
  startMarker +
  "\n\n" +
  codeForTheHandbook.join("\n") +
  "\n\n" +
  endMarker +
  oldCode.split(endMarker)[1];

writeFileSync(
  pathToFileWeEdit,
  format(newCode, { filepath: pathToFileWeEdit })
);

/**
 * @typedef {Object} HandbookNavSubItem
 * @property {import("./types/AllFilenames").AllDocsPages= } file - the reference to the file based on the lang root
 * @property {HandbookNavSubItem[]=} items - pages
 * or!
 * @property {string= } href - a language prefixless
 * @property {string= } title - the display only used when href exists
 * @property {string= } oneliner
 * @property {boolean=} chronological - should we recommend a next/prev
 */

/**
 * @typedef {Object} HandbookNavItem
 * @property {string} title - TBD
 * @property {string} summary - TDB
 * @property {boolean=} chronological - should we recommend a next/prev
 * @property {boolean=} beta - should it be shown differently
 * @property {HandbookNavSubItem[]} items - pages
 */

function validateNonEnglishMarkdownFile(info, lang, filepath) {
  if (!info.data.permalink.startsWith("/" + lang + "/")) {
    throw new Error(
      `Permalink in ${filepath} does not start with '/${lang}/'\n\nExpected ${info.data.permalink} to be /${lang}${info.data.permalink}\n\n`
    );
  }
}

function validateMarkdownFile(info, filepath) {
  // const needed = ["permalink", "oneline", "title"];
  const needed = ["permalink", "title"];
  const missing = [];
  for (const needs of needed) {
    if (info.data[needs] === undefined) {
      missing.push(needs);
    }
  }
  if (missing.length) {
    // prettier-ignore
    throw new Error(`You need to have '${missing.join("', '")}' in the YML for ${filepath}\n\n`);
  }
}

function throwForUnfoundFile(subItem, lang, langInfo) {
  const keys = [...langInfo.keys()];
  // prettier-ignore
  throw new Error(`Could not find the file '${subItem.file}' from the handbook nav in either ${lang} or 'en' - has: ${keys.join(", ")}`);
}

function toID(secIdx, str) {
  return secIdx.toString() + "-" + str.toLowerCase().replace(/\s/g, "-");
}
