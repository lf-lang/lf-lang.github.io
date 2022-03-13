import * as path from "path"

export type Language = {
  canonicalName: string,
  scopeName: string,
  grammarFile: string,
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
    }
  ]
}
