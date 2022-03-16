if (process.env.BOOTSTRAPPING) {
  const chalk = require("chalk")
  const readline = require("readline")
  const blank = "\n".repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)

  // prettier-ignore
  console.log(`
  Bootstrapped. You can now run the site with ${chalk.greenBright.bold("yarn start")}.`)
  process.exit(0)
}
var lf = require("../documentation/scripts/linguaFrancaUtils");

// require("./scripts/ensureDepsAreBuilt")

// https://github.com/gatsbyjs/gatsby/issues/1457
require("ts-node").register({ files: true })
const { join } = require("path")

module.exports = {
  siteMetadata: {
    siteUrl: `https://www.lf-lang.org/`,
  },
  flags: {
    DEV_SSR: false,
  },
  plugins: [
    // SCSS provides inheritance for CSS and which pays the price for the dep
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
      },
    },
    // PWA metadata
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Lingua Franca Documentation`,
        short_name: `LF Docs`,
        start_url: `/`,
        background_color: `white`,
        theme_color: `#3178C6`,
        display: `standalone`,
        icon: `static/icons/lf-logo.png`,
      },
    },

    // Support for downloading or pre-caching pages, needed for PWAs
    // "gatsby-plugin-offline",

    // Creates TS types for queries during `gatsby dev`
    {
      resolve: "gatsby-plugin-typegen",
      options: {
        // Ensure it works in a monorepo
        outputPath: __dirname + "/src/__generated__/gatsby-types.ts",
      },
    },

    // Support ts/tsx files in src
    "gatsby-plugin-typescript",
    // SEO
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // Skip handbook v2 from appearing in search
        excludes: [`*/vo/*`],
      },
    },
    // Lets you edit the head from inside a react tree
    "gatsby-plugin-react-helmet",
    // Grabs the old handbook markdown files
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../documentation/copy`,
        name: `documentation`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/../../img`,
        name: `img`,
      },
    },
    {
      resolve: "gatsby-plugin-i18n",
      options: {
        langKeyDefault: "en",
        useLangKeyLayout: true,
      },
    },

    // Markdown support, and markdown + react
    // `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
             resolve: `gatsby-remark-prismjs`,
             options: {
               // Class prefix for <pre> tags containing syntax highlighting;
               // defaults to 'language-' (e.g. <pre class="language-js">).
               // If your site loads Prism into the browser at runtime,
               // (e.g. for use with libraries like react-live),
               // you may use this to prevent Prism from re-processing syntax.
               // This is an uncommon use-case though;
               // If you're unsure, it's best to use the default value.
               classPrefix: "language-",
               // This is used to allow setting a language for inline code
               // (i.e. single backticks) by creating a separator.
               // This separator is a string and will do no white-space
               // stripping.
               // A suggested value for English speakers is the non-ascii
               // character '›'.
               inlineCodeMarker: null,
               // This lets you set up language aliases.  For example,
               // setting this to '{ sh: "bash" }' will let you use
               // the language "sh" which will highlight using the
               // bash highlighter.
               aliases: {},
               // This toggles the display of line numbers globally alongside the code.
               // To use it, add the following line in gatsby-browser.js
               // right after importing the prism color scheme:
               //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
               // Defaults to false.
               // If you wish to only show line numbers on certain code blocks,
               // leave false and use the {numberLines: true} syntax below
               showLineNumbers: false,
               // If setting this to true, the parser won't handle and highlight inline
               // code used in markdown i.e. single backtick code like `this`.
               noInlineHighlight: false,
               // This adds a new language definition to Prism or extend an already
               // existing language definition. More details on this option can be
               // found under the header "Add new language definition or extend an
               // existing language" below.
               // FIXME: The LF keywords are repeated below for each target language.
               // Prism does not seem to support extending multiple languages.
               // Is there some way to encode this in a single variable?
               languageExtensions: [
                {
                  language: "lf",  /* Language agnostic. */
                  extend: "clike", /* FIXME: Must be a better base for this. */
                  insertBefore: {
                    function: {
                      lf_keywords: lf.keywordMatcher,
                    },
                  },
                },
                {
                    language: "lf-c",
                    extend: "c",
                    insertBefore: {
                      function: {
                        lf_keywords: lf.keywordMatcher,
                      },
                    },
                  },
                  {
                    language: "lf-cpp",
                    extend: "cpp",
                    insertBefore: {
                      function: {
                        lf_keywords: lf.keywordMatcher,
                      },
                    },
                  },
                  {
                    language: "lf-py",
                    extend: "python",
                    insertBefore: {
                      function: {
                        lf_keywords: lf.keywordMatcher,
                      },
                    },
                  },
                  {
                    language: "lf-ts",
                    extend: "typescript",
                    insertBefore: {
                      function: {
                        lf_keywords: lf.keywordMatcher,
                      },
                    },
                  },
                  {
                    language: "lf-rs",
                    extend: "rust",
                    insertBefore: {
                      function: {
                        lf_keywords: lf.keywordMatcher,
                      },
                    },
                  },
                ],
               // Customize the prompt used in shell output
               // Values below are default
               prompt: {
                 user: "root",
                 host: "localhost",
                 global: false,
               },
               // By default the HTML entities <>&'" are escaped.
               // Add additional HTML escapes by providing a mapping
               // of HTML entities and their escape value IE: { '}': '&#123;' }
               escapeEntities: {},
             },
          },
          `gatsby-remark-emoji`,
          `gatsby-remark-relative-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
              showCaptions: false
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          "gatsby-remark-autolink-headers",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    `gatsby-plugin-sharp`,
    // Finds auto-generated <a>s and converts them
    // into Gatsby Links at build time, speeding up
    // linking between pages.
    {
      resolve: `gatsby-plugin-catch-links`,
      options: {
        excludePattern: /(sandbox|play|dev)/,
      },
    },
    "gatsby-plugin-client-side-redirect",
  ],
}
