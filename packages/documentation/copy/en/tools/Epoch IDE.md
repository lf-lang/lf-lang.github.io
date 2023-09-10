---
title: Epoch IDE
layout: docs
permalink: /docs/handbook/epoch-ide
oneline: "Epoch IDE for Lingua Franca."
preamble: >
---

This page shows how to install and run the Epoch integrated development environment (IDE). Epoch is a standalone application based on Eclipse that provides a syntax-directed editor, compiler, and diagram synthesis tool for Lingua Franca programs.

## Install Epoch

Epoch can be installed automatically using the following one-liner:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s epoch
```

This installs the latest stable version.
To install the nightly-built version, simply add `nightly` to the parameters passed to the installer:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s nightly epoch
```

A default installation directory is chosen by the installer depending on the platform. You can also specify a prefix using the `--prefix=<path>` parameter. For instance, if you specify `--prefix=/usr` then the executables will be placed in `/usr/bin`. You will want to make sure this directory is in your `PATH`.

### Building from Source

Clone the repository using one of

```sh
$ git clone git@github.com:lf-lang/epoch.git
```

or

```sh
$ git clone https://github.com/lf-lang/epoch.git
```

Update the submodules:

```sh
$ cd epoch
$ git submodule update --init --recursive
```

Then build using Maven:

```sh
$ mvn -U clean package
```

The location of the resulting Epoch app depends on your platform.
For example, on a Mac with Apple silicon, it will be here:

```
org.lflang.rca/target/products/org.lflang.rca/macosx/cocoa/aarch64/
```

## Direct Download

You can download the latest release of Epoch from the Lingua Franca Release page:

- [Epoch for x86_64 Linux](https://github.com/lf-lang/lingua-franca/releases/download/v0.4.0/epoch_ide_0.4.0-linux.gtk.x86_64.tar.gz)
- [Epoch for aarch64 macOS](https://github.com/lf-lang/lingua-franca/releases/download/v0.4.0/epoch_ide_0.4.0-macosx.cocoa.aarch64.tar.gz)
- [Epoch for x86_64 macOS](https://github.com/lf-lang/lingua-franca/releases/download/v0.4.0/epoch_ide_0.4.0-macosx.cocoa.x86_64.tar.gz)
- [Epoch for Windows](https://github.com/lf-lang/lingua-franca/releases/download/v0.4.0/epoch_ide_0.4.0-win32.win32.x86_64.zip)

Extract the contents from the archive. For example:

```
open epoch_ide_0.4.0-macosx.cocoa.aarch64.tar.gz
```

For Linux and Windows, you can just run the resulting exutable.

MacOS requires extra steps before being able to execute the app:

```
xattr -cr Epoch.app
```

Drag the Epoch.app file to your Applications folder.
You can then invoke the App as follows:

```
open -a Epoch.app
```

Please note that Java version 17 or higher is required to run Epoch.

**NOTE**: By default, the Lingua Franca compiler uses `cmake` to compile the programs it generates. This is not installed by default on macOS systems. To install `cmake` using `brew`, just do this:

```sh
brew install cmake
```

Verify that cmake is in your path by typing `which cmake`.

**NOTE**: We recommend also starting Epoch from the command line because then it will inherit your `PATH` variable (If you start it by double clicking on the icon, as usual in macOS, it will not find `cmake` and will be unable to build LF programs). To do this, in a terminal window:

```sh
open epoch.app
```

If you instead start Epoch by double clicking on its icon, then when you compile Lingua Franca programs, you may get unexpected results or unexpected failures because Epoch fails to find required programs (e.g., your python runtime system or a compiler) or finds a different version from what `lfc` will find.

**NOTE**: By default, Epoch is set to "Build Automatically" in the Project menu. This means that the LF code generator and compiler will be invoked every time you change a file and whenever you open a new project (on all files in the project). Many people prefer to turn this feature off and invoke the code generator by hand by clicking on the gear icon at the upper left.
