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

// Create a registry that can create a grammar from a scope name.
const registry = new vsctm.Registry({
    onigLib: vscodeOnigurumaLib,
    loadGrammar: async (scopeName: string) => {
      if (scopeName === 'source.lf') {
        const data: any = await readFile(Config.lfGrammar)
        return vsctm.parseRawGrammar(data.toString(), Config.lfGrammar)
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
  if (!lang.includes("lf")) return null
  if (code.startsWith("target")) return null
  let language: string | null = null
  const lower = code.toLowerCase()
  if (lower.includes("c")) language = "C"
  if (lower.includes("cpp")) language = "Cpp"
  if (lower.includes("ccpp")) language = "CCpp"
  if (lower.includes("py")) language = "Python"
  if (lower.includes("rust")) language = "Rust"
  if (lower.includes("typescript") || lower.includes("ts")) language = "TypeScript"
  let { ruleStack } = grammar.tokenizeLine("target " + language + ";", null)
  return ruleStack
}

function annotateCode(code: string, grammar: vsctm.IGrammar, lang: string) {
  if (grammar == null) return
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
      annotatedLine += line.substring(lengthAppended, token.startIndex)
      annotatedLine += `<span class="${token.scopes.join(" ").replace(/\./g, " ")}">${
        line.substring(token.startIndex, token.endIndex)
      }</span>`
      lengthAppended = token.endIndex
    }
    annotatedLine += line.substring(lengthAppended, line.length)
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
  const grammar: vsctm.IGrammar | null = await registry.loadGrammar('source.lf')
  if (grammar == null) {
    console.error("Failed to load the TextMate grammar.")
    return markdownAST
  }
  visit(markdownAST, "code", (node) => {
    node.type = "html"
    const lang = node.hasOwnProperty("lang") ? node["lang"] : null
    const annotated = annotateCode(node.value, grammar, lang)
    node.value = `<pre>${annotated}</pre>`
  })
  return markdownAST
}
