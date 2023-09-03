---
title: Developer Setup
layout: docs
permalink: /docs/handbook/developer-setup
oneline: "Setting up Lingua Franca for developers."
preamble: >
---

## Prerequisites

- Java 17 ([download from Oracle](https://www.oracle.com/java/technologies/downloads/))

## Cloning the Repository

Please run the following commands to clone the repository and its submodules.

```sh
git clone git@github.com:lf-lang/lingua-franca.git
cd lingua-franca
git submodule update --init --recursive
```

## Building the command line tools

We use [Gradle](https://docs.gradle.org/current/userguide/userguide.html) for building the code within our repository.

For an easy start, the `bin/` directory contains scripts for building and running our compiler lfc and our code formatter lff.
Try to run `./bin/lfc --version`.
This will first build `lfc` and then execute it through Gradle.
In fact, running `./bin/lfc <args>` is equivalent to running `./gradlew cli:lfc:run --args="<args>"`.

To build the entire repository, you can simply run `./gradlew build`.
This will build all tools and also run all formatting checks and unit tests.
Note that this does not run our integration tests.
For more details on our testing infrastructure, please refer to the [Regression Test](/docs/handbook/regression-tests) section.

If you only want to build without running any tests, you can use `./gradlew assemble` instead.
Both the assemble and the build task will create a distribution package containing our command line tools in `build/distribution`.
There is also an installed version of this package in `build/install/lf-cli/`.
If you run `build/install/lf-cli/bin/lfc` this will run lfc as it was last build.
Thus, you can choose if you want to use `bin/lfc`, which runs lfc through gradle and always uses the latest code, or if you prefer to run `./gradlew build` and then directly invoke `build/install/lf-cli/bin/lfc`.

## IDE Integration

You can use any editor or IDE that you like to work with the code base.
However, we would suggest to choose an IDE that comes with good Java (and
ideally Kotlin) support and that integrates well with Gradle.
We recommend to use our [IntelliJ setup](/docs/handbook/intellij).

## Building IDEs

Currently, we provide two IDEs that support Lingua Franca programs.
Their source code is located in external repositories.
We have a [Lingua Franca extension](https://github.com/lf-lang/vscode-lingua-franca) for VS code and an Eclipse based IDE called [Epoch](https://github.com/lf-lang/epoch).
Please refer to the READMEs for build instructions.
