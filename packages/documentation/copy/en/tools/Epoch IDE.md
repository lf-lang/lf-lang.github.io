---
title: Epoch IDE
layout: docs
permalink: /docs/handbook/epoch-ide
oneline: "Epoch IDE for Lingua Franca."
preamble: >
---

Epoch is a standalone application based on Eclipse that provides a syntax-directed editor, compiler, and diagram synthesis tool for Lingua Franca programs.

## Prerequisites

**Please note that Java version 17 or higher is required to run Epoch.**

The Lingua Franca compiler also uses certain development packages (e.g., `cmake`, `cargo`, or `npm`) to build the programs it generates. We recommend using your favorite package manager to install these, depending on the target you will be using.

## Installing Epoch

### Linux and Mac

On Linux and Mac, Epoch can be installed automatically using the following one-liner:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s epoch
```

This installs the latest stable version.
To install the nightly-built version, simply add `nightly` to the parameters passed to the installer:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s nightly epoch
```

A default installation directory is chosen by the installer depending on the platform. You can also specify a prefix using the `--prefix=<path>` parameter. For instance, if you specify `--prefix=/usr` then the executables will be placed in `/usr/bin`. You will want to make sure this directory is in your `PATH`.

### Windows

To install Epoch in WSL, just follow the [Linux installation instructions](#linux-and-mac). To obtain a native Windows executable, you can either [download it](#downloading-epoch), or [build it from source](#building-epoch-from-source).

## Downloading Epoch

You can download the latest release of Epoch from the [Lingua Franca Release page](https://github.com/lf-lang/lingua-franca/releases/latest). 

After downloading the `.tar.gz` or `.zip` archive that matches your OS and system architecture, extract its contents.

### Linux and Windows

For Linux and Windows, you can just run `epoch` or `epoch.exe` executable found among the extracted files.

### Mac

MacOS requires extra steps before being able to execute the app:

```sh
xattr -cr Epoch.app
```

To install, drag the `Epoch.app` file to your `Applications` folder. You can then invoke the App as follows:

```sh
open -a Epoch.app
```

**NOTE**: On macOS, we recommend starting Epoch from the command line because then it will inherit your `PATH` variable (If you start it by double clicking on the icon, as usual in macOS, it will not target language build tools that are installed on your system, thus leaving it unable to build LF programs). To do this, in a terminal window:

```sh
open epoch.app
```

## Building Epoch from Source

To build from source, refer to the instructions provided in the [Epoch GitHub repository](https://github.com/lf-lang/epoch/#building-from-source).

## Using Epoch

By default, Epoch is set to "Build Automatically" in the Project menu. This means that the LF code generator and compiler will be invoked every time you change a file and whenever you open a new project (on all files in the project). Many people prefer to turn this feature off and invoke the code generator by hand by clicking on the gear icon at the upper left.
