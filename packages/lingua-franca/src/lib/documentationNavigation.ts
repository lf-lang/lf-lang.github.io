/* This function is completely auto-generated via the `yarn bootstrap` phase of
   the app. You can re-run it when adding new localized handbook pages by running:

   yarn workspace documentation create-handbook-nav

   Find the source of truth at packages/documentation/scripts/generateDocsNavigationPerLanguage.js
*/

export interface SidebarNavItem {
  title: string;
  id: string;
  permalink?: string;
  chronological?: boolean;
  oneline?: string;
  items?: SidebarNavItem[];
}

/** ---INSERT--- */

export function getDocumentationNavForLanguage(
  langRequest: string
): SidebarNavItem[] {
  const langs = ["en"];
  const lang = langs.includes(langRequest) ? langRequest : "en";
  const navigations: Record<string, SidebarNavItem[]> = {};

  navigations.en = [
    {
      title: "Topics",
      oneline: "A great first read for your daily Lingua Franca work.",
      id: "topics",
      chronological: true,

      items: [
        {
          title: "Overview",
          id: "0-overview",
          permalink: "/docs/handbook/overview",
          oneline: "Overview of Lingua Franca.",
        },
        {
          title: "Tutorial",
          id: "0-tutorial",
          permalink: "/docs/handbook/tutorial",
          oneline: "Tutorial of Lingua Franca.",
        },
        {
          title: "Language Specification",
          id: "0-language-specification",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Language Specification",
              id: "0-language-specification",
              permalink: "/docs/handbook/language-specification",
              oneline: "Language Specification for Lingua Franca.",
            },
            {
              title: "Multiports and Banks",
              id: "0-multiports-and-banks",
              permalink: "/docs/handbook/multiports-banks",
              oneline: "Multiports and Banks of Reactors.",
            },
          ],
        },
        {
          title: "Downloading and Building",
          id: "0-downloading-and-building",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Downloading and Building",
              id: "0-downloading-and-building",
              permalink: "/docs/handbook/download",
              oneline: "Downloading and Building Lingua Franca.",
            },
            {
              title: "Developer Eclipse setup with Oomph",
              id: "0-developer-eclipse-setup-with-oomph",
              permalink: "/docs/handbook/eclipse-oomph",
              oneline: "Developer Eclipse setup with Oomph.",
            },
            {
              title: "Developer IntelliJ Setup (for Kotlin)",
              id: "0-developer-intellij-setup-(for-kotlin)",
              permalink: "/docs/handbook/intellij-kotlin",
              oneline: "Developer IntelliJ Setup (for Kotlin).",
            },
          ],
        },
        {
          title: "Writing Reactors in C",
          id: "0-writing-reactors-in-c",
          permalink: "/docs/handbook/write-reactor-c",
          oneline: "Writing Reactors in C.",
        },
        {
          title: "Writing Reactors in C++",
          id: "0-writing-reactors-in-c++",
          permalink: "/docs/handbook/write-reactor-c++",
          oneline: "Writing Reactors in C++.",
        },
        {
          title: "Writing Reactors in TypeScript",
          id: "0-writing-reactors-in-typescript",
          permalink: "/docs/handbook/write-reactor-ts",
          oneline: "Writing Reactors in TypeScript.",
        },
        {
          title: "Writing Reactors in Python",
          id: "0-writing-reactors-in-python",
          permalink: "/docs/handbook/write-reactor-py",
          oneline: "Writing Reactors in Python.",
        },
        {
          title: "Regression Tests",
          id: "0-regression-tests",
          permalink: "/docs/handbook/regression-tests",
          oneline: "Regression Tests for Lingua Franca.",
        },
        {
          title: "Contributing",
          id: "0-contributing",
          permalink: "/docs/handbook/contributing",
          oneline: "Contribute to Lingua Franca.",
        },
      ],
    },
    {
      title: "Preliminary Development",
      oneline: "Capabilities Under Development",
      id: "preliminary-development",
      chronological: false,

      items: [
        {
          title: "Distributed Execution",
          id: "1-distributed-execution",
          permalink: "/docs/handbook/distributed-execution",
          oneline: "Distributed Execution (preliminary)",
        },
        {
          title: "Import System",
          id: "1-import-system",
          permalink: "/docs/handbook/import-system",
          oneline: "Import System (preliminary)",
        },
        {
          title: "Tracing",
          id: "1-tracing",
          permalink: "/docs/handbook/tracing",
          oneline: "Tracing (preliminary)",
        },
        {
          title: "Containerized Execution",
          id: "1-containerized-execution",
          permalink: "/docs/handbook/containerized-execution",
          oneline: "Containerized Execution (preliminary)",
        },
        {
          title: "Generic Types, Interfaces, and Inheritance",
          id: "1-generic-types,-interfaces,-and-inheritance",
          permalink: "/docs/handbook/generic-types-interfaces-inheritance",
          oneline: "Generic Types, Interfaces, and Inheritance (preliminary)",
        },
        {
          title: "Target-Supported Features",
          id: "1-target-supported-features",
          permalink: "/docs/handbook/features",
          oneline: "Which features are supported by which target?",
        },
        {
          title: "Writing Reactors in Rust (WIP)",
          id: "1-writing-reactors-in-rust-(wip)",
          permalink: "/docs/handbook/write-reactor-rust",
          oneline: "Writing Reactors in Rust  (preliminary)",
        },
      ],
    },
    {
      title: "Less Developed Topics",
      oneline: "Less Developed Topics in Progress",
      id: "less-developed-topics",
      chronological: false,

      items: [
        {
          title: "Running Benchmarks",
          id: "2-running-benchmarks",
          permalink: "/docs/handbook/running-benchmarks",
          oneline: "Running Benchmarks.",
        },
        {
          title: "Tools",
          id: "2-tools",
          permalink: "/docs/handbook/tools",
          oneline: "LF Tools.",
        },
        {
          title: "Timing Analysis",
          id: "2-timing-analysis",
          permalink: "/docs/handbook/timing-analysis",
          oneline: "Timing Analysis.",
        },
        {
          title: "Related Work",
          id: "2-related-work",
          permalink: "/docs/handbook/related-work",
          oneline: "Related Work",
        },
        {
          title: "Future Proof Package/Import System",
          id: "2-future-proof-package/import-system",
          permalink: "/docs/handbook/proof-import",
          oneline: "A future proof package and import system",
        },
        {
          title: "RFC: Modal Models (Draft I)",
          id: "2-rfc:-modal-models-(draft-i)",
          permalink: "/docs/handbook/rfc-modal",
          oneline: "RFC: Modal Models (first draft)",
        },
      ],
    },
  ];

  return navigations[lang];
}

/** ---INSERT-END--- */

const findInNav = (
  item: SidebarNavItem | SidebarNavItem[],
  fun: (item: SidebarNavItem) => boolean
): SidebarNavItem | undefined => {
  if (Array.isArray(item)) {
    for (const subItem of item) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
  } else {
    if (fun(item)) return item;
    if (!item.items) return undefined;
    for (const subItem of item.items) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
    return undefined;
  }
};

export function getNextPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false
  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const next = section.items[currentIndex + 1];
  if (next) {
    if (next.items) {
      return {
        path: next.items[0].permalink,
        ...section.items[currentIndex + 1],
      };
    } else {
      return {
        path: next.permalink,
        ...section.items[currentIndex + 1],
      };
    }
  }
}

export function getPreviousPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false

  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const prev = section.items[currentIndex - 1];

  if (prev) {
    return {
      path: prev.permalink,
      ...section.items[currentIndex - 1],
    };
  }
}
