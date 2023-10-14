---
title: Troubleshooting
layout: docs
permalink: /docs/handbook/troubleshooting
oneline: "Troubleshooting page for Lingua Franca tools."
preamble: >
---

The purpose of this page is to collect problems and solutions that users on various platforms have had with the Lingua Franca tools. If you have suggestions for additions to this page, please <a href="https://github.com/lf-lang/website-lingua-franca/blob/main/packages/documentation/copy/en/tools/Troubleshooting.md">submit a pull request</a>.

## Environment Issues

The Lingua Franca tools rely on being able to invoke various external programs such as `cmake`, target-language compilers, Python, and Node.js. If any of these programs is missing, you will get an error message suggesting that you install the program. If you install the program and the error message persists, this usually means that the program is not visible in the environment in which the Lingua Franca tool is being run.

The simplest approach to diagnosing the problem is to first verify that the <a href="/docs/handbook/command-line-tools">command-line tools</a> work. For example, on the command line:

```
$ lfc --version
lfc 0.2.1
$ cmake --version
cmake version 3.22.2
$ lfc src/MyFile.lf
... successful compile ...
```

If you then have trouble compiling the same file using [Epoch](/docs/handbook/epoch-ide) or the [Visual Studio Code extension](/docs/handbook/code-extension), then those tools are executing in a different environment that may not have the same `PATH` variable and may, for example, fail to find some external program or invoke a different version of that program.

On many platforms, one way to ensure that [Epoch](/docs/handbook/epoch-ide) and the [Visual Studio Code extension](/docs/handbook/code-extension) use the same environment as the command-line tools is to invoke them on the command line. For example, on a Mac, you can invoke Epoch and Visual Studio Code as follows:

```
$ open -a epoch
$ code .
```

This way, the tools inherit the environment from the shell from which you invoke them. Often, that environment is quite different from what you get if, for example, you invoke the tools by double clicking on their icons.

