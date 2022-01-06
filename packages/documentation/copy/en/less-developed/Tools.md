---
title: Tools
layout: docs
permalink: /docs/handbook/tools
oneline: "LF Tools."
preamble: >
---
# IDE integration
The idea is to build a language server to facilitate the integration with a variety of editors/IDEs. See [Language Server Protocol (LSP)](https://langserver.org/) for more information.

```
                 +-------------------------------------+
+--------+       |  +----------+         +----------+  |
|        +-------|-->    LF    +--------->  Target  |  |
| Editor |  src  |  | Compiler | gen src | Compiler |  |
|        <-------|--+          <---------+          |  |
+--------+  err  |  +----------+ gen err +----------+  |
                 |          Language Server            |
                 +-------------------------------------+
```

If the LF compiler encounters any syntax errors, it will report them to the editor (the language client). If the LF code compiles, the output will be sent to the target compiler. If the target compiler reports any errors, these, too, will be reported to the editor via the language server. The tricky part is to match target language errors to LF source locations; the language server will have to do some bookkeeping.