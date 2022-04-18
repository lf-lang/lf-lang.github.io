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
      title: "Resources",
      oneline: "Overview of the project.",
      id: "resources",
      chronological: true,

      items: [
        {
          title: "Overview",
          id: "0-overview",
          permalink: "/docs/handbook/overview",
          oneline: "Overview of Lingua Franca.",
        },
        {
          title: "Tutorial Video",
          id: "0-tutorial-video",
          permalink: "/docs/handbook/tutorial-video",
          oneline: "Tutorial video presented by the Lingua Franca team.",
        },
      ],
    },
    {
      title: "Writing Reactors",
      oneline: "Introduction to writing reactors.",
      id: "writing-reactors",
      chronological: true,

      items: [
        {
          title: "A First Reactor",
          id: "1-a-first-reactor",
          permalink: "/docs/handbook/a-first-reactor",
          oneline: "Writing your first Lingua Franca reactor.",
        },
        {
          title: "Inputs and Outputs",
          id: "1-inputs-and-outputs",
          permalink: "/docs/handbook/inputs-and-outputs",
          oneline: "Inputs, outputs, and reactions in Lingua Franca.",
        },
        {
          title: "Parameters and State Variables",
          id: "1-parameters-and-state-variables",
          permalink: "/docs/handbook/parameters-and-state-variables",
          oneline: "Parameters and state variables in Lingua Franca.",
        },
        {
          title: "Time and Timers",
          id: "1-time-and-timers",
          permalink: "/docs/handbook/time-and-timers",
          oneline: "Time and timers in Lingua Franca.",
        },
        {
          title: "Composing Reactors",
          id: "1-composing-reactors",
          permalink: "/docs/handbook/composing-reactors",
          oneline: "Composing reactors in Lingua Franca.",
        },
        {
          title: "Reactions and Methods",
          id: "1-reactions-and-methods",
          permalink: "/docs/handbook/reactions-and-methods",
          oneline: "Reactions and methods in Lingua Franca.",
        },
        {
          title: "Causality Loops",
          id: "1-causality-loops",
          permalink: "/docs/handbook/causality-loops",
          oneline: "Causality loops in Lingua Franca.",
        },
        {
          title: "Extending Reactors",
          id: "1-extending-reactors",
          permalink: "/docs/handbook/extending-reactors",
          oneline: "Extending reactors in Lingua Franca.",
        },
        {
          title: "Actions",
          id: "1-actions",
          permalink: "/docs/handbook/actions",
          oneline: "Actions in Lingua Franca.",
        },
        {
          title: "Superdense Time",
          id: "1-superdense-time",
          permalink: "/docs/handbook/superdense-time",
          oneline: "Superdense time in Lingua Franca.",
        },
        {
          title: "Deadlines",
          id: "1-deadlines",
          permalink: "/docs/handbook/deadlines",
          oneline: "Deadlines in Lingua Franca.",
        },
        {
          title: "Multiports and Banks",
          id: "1-multiports-and-banks",
          permalink: "/docs/handbook/multiports-and-banks",
          oneline: "Multiports and Banks of Reactors.",
        },
        {
          title: "Preambles and Methods",
          id: "1-preambles-and-methods",
          permalink: "/docs/handbook/preambles-and-methods",
          oneline: "Defining functions and methods in Lingua Franca.",
        },
        {
          title: "Distributed Execution",
          id: "1-distributed-execution",
          permalink: "/docs/handbook/distributed-execution",
          oneline: "Distributed Execution (preliminary)",
        },
        {
          title: "Termination",
          id: "1-termination",
          permalink: "/docs/handbook/termination",
          oneline: "Terminating a Lingua Franca execution.",
        },
      ],
    },
    {
      title: "Target Languages",
      oneline: "Documentation for specific target languages.",
      id: "target-languages",
      chronological: true,

      items: [
        {
          title: "C Reactors",
          id: "2-c-reactors",
          permalink: "/docs/handbook/c-reactors",
          oneline: "Writing reactors using the C target in Lingua Franca.",
        },
      ],
    },
    {
      title: "Tools",
      oneline: "Tools for developing Lingua Franca programs.",
      id: "tools",
      chronological: true,

      items: [
        {
          title: "Code Plugin",
          id: "3-code-plugin",
          permalink: "/docs/handbook/code-plugin",
          oneline: "Visual Studio Code Plugin for Lingua Franca.",
        },
        {
          title: "Epoch IDE",
          id: "3-epoch-ide",
          permalink: "/docs/handbook/epoch-ide",
          oneline: "Epoch IDE for Lingua Franca.",
        },
        {
          title: "Command Line Tools",
          id: "3-command-line-tools",
          permalink: "/docs/handbook/command-line-tools",
          oneline: "Command-line tools for Lingua Franca.",
        },
        {
          title: "Setup for C",
          id: "3-setup-for-c",
          permalink: "/docs/handbook/setup-for-c",
          oneline: "Set up the C target in Lingua Franca.",
        },
        {
          title: "Setup for Cpp",
          id: "3-setup-for-cpp",
          permalink: "/docs/handbook/setup-for-cpp",
          oneline: "Set up the C++ target in Lingua Franca.",
        },
        {
          title: "Setup for Python",
          id: "3-setup-for-python",
          permalink: "/docs/handbook/setup-for-python",
          oneline: "Set up the Python target in Lingua Franca.",
        },
        {
          title: "Setup for TypeScript",
          id: "3-setup-for-typescript",
          permalink: "/docs/handbook/setup-for-typescript",
          oneline: "Set up the TypeScript target in Lingua Franca.",
        },
        {
          title: "Setup for Rust",
          id: "3-setup-for-rust",
          permalink: "/docs/handbook/setup-for-rust",
          oneline: "Set up the Rust target in Lingua Franca.",
        },
      ],
    },
    {
      title: "Reference",
      oneline: "Reference documentation.",
      id: "reference",
      chronological: true,

      items: [
        {
          title: "Expressions",
          id: "4-expressions",
          permalink: "/docs/handbook/expressions",
          oneline: "Expressions in Lingua Franca.",
        },
        {
          title: "Target Specification",
          id: "4-target-specification",
          permalink: "/docs/handbook/target-specification",
          oneline: "The target specification in Lingua Franca.",
        },
        {
          title: "Tracing",
          id: "4-tracing",
          permalink: "/docs/handbook/tracing",
          oneline: "Tracing (preliminary)",
        },
        {
          title: "Language Specification",
          id: "4-language-specification",
          permalink: "/docs/handbook/language-specification",
          oneline: "Language Specification for Lingua Franca.",
        },
      ],
    },
    {
      title: "Developer",
      oneline:
        "Information for developers of the Lingua Franca language and tools.",
      id: "developer",
      chronological: true,

      items: [
        {
          title: "Regression Tests",
          id: "5-regression-tests",
          permalink: "/docs/handbook/regression-tests",
          oneline: "Regression Tests for Lingua Franca.",
        },
        {
          title: "Contributing",
          id: "5-contributing",
          permalink: "/docs/handbook/contributing",
          oneline: "Contribute to Lingua Franca.",
        },
        {
          title: "Downloading and Building",
          id: "5-downloading-and-building",
          permalink: "/docs/handbook/download",
          oneline: "Downloading and Building Lingua Franca.",
        },
        {
          title: "Developer Eclipse setup with Oomph",
          id: "5-developer-eclipse-setup-with-oomph",
          permalink: "/docs/handbook/eclipse-oomph",
          oneline: "Developer Eclipse setup with Oomph.",
        },
        {
          title: "Developer IntelliJ Setup (for Kotlin)",
          id: "5-developer-intellij-setup-(for-kotlin)",
          permalink: "/docs/handbook/intellij-kotlin",
          oneline: "Developer IntelliJ Setup (for Kotlin).",
        },
        {
          title: "Running Benchmarks",
          id: "5-running-benchmarks",
          permalink: "/docs/handbook/running-benchmarks",
          oneline: "Running Benchmarks.",
        },
      ],
    },
    {
      title: "Preliminary Development",
      oneline: "Capabilities under development",
      id: "preliminary-development",
      chronological: false,

      items: [
        {
          title: "Containerized Execution",
          id: "6-containerized-execution",
          permalink: "/docs/handbook/containerized-execution",
          oneline: "Containerized Execution (preliminary)",
        },
        {
          title: "Generic Types, Interfaces, and Inheritance",
          id: "6-generic-types,-interfaces,-and-inheritance",
          permalink: "/docs/handbook/generic-types-interfaces-inheritance",
          oneline: "Generic Types, Interfaces, and Inheritance (preliminary)",
        },
        {
          title: "Target-Supported Features",
          id: "6-target-supported-features",
          permalink: "/docs/handbook/features",
          oneline: "Which features are supported by which target?",
        },
        {
          title: "Writing Reactors in Rust (WIP)",
          id: "6-writing-reactors-in-rust-(wip)",
          permalink: "/docs/handbook/write-reactor-rust",
          oneline: "Writing Reactors in Rust  (preliminary)",
        },
        {
          title: "Reactors on Patmos",
          id: "6-reactors-on-patmos",
          permalink: "/docs/handbook/reactors-on-patmos",
          oneline: "Reactors on Patmos (preliminary)",
        },
      ],
    },
    {
      title: "Less Developed Topics",
      oneline: "Less mature topics in progress",
      id: "less-developed-topics",
      chronological: false,

      items: [
        {
          title: "Logical Execution Time",
          id: "7-logical-execution-time",
          permalink: "/docs/handbook/logical-execution-time",
          oneline: "Reactions that take non-zero logical time to execute.",
        },
        {
          title: "Tools",
          id: "7-tools",
          permalink: "/docs/handbook/tools",
          oneline: "LF Tools.",
        },
        {
          title: "Timing Analysis",
          id: "7-timing-analysis",
          permalink: "/docs/handbook/timing-analysis",
          oneline: "Timing Analysis.",
        },
        {
          title: "Related Work",
          id: "7-related-work",
          permalink: "/docs/handbook/related-work",
          oneline: "Related Work",
        },
        {
          title: "Future Proof Package/Import System",
          id: "7-future-proof-package/import-system",
          permalink: "/docs/handbook/proof-import",
          oneline: "A future proof package and import system",
        },
        {
          title: "RFC: Modal Models (Draft I)",
          id: "7-rfc:-modal-models-(draft-i)",
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
