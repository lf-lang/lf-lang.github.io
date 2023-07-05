---
title: Developer IntelliJ Setup
layout: docs
permalink: /docs/handbook/intellij
oneline: "Developer IntelliJ Setup."
preamble: >
---

## Prerequisites

- Java 17 or up ([download from Oracle](https://www.oracle.com/java/technologies/downloads/))
- IntelliJ IDEA Community Edition ([download from Jetbrains](https://www.jetbrains.com/idea/download/))

## Cloning lingua-franca repository

If you have not done so already, clone the lingua-franca repository into your working directory.

```sh
$ git clone git@github.com:lf-lang/lingua-franca.git lingua-franca
$ cd lingua-franca
$ git submodule update --init --recursive
```

## Opening lingua-franca as IntelliJ Project

To import the Lingua Franca repository as a project, simply run `./gradew openIdea`.
This will create some project files and then open the project in IntelliJ.

When you open the project for the first time, you will see a small pop-up in the lower right corner.

![](../../../../../img/intellij/gradle_import.png)

Click on "Load Gradle Project" to import the Gradle configurations.

If you are prompted to a pop-up window asking if you trust the Gradle project, click Trust Project.

![](../../../../../img/intellij/trust_gradle_project.png)

Once the repository is imported as a Gradle project, you will see a Gradle tab on the right.

Once the indexing finishes, you can expand the Gradle project and see the set of Tasks.

![](../../../../../img/intellij/expand_gradle_tab.png)

You can run any Gradle command from IntelliJ simply by clicking on the "Execute Gradle Task" icon in the Gradle tab. You are the prompted for the precis command to run.

## Setting up run configurations

You can set up a run configuration for running and debugging various Gradle tasks from the Gradle tab, including the code generation through lfc.
To set up a run configuration for the run task of lfc, right-click on "run" under org.lflang -> cli -> lfc -> Tasks -> application and click "Modify Run Configuration".
This will create a custom run/debug configuration for you.

In the Run/Debug Configurations dialog, click on the text box next to Tasks: use the full task name `cli:lfc:run` instead of just `run`.
and append args to specify the LF target. For example, `cli:lfc:run -args 'test/Cpp/src/HelloWorld.lf'` Meanwhile, change the Gradle project to
"lingua-franca" instead of "lingua-franca:cli:lfc". Then click OK.

![](../../../../../img/intellij/run_config_lf_program.png)

You will see a new run/debug config added to the top-level menu bar, as shown below.
You can always change the config, for example, changing the args, by clicking `Edit Configurations` via a drop-down menu.

![](../../../../../img/intellij/new_runlfc_config.png)

## Running and Debugging

Using the newly added config, you can run and debug the code generator by clicking the play button and the debug button.

![](../../../../../img/intellij/run_debug_buttons.png)

Set up breakpoints before starting the debugger by clicking the space right next to the line numbers.
While debugging, you can run code step-by-step by using the debugger tools.

![](../../../../../img/intellij/debugger_screen.png)

By clicking the play button, the code will be generated without execution. You can run the program by executing the binary file generated under the "bin" folder. In the HelloWorld example above, we can execute the binary by typing the command "test/Cpp/bin/HelloWorld" in the terminal and then pressing enter.

## Integration Tests

You can also run the integration test from IntelliJ. You will find the `targetTest` and `singleTest` tasks in the Gradle tab under "org.lflang" -> "Tasks" -> "other". Make sure to add a run configuration as shown above and add `-Ptarget=...` to the `targetTest` command or `-DsingleTest=...` to your `singleTest` command to specify the target or the precise test that you would like to run.
