import * as path from "path"

export type Language = {
  canonicalName: string,  // The name used in the "lang" field of MarkDown code blocks.
  scopeName: string,  // The name of the TextMate scope of this language.
  grammarFile: string | URL,  // A path or URL to the TextMate grammar.
  aliases: string[]
}

export class Config {
  static readonly onigurumaParser: string = path.join(
    "..", "node_modules", "vscode-oniguruma", "release", "onig.wasm"
  )
  static readonly languages: Language[] = [
    {
      canonicalName: "Lingua Franca",
      scopeName: "source.lf",
      grammarFile: path.join(
        "..", "vscode-lingua-franca", "syntax", "lflang.tmLanguage.json"
      ),
      aliases: ['LF']
    },
    {
      canonicalName: "C",
      scopeName: "source.c",
      grammarFile: path.join(
        "..", "syntaxes", "better-cpp-syntax", "syntaxes", "c.tmLanguage.json"
      ),
      aliases: []
    },
    {
      canonicalName: "Cpp",
      scopeName: "source.cpp",
      grammarFile: path.join(
        "..", "syntaxes", "better-cpp-syntax", "syntaxes", "cpp.tmLanguage.json"
      ),
      aliases: ["C++"]
    },
    {
      canonicalName: "CppMacro",
      scopeName: "source.cpp.embedded.macro",
      grammarFile: path.join(
        "..", "syntaxes", "better-cpp-syntax", "syntaxes", "cpp.embedded.macro.tmLanguage.json"
      ),
      aliases: []
    },
    {
      canonicalName: "Python",
      scopeName: "source.python",
      grammarFile: path.join(
        "..", "syntaxes", "MagicPython", "grammars", "MagicPython.tmLanguage"
      ),
      aliases: ["Py"]
    },
    {
      canonicalName: "PythonRegExp",
      scopeName: "source.regexp.python",
      grammarFile: path.join(
        "..", "syntaxes", "MagicPython", "grammars", "MagicRegExp.tmLanguage"
      ),
      aliases: []
    },
    {
      canonicalName: "TypeScript",
      scopeName: "source.ts",
      grammarFile: path.join(
        "..", "syntaxes", "TypeScript-TmLanguage", "TypeScript.tmLanguage"
      ),
      aliases: ["TS"]
    },
    {
      canonicalName: "Rust",
      scopeName: "source.rust",
      grammarFile: path.join(
        "..", "syntaxes", "vscode-rust", "rust-analyzer", "editors", "code", "rust.tmGrammar.json"
      ),
      aliases: ["RS"]
    },
    {
      canonicalName: "shell",
      scopeName: "source.shell",
      grammarFile: new URL("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/shellscript/syntaxes/shell-unix-bash.tmLanguage.json"),
      aliases: ["bash", "sh"]
    },
    {
      canonicalName: "gnuplot",
      scopeName: "source.gnuplot",
      grammarFile: new URL("https://raw.githubusercontent.com/mammothb/vscode-gnuplot/master/syntaxes/gnuplot.tmLanguage"),
      aliases: []
    },
    {
      canonicalName: "powershell",
      scopeName: "source.powershell",
      grammarFile: new URL("https://raw.githubusercontent.com/PowerShell/EditorSyntax/master/PowerShellSyntax.tmLanguage"),
      aliases: []
    },
    {
      canonicalName: "yaml",
      scopeName: "source.yaml",
      grammarFile: new URL("https://raw.githubusercontent.com/redhat-developer/vscode-yaml/main/syntaxes/yaml.tmLanguage.json"),
      aliases: []
    },
    {
      canonicalName: "cmake",
      scopeName: "source.cmake",
      grammarFile: new URL("https://raw.githubusercontent.com/twxs/vs.language.cmake/master/syntaxes/CMake.tmLanguage"),
      aliases: []
    },
    {
      canonicalName: "JavaScript",
      scopeName: "source.js",
      grammarFile: new URL("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/javascript/syntaxes/JavaScript.tmLanguage.json"),
      aliases: ["js"]
    },
    {
      canonicalName: "JSON",
      scopeName: "source.json",
      grammarFile: new URL("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/json/syntaxes/JSON.tmLanguage.json"),
      aliases: []
    },
    {
      canonicalName: "JSON Comments",
      scopeName: "source.json.comments",
      grammarFile: new URL("https://raw.githubusercontent.com/microsoft/vscode/main/extensions/json/syntaxes/JSONC.tmLanguage.json"),
      aliases: []
    },
    {
      canonicalName: "TOML",
      scopeName: "source.toml",
      grammarFile: new URL("https://raw.githubusercontent.com/bungcip/better-toml/master/syntaxes/TOML.tmLanguage"),
      aliases: []
    }
  ]
}
