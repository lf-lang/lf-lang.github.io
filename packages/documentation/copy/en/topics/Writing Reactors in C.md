---
title: Writing Reactors in C
layout: docs
permalink: /docs/handbook/write-reactor-c
oneline: "Writing Reactors in C."
preamble: >
---
In the C reactor target for Lingua Franca, reactions are written in C and the code generator generates a standalone C program that can be compiled and run on several platforms. It has been tested on MacOS, Linux, Windows, and at least one bare-iron embedded platforms. The single-threaded version is the most portable, requiring only a handful of common C libraries (see [Included Libraries](#included-libraries) below). The multithreaded version requires a small subset of the Posix thread library (`pthreads`) and transparently executes in parallel on a multicore machine while preserving the deterministic semantics of Lingua Franca.

Note that C is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Here, we provide some guidelines for a style for writing reactors that will be safe.

**NOTE:** On July 2, 2020, a change was pushed into the Lingua Franca repo that requires users to change their C code in reactions of reactors using the C target. Such non-backward-compatible changes are expected to be rare. If you have code that predates this change, see the [summary of the changes you must make to your C code to use the new syntax](syntax-change-in-c-reactions). The documentation below is for the syntax required after this change.

**NOTE:** If you intend to use C++ code or import C++ libraries in the C target, we provide a special [CCpp target](#the-ccpp-target) that automatically uses a C++ compiler by default. Alternatively, you might want to look at the native [Cpp](Writing-Reactors-in-Cpp) target, built for C++ code if features such as [federated execution](Distributed-Execution) are not needed.

## Table of Contents
- [A Minimal Example](#a-minimal-example)
- [The C Target Specification](#the-c-target-specification)
  * [threads](#threads)
  * [cmake](#cmake)
  * [cmake-include](#cmake-include)
- [Command-Line Arguments](#command-line-arguments)
- [Imports](#imports)
- [Preamble](#preamble)
- [Reactions](#reactions)
  * [Inputs and Outputs](#inputs-and-outputs)
  * [Using State Variables](#using-state-variables)
  * [Using Parameters](#using-parameters)
  * [Sending and Receiving Arrays and Structs](#sending-and-receiving-arrays-and-structs)
    + [Dynamically Allocated Arrays](#dynamically-allocated-arrays)
    + [Macros For Setting Output Values](#macros-for-setting-output-values)
    + [Dynamically Allocated Structs](#dynamically-allocated-structs)
- [Timed Behavior](#timed-behavior)
  * [Scheduling Delayed Reactions](#scheduling-delayed-reactions)
  * [Zero-Delay Actions](#zero-delay-actions)
- [Actions With Values](#actions-with-values)
- [Stopping Execution](#stopping-execution)
- [Log and Debug Information](#log-and-debug-information)
- [Implementation Details](#implementation-details)
  * [Included Libraries](#included-libraries)
  * [Single Threaded Implementation](#single-threaded-implementation)
  * [Multithreaded Implementation](#multithreaded-implementation)
- [Reactors on Patmos](#reactors-on-patmos)
  * [Compiling and Running Reactors](#compiling-and-running-reactors)
  * [Worst-Case Execution Time Analysis](#worst-case-execution-time-analysis)
- [The CCpp Target](#the-ccpp-target)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## A Minimal Example

A "hello world" reactor for the C target looks like this:

    target C; 
    main reactor Minimal {
        reaction(startup) {=
            printf("Hello World.\n");
        =}
    }

The `startup` trigger causes the reaction to execute at the logical start time of the program. This program can be found in a file called [Minimal.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Minimal.lf) in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/C), where you can also find quite a few more interesting examples. If you compile this using the [`lfc` command-line compiler](downloading-and-building#Command-Line-Tools) or the [Eclipse-based IDE](downloading-and-building#Download-the-Integrated-Development-Environment), then a generated file called Minimal.c plus supporting files will be put into a subdirectory called `src-gen`. In addition, the compiled C code will be put into a file called `Minimal` in a subdirectory called `bin`.  If you are in the test directory, you can run this code in a shell as follows:

    bin/Minimal

The resulting output should look something like this:

    Start execution at time Sat Jun 29 11:34:41 2019
    plus 958455000 nanoseconds.
    Hello World.
    Elapsed logical time (in nsec): 0
    Elapsed physical time (in nsec): 1014000

It is also possible to run the executable from within the Eclipse IDE.  To do this, bring up the menu on the green run button in the toolbar and select `External Tools Configurations...`.  Select `Program` and click the New Configuration button. Fill out the dialog as follows (the first item is in the Variables menu and the second can be obtained by clicking on Browse Workspace, so you don't have to type them in):

![](../../../../../../img/ExternalToolsConfiguration.png)

You can then select the binary in the Project Explorer and, using the green Run button at the top, choose RunSelectedBinary. The output will go to the console.

## The C Target Specification

To have Lingua Franca generate C code, start your `.lf` file with the following target specification:

    target C;

A C target specification may optionally specify any of the parameters given in the [[target specification]]. For example, for the C target, in a source file named Foo.lf, you might specify:

    target C {
        fast: true,
        timeout: 10 secs
    };


The `fast` option given above specifies to execute the file as fast as possible, ignoring timing delays.

The `timeout` option specifies to stop after 10 seconds of logical time have elapsed. All events at logical time 10 seconds that have microstep 0 will be processed, but not events with later tags. If any reactor calls `request_stop` before this logical time, then the program may stop at an earlier logical time. If no timeout is specified and `request_stop` is not called, then the program will continue to run until stopped by some other mechanism (such as Control-C).

In addition, the C target supports the following parameters:

- [**threads**](#threads): The number of worker threads to create to run reactions.
- [**cmake**](#cmake): Enable or disable the CMake-based build system (the default is `true`).
- [**cmake-include**](#cmake-include): Optionally append additional custom CMake instructions to the generated `CMakeLists.txt` from a text file.

These target specifications specify the *default* behavior of the generated code, the behavior it will exhibit if you give no command-line options. The `timeout`, `fast`, and `threads` options can be overridden on the command line when invoking the program as explained in [Command-Line Arguments](#command-line-arguments).

### threads
```
target C {
    threads: <integer>
};
```

The number of threads to create to run reactions. This is required to be a non-negative integer. If this is not specified or a value 0 is given (the default), then a single thread is used, no thread library is included, and the `schedule()` function is not thread safe. Hence, unless you specify this, you cannot asynchronously schedule any actions. If the value given is 1 or more, then the specified number of worker threads will be created. On a multicore machine, these threads will typically be able to execute reactions in parallel if the program dependencies allow it. If a program contains physical actions, then a value of 1 or more will be forced; i.e., a threaded runtime will be used even if only one worker thread is created because the physical action needs the threading infrastructure to be able to safely asynchronous schedule events.

For example, the following
```
target C {
    threads: 4
};
```
requests that the generated code create four threads, a good choice for a four-core machine.  

**Important:** If the `threads` option is not given, then the generated C code makes no use of a thread library. In that case, everything runs in a single thread, and asynchronous calls to `schedule()` are not supported (the `schedule()` function will not be thread safe).  If the `threads` option is given, even if you request only one thread, then thread-safe code is generated and `schedule()` may be called from any thread or even from an interrupt service routine.

### cmake
```
target C {
    cmake: <true or false>
}; 
```

Enable or disable the CMake-based build system (the default is `true`). Enabling the CMake build system will result in a `CMakeLists.txt` being generated in the `src-gen` directory. This `CMakeLists.txt` is then used when `cmake` is invoked by the LF runtime (either the `lfc` or the IDE). Alternatively, the generated program can be built manually. To do so, in the `src-gen/ProgramName` directory, run:
```
mkdir build && cd build
cmake ../
make
```

If `cmake` is disabled, `gcc` is directly invoked after code generation by default. In this case, additional target properties can be used to gain finer control over the compilation process. For example, in a source file named `Bar.lf`, you might specify:

```
target C {
    cmake: false,
    compiler: "cc",
    flags: "-g -I/usr/local/include -L/usr/local/lib -lpaho-mqtt3c"
};
```

The ```compiler``` option here specifies to use `cc` rather than `gcc`.

The `flags` option specifies to include debug information in the compiled code (`-g`); a directory to search for include files (`-I/usr/local/include`); a directory to search for library files (`-L/usr/local/lib`); a library to link with (`-lpaho-mqtt3c`, which will link with file `libpaho-mqtt3c.so`).


**Note**: Using the `flags` standard parameter when `cmake` is enabled is strongly discouraged, although supported. Flags are compiler-specific, and thus interfere with CMake's ability to find the most suitable compiler for each platform. In a similar fashion, we recommend against the use of the `compiler` standard parameter for the same reason. A better solution is to provide a `cmake-include` file, as described next.

### cmake-include
```
target C {
    cmake-include: ["relative/path/to/foo.txt", "relative/path/to/bar.txt", ...]
};
```

Optionally append additional custom CMake instructions to the generated `CMakeLists.txt` from text files (e.g, `foo.txt`). The specified files are resolved using the file search algorithm documented [[here | Target-Specification#files]], and copied to the directory that contains the generated sources (only in the C target). This is done to make the generated code more portable (a feature that is useful in [[federated execution | Distributed-Execution]]).

This target property can be used, for example, to add dependencies for various packages (e.g., by using [`find_package()`](https://cmake.org/cmake/help/latest/command/find_package.html) and [`target_link_libraries`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html) commands). [CMakeInclude.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/CMakeInclude.lf) is an example that uses this feature. A more sophisticated example of the usage of this target parameter can be found in [Rhythm.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/src/Rhythm/Rhythm.lf).

A CMake variable called `${LF_MAIN_TARGET}` can be used in the included text file(s) for convenience. This variable will contain the name of the CMake target (i.e., the name of the main reactor).  For example, a `foo.txt` file can contain:
```
find_package(m REQUIRED) # Finds the m library

target_link_libraries( ${LF_MAIN_TARGET} m ) # Links the m library
```

`foo.txt` can then be included:
```
target C {
    cmake-include: "foo.txt"
};
```
In this case, "foo.txt" is in the same `src` folder as the main `.lf` file.

**Note**: For a general tutorial on finding packages in CMake, see [this](https://cmake.org/cmake/help/latest/command/find_package.html) external documentation entry. For a list of CMake find modules, see [this](https://cmake.org/cmake/help/latest/manual/cmake-modules.7.html#find-modules).

Finally, `cmake-include` works in conjunction with [import](#imports). If any imported `.lf` file has `cmake-include` in its target property, it will be appended to the current list of `cmake-include`s. These files will be resolved relative to the imported `.lf` file using the [[files | Target-Specification#files]] search procedure and copied to the directory that contains the generated sources. This will help resolve dependencies in imported reactors automatically and make the code more portable. [DistributedCMakeInclude.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/DistributedCMakeInclude.lf) is a test that uses this feature.

**Note**: For [[federated execution | Distributed-Execution]], both `cmake-include` and `file` are kept separate for each federate as much as possible. This means that if one federate is imported, or uses an imported reactor that other federates don't use, it will only have access to `cmake-include`s and `file`s defined in the main `.lf` file, plus the selectively imported `.lf` files. [DistributedCMakeIncludeSeparateCompile.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/DistributedCMakeIncludeSeparateCompile.lf) is a test that demonstrates this feature.

## Command-Line Arguments

The generated C program understands the following command-line arguments, each of which has a short form (one character) and a long form:

* `-f, --fast [true | false]`:  Specifies whether to wait for physical time to match logical time. The default is `false`. If this is `true`, then the program will execute as fast as possible, letting logical time advance faster than physical time.
* `-o, --timeout <duration> <units>`: Stop execution when logical time has advanced by the specified *duration*. The units can be any of nsec, usec, msec, sec, minute, hour, day, week, or the plurals of those.
* `-k, --keepalive [true | false]`: Specifies whether to stop execution if there are no events to process. This defaults to `false`, meaning that the program will stop executing when there are no more events on the event queue. If you set this to `true`, then the program will keep executing until either the `timeout` logical time is reached or the program is externally killed. If you have `physical action`s, it usually makes sense to set this to `true`.
* `-t, --threads <n>`: Executed in <n> threads if possible. This option is ignored in the single-threaded version. That is, it is ignored if a `threads` option was not given in the source .lf file.

Any other command-line arguments result in printing the above information.

## Imports

The [import statement](Language-Specification#import-statement) can be used to share reactor definitions across several applications. Suppose for example that we modify the above Minimal.lf program as follows and store this in a file called [HelloWorld.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/HelloWorld.lf):

    target C;
    reactor HelloWorld {
        reaction(startup) {=
            printf("Hello World.\n");
        =}
    }
    main reactor HelloWorldTest {
        a = new HelloWorld();
    }

This can be compiled and run, and its behavior will be identical to the version above.
But now, this can be imported into another reactor definition as follows:

    target C;
    import HelloWorld.lf;
    main reactor TwoHelloWorlds {
        a = new HelloWorld();
        b = new HelloWorld();
    }

This will create two instances of the HelloWorld reactor, and when executed, will print "Hello World" twice.

Note that in the above example, the order in which the two reactions are invoked is undefined
because there is no causal relationship between them. In fact, if you modify the target specification to say:

    target C {threads: 2};

then you might see garbled output if the implementation of `printf` on your machine is not thread safe (most modern implementations *are* thread safe, so you are not likely to see this behavior).

A more interesting illustration of imports can be found in the [Import.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Import.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/C).

## Preamble

Reactions may contain arbitrary C code, but often it is convenient for that code to invoke external libraries or to share procedure definitions.  For either purpose, a reactor may include a **preamble** section. For example, the following reactor uses the common `stdlib` C library to convert a string to an integer:

```
main reactor Preamble {
    preamble {=
        #include <stdlib.h>
    =}
    timer t;
    reaction(t) {=
        char* s = "42";
        int i = atoi(s);
        printf("Converted string %s to int %d.\n", s, i);
    =}
}
```

This will print:

```
Converted string 42 to int 42.
```

By putting the `#include` in the **preamble**, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file or in files that include this file.

You can also use the preamble to define functions that are shared across reactions and reactors (this is [Preamble.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Preamble.lf) in the test suite):

```
main reactor Preamble {
    preamble {=
        int add_42(int i) {
            return i + 42;
        }
    =}
    timer t;
    reaction(t) {=
        printf("42 plus 42 is %d.\n", add_42(42));
    =}
}
```

Not surprisingly, this will print:

```
42 plus 42 is 84.
```

## Reactions

Recall that a reaction is defined within a reactor using the following syntax:

> **reaction**(*triggers*) *uses* -> *effects* {=<br/>
> &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the C target.

### Inputs and Outputs

In the body of a reaction in the C target, the value of an input is obtained using the syntax `name->value`, where `name` is the name of the input port. To determine whether an input is present, use `name->is_present`. For example, the [Determinism.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Determinism.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/C) includes the following reactor:

    reactor Destination {
        input x:int;
        input y:int;
        reaction(x, y) {=
            int sum = 0;
            if (x->is_present) {
                sum += x->value;
            }
            if (y->is_present) {
                sum += y->value;
            }
            printf("Received %d.\n", sum);
        =}
    }

The reaction refers to the input values `x->value` and `y->value`  and tests for their presence by referring to the variables `x->is_present` and `y->is_present`.  If a reaction is triggered by just one input, then normally it is not necessary to test for its presence; it will always be present. But in the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:

```
    reaction(x) y {=
        int sum = x->value;
        if (y->is_present) {
            sum += y->value;
        }
        printf("Received %d.\n", sum);
    =}
```

It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Outputs are set using a `SET` macro. For example, we can further modify the above example as follows:

```
    output z:int;
    reaction(x) y -> z {=
        int sum = x->value;
        if (y->is_present) {
            sum += y->value;
        }
        SET(z, sum);
    =}
```
The `SET` macro is shorthand for this:
```
    z->value = sum;
    z->is_present = true;
```
There are several variants of the `SET` macro, and the one you should use depends on the type of the output. The simple version shown above works for all primitive C type (int, double, etc.) as well as the `bool` and `string` types that Lingua Franca defines. For the other variants, see [Sending and Receiving Arrays and Structs](#Sending-and-Receiving-Arrays-and-Structs) below.

If an output gets set more than once at any logical time, downstream reactors will see only the *final* value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name->is_present` to determine whether the output has been set.  For example, the following reactor (see [TestForPreviousOutput.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/TestForPreviousOutput.lf)) will always produce the output 42:
```
reactor TestForPreviousOutput {
    output out:int;
    reaction(startup) -> out {=
        // Set a seed for random number generation based on the current time.
        srand(time(0));
        // Randomly produce an output or not.
        if (rand() % 2) {
            SET(out, 21);
        }
    =}
    reaction(startup) -> out {=
        if (out->is_present) {
            SET(out, 2 * out->value);
        } else {
            SET(out, 42);
        }
    =}
}
```
The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

### Using State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor (see [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/lib/src/Count.lf) and [CountTest.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Count.lf)) will produce the output sequence 1, 2, 3, ... :

```
reactor Count {
    state count:int(1);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        SET(y, self->count++);
    =}
}
```
The declaration on the second line gives the variable the name "count", declares its type to be `int`, and initializes its value to 1. The type and initial value can be enclosed in the C-code delimiters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

**NOTE**: String types in C are `char*`. But, as explained below, types ending with `*` are interpreted specially to provide automatic memory management, which we generally don't want with strings (a string that is a compile-time constant must not be freed). You could enclose the type as `{= char* =}`, but to avoid this awkwardness, the header files include a typedef that permits using `string` instead of `char*`. For an example using `string` data types, see [DelayString.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf).

In the body of the reaction, the state variable is referenced using the syntax `self->count`. Here, **self** is a keyword that is provided by Lingua Franca. It refers to a struct that contains all the instance-specific data associated with an instance of the reactor. Since each instance of a reactor has its own state variables, these variables are carried in the **self** struct.

It may be tempting to declare state variables in the **preamble**, as follows:

```
reactor FlawedCount {
    preamble {=
        int count = 0;
    =}
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        SET(y, count++);
    =}
}
```

This will produce a sequence of integers, but if there is more than one instance of the reactor, those instances will share the same variable count. Hence, **don't do this**! Sharing variables across instances of reactors violates a basic principle, which is that reactors communicate only by sending messages to one another. Sharing variables will make your program nondeterministic. If you have multiple instances of the above FlawedCount reactor, the outputs produced by each instance will not be predictable, and in a multithreaded implementation, will also not be repeatable.

A state variable may be a time value, declared as follows (see for example [SlowingClock.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SlowingClock.lf)):

```
    state time_value:time(100 msec);
```
The `self->time_value` variable will be of type `instant_t`, which is a `long long` and the same type as `interval_t`. The value of the variable is a number in units of nanoseconds.

A state variable can have an array value. For example, the [MovingAverage] (https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/MovingAverage.lf) reactor computes the **moving average** of the last four inputs each time it receives an input:
```
reactor MovingAverageImpl {
    state delay_line:double[](0.0, 0.0, 0.0);
    state index:int(0);
    input in:double;
    output out:double;
    reaction(in) -> out {=
        // Calculate the output.
        double sum = in->value;
        for (int i = 0; i < 3; i++) {
            sum += self->delay_line[i];
        }
        SET(out, sum/4.0);

        // Insert the input in the delay line.
        self->delay_line[self->index] = in->value;

        // Update the index for the next input.
        self->index++;
        if (self->index >= 3) {
            self->index = 0;
        }
    =}
}
```
The second line declares that the type of the state variable is an array of `double`s with the initial value of the array being a three-element array filled with zeros.

States whose type are structs can similarly be initialized. See [StructAsState.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsState.lf).

### Using Parameters

Reactor parameters are also referenced in the C code using the **self** struct. The [Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Stride.lf) example modifies the above `Count` reactor so that its stride is a parameter:

```
target C;
reactor Count(stride:int(1)) {
    state count:int(1);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        SET(y, self->count);
        self->count += self->stride;
    =}
}
reactor Display {
    input x:int;
    reaction(x) {=
        printf("Received: %d.\n", x->value);
    =}
}
main reactor Stride {
    c = new Count(stride = 2);
    d = new Display();
    c.y -> d.x;
}
```

The second line defines the `stride` parameter, gives its type, and gives its initial value. As with state variables, the type and initial value can be enclosed in `{= ... =}` if necessary. The parameter is referenced in the reaction with the syntax `self->stride`.

When the reactor is instantiated, the default parameter value can be overridden. This is done in the above example near the bottom with the line:

```
    c = new Count(stride = 2);
```

If there is more than one parameter, use a comma separated list of assignments.

Parameters can have array values, though some care is needed. The [ArrayAsParameter](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsParameter.lf) example  outputs the elements of an array as a sequence of individual messages:
```
reactor Source(sequence:int[](0, 1, 2), n_sequence:int(3)) {
    output out:int;
    state count:int(0);
    logical action next;
    reaction(startup, next) -> out, next {=
        SET(out, self->sequence[self->count]);
        self->count++;
        if (self->count < self->n_sequence) {
            schedule(next, 0);
        }
    =}
}
```
The **logical action** named `next` and the `schedule` function are explained below in [Scheduling Delayed Reactions](#Scheduling-Delayed-Reactions); here they are used simply to repeat the reaction until all elements of the array have been sent.

In C, arrays do not encode their own length, so a separate parameter is used for the array length. Obviously, there is potential here for errors, where the array length doesn't match the length parameter.

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is that of a Lingua Franca list, `(0, 1, 2)`, which gets converted by the code generator into a C static initializer. The default value can be overridden when instantiating the reactor using a similar syntax:
```
    s = new Source(sequence = (1, 2, 3, 4), n_sequence=4);
```

### Sending and Receiving Arrays and Structs

You can define your own datatypes in C and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsType.lf) example:
```
reactor StructAsType {
    preamble {=
        typedef struct hello_t {
            char* name;
            int value;
        } hello_t;
    =}
    output out:hello_t;
    reaction(startup) -> out {=
        struct hello_t temp = {"Earth", 42};
        SET(out, temp);
    =}
}
```
The **preamble** code defines a struct datatype. In the reaction to **startup**, the reactor creates an instance of this struct on the stack (as a local variable named `temp`) and then copies that struct to the output using the `SET` macro.

For large structs, it may be inefficient to create a struct on the stack and copy it to the output, as done above. You can instead write directly to the fields of the struct. For example, the above reaction could be rewritten as follows (see [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsTypeDirect.lf)):
```
    reaction(startup) -> out {=
        out->value.name = "Earth";
        out->value.value = 42;
        SET_PRESENT(out);
    =}
```
The final call to `SET_PRESENT` is necessary to inform downstream reactors that the struct has a new value. (This is a macro that simply does `out->is_present = true`). Note that in subsequent reactions, the values of the struct persist. Hence, this technique can be very efficient if a large struct is modified only slightly in each of a sequence of reactions.

A reactor receiving the struct message uses the struct as normal in C:
```
reactor Print() {
    input in:hello_t;
    reaction(in) {=
        printf("Received: name = %s, value = %d\n", in->value.name, in->value.value);
    =}
}
```
The preamble should not be repeated in this reactor definition if the two reactors are defined together because this will trigger an error when the compiler thinks that hello_t is being redefined.

Arrays that have fixed sizes are handled similarly. Consider the [ArrayAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsType.lf) example:
```
reactor ArrayAsType {
    output out:int[3];
    reaction(startup) -> out {=
        out[0] = 0;
        out[1] = 1;
        out[2] = 2;
        SET_PRESENT(out);
    =}
}
```
Here, the output is declared to have type `int[3]`, an array of three integers. The startup reaction above writes to the array and then calls `SET_PRESENT` to indicate an updated value. Again, the values in the array will persist across reactions.

A reactor receiving this array is straightforward. It just references the array elements as usual in C, as illustrated by this example:
```
reactor Print() {
    input in:int[3];
    reaction(in) {=
        printf("Received: [");
        for (int i = 0; i < 3; i++) {
            if (i > 0) printf(", ");
            printf("%d", in->value[i]);
        }
        printf("]\n");
    =}
}
```

#### Dynamically Allocated Arrays

For arrays where the size is variable, it may be necessary to dynamically allocate memory.  But when should that memory be freed? A reactor cannot know when downstream reactors are done with the data. Lingua Franca provides utilities for managing this using reference counting. You can pass a pointer to a dynamically allocated object as illustrated in the [ArrayPrint](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayPrint.lf) example:
```
reactor ArrayPrint {
    output out:int[];
    reaction(startup) -> out {=
        // Dynamically allocate an output array of length 3.
        SET_NEW_ARRAY(out, 3);
        // Above allocates the array, which then must be populated.
        out[0] = 0;
        out[1] = 1;
        out[2] = 2;
    =}
}
```
This declares the output datatype to be `int[]` (or, equivalently, `int*`), an array of integers of unspecified size. To produce the array in a reaction, it uses the library function `SET_NEW_ARRAY` to allocate an array of length 3 and sets the output to send that array. The reaction then populates the array with data. The deallocation of the memory for the array will occur automatically after the last reactor that receives a pointer to the array has finished using it.

A reactor receiving the array looks like this:
```
reactor Print {
    input in:int[];
    reaction(in) {=
        printf("Received: [");
        for (int i = 0; i < in->length; i++) {
            if (i > 0) printf(", ");
            printf("%d", in->value[i]);
        }
        printf("]\n");
    =}
}
```
In the body of the reaction, `in->value` is a pointer to first element of the array, so it can be indexed as usual with arrays in C, `in->value[i]`. Moreover, a variable `in->length` is bound to the length of the array.

Although it cannot be enforced in C, the receiving reactor should not modify the values stored in the array. Inputs are logically *immutable* because there may be several recipients. Any recipient that wishes to modify the array should make a copy of it. Fortunately, a utility is provided for this pattern. Consider the [ArrayScale](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayScale.lf) example:
```
reactor ArrayScale(scale:int(2)) {
    mutable input in:int[];
    output out:int[];
    reaction(in) -> out {=
        for(int i = 0; i < in->length; i++) {
            in->value[i] *= self->scale;
        }
        SET_TOKEN(out, in->token);
    =}
}
```
Here, the input is declared **mutable**, which means that any reaction is free to modify the input. If this reactor is the only recipient of the array or the last recipient of the array, then this will not copy of the array but rather use the original array. Otherwise, it will use a copy.

The above `ArrayScale` reactor modifies the array and then forwards it to its output port using the `SET_TOKEN()` macro. That macro further delegates to downstream reactors the responsibility for freeing dynamically allocated memory once all readers have completed their work.

If the above code were not to forward the array, then the dynamically allocated memory will be automatically freed when this reactor is done with it.

The above three reactors can be combined into a pipeline as follows:
```
main reactor ArrayScaleTest {
    s = new ArrayPrint();
    c = new ArrayScale();
    p = new Print();
    s.out -> c.in;
    c.out -> p.in;
}
```
In this composite, the array is allocated by `ArrayPrint`, modified by `ArrayScale`, and deallocated (freed) after `Print` has reacted. No copy is necessary because `ArrayScale` is the only recipient of the original array.

Inputs and outputs can also be dynamically allocated structs. In fact, Lingua Franca's C target will treat any input or output datatype that ends with `[]` or `*` specially by providing utilities for allocating memory and modifying and forwarding. Deallocation of the allocated memory is automatic.  The complete set of utilities is given below.

#### Macros For Setting Output Values

In all of the following, *out* is the name of the output and *value* is the value to be sent.

> **SET**(*out*, *value*);
    Set the specified output (or input of a contained reactor) to the specified value. This version is used for primitive type such as `int`, `double`, etc. as well as the built-in types `bool` and `string` (but only if the string is a statically allocated constant; otherwise, see `SET_NEW_ARRAY`). It can also be used for structs with a type defined by a `typedef` so that the type designating string does not end in '*'. The value is copied and therefore the variable carrying the value can be subsequently modified without changing the output.

> **SET_ARRAY**(*out*, *value*, *element_size*, *length*);
    This version is used for outputs with a type declaration ending with `[]` or `*`, such as `int[]`. This version is for use when the *value* to be sent is in dynamically allocated memory that will need to be freed downstream. The allocated memory will be automatically freed when all recipients of the outputs are done with it. Since C does not encode array sizes as part of the array, the *length* and *element_size* must be given (the latter is the size of each element in bytes). See [SetArray.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetArray.lf).

> **SET_NEW**(*out*);
   This version is used for outputs with a type declaration ending with `*` (see example below). This sets the `out` variable to point to newly allocated memory for storing the specified output type. After calling this function, the reaction should populate that memory with the content it intends to send to downstream reactors. This macro is equivalent to `SET_NEW_ARRAY(out, 1)`. See [StructPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructPrint.lf)

> **SET_NEW_ARRAY**(*out*, *length*);
    This version is used for outputs with a type declaration ending with `[]` or `*`. This sets the *out* variable to point to newly allocated memory sufficient to hold an array of the specified length containing the output type in each element. The caller should subsequently populate the array with the contents that it intends to send to downstream reactors.  See [ArrayPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayPrint.lf).
    **Dynamically allocated strings:** If an output is to be a dynamically allocated string, as opposed to a static string constant, then you can use `SET_NEW_ARRAY` to allocate the memory, and the memory will be automatically freed downstream after the all users have read the string. To do this, set the output type to `char[]` or `char*` rather than `string` and call `SET_NEW_ARRAY` with the desired length. After this, *out* will point to a char array of the required length. You can then populate it with your desired string, e.g. using `snprintf()`. See [DistributedToken.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/federated/DistributedToken.lf)

>**SET_PRESENT**(*out*);
    This version just sets the *out*->is_present variable corresponding to the specified output  to true. This is normally used with array outputs with fixed sizes and statically allocated structs.  In these cases, the values in the output are normally written directly to the array or struct. See [ArrayAsType.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsType.lf)

> **SET_TOKEN**(*out*, *value*);
    This version is used for outputs with a type declaration ending with `*` (any pointer) or `[]` (any array). The *value* argument should be a struct of type `token_t`. This can be the trickiest form to use, but it is rarely necessary for the programmer to create their own (dynamically allocated) instance of `token_t`. Consider the [SetToken.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetToken.lf) example:
```
    reactor Source {
        output out:int*;
        logical action a:int;
        reaction(startup) -> a {=
            schedule_int(a, MSEC(200), 42);
        =}
        reaction(a) -> out {=
            SET_TOKEN(out, a->token);
        =}
    }
```
Here, the first reaction schedules an integer-valued action to trigger after 200 microseconds. As explained below, action payloads are carried by tokens. The second reaction grabs the token rather than the value using the syntax `a->token` (the name of the action followed by `->token`). It then forwards the token to the output. The output data type is `int*` not `int` because the token carries a pointer to dynamically allocated memory that contains the value. All inputs and outputs with types ending in `*` or `[]` are carried by tokens.

All of the SET macros will overwrite any output value previously set at the same logical time and will cause the final output value to be sent to all reactors connected to the output. They also all set a local *out*->is_present variable to true. This can be used to subsequently test whether the output value has been set.

#### Dynamically Allocated Structs

The `SET_NEW` and `SET_TOKEN` macros can be used to send `structs` of arbitrary complexity. For example:
```
reactor StructPrint {
    preamble {=
        typedef struct hello_t {
            char* name;
            int value;
        } hello_t;
    =}
    output out:hello_t*;
    reaction(startup) -> out {=
        // Dynamically allocate an output struct.
        SET_NEW(out);
        // Above allocates a struct, which then must be populated.
        out->value->name = "Earth";
        out->value->value = 42;
    =}
}
```
The **preamble** declares a struct type `hello_t` with two fields, and the `SET_NEW` macro allocates memory to contain such a struct. The subsequent code populates that memory. A reactor receiving this struct might look like this:
```
reactor Print() {
    input in:hello_t*;
    reaction(in) {=
        printf("Received: name = %s, value = %d\n",
            in->value->name, in->value->value
        );
    =}
}
```
Just as with arrays, an input with a pointer type can be declared **mutable**, in which case it is safe to modify the fields and forward the struct.

Occasionally, you will want an input or output type to be a pointer, but you don't want the automatic memory allocation and deallocation. A simple example is a string type, which in C is `char*`. Consider the following (erroneous) reactor:
```
reactor Erroneous {
    output out:char*;
    reaction(startup) -> out {=
        SET(out, "Hello World");
    =}
}
```
An output data type that ends with `*` signals to Lingua Franca that the message is dynamically allocated and must be freed downstream after all recipients are done with it. But the "Hello World" string here is statically allocated,  so an error will occur when the last downstream reactor to use this message attempts to free the allocated memory. To avoid this for strings, you can use the `string` type, defined in `reactor.h`, as follows:
```
reactor Fixed {
    output out:string;
    reaction(startup) -> out {=
        SET(out, "Hello World");
    =}
}
```
The `string` type is equivalent to `char*`, but since it doesn't end with `*`, it does not signal to Lingua Franca that the type is dynamically allocated. Lingua Franca only handles allocation and deallocation for types that are specified literally with a final `*` in the type name. The same trick can be used for any type where you don't want automatic allocation and deallocation. E.g., the [SendsPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendsPointerTest.lf) example looks like this:
```
reactor SendsPointer  {
    preamble {=
        typedef int* int_pointer;
    =}
    output out:int_pointer;
    reaction(startup) -> out {=
        static int my_constant = 42;
        SET(out, &my_constant;)
    =}
}
```
The above technique can be used to abuse the reactor model of computation by communicating pointers to shared variables. This is generally a bad idea unless those shared variables are immutable. The result will likely be nondeterministic. Also, communicating pointers across machines that do not share memory will not work at all.

## Timed Behavior

Timers are specified exactly as in the [Lingua Franca language specification](Language-Specification#timer-declaration). When working with time in the C code body of a reaction, however, you will need to know a bit about its internal representation.

In the C target, the value of a time instant or interval is an integer specifying a number of nanoseconds. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Time in the C target is a `long long`, which is (normally) a 64 bit signed number. Since a 64-bit number has a limited range, this measure of time instants will overflow in approximately the year 2262.  For better code clarity, two types are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h), `instant_t` and `interval_t`, which you can use for time instants and intervals respectively. These are both equivalent to `long long`, but using those types will insulate your code against changes and platform-specific customizations.

Lingua Franca uses a superdense model of time. A reaction is invoked at a logical **tag**, a struct consists of a `time` value (an `instant_t`, which is a `long long`) and a `microstep` value (a `microstep_t`, which is an unsigned `int`). The tag is guaranteed to not increase during the execution of a reaction.  Outputs produced by a reaction have the same tag as the inputs, actions, or timers that trigger the reaction, and hence are **logically simultaneous**.

The time structs and functions for working with time are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h).  The most useful functions are:

* `tag_t get_current_tag()`: Get the current tag at which this reaction has been invoked.
* `instant_t get_logical_time()`: Get the current logical time (the first part of the current tag).
* `microstep_t get_microstep() `: Get the current microstep (the second part of the current tag).
* `interval_t get_elapsed_logical_time()`: Get the logical time elapsed since program start.
* `int compare_tags(tag_t, tag_t)`: Compare two tags, returning -1, 0, or 1 for less than, equal, and greater than.

There are also some useful functions for accessing physical time:

* `instant_t get_physical_time()`: Get the current physical time.
* `instant_t get_elapsed_physical_time()`: Get the physical time elapsed since program start.
* `instant_t get_start_time()`: Get the starting physical and logical time.

The last of these is both a physical and logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/GetTime.lf) example:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        instant_t logical = get_logical_time();
        printf("Logical time is %lld.\n", logical);
    =}
}
```

When executed, you will get something like this:

```
Start execution at time Sun Oct 13 10:18:36 2019
plus 353609000 nanoseconds.
Logical time is 1570987116353609000.
Logical time is 1570987117353609000.
Logical time is 1570987118353609000.
...
```

The first two lines give the current time-of-day provided by the execution platform at the start of execution. This is used to initialize logical time. Subsequent values of logical time are printed out in their raw form, rather than the friendlier form in the first two lines. If you look closely, you will see that each number is one second larger than the previous number, where one second is 1000000000 nanoseconds.

You can also obtain the *elapsed* logical time since the start of execution:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        interval_t elapsed = get_elapsed_logical_time();
        printf("Elapsed logical time is %lld.\n", elapsed);
    =}
}
```

This will produce:

```
Start execution at time Sun Oct 13 10:25:22 2019
plus 833273000 nanoseconds.
Elapsed logical time is 0.
Elapsed logical time is 1000000000.
Elapsed logical time is 2000000000.
...
```

You can also get physical time, which comes from your platform's real-time clock:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        instant_t physical = get_physical_time();
        printf("Physical time is %lld.\n", physical);
    =}
}
```

This will produce something like this:

```
Start execution at time Sun Oct 13 10:35:59 2019
plus 984992000 nanoseconds.
Physical time is 1570988159986108000.
Physical time is 1570988160990219000.
Physical time is 1570988161990067000.
...
```

Finally, you can get elapsed physical time:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        instant_t elapsed_physical = get_elapsed_physical_time();
        printf("Elapsed physical time is %lld.\n", elapsed_physical);
    =}
}
```

This will produce something like this:

```
Elapsed physical time is 657000.
Elapsed physical time is 1001856000.
Elapsed physical time is 2004761000.
...
```
Notice that these numbers are increasing by *roughly* one second each time. If you set the `fast` target parameter to `true`, then physical time will elapse much faster than logical time.

Working with nanoseconds in C code can be tedious if you are interested in longer durations. For convenience, a set of macros are available to the C programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in C code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided macros are NSEC, USEC (for microseconds), MSEC, SEC, MINUTE, HOUR, DAY, and WEEK. You may also use the plural of any of these. Examples are given in the next section.

### Scheduling Delayed Reactions

The C target provides a variety of `schedule()` functions to trigger an action at a future logical time. Actions are described in the [Language Specification](language-specification#action-declaration) document. Consider the [Schedule](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Schedule.lf) reactor:

    target C;
    reactor Schedule {
        input x:int;
        logical action a;
        reaction(a) {=
            interval_t elapsed_time = get_elapsed_logical_time();
            printf("Action triggered at logical time %lld nsec after start.\n", elapsed_time);
        =}
        reaction(x) -> a {=
            schedule(a, MSEC(200));
        =}
    }

When this reactor receives an input `x`, it calls `schedule()`, specifying the action `a` to be triggered and the logical time offset (200 msec). The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. At that logical time, the second reaction will trigger and will use the `get_elapsed_logical_time()` function to determine how much logical time has elapsed since the start of execution.

Notice that after the logical time offset of 200 msec, there may be another input `x` simultaneous with the action `a`. Because the reaction to `a` is given first, it will execute first. This becomes important when such a reactor is put into a feedback loop (see below).

### Zero-Delay Actions

If the specified delay in a `schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time *t*, and you call `schedule()` as follows:

    schedule(a, 0);

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the *previous* microstep). The reaction to `x` and the reaction to `a` occur at the same metric time *t*, but separated by one microstep, so these two reactions are *not* logically simultaneous.

The metric time is visible to the C programmer and can be obtained in a reaction using either
`get_elapsed_logical_time()`, as above, or `get_logical_time()`. The latter function also returns a `long long` (aka `instant_t`), but its meaning is now the time elapsed since January 1, 1970 in nanoseconds.

As described in the [Language Specification](language-specification#action-declaration) document, action declarations can have a *min_delay* parameter. This modifies the timestamp further. Also, the action declaration may be **physical** rather than **logical**, in which case, the assigned timestamp will depend on the physical clock of the executing platform.

## Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action.  This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from the [Contained Reactors](language-specification#Contained-Reactors) section in the Language Specification document that the **after** keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayInt.lf) example:

    reactor DelayInt(delay:time(100 msec)) {
        input in:int;
        output out:int;
        logical action d:int;
        reaction(d) -> out {=
            SET(out, d->value);
        =}
        reaction(in) -> d {=
            schedule_int(d, self->delay, in->value);
        =}
    }

Using this reactor as follows
```
    d = new Delay();
    source.out -> d.in;
    d.in -> sink.out
```
is equivalent to
```
    source.out -> sink.in after 100 msec
```
(except that our `DelayInt` reactor will only work with data type `int`).

The action `d` is specified with a type `int`. The reaction to the input `in` declares as its effect the action `d`. This declaration makes it possible for the reaction to schedule a future triggering of `d`. The reaction uses one of several variants of the **schedule** function, namely **schedule_int**, a convenience function provided because integer payloads on actions are very common. We will see below, however, that payloads can have any data type.

The first reaction declares that it is triggered by `d` and has effect `out`. To read the value, it uses the `d->value` variable. Because this reaction is first, the `out` at any logical time can be produced before the input `in` is even known to be present. Hence, this reactor can be used in a feedback loop, where `out` triggers a downstream reactor to send a message back to `in` of this same reactor. If the reactions were given in the opposite order, there would be causality loop and compilation would fail.

If you are not sure whether an action carries a value, you can test for it as follows:

```
    reaction(d) -> out {=
        if (d->has_value) {
            SET(out, d->value);
        }
    =}
```

It is possible to both be triggered by and schedule an action the same reaction. For example, this [CountSelf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/CountSelf.lf) reactor will produce a counting sequence after it is triggered the first time:

```
reactor CountSelf(delay:time(100 msec)) {
    output out:int;
    logical action a:int;
    reaction(startup) -> a, out {=
        SET(out, 0);
        schedule_int(a, self->delay, 1);
    =}
    reaction(a) -> a, out {=
        SET(out, a->value);
        schedule_int(a, self->delay, a->value + 1);
    =}
}
```
Of course, to produce a counting sequence, it would be more efficient to use a state variable.

Actions with values can be rather tricky to use because the value must usually be carried in dynamically allocated memory. It will not work for value to refer to a state variable of the reactor because that state variable will likely have changed value by the time the reactions to the action are invoked. Several variants of the **schedule** function are provided to make it easier to pass values across time in varying circumstances.

> **schedule**(*action*, *offset*);
    This is the simplest version as it carries no value. The action need not have a data type.

> **schedule_int**(*action*, *offset*, *value*);
    This version carries an `int` value. The datatype of the action is required to be `int`.

> **schedule_token**(*action*, *offset*, *value*);
    This version carries a **token**, which has type `token_t` and points to the value, which can have any type. There is a `create_token()` function that can be used to create a token, but programmers will rarely need to use this.  Instead, you can use `schedule_value()` (see below), which will automatically create a token. Alternatively, for inputs with types ending in `*` or `[]`, the value is wrapped in a token, and the token can be obtained using the syntax `inputname->token` in a reaction and then forwarded using `schedule_token()` (see section [Dynamically Allocated Structs](#Dynamically-Allocated-Structs) above). If the input is mutable, the reaction can then even modify the value pointed to by the token and/or use `schedule_token()` to send the token to a future logical time. For example, the [DelayPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayPointer.lf) reactor realizes a logical delay for any datatype carried by a token:
```
reactor DelayPointer(delay:time(100 msec)) {
    input in:void*;
    output out:void*;
    logical action a:void*;
    reaction(a) -> out {=
        // Using SET_TOKEN delegates responsibility for
        // freeing the allocated memory downstream.
        SET_TOKEN(out, a->token);
    =}
    reaction(in) -> a {=
        // Schedule the actual token from the input rather than
        // a new token with a copy of the input value.
        schedule_token(a, self->delay, in->token);
    =}
}
```

>  **schedule_value**(*action*, *offset*, *value*, *length*);
    This version is used to send into the future a value that has been dynamically allocated malloc. It will be automatically freed when it is no longer needed. The *value* argument is a pointer to the memory containing the value. The *length* argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly. See [ScheduleValue.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ScheduleValue.lf).

> **schedule_copy**(*action*, *offset*, *value*, *length*);
    This version is for sending a copy of some data pointed to by the *value* argument. The data is assumed to be a scalar or array of type matching the *action* type. The *length* argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly.

Occasionally, an action payload may not be dynamically allocated nor freed. For example, it could be a pointer to a statically allocated string. If you know this to be the case, the  [DelayString](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf) reactor will realize a logical time delay on such a string:

```
reactor DelayString(delay:time(100 msec)) {
    input in:string;
    output out:string;
    logical action a:string;
    reaction(a) -> out {=
        SET(out, a->value);
    =}
    reaction(in) -> a {=
        // The following copies the char*, not the string.
        schedule_copy(a, self->delay, &(in->value), 1);
    =}
}
```
The datatype `string` is an alias for `char*`, but Lingua Franca does not know this, so it creates a token that contains a copy of the pointer to the string rather than a copy of the string itself.

## Stopping Execution

A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in function `request_stop()`, which takes no arguments. In a non-federated execution, the returned time is normally the same as the current logical time, and the actual last tag will be one microstep later. In a federated execution, however, the stop time will likely be larger than the current logical time. All federates are assured of stopping at the same logical time.

## Log and Debug Information

A suite of useful functions is provided in [util.h](https://github.com/lf-lang/lingua-franca/blob/master/org.lflang/src/lib/core/util.h) for producing messages to be made visible when the generated program is run.  Of course, you can always use `printf`, but this is not a good choice for logging or debug information, and it is not a good choice when output needs to be redirected to a window or some other user interface (see for example the [sensor simulator](https://github.com/lf-lang/lingua-franca/blob/master/org.lflang/src/lib/C/util/sensor_simulator.h)). Also, [[Distributed Execution]], these functions identify which federate is producing the message. The functions are listed below. The arguments for all of these are identical to `printf` with the exception that a trailing newline is automatically added and therefore need not be included in the format string.

* `DEBUG_PRINT(format, ...)`: Use this for verbose messages that are only needed during debugging. Nothing is printed unless the [target](Language-Specification#Target-Specification) parameter `logging` is set to `debug`. This is a macro so that overhead is minimized when nothing is to be printed.

* `LOG_PRINT(format, ...)`: Use this for messages that are useful logs of the execution. Nothing is printed unless the [target parameter `logging`](https://github.com/lf-lang/lingua-franca/wiki/Target-Specification#logging) is set to `log` or `debug`. This is a macro so that overhead is minimized when nothing is to be printed.

* `info_print(format, ...)`: Use this for messages that should normally be printed but may need to be redirected to a user interface such as a window or terminal (see `register_print_function` below). These messages can be suppressed by setting the [logging target property](https://github.com/lf-lang/lingua-franca/wiki/Target-Specification#logging) to `warn` or `error`.

* `warning_print(format, ...)`: Use this for warning messages. These messages can be suppressed by setting the [logging target property](https://github.com/lf-lang/lingua-franca/wiki/Target-Specification#logging) to `error`.

* `error_print(format, ...)`: Use this for error messages. These messages are not suppressed by any [logging target property](https://github.com/lf-lang/lingua-franca/wiki/Target-Specification#logging).

* `error_print_and_exit(format, ...)`: Use this for catastrophic errors.

In addition, a utility function is provided to register a function to redirect printed outputs:

* `register_print_function(function)`: Register a function that will be used instead of `printf` to print messages generated by any of the above functions. The function should accept the same arguments as `printf`.

## Implementation Details

### Included Libraries

The generated code includes the following standard C libraries, so there is no need for a reactor definition to explicitly include them if they are needed:

* stdio.h
* stdlib.h
* string.h
* time.h
* errno.h

In addition, the multithreaded implementation uses

* pthread.h

### Single Threaded Implementation

The runtime library for the single-threaded implementation is in the following files:

* reactor.c
* reactor_common.c (included in the above using #include)
* pqueue.c

Three  header files provide the interfaces:

* reactor.h
* ctarget.h
* pqueue.h

The strategy is to have two queues of pending accessor invocations, one that is sorted by timestamp (the event queue) and one that is sorted by priority (the reaction queue). Execution proceeds as follows:

1. At initialization, an event for each timer is put on the event queue and logical time is initialized to the current time, represented as the number of nanoseconds elapsed since January 1, 1970.

2. At each logical time, pull all events from event queue that have the same earliest time stamp, find the reactions that these events trigger, and put them on the reaction queue. If there are no events on the event queue, then exit the program (unless the `--keepalive true` command-line argument is given).

3. Wait until physical time matches or exceeds that earliest timestamp (unless the `--fast true` command-line argument is given). Then advance logical time to match that earliest timestamp.

4.  Execute reactions in order of priority from the reaction queue.  These reactions may produce outputs, which results in more events getting put on the reaction queue.  Those reactions are assured of having lower priority than the reaction that is executing. If a reaction calls `schedule()`, an event will be put on the event queue, not the reaction queue.

5. When the reaction queue is empty, go to 2.

### Multithreaded Implementation

The runtime library for the multithreaded implementation is in the following files:

* reactor_threaded.c
* reactor_common.c (included in the above using #include)
* pqueue.c

The same two header files provide the interfaces:

* reactor.h
* pqueue.h

The default number of worker threads is given by the `threads` argument in the [target](#The-C-Target) statement.
This can be overridden with the `--threads` [command-line argument](#command-line-arguments).

Upon initialization, the main thread will create the specified number of worker threads.
A good choice is for this number to match the number of available cores.
Execution proceeds in a manner similar to the [single threaded implementation](single-threaded-implementation)
except that the worker threads concurrently draw reactions from the reaction queue.
The execution algorithm ensures that no reaction executes until all reactions that it depends on that are also
on the reaction queue have executed at the current logical time.

FIXME: Describe the algorithm exploiting parallelism.

## Reactors on Patmos

Reactors can be executed on [Patmos](https://github.com/t-crest/patmos), a bare-metal execution platform
that is optimized for time-predictable execution. Well written C programs can be analyzed for their
worst-case execution time (WCET).

### Compiling and Running Reactors

Patmos can run in an FPGA, but there are also two
simulators available:

1. ```pasim``` a software ISA simulator that is written in C++.
2. ```patemu``` a cycle-accurate hardware emulator generated from the hardware description.

To execute reactions on Patmos, the [Patmos toolchain](https://github.com/t-crest/patmos) needs
to be installed. The web page contains a quick start, detailed information including how to
perform WCET analysis is available in the
[Patmos Reference Handbook](http://patmos.compute.dtu.dk/patmos_handbook.pdf).

To execute the "hello world" reactor on Patmos use the LF compiler to generate the C code.
Compile the reactor with the Patmos compiler (in ```src-gen```):

    patmos-clang Minimal.c -o Minimal.elf

The reactor can be executed on the SW simulator with:

    pasim Minimal.elf

As Patmos is a bare metal runtime that has no notion of calendar time, its start time
is considered the epoch and the following output will be observed:

```
Start execution at time Thu Jan  1 00:00:00 1970
plus 640000 nanoseconds.
Hello World.
Elapsed logical time (in nsec): 0
Elapsed physical time (in nsec): 3970000
```

The reactor can also be executed on the hardware emulator of Patmos:

    patemu Minimal.elf

This execution is considerably slower than the SW simulator, as the concrete hardware
of Patmos is simulated cycle-accurate.

### Worst-Case Execution Time Analysis

Following example is a code fragment from
[Wcet.lf](https://github.com/lf-lang/lingua-franca/blob/master/xtext/org.icyphy.linguafranca/src/test/C/src/Wcet.lf).

```
reactor Work {
    input in1: int;
    input in2: int;
    output out:int;
    reaction(in1, in2) -> out {=
    	int ret;
    	if (in1 > 10) {
    		ret = in2 * in1;
    	} else {
    		ret = in2 + in1;
    	}
        SET(out, ret);
    =}
}
```

We want to perform WCET analysis of the single reaction of the Work reactor.
This reaction, depending on the input data, will either perform a multiplication,
which is more expensive in Patmos, or an addition. The WCET analysis shall consider
the multiplication path as the worst-case path. To generate the information for
WCET analysis by the compiler we have to compile the application as follows:

    patmos-clang -O2 -mserialize=wcet.pml Wcet.c

We investigate the C source code ```Wcet.c``` and find that the reaction we
are interested is named ```reaction_function1```. Therefore, we invoke WCET analysis
as follows:

    platin wcet -i wcet.pml -b a.out -e reaction_function1 --report

This results in following report:

```
...
[platin] INFO: Finished run WCET analysis (platin)          in 62 ms
[platin] INFO: best WCET bound: 242 cycles
---
- analysis-entry: reaction_function1
  source: platin
  cycles: 242
...
```

The analysis gives the WCET of 242 clock cycles for the reaction,
which includes clock cycles for data cache misses.
Further details on the WCET analysis
tool ```platin``` and e.g., how to annotate loop bounds can be found in the
[Patmos Reference Handbook](http://patmos.compute.dtu.dk/patmos_handbook.pdf).

Note, that the WCET analysis of a reaction does only include the code of the
reaction function, not the cache miss cost of calling the function from
the scheduler or the cache miss cost when returning to the scheduler.

## The CCpp Target
In some cases, it might be needed or desirable to mix C and C++ code, including in the body of reactions, or in included libraries and header files. The C target uses a C compiler by default, and will fail to compile mixed C/C++ language programs. As a remedy, we offer a `CCpp` target that uses the C runtime but employs a C++ compiler to compile your program. To use it, simply replace `target C` with `target CCpp`.

Here is a minimal example of a program written in the `CCpp` target, taken from [HelloWorldCCPP.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/HelloWorldCCPP.lf):
```
target CCpp;
reactor HelloWorld {
    preamble {=
        #include <iostream> // Note that no C++ header will be included by default.
    =}
    reaction(startup) {=
        std::cout << "Hello World." << std::endl;
    =}
}
main reactor {
    a = new HelloWorld();
}
```

**Note:** Unless some [feature](Support-Matrix) in the C target is needed, we recommend using the [Cpp target](Writing-Reactors-in-Cpp) that uses a runtime that is written natively in C++.

**Note:** A `.lf` file that uses the `CCpp` target cannot and should not be imported to an `.lf` file that uses the `C` target. Although these two targets use essentially the same runtime, such a scenario can cause unintended compiler errors.