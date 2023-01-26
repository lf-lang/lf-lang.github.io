---
title: Developer Setup
layout: docs
permalink: /docs/handbook/developer-setup
oneline: "Setting up Lingua Franca for developers."
preamble: >
---

# Cloning the Repository

```
git clone git@github.com:lf-lang/lingua-franca.git
cd lingua-franca
git submodule update --init --recursive
```

# Building from the Command Line

## Command Line Tools

The command line tools are used using Gradle with `./gradlew buildAll`.

You can the Lingua Franca compiler and other CLI tools. For instance: `./bin/lfc --version`.

## Epoch

The Epoch IDE can be build with Maven using `mvn compile && mvn pacakge`. The resulting is then located within `org.lflang.rca/target/products/org.lflang.rca/`. On a 64-bit Linux, the binary is `org.lflang.rca/target/products/org.lflang.rca/linux/gtk/x86_64/epoch/epoch`.

# Running Test

Lingua Franca comes with unit and integration tests. More details can be found [here](/docs/handbook/regression-tests).

## Unit Tests

The unit tests can be run with Gradle using `./gradlew test --tests "org.lflang.tests.compiler.*"`.

## Integration Tests

All integration tests can be run with Gradle using `./gradlew test --tests "org.lflang.tests.runtime.*"`. By specifying the concrete test class, it is also possible to run only tests for a specific target. For instance the Python tests can be run with `./gradlew test --tests "org.lflang.tests.runtime.PythonTest.*"`. For convenience, there is also a script which can be used for running the integration tests for a specific target. For instance: `./bin/run-lf-tests Python`.

Sometimes it is useful to only run a single integration test. This can be done with the `runSingleTest` Gradle task. For instance: `./gradlew  runSingleTest --args test/C/src/Minimal.lf`.


# IDE Integration

You will likely want to use an IDE for working with the code base. For development of the core tools, any IDE that integrates with gradle can be used. We recommend our [IntelliJ setup](/docs/handbook/intellij).
If you plan to contribute to the Epoch IDE, you should use the [Oomph setup for Eclipse](/docs/handbook/eclipse-oomph).
