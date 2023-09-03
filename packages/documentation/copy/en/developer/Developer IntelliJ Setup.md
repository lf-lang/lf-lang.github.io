---
title: Developer IntelliJ Setup
layout: docs
permalink: /docs/handbook/intellij
oneline: "Developer IntelliJ Setup."
preamble: >
---

## Prerequisites

- Java 17 ([download from Oracle](https://www.oracle.com/java/technologies/downloads/))
- IntelliJ IDEA Community Edition ([download from Jetbrains](https://www.jetbrains.com/idea/download/))

## Cloning lingua-franca repository

If you have not done so already, clone the lingua-franca repository into your working directory.

```sh
$ git clone git@github.com:lf-lang/lingua-franca.git lingua-franca
$ cd lingua-franca
$ git submodule update --init --recursive
```

## Opening lingua-franca as IntelliJ Project

To import the Lingua Franca repository as a project, simply run `./gradlew openIdea`.
This will create some project files and then open the project in IntelliJ.

When you open the project for the first time, you will see a small pop-up in the lower right corner.

![](../../../../../img/intellij/gradle_import.png)

Click on <kbd>Load Gradle Project</kbd> to import the Gradle configurations.

If you are prompted to a pop-up window asking if you trust the Gradle project, click <kbd>Trust Project</kbd>.

![](../../../../../img/intellij/trust_gradle_project.png)

Once the repository is imported as a Gradle project, you will see a <kbd>Gradle</kbd> tab on the right.

Once the indexing finishes, you can expand the Gradle project and see the set of Tasks.

![](../../../../../img/intellij/expand_gradle_tab.png)

You can run any Gradle command from IntelliJ simply by clicking on the <kbd>Execute Gradle Task</kbd> icon in the Gradle tab. You are then prompted for the precise command to run.

## Setting up run configurations

You can set up a run configuration for running and debugging various Gradle tasks from the <kbd>Gradle</kbd> tab, including the code generation through `lfc`.
To set up a run configuration for the run task of `lfc`, expand the <kbd>application</kbd> task group under <kbd>org.lflang > Tasks</kbd>, right-click on <kbd>⚙️ run</kbd>, and select <kbd>Modify Run Configuration...</kbd>.
This will create a custom run/debug configuration for you.

In the <kbd>Create Run Configuration</kbd> dialog, click on the text box next to <kbd>Run</kbd>, select `cli:lfc:run` from the drop-down menu, and append arguments to be passed to `lfc` using the `--args` flag. For instance, to invoke `lfc` on `test/Cpp/src/HelloWorld.lf`, enter `cli:lfc:run --args 'test/Cpp/src/HelloWorld.lf'` Then click <kbd>OK</kbd>.

![](../../../../../img/intellij/run_config_lf_program.png)

You will see a new run/debug config added to the top-level menu bar, as shown below.
You can always change the config, for example, changing the `--args`, by clicking <kbd>Edit Configurations</kbd> via a drop-down menu.

![](../../../../../img/intellij/new_runlfc_config.png)

## Running and Debugging

Using the newly added config, you can run and debug the code generator by clicking the play button and the debug button.

![](../../../../../img/intellij/run_debug_buttons.png)

Set up breakpoints before starting the debugger by clicking the space right next to the line numbers.
While debugging, you can run code step-by-step by using the debugger tools.

![](../../../../../img/intellij/debugger_screen.png)

By clicking the play button, `lfc` will be invoked, and if compilation is successful, its output can be found, relative to package root of the file under compilation, in `bin` if the target is a compiled language (e.g., C) or in `src-gen` if the target is an interpreted language (e.g., TypeScript).  For the `HelloWorld.lf` example above, the binary can be found in `test/Cpp/bin/HelloWorld` and can be executed in the terminal.

## Integration Tests

You can also run the integration test from IntelliJ. You will find the <kbd>targetTest</kbd> and <kbd>singleTest</kbd> tasks in the Gradle tab under <kbd>org.lflang > Tasks > other</kbd>. Make sure to add a run configuration as shown above and append `-Ptarget=...'` to the `targetTest` command or `-DsingleTest=...` to your `singleTest` command to specify the target (e.g., `C`) or the specific test that you would like to run.
