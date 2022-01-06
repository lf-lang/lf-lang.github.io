---
title: Regression Tests
layout: docs
permalink: /docs/handbook/regression-tests
oneline: "Regression Tests for Lingua Franca."
preamble: >
---
## Regression Tests
Lingua Franca comes with an extensive set of regression tests that are executed on various platforms automatically whenever an update is pushed to the LF repository. There are three categories of tests:

* **System tests** are complete Lingua Franca programs that are compiled and executed automatically. A test passes if it successfully compiles and runs to completion with normal termination (return code 0). These tests are located in the `test` directory at the root of the LF repo, with one subdirectory per target language.
* **Unit tests** are Java or Xtend methods in the [`compiler` package](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca.tests/src/org/icyphy/tests/compiler) that are labeled with the `@test` directive in the comment just before the method. These tests check individual functions of the code generation infrastructure and/or IDE. The system tests are also executed through JUnit using methods with `@test` directives, but these tests are located in the [`runtime` package](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca.tests/src/org/icyphy/tests/runtime) (because their goal is not only to successfully generate code, but also to execute it and test for expected results).
* **Examples** are complete Lingua Franca programs that are compiled but not executed automatically.  These are not executed automatically because they are typically interactive and may not terminate.

To learn about Lingua Franca, browsing the system tests and examples could be very useful.

### Browsing and Editing Examples in the LF IDE

- In the LF IDE Eclipse, select File->New->Project  (a General Project is adequate) and click Next.
- Give the project a name, e.g. `CExamples`.
- Unselect "Use default location".
- Navigate to the example directory and click Open. For the C target, the example directory is `$LF/example/C` where `$LF` is the root of your git clone of the lingua-franca repo.
- Click Finish.
- Open any one of the `.lf` files in any of the subdirectories.
- **IMPORTANT:** A dialog appears: Do you want to convert 'test' to an Xtext Project? Say YES.

This will create two directories called `src-gen` and `bin` in the `$LF/example/C` directory. Eclipse populates these directories with generated and compiled code. You can run the programs in the `bin` directory.

### Browsing and Editing System Tests in the LF IDE
The built-in regression tests provide many small, simple examples of LF programs. Browsing them can be useful to learn the capabilities, so we strongly recommend creating a project for this.

- In the LF IDE Eclipse, select File->New->Project  (a General Project is adequate) and click Next.
- Give the project a name, e.g. `CTests`.
- Unselect "Use default location".
- Navigate to the test directory and click Open. For the C target, the test directory is `$LF/test/C` where `$LF` is the root of your git clone of the lingua-franca repo.
- The `src` directory contains all the tests, some organized into topical subdirectories.
- Open any one of the `.lf` files.
- **IMPORTANT:** A dialog appears: Do you want to convert 'test' to an Xtext Project? Say YES.

This will create two directories called `src-gen` and `bin` in the `$LF/test/C` directory. Eclipse populates these directories with generated and compiled code. You can run the programs in the `bin` directory.

### Running the Tests From the Command Line

The simplest way to run the regression tests is to use a Bash script called `run-lf-tests` in `$LF/bin`, which takes the target language as a parameter:
```
run-lf-tests C
run-lf-tests Cpp
run-lf-tests Python
run-lf-tests TS
```
This will run the system tests only. To run all the tests, use the `gradle` build system in the `$LF/xtext` directory:
```
cd $LF/xtext
./gradlew test
```
You can also selectively run just some of the tests. For example, to run the system tests for an individual target language, do this:
```
cd $LF
./gradlew test --tests org.lflang.tests.runtime.CTest.*
./gradlew test --tests org.lflang.tests.runtime.CppTest.*
./gradlew test --tests org.lflang.tests.runtime.PythonTest.*
./gradlew test --tests org.lflang.tests.runtime.TypeScriptTest.*
```

To run a single test case, use the `runSingleTest` gradle task along with the path to the test source file:
```
./gradlew runSingleTest --args test/C/src/Minimal.lf
```

It is also possible to run a subset of the tests. For example, the C tests are organized into the following categories:

* **generic** tests are `.lf` files located in `$LF/test/C/src`.
* **concurrent** tests are `.lf` files located in `$LF/test/C/src/concurrent`.
* **federated** tests are `.lf` files located in `$LF/test/C/src/federated`.
* **multiport** tests are `.lf` files located in `$LF/test/C/src/multiport`.

