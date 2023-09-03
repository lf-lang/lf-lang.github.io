---
title: Command Line Tools
layout: docs
permalink: /docs/handbook/command-line-tools
oneline: "Command-line tools for Lingua Franca."
preamble: >
---

## Installing the Command Line Tools

The command-line tools (`lfc` for compilation, `lfd` for diagram synthesis, and `lff` for formatting), can be installed automatically using the following one-liner:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s cli
```

This installs the latest stable version.
To install the nightly-built version, simply add `nightly` to the parameters passed to the installer:

```sh
$ curl -Ls https://install.lf-lang.org | sh -s nightly cli
```

A default installation directory is chosen by the installer depending on the platform. You can also specify a prefix using the `--prefix=<path>` parameter. For instance, if you specify `--prefix=/usr` then the executables will be placed in `/usr/bin`.

For a manual installation, refer to the artifacts published with our [releases](https://github.com/lf-lang/lingua-franca/releases/). (Just decompress the archive and find the executables in the `bin` directory.)

### Building from Source

Clone the repository using one of

```sh
$ git clone git@github.com:lf-lang/lingua-franca.git
```

or

```sh
$ git clone https://github.com/lf-lang/lingua-franca.git
```

Then change directory to `lingua-franca` and build using `gradle`:

```sh
$ ./gradlew build
```

**Note:** The `build` tasks also performs tests, which takes a long time. To skip the tests, use `assemble` instead. After completion of the task, the command-line tools will be in `./bin`.

## Using the Command Line Tools

Set up a Lingua Franca project by putting your program in a file with the `.lf` extension,
such as `Example.lf` and putting that file with a directory called `src`.
Then compile the program:

```sh
$ lfc src/Example.lf
```

This will create two directories in parallel with the `src` directory, `src-gen` and `bin`. If your target language is a compiled one (like C and C++), then the `bin` directory should contain an executable that you can run:

```sh
$ bin/Example
```

To see the options that can be given to `lfc`, get help:

```sh
$ lfc --help
```
