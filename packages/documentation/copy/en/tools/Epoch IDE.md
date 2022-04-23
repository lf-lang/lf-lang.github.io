---
title: Epoch IDE
layout: docs
permalink: /docs/handbook/epoch-ide
oneline: "Epoch IDE for Lingua Franca."
preamble: >
---

This page shows how to install and run the Epoch integrated development environment (IDE). Epoch is a standalone application based on Eclipse that provides a syntax-directed editor, compiler, and diagram synthesis tool for Lingua Franca programs.

## Download Epoch

Download the appropriate `epoch_ide_...` file for your platform from:

- [Nightly build](https://github.com/lf-lang/lingua-franca/releases/tag/nightly) (the most recent version, under development)

## Set Up Epoch in MacOS

The downloaded file is a compressed tarball. Open it to get an `Epoch.app` item that you can drag into your `Applications` folder.

**First**: Currently, the Epoch IDE is not signed, and MacOS will report it as "damaged" if you try to invoke it immediately. You can work around this by opening a terminal and running the following command:

```sh
xattr -cr Epoch.app
```

**Second**: By default, the Lingua Franca compiler uses `cmake` to compile the programs it generates. This is not installed by default on MacOS systems. To install `cmake` using `brew`, just do this:

```sh
brew install cmake
```

Verify that cmake is in your path by typing `which cmake`.

**Third**: We recommend also starting Epoch from the command line because then it will inherit your `PATH` variable (If you start it by double clicking on the icon, as usual in MacOS, it will not find `cmake` and will be unable to build LF programs). To do this, in a terminal window:

```
open -a Epoch
```

**Fourth**: By default, Epoch is set to "Build Automatically" in the Project menu. This means that the LF code generator and compiler will be invoked every time you change a file and whenever you open a new project (on all files in the project). Many people prefer to turn this feature off and invoke the code generator by hand by clicking on the gear icon at the upper left.

## Set Up Epoch in Linux

**FIXME**

## Set Up Epoch in Windows

**FIXME**
