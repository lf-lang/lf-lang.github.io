import fs from "fs"
import path from "path"
import * as vsctm from "vscode-textmate"
import { Config } from "./config"
import * as oniguruma from "vscode-oniguruma"

function readFile(p: string) {
    return new Promise((resolve, reject) => {
      return fs.readFile(
        path.resolve(__dirname, p),
        (error: any, data: any) => error ? reject(error) : resolve(data)
      );
    })
}

const wasmBin = fs.readFileSync(path.join(__dirname, Config.onigurumaParser)).buffer;
const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => {
    return {
        createOnigScanner(patterns: any) { return new oniguruma.OnigScanner(patterns); },
        createOnigString(s: string) { return new oniguruma.OnigString(s); }
    };
});

const registry = new vsctm.Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName: string) => {
      let grammarFile: string = ""
      for (const language of Config.languages) {
        if (scopeName == language.scopeName) {
          grammarFile = language.grammarFile
          break
        }
      }
      if (grammarFile !== "") {
        const data: any = await readFile(grammarFile)
        return vsctm.parseRawGrammar(data.toString(), grammarFile)
      }
      console.error(`Unknown scope name: ${scopeName}`)
      return Promise.resolve(null)
    }
});

function implicitRuleStackFor(
  lang: string | undefined,
  code: string,
  grammar: vsctm.IGrammar
): vsctm.StackElement | null {
  if (!lang) return null
  if (lang.trim() === "lf") return null
  if (!lang.includes("lf")) return null
  if (code.includes("target")) return null
  let languageName: string | null = null
  if (!lang.includes("-")) {
    console.error(
      "Language \"lf\" specified via the language label \"" + lang + "\", but target language is"
      + " unclear. Required format is lf-<target language name>."
    )
    return null
  }
  const lower = lang.split("-").slice(1).join("-").toLowerCase()
  for (const language of Config.languages) {
    if (
      lower == language.canonicalName.toLowerCase()
      || language.aliases.map(it => it.toLowerCase()).some(it => lower === it)
    ) {
      languageName = language.canonicalName
      break
    }
  }
  let { ruleStack } = grammar.tokenizeLine("target " + languageName + ";", null)
  return ruleStack
}

function escapeHtml(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function annotateCode(code: string, grammar: vsctm.IGrammar | undefined, lang: string): string {
  if (!grammar) return escapeHtml(code)
  let prevState: vsctm.StackElement | null = implicitRuleStackFor(lang, code, grammar)
  let ret: string = ""
  for (const line of code.split("\n")) {
    let result: vsctm.ITokenizeLineResult = grammar.tokenizeLine(line, prevState)
    prevState = result.ruleStack
    if (result.stoppedEarly) {
      console.error("Tokenization stopped early due to timeout.")
      continue
    }
    let annotatedLine = ""
    let lengthAppended = 0
    for (const token of result.tokens) {
      annotatedLine += escapeHtml(line.substring(lengthAppended, token.startIndex))
      annotatedLine += `<span class="${token.scopes.join(" ").replace(/\./g, "-")}">${
        escapeHtml(line.substring(token.startIndex, token.endIndex))
      }</span>`
      lengthAppended = token.endIndex
    }
    annotatedLine += escapeHtml(line.substring(lengthAppended, line.length))
    ret += annotatedLine + "\n"
  }
  return ret
}

type Node = {
  type: string,
  children: Node[],
  value: string
}

function visit(ast: Node, type: string, transform: (node: Node) => void) {
  if (!ast) return;
  if (ast.type == type) transform(ast);
  if (!ast.children) return;
  for (const child of ast.children) {
    visit(child, type, transform);
  }
}

export const processAST = async ({ markdownAST }, pluginOptions) => {
  const grammars: Map<string, vsctm.IGrammar> = new Map()
  for (const language of Config.languages) {
    const grammar = await registry.loadGrammar(language.scopeName)
    if (grammar) {
      for (const name of [language.canonicalName, ...language.aliases]) {
        grammars.set(name.toLowerCase(), grammar)
      }
    } else {
      console.error("Failed to load grammar corresponding to " + language.scopeName)
    }
  }
  visit(markdownAST, "code", (node) => {
    node.type = "html"
    const lang: string = (node.hasOwnProperty("lang") && node["lang"]) ? node["lang"] : "text"
    const key: string | undefined = lang.includes("lf") ? "lf" : lang.toLowerCase()
    const annotated = annotateCode(node.value, grammars.get(key), lang)
    node.value = `<pre class="source-lf">${annotated}</pre>`
  })
  return markdownAST
}
