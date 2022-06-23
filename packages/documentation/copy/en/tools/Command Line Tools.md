---
title: Command Line Tools
layout: docs
permalink: /docs/handbook/command-line-tools
oneline: "Command-line tools for Lingua Franca."
preamble: >
---

## Download the Command Line Tools

The command-line compiler `lfc` can be installed in any directory, but it will be most convenient if add its directory to your <code>PATH</code> environment variable.
To download the current development version of the command-line tools instead of the latest release, replace the following tar and zip files with those from the <a href="https://github.com/lf-lang/lingua-franca/releases/tag/nightly">nightly build</a>.

### Linux and macOS

Download <a href="https://github.com/lf-lang/lingua-franca/releases/download/v0.2.0/lfc_0.2.0.tar.gz">lfc 0.2.0 for Linux/Mac</a> and run:

```shell
    tar xvf lfc_0.2.0.tar.gz
    ./lfc_0.2.0/bin/lfc --help
```

### Windows

Download <a href="https://github.com/lf-lang/lingua-franca/releases/download/v0.2.0/lfc_0.2.0.zip">lfc 0.2.0 for Windows</a> and run:

```powershell
    unzip lfc_0.2.0.zip
    .\lfc_0.2.0\bin\lfc.ps1 --version
```

### Developer

Clone the repository using one of

```shell
    git clone git@github.com:lf-lang/lingua-franca.git
```

or

```sh
    git clone https://github.com/lf-lang/lingua-franca.git
```

Then build using `gradle` or `maven`:

```sh
    ./gradlew assemble
```

or

```sh
    mvn compile
```

**Note:** The Gradle build also performs tests, which takes a long time.

The comnand-line tools will then be in a directory `lingua-franca/bin`.

## Using the Command Line Tools

Set up a Lingua Franca project by putting your program in a file with the `.lf` extension,
such as `Example.lf` and putting that file with a directory called `src`.
Then compile the program:

```sh
    lfc src/Example.lf
```

This will create two directories in parallel with the `src` directory, `src-gen` and `bin`. If your target language is a compiled one (like C and C++), then the `bin` directory should contain an executable that you can run:

```sh
    bin/Example
```

To see the options that can be given to `lfc`, get help:

```sh
    lfc --help
```

If you have installed the developer setup by cloning the GitHub repository, then there are a number of other command-line tools available in the `lingua-franca/bin` directory.