To invoke only the tests in the `concurrent` category, for example, do this:
```
cd $LF/xtext
./gradlew test --tests org.icyphy.tests.runtime.CTest.runConcurrentTests
```


### Reporting Bugs
If you encounter a bug or add some enhancement to Lingua Franca, then you should create a regression test either as a system test or a unit test and issue a pull request. System tests are particularly easy to create since they are simply Lingua Franca programs that either compile and execute successfully (the test passes) or fail either to compile or execute.

## Testing Architecture

System tests can be put in any subdirectory of `$LF/test` or `$LF/example`.
Any `.lf` file within these directories will be treated as a system test unless they are within a directory named `failing`, in which case they will be ignored.
The tests are automatically indexed by our JUnit-based test infrastructure, which is located in the package `xtext/org.icyphy.linguafranca.tests`. Each target has its own class in the `runtime` package, with a number of test methods that correspond to particular test categories, such as `generic`, `concurrent`, `federated`, etc. A test can be associated with a particular category by placing it in a directory that matches its name. For instance, we can create a test (e.g., `Foo.lf`) in `test/C/src/concurrent`, which will then get indexed under the target `C` in the category `concurrent`. Files placed directly in `test/C/src` will be considered `generic` `C` tests, and a file in a directory `concurrent/federated` will be indexed as `federated` (corresponding to the nearest containing directory).

**Caution**: adding a _new_ category requires updating an enum in `TestRegistry.java` and adding a `@test`-labeled method to `TestBase`. 

### Known Failures
Sometimes it is useful to retain tests that have a known failure that should be addressed at a later point. Such tests can simply be put in a directory called `failing`, which will tell our test indexing code to exclude it.

### Examples
All files in our `example` directory are also indexed automatically. This is to assure they will continue to function correctly as our compiler evolves. All files in the `example` category will be parsed and code generated, but only files in a `test` directory will be executed, meaning they must also execute successfully in order not to be reported as a failure.

### Test Output
Tests are grouped by target and category. It is also reported when, for a given category, there are other targets that feature tests that are missing for the target under test. Tests that either do not have a main reactor or are marked as known failures are reported as "ignored." For all the tests that were successfully indexed, it is reported how many passed. For each failing test, diagnostics are reported that should help explain the failure. Here is some sample output for `Ctest.runConcurrentTests`, which runs tests categorized as `concurrent` for the `C` target:

```
CTest > runConcurrentTests() STANDARD_OUT
    ==============================================================================
    Target: C
    Description: Run concurrent tests.
    ==============================================================================

    ==============================================================================
    Category: CONCURRENT
    ==============================================================================
    ------------------------------------------------------------------------------
    Ignored: 0
    ------------------------------------------------------------------------------

    ------------------------------------------------------------------------------
    Covered: 29/33
    ------------------------------------------------------------------------------
    Missing: src/concurrent/BankToBank.lf
    Missing: src/concurrent/BankToBankMultiport.lf
    Missing: src/concurrent/BankToBankMultiportAfter.lf
    Missing: src/concurrent/BankToMultiport.lf

    ------------------------------------------------------------------------------
    Passing: 29/29
    ------------------------------------------------------------------------------

```

### Running JUnit Tests from Eclipse
It is also possible to invoke tests in Eclipse. Simply navigate to the source file in the package explorer, right click on it and select `Run As JUnit Test`. To invoke particular tests, open the file, right click on a method labeled as `@test` and again run it as a JUnit test.

## Unit Tests
We also maintain a set of unit tests that focus on various aspects of the LF compiler. They are located in the `compiler` package in `xtext/org.icyphy.linguafranca.tests`. These tests can also be invoked from Eclipse as describe above, or from the command line as follows:
```
./gradlew test --tests org.icyphy.tests.compiler.*
```

## Code Coverage
Code coverage is automatically recorded when running tests. After completing a test run, a full report can be found in `$LF/xtext/org.icyphy.linguafranca.tests/build/reports/html/jacoco/index.html`. Note that this report will only reflect the coverage of the test that have actually executed. It is possible to obtain the full report without waiting for all the tests to complete by running the following command which only parses and generates code for system tests (instead of building and executing them, too): 
```
./gradlew test --tests org.icyphy.tests.runtime.compiler.CodeGenCoverage.*
```
## Continuous Integration
Each push or pull request will trigger all tests to be run on Github Actions. It's configuration can be found [here](https://github.com/lf-lang/lingua-franca/blob/master/.github/workflows/build.yml).