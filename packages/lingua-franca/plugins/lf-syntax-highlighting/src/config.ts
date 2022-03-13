import * as path from 'path'

export class Config {
  static readonly onigurumaParser: string = path.join(
    '..', 'node_modules', 'vscode-oniguruma', 'release', 'onig.wasm'
  )
  static readonly lfGrammar: string = path.join(
    '..', 'vscode-lingua-franca', 'syntax', 'lflang.tmLanguage.json'
  )
}
