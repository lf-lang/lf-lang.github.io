---
title: Downloading and Building
layout: docs
permalink: /docs/handbook/download
oneline: "Downloading and Building Lingua Franca."
preamble: >
---
## Using Lingua Franca
To get started with Lingua Franca immediately, download `Epoch` (our IDE) and/or `lfc` (our command-line compiler) from one of the following releases:
* [Nightly Build](https://github.com/lf-lang/lingua-franca/releases/tag/nightly)
* [Version 0.1.0-beta](https://github.com/lf-lang/lingua-franca/releases/tag/v0.1.0-beta)

**IMPORTANT NOTE**: MacOS will report that `lflang.app` is broken because it was not signed. To execute it, please run
```
    xattr -cr epoch.app
```
first on the command line. Eventually, we will provide a signed download.

If you plan to just use the command-line compiler, you may want a language plugin for Vim and Neovim.
See the [installation instructions](https://github.com/lf-lang/lingua-franca.vim).

## Working from the git Repository
If you plan to contribute to Lingua Franca, or if you want to keep up to date as the project evolves, you will need to work from the git repository on GitHub. There are several ways to do this:
1. **Recommended**: Oomph setup for Eclipse: Follow the [[Developer Eclipse setup with Oomph]] instructions.
2. You can [[Clone the Repository]] and build manually using gradle or maven.
  * Gradle: `./gradlew assemble` (the `build` also performs tests, which takes a long time)
  * Maven: `mvn compile` (you need to install Maven first)
3. Some of code generator components are written in Kotlin, which is not supported by Eclipse. If you want a Kotlin-friendly developer environment using IntelliJ, you can follow the [[Developer IntelliJ Setup (for Kotlin)]] instructions to set it up. To build the Lingua Franca IDE (Epoch) with Kotlin-based code generators enabled (which is not possible with the Eclipse setup), please see the instructions in [[Running Lingua Franca IDE (Epoch) with Kotlin based Code Generators Enabled (without Eclipse Environment)]].

## See also:
- [[Diagrams]]
- [[Regression Tests]]
- [[Legacy Eclipse Instructions]]
- [[Web Based Editor]]
