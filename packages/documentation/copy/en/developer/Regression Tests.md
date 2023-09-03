---
title: Regression Tests
layout: docs
permalink: /docs/handbook/regression-tests
oneline: "Regression Tests for Lingua Franca."
preamble: >
---

Lingua Franca comes with an extensive set of regression tests that are executed on various platforms automatically whenever an update is pushed to the LF repository. There are two categories of tests:

- **Unit tests** are Java or Kotlin methods in our code base that are labeled with the `@Test` directive. These tests check individual functions of the code generation infrastructure. These are located in the `src/test` directory of each subroject within the repository.
- **Integration tests** are complete Lingua Franca programs that are compiled and executed automatically. A test passes if it successfully compiles and runs to completion with normal termination (return code 0). These tests are located in the `test` directory at the root of the LF repo, with one subdirectory per target language.
Their implementation can be found in the `core/src/integrationTest` directory.
The integration tests are also executed through JUnit using methods with `@Test` directives, but they are executed separately.

## Running the Tests From the Command Line

To run all unit tests, simply run `./gradlew test`. Note that also the normal build tasks `./gradlew build` runs all the unit tests.


The integration tests can be run using the `integrationTest` task. However, typically it is not desired to run all tests for all targets locally as it will need the right target tooling and will take a long time.

To run only the integration tests for one target, we provide the `targetTest` gradle task. For instance, you can use the following command to run all Rust tests:
```
./gradlew targetTest -Ptarget=Rust
```
You can specify any valid target. If you run the task without specifying the target property `./gradlew tagetTest` it will produce an error message and list all available targets.


The `targetTest` task is essentially a convenient shortcut for the following:
```
./gradew core:integrationTest --test org.lflang.tests.runtime.<target>Test.*
```
If you prefer have more control over which tests are executed, you can also use this more verbose version.

It is also possible to run a subset of the tests. For example, the C tests are organized into the following categories:

* **generic** tests are `.lf` files located in `$LF/test/C/src`.
* **concurrent** tests are `.lf` files located in `$LF/test/C/src/concurrent`.
* **federated** tests are `.lf` files located in `$LF/test/C/src/federated`.
* **multiport** tests are `.lf` files located in `$LF/test/C/src/multiport`.

To invoke only the C tests in the `concurrent` category, for example, run this:
```
./gradlew core:integrationTest --tests org.lflang.tests.runtime.CTest.runConcurrentTests
```

Sometimes it is convenient to only run a single specific test case. This can be done with the `singleTest` task. For instance:
```
./gradlew singleTest -DsingleTest=test/C/src/Minimal.lf
```

## Reporting Bugs

If you encounter a bug or add some enhancement to Lingua Franca, then you should create a regression test either as a system test or a unit test and issue a pull request. System tests are particularly easy to create since they are simply Lingua Franca programs that either compile and execute successfully (the test passes) or fail either to compile or execute.

## Testing Architecture

System tests can be put in any subdirectory of `$LF/test` or `$LF/example`.
Any `.lf` file within these directories will be treated as a system test unless they are within a directory named `failing`, in which case they will be ignored.
The tests are automatically indexed by our JUnit-based test infrastructure, which is located in the package `core/src/integrationTest`. Each target has its own class in the `runtime` package, with a number of test methods that correspond to particular test categories, such as `generic`, `concurrent`, `federated`, etc. A test can be associated with a particular category by placing it in a directory that matches its name. For instance, we can create a test (e.g., `Foo.lf`) in `test/C/src/concurrent`, which will then get indexed under the target `C` in the category `concurrent`. Files placed directly in `test/C/src` will be considered `generic` `C` tests, and a file in a directory `concurrent/federated` will be indexed as `federated` (corresponding to the nearest containing directory).

**Caution**: adding a _new_ category requires updating an enum in `TestRegistry.java` and adding a `@Test`-labeled method to `TestBase`.

### Known Failures

Sometimes it is useful to retain tests that have a known failure that should be addressed at a later point. Such tests can simply be put in a directory called `failing`, which will tell our test indexing code to exclude it.

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

## Code Coverage

Code coverage is automatically recorded when running tests.
A combined report for each subproject can be created by running `./gradlew jacocoTestReport`.
For the `core` subproject, the html report will be located in `build/reports/html/index.html`.
Note that this report will only reflect the coverage of the test that have actually executed.

## Continuous Integration

Each push or pull request will trigger all tests to be run on GitHub Actions. It's configuration can be found [here](https://github.com/lf-lang/lingua-franca/tree/master/.github/workflows).
