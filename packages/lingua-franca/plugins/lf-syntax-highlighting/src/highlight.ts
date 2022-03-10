const fs = require("fs")
import path from "path"
import * as vsctm from "vscode-textmate"
import { Config } from "./config"
import * as oniguruma from "vscode-oniguruma"

function readFile(path: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error: any, data: any) => error ? reject(error) : resolve(data));
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
        console.log('Returning the LF grammar...')
        const data: any = await readFile(Config.lfGrammar)
        console.log(data.toString())
        return vsctm.parseRawGrammar(data.toString(), Config.lfGrammar)
      }
      console.log(`Unknown scope name: ${scopeName}`)
      return Promise.resolve(null)
    }
});

export const annotateCode = async (code: string) => {
  const grammar: vsctm.IGrammar | null = await registry.loadGrammar('source.lf')
  if (grammar == null) return
  let prevState: vsctm.StackElement | null = null
  let ret: string = ""
  for (const line of code.split("\n")) {
    console.log(line)
    let result: vsctm.ITokenizeLineResult = grammar.tokenizeLine(line, prevState)
    prevState = result.ruleStack
    if (result.stoppedEarly) {
      console.error("Tokenization stopped early due to timeout.")
      continue
    }
    console.log(result)
    let annotatedLine = ""
    let lengthAppended = 0
    for (const token of result.tokens) {
      annotatedLine += line.substring(lengthAppended, token.startIndex)
      annotatedLine += `<span class="${token.scopes.join(" ")}">${
        line.substring(token.startIndex, token.endIndex)
      }</span>`
      lengthAppended = token.endIndex
    }
    annotatedLine += line.substring(lengthAppended, line.length)
    ret += annotatedLine + "\n"
  }
  return ret
}
