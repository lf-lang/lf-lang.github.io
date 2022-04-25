---
title: "Target Language Reference"
layout: docs
permalink: /docs/handbook/target-language-reference
oneline: "Detailed reference for each target langauge."
preamble: >
---

[comment]: <> (Unfortunately, HTML has on include function, so we)
[comment]: <> (have to put all the target languages in one file.)

$page-showing-target$

[comment]: <> (================= NEW SECTION =====================)

## Overview

<div class="lf-c">

In the C reactor target for Lingua Franca, reactions are written in C and the code generator generates one or more standalone C programs that can be compiled and run on several platforms. It has been tested on MacOS, Linux, Windows, and at least one bare-iron embedded platforms. The single-threaded version (which you get by setting the [`threading` target parameter](/docs/handbook/target-declaration#threading) to `false`) is the most portable, requiring only a handful of common C libraries (see [Included Libraries](#included-libraries) below). The multithreaded version requires a small subset of the Posix thread library (`pthreads`) and transparently executes in parallel on a multicore machine while preserving the deterministic semantics of Lingua Franca.

Note that C is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Here, we provide some guidelines for a style for writing reactors that will be safe.

**NOTE:** If you intend to use C++ code or import C++ libraries in the C target, we provide a special [CCpp target](#the-ccpp-target) that automatically uses a C++ compiler by default. Alternatively, you might want to use the [Cpp target](/docs/handbook/cpp-reactors).

</div>

<div class="lf-cpp">

In the C++ reactor target for Lingua Franca, reactions are written in C++ and the code generator generates a standalone C++ program that can be compiled and run on all major platforms. Our continous integration ensures compatibility with Windows, MacOS and Linux.
The C++ target solely depends on a working C++ build system including a recent C++ compiler (supporting C++17) and [CMake](https://cmake.org/) (>= 3.5). It relies on the [reactor-cpp](https://github.com/lf-lang/reactor-cpp) runtime, which is automatically fetched and compiled in the background by the Lingua Franca compiler.

Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe.

</div>

<div class="lf-py">

In the Python reactor target for Lingua Franca, reactions are written in Python. The user-written reactors are then generated into a Python 3 script that can be executed on several platforms. The Python target has been tested on Linux, MacOS, and Windows. To facilitate efficient and fast execution of Python code, the generated program relies on a C extension to facilitate Lingua Franca APIs such as `set` and `schedule`. To learn more about the structure of the generated Python program, see [Implementation Details](#python-target-implementation-details).

Python reactors can bring the vast library of scientific modules that exist for Python into a Lingua Franca program. Moreover, since the Python reactor target is based on a fast and efficient C runtime library, Lingua Franca programs can execute much faster than native equivalent Python programs in many cases. Finally, interoperability with C reactors is planned for the future.

In comparison to the C target, the Python target can be up to an order of magnitude slower. However, depending on the type of application and the implementation optimizations in Python, you can achieve an on-par performance to the C target in many applications.

**NOTE:** A [Python C
extension](https://docs.python.org/3/extending/extending.html) is
generated for each Lingua Franca program (see [Implementation
Details](#python-target-implementation-details)). This extension module will
have the name LinguaFranca[your_LF_program_name].

</div>

<div class="lf-ts">

In the TypeScript reactor target for Lingua Franca, reactions are written in [TypeScript](https://www.typescriptlang.org/) and the code generator generates a standalone TypeScript program that can be compiled to JavaScript and run on [Node.js](https://nodejs.org).

TypeScript reactors bring the strengths of TypeScript and Node.js to Lingua Franca programming. The TypeScript language and its associated tools enable static type checking for both reaction code and Lingua Franca elements like ports and actions. The Node.js JavaScript runtime provides an execution environment for asynchronous network applications. With Node.js comes Node Package Manager ([npm](https://www.npmjs.com/)) and its large library of supporting modules.

In terms of raw performance on CPU intensive operations, TypeScript reactors are about two orders of magnitude slower than C reactors. But excelling at CPU intensive operations isn't really the point of Node.js (or by extension TypeScript reactors). Node.js is about achieving high throughput on network applications by efficiently handling asynchronous I/O operations. Keep this in mind when choosing the right Lingua Franca target for your application.

</div>

<div class="lf-rs">

**Important:** The Rust target is still quite preliminary. This is early WIP documentation to let you try it out if you're curious

In the Rust reactor target for Lingua Franca, reactions are written in Rust and the code generator generates a standalone Rust program that can be compiled and run on platforms supported by rustc. The program depends on a runtime library distributed as the crate [reactor_rt](https://github.com/lf-lang/reactor-rust), and depends on the Rust standard library.

Documentation for the runtime API is available here: https://lf-lang.org/reactor-rust/

LF-Rust generates a Cargo project per compiled main reactor. This specification assumes in some places that the user is somewhat familiar with how Cargo works.
If you're not, here's a primer:

- a Rust project (and its library artifact) are called a _crate_.
- Cargo is the Rust package manager and build tool. LF/Rust uses Cargo to build the generated project.
- Rust has extensive support for conditional compilation. Cargo _features_ are commonly used to enable or disable the compilation of parts of a crate. A feature may also pull in additional dependencies. Cargo features only influence the compilation process; if you don't mention the correct feature flags at compilation time, those features cannot be made available at runtime. The Rust reactor runtime crate uses Cargo features to conditionally enable some features, eg, command-line argument parsing.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Requirements

<div class="lf-c">

The following tools are required in order to compile the generated C++ source code:

- A C compiler such as `gcc`
- A recent version of `cmake` (at least 3.5)

</div>

<div class="lf-cpp">

The following tools are required in order to compile the generated C++ source code:

- A recent C++ compiler supporting C++17
- A recent version of `cmake` (at least 3.5)

</div>

<div class="lf-py">

To use this target, install Python 3 on your machine. See [downloading Python](https://wiki.python.org/moin/BeginnersGuide/Download).

**NOTE:** The Python target requires a C implementation of Python (nicknamed CPython). This is what you will get if you use the above link, or with most of the alternative Python installations such as Anaconda. See [this](https://www.python.org/download/alternatives/) for more details.

The Python reactor target relies on `setuptools` to be able to compile a [Python
C extension](https://docs.python.org/3/extending/extending.html) for each LF
program.

<!-- To install `pip3`, you can follow instructions [here](https://pip.pypa.io/en/stable/installation/). -->

`setuptools` can be installed using `pip3`:

```bash
pip3 install setuptools
```

</div>

<div class="lf-ts">

First, make sure Node.js is installed on your machine. You can [download Node.js here](https://nodejs.org/en/download/). The npm package manager comes along with Node.

After installing Node, you may optionally install the TypeScript compiler.

```
npm install -g typescript
```

TypeScript reactor projects are created with a local copy of the TypeScript compiler, but having the TypeScript compiler globally installed can be useful for [debugging type errors](#debugging-type-errors) and type checking on the command line.

</div>

<div class="lf-rs">

In order to compile the generated Rust source code, you need a recent version of [Cargo](https://doc.rust-lang.org/cargo/), the Rust package manager. See [How to Install Rust and Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) if you don't have them on your system.

You can use a development version of the runtime library by setting the LFC option `--external-runtime-path` to the root directory of the runtime library crate sources. If this variable is mentioned, LFC will ask Cargo to fetch the runtime library from there.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Limitations

<div class="lf-c">

- The C target does not yet implement methods.

</div>

<div class="lf-cpp">

The C++ target does not yet implement:

- $extends$
- $federated$

</div>

<div class="lf-py">

- The Python target does not yet implement methods.

- On some platforms (Mac, in particular), if you generate code from within the Epoch IDE, the code will not run. It fails to find the needed libraries. As a workaround, please compile the code using the [command-line tool, lfc](/docs/handbook/command-line-tools).

- The Lingua Franca lexer does not support single-quoted strings in Python. This limitation also applies to target property values. You must use double quotes.

</div>

<div class="lf-ts">

<span class="warning">FIXME</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## The Target Specification

<div class="lf-c">

To have Lingua Franca generate C code, start your `.lf` file with one of the following target specifications:

```lf
    target C <options>;
    target CCpp <options>;
```

Note that for all LF statements, the final semicolon is optional, but if you are writing your code in C, you may want to include the final semicolon for uniformity.

For options to the target specification, see [detailed documentation of the target options](/docs/handbook/target-specification).

The second form, `CCpp`, is used when you wish to use a C++ compiler to compile the generated code, thereby allowing your C reactors to call C++ code. The C target uses a C compiler by default, and will fail to compile mixed C/C++ language programs. As a remedy, the `CCpp` target uses the C runtime but employs a C++ compiler to compile your program. To use it, simply replace `target C` with `target CCpp`.

Here is a minimal example of a program written in the `CCpp` target, taken from [HelloWorldCCPP.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/HelloWorldCCPP.lf):

```lf-c
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

**Note:** Unless some feature in the C target is needed, we recommend using the [Cpp target](/docs/handbook/cpp-reactors) that uses a runtime that is written natively in C++.

**Note:** A `.lf` file that uses the `CCpp` target cannot and should not be imported to an `.lf` file that uses the `C` target. Although these two targets use essentially the same runtime, such a scenario can cause unintended compiler errors.

</div>

<div class="lf-cpp">

To have Lingua Franca generate C++ code, start your `.lf` file with the following target specification:

```lf
    target Cpp;
```

Note that for all LF statements, the final semicolon is optional, but if you are writing your code in C++, you may want to include the final semicolon for uniformity.

For options to the target specification, see [detailed documentation of the target options](/docs/handbook/target-specification).

</div>

<div class="lf-py">

To have Lingua Franca generate Python code, start your `.lf` file with the following target specification:

```lf
target Python
```

Note that for all LF statements, a final semicolon is optional, but if you are writing your code in Python, you may want to omit the final semicolon for uniformity.

For options to the target specification, see [detailed documentation of the
target options](/docs/handbook/target-specification).

</div>

<div class="lf-ts>">

To have Lingua Franca generate TypeScript code, start your `.lf` file with the following target specification:

```lf
    target TypeScript;
```

Note that for all LF statements, the final semicolon is optional, but if you are writing your code in TypeScript, you may want to include the final semicolon for uniformity.

</div>

<div class="lf-rs">

To have Lingua Franca generate Rust code, start your `.lf` file with the following target specification:

```lf
    target Rust;
```

Note that for all LF statements, the final semicolon is optional, but if you are writing your code in Rust, you may want to include the final semicolon for uniformity.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Parameters and State Variables

<div class="lf-c">

Reactor parameters and state variables are referenced in the C code using the `self` struct. The following [Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Stride.lf) example modifies the `Count` reactor in [State Declaration](/docs/handbook/parameters-and-state-variables#state-declaration) to include both a parameter and state variable:

```lf-c
reactor Count(stride:int(1)) {
    state count:int(1);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        SET(y, self->count);
        self->count += self->stride;
    =}
}
```

This defines a `stride` parameter with type `int` and initial value `1` and
a `count` state variable with the same type and initial value.
These are referenced in the reaction with the syntax `self->stride` and `self->count` respectively.

**The self Struct:**
The code generator synthesizes a struct type in C for each reactor class and a constructor that creates an instance of this struct. By convention, these instances are called `self` and are visible within each reactor body. The `self` struct contains the parameters, state variables, and values associated with actions and ports of the reactor. Parameters and state variables are accessed directly on the `self` struct, whereas ports and actions are directly in scope by name, as we will see below. Let's begin with parameters.

It may be tempting to declare state variables in the $preamble$, as follows:

```lf-c
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

### Array Values for Parameters

Parameters and state variables can have array values, though some care is needed. The [ArrayAsParameter](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsParameter.lf) example outputs the elements of an array as a sequence of individual messages:

```lf-c
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

This uses a [$logical$ $action$](/docs/handbook/actions#logical-actions) to repeat the reaction, sending one element of the array in each invocation.

In C, arrays do not encode their own length, so a separate parameter `n_sequence` is used for the array length. Obviously, there is potential here for errors, where the array length doesn't match the length parameter.

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is that of a Lingua Franca list, `(0, 1, 2)`, which gets converted by the code generator into a C static initializer. The default value can be overridden when instantiating the reactor using a similar syntax:

```lf
    s = new Source(sequence = (1, 2, 3, 4), n_sequence=4);
```

### Array Values for States

A state variable can also have an array value. For example, the [MovingAverage] (https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/MovingAverage.lf) reactor computes the **moving average** of the last four inputs each time it receives an input:

```lf-c
reactor MovingAverage {
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

### States and Parameters with Struct Values

States whose type are structs can similarly be initialized. This [StructAsState](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsState.lf) example illustrates this:

```lf-c
target C;
main reactor StructAsState {
    preamble {=
        typedef struct hello_t {
            char* name;
            int value;
        } hello_t;
    =}
    state s:hello_t("Earth", 42);
    reaction(startup) {=
        printf("State s.name=\"%s\", value=%d.\n", self->s.name, self->s.value);
    =}
}
```

Notice that state `s` is given type `hello_t`, which is defined in the $preamble$. The initial value just lists the initial values of each of the fields of the struct in the order they are declared.

Parameters are similar:

```lf-c
target C;
main reactor StructParameter(p:hello_t("Earth", 42)) {
    preamble {=
        typedef struct hello_t {
            char* name;
            int value;
        } hello_t;
    =}
    reaction(startup) {=
        printf("Parameter p.name=\"%s\", value=%d.\n", self->p.name, self->p.value);
        if (self->p.value != 42) {
            fprintf(stderr, "FAILED: Expected 42.\n");
            exit(1);
        }
    =}
}
```

</div>

<div class="lf-cpp">

Reactor parameters internally declared as `const` by the code generator and initialized during reactor instantiation. Thus, the value of a parameter may not be changed. See [Parameters and State](/docs/handbook/parameters-and-state-variables) for examples.

### Array-Valued Parameters

Also parameters can have fixed- or variable-sized array values. The [ArrayAsParameter](https://github.com/lf-lang/lingua-franca/blob/master/test/C/ArrayAsParameter.lf) example outputs the elements of an array as a sequence of individual messages:

```lf-cpp
reactor Source(sequence:int[]{0, 1, 2}) {
    output out:int;
    state count:int(0);
    logical action next:void;
    reaction(startup, next) -> out, next {=
        out.set(sequence[count]);
        count++;
        if (count < sequence.size()) {
            next.schedule();
        }
    =}
}
```

Note that curly braces `{...}` can be used for initialization instead of parentheses to better match C++ syntax.

Note that also the main reactor can be parameterized:

```lf-cpp
main reactor Hello(msg: std::string("World")) {
    reaction(startup) {=
        std::cout << "Hello " << msg << "!\n";
    =}
}
```

This program will print "Hello World!" by default. However, since `msg` is a main reactor parameter, the C++ code generator will extend the CLI argument parser and allow to overwrite `msg` when invoking the program. For instance,

```
bin/Hello --msg Earth
```

will result in "Hello Earth!" being printed.

### State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor (see [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/lib/Count.lf) and [CountTest.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/CountTest.lf)) will produce the output sequence 1, 2, 3, ... :

```lf-cpp
reactor Count {
    state i:int(0);
    output c:int;
    timer t(0, 1 sec);
    reaction(t) -> c {=
        i++;
        c.set(i);
    =}
}
```

The declaration on the second line gives the variable the name `count`, declares its type to be `int`, and initializes its value to 0. The type and initial value can be enclosed in the C++-code delimiters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

In the body of the reaction, the state variable is automatically in scope and can be referenced directly by its name. Since all reactions, state variables and also parameters of a reactor are members of the same class, reactions can also reference state variables (or parameters) using the this pointer: `this->name`.

A state variable may be a time value, declared as follows:

```lf-cpp
state time_value:time(100 msec);
```

The type of the generated `time_value` variable will be `reactor::Duration`, which is an alias for [`std::chrono::nanoseconds`](https://en.cppreference.com/w/cpp/chrono/duration).

For the C++ target, Lingua Franca provides two alternative styles for initializing state variables. We can write `state foo:int(42)` or `state foo:int{42}`. This allows to distinguish between the different initialization styles in C++. `foo:int(42)` will be translated to `int foo(42)` and ` foo:int{42}` will be translated to `int foo{42}` in the generated code. Generally speaking, the `{...}` style should be preffered in C++, but it is not always applicable. Hence we allow the LF programmer to choose the style. Due to the peculiarities of C++, this is particularly important for more complex data types. For instance, `state foo:std::vector<int>(4,2)` would be initialized to the list `[2,2,2,2]` whereas `state foo:std::vector<int>{4,2}` would be initialized to the list `[4,2]`.

State variables can have array values. For example, the [MovingAverage] (https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/MovingAverage.lf) reactor computes the **moving average** of the last four inputs each time it receives an input:

```lf-cpp
reactor MovingAverageImpl {
    state delay_line:double[3]{0.0, 0.0, 0.0};
    state index:int(0);
    input in:double;
    output out:double;

    reaction(in) -> out {=
        // Calculate the output.
        double sum = *in.get();
        for (int i = 0; i < 3; i++) {
            sum += delay_line[i];
        }
        out.set(sum/4.0);

        // Insert the input in the delay line.
        delay_line[index] = *in.get();

        // Update the index for the next input.
        index++;
        if (index >= 3) {
            index = 0;
        }
    =}
}
```

The second line declares that the type of the state variable is an fixed-size array of 3 `double`s with the initial value of the being filled with zeros (note the curly braces). If the size is given in the type specification, then the code generator will declare the type of the state variable using [`std::array`](https://en.cppreference.com/w/cpp/container/array). In the example above, the type of `delay_line` is `std::array<3, double>`. If the size specifier is omitted (e.g. `state x:double[]`). The code generator will produce a variable-sized array using [`std::vector`](https://en.cppreference.com/w/cpp/container/vector).

State variables with more complex types such as classes or structs can be similiarly initialized. See [StructAsState.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsState.lf).

</div>

<div class="lf-py">

Reactor parameters and state variables are referenced in the Python code using the syntax `self.<name>`,
where `<name>` is the name of the parameter or state variable. The following [Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Stride.lf) example modifies the `Count` reactor in [State Declaration](/docs/handbook/parameters-and-state-variables#state-declaration) to include both a parameter and state variable:

```lf-py
reactor Count(stride(1)) {
    state count(1);
    output y;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y.set(self.count)
        self.count += self.stride
    =}
}
```

This defines a `stride` parameter with initial value `1` and a `count` state
variable with the same initial value. These are referenced in the reaction with
the syntax `self->stride` and `self->count` respectively. Note that state
variables and parameters do not have types in the Python reactor target. See [Parameters
and State](/docs/handbook/parameters-and-state-variables) for more examples.

**The Reactor Class:**

The code generator synthesizes a class in Python for each reactor class in LF,
with a constructor (i.e., `def __init__(self, ...):`) that creates an instance
of this class and initializes its parameters and state variables as [instance
variables](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables).
These parameters and state variables can then subsequently be accessed directly
using the `self` reference in the body of reactions (which will be synthesized as
methods of the Python class).

It may be tempting to declare state variables in the $preamble$, as follows:

```lf-py
reactor FlawedCount {
    preamble {=
        count = 0
    =}
    output y
    timer t(0, 100 msec)
    reaction(t) -> y {=
        y.set(count)
        count += 1
    =}
}
```

This will produce a sequence of integers, but if there is more than one instance
of the reactor, those instances will share the same variable `count` (because
`count` will be a [class variable](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)). Hence,
**don't do this**! Sharing variables across instances of reactors violates a
basic principle, which is that reactors communicate only by sending messages to
one another. Sharing variables will make your program nondeterministic. If you
have multiple instances of the above `FlawedCount` reactor, the outputs produced
by each instance will not be predictable, and in a multithreaded implementation,
will also not be repeatable.

### Array Values for State Variables and Parameters

An array expression (e.g., (0, 1, 2)) can be used as the default value for
parameters and state variables. In the following example, the parameter
`sequence` and the state variable `x` have a default value of `(0, 1, 2)`:

```lf-py
reactor Source(sequence(0, 1, 2)) {
    state x(0, 1, 2);
    ...
}
```

The Python target interprets the `(0, 1, 2)` expression differently depending on
whether the assignee is a parameter or a state variable. For parameters, the
`(0, 1, 2)` expression will translate into an immutable Python tuple (i.e.,
`sequence = (0, 1, 2)`). For state variables, the `(0, 1, 2)` expression will
translate into a mutable Python list (i.e., `x = [0, 1, 2])`). The reason behind
this discrepancy is that parameters are assumed to be immutable after
instantiation (in fact, they are also read-only in reaction bodies), but state
variables usually need to be updated during execution.

Notice that even though the tuple assigned to the parameter is immutable (you
cannot assign new values to its elements), the parameter itself can be
overridden with _another_ immutable tuple when instantiating the reactor:

```lf
s = new Source(sequence = (1, 2, 3, 4));
```

As with any ordinary Python list or tuple, `len()` can been used to deduce the
length.

### Arbitrary Assignment to State Variables and Parameters

The code delimiters `{= ... =}` can allow for assignment of arbitrary Python
expressions as default values for state variables and parameters. The following example, taken from
[StructAsState.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsState.lf)
demonstrates this usage:

```lf-py
main reactor StructAsState {
    preamble {=
        class hello:
            def __init__(self, name, value):
                self.name = name
                self.value = value
    =}
    state s ({=self.hello("Earth", 42) =});
    reaction(startup) {=
        print("State s.name='{:s}', value={:d}.".format(self.s.name, self.s.value))
        if self.s.value != 42:
            sys.stderr.write("FAILED: Expected 42.\n")
            exit(1)
    =}
}
```

Notice that a class `hello` is defined in the preamble. The state variable `s` is then initialized to an instance of `hello` constructed within the `{= ... =}` delimiters.

<!-- State variables may be initialized to lists or tuples without requiring `{= ... =}` delimiters. The following illustrates the difference:

```lf-py
target Python;
main reactor Foo {
    state a_tuple(1, 2, 3);
    state a_list([1, 2, 3]);
    reaction(startup) {=
        # will print "<class 'tuple'> != <class 'list'>"
        print("{0} != {1}".format(type(self.a_tuple), type(self.a_list)))
    =}
}
``` -->

<!--
In Python, tuples are immutable, while lists can be modified. Be aware also that the syntax for declaring tuples in the Python target is the same syntax as to declare an array in the C target, so the immutability might be a surprise. -->

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Inputs and Outputs

<div class="lf-c">

In the body of a reaction in the C target, the value of an input is obtained using the syntax `name->value`, where `name` is the name of the input port. See, for example, the `Destination` reactor in [Triggers, Effects, and Uses](/docs/handbook/inputs-and-outputs#triggers-effects-and-uses).

To set the value of outputs, use one of several variants of the `SET` macro. See, for example, the `Double` reactor in [Input and Output Declarations](/docs/handbook/inputs-and-outputs#input-and-output-declarations).)

There are several variants of the `SET` macro, and the one you should use depends on the type of the output. The simple version `SET` works for all primitive C type (int, double, etc.) as well as the `bool` and `string` types that Lingua Franca defines. For the other variants, see [Sending and Receiving Arrays and Structs](#Sending-and-Receiving-Arrays-and-Structs) below.

An output may even be set in different reactions of the same reactor at the same tag. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name->is_present` to determine whether the output has been set. For example, the following reactor (the test case [TestForPreviousOutput](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/TestForPreviousOutput.lf)) will always produce the output 42:

```lf-c
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

### Sending and Receiving Arrays and Structs

You can define your own datatypes in C and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsType.lf) example:

```lf-c
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

The $preamble$ code defines a struct datatype. In the reaction to $startup$, the reactor creates an instance of this struct on the stack (as a local variable named `temp`) and then copies that struct to the output using the `SET` macro.

For large structs, it may be inefficient to create a struct on the stack and copy it to the output, as done above. You can instead write directly to the fields of the struct. For example, the above reaction could be rewritten as follows (see [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsTypeDirect.lf)):

```lf-c
    reaction(startup) -> out {=
        out->value.name = "Earth";
        out->value.value = 42;
        SET_PRESENT(out);
    =}
```

The final call to `SET_PRESENT` is necessary to inform downstream reactors that the struct has a new value. (This is a macro that simply does `out->is_present = true`). Note that in subsequent reactions, the values of the struct persist. Hence, this technique can be very efficient if a large struct is modified only slightly in each of a sequence of reactions.

A reactor receiving the struct message uses the struct as normal in C:

```lf-c
reactor Print() {
    input in:hello_t;
    reaction(in) {=
        printf("Received: name = %s, value = %d\n", in->value.name, in->value.value);
    =}
}
```

The preamble should not be repeated in this reactor definition if the two reactors are defined together because this will trigger an error when the compiler thinks that hello_t is being redefined.

Arrays that have fixed sizes are handled similarly. Consider the [ArrayAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsType.lf) example:

```lf-c
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

```lf-c
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

### Dynamically Allocated Arrays

For arrays where the size is variable, it may be necessary to dynamically allocate memory. But when should that memory be freed? A reactor cannot know when downstream reactors are done with the data. Lingua Franca provides utilities for managing this using reference counting. You can pass a pointer to a dynamically allocated object as illustrated in the [ArrayPrint](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayPrint.lf) example:

```lf-c
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

```lf-c
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

### Mutable Inputs

Although it cannot be enforced in C, the receiving reactor should not modify the values stored in the array. Inputs are logically _immutable_ because there may be several recipients. Any recipient that wishes to modify the array should make a copy of it. Fortunately, a utility is provided for this pattern. Consider the [ArrayScale](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayScale.lf) example:

```lf-c
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

Here, the input is declared $mutable$, which means that any reaction is free to modify the input. If this reactor is the only recipient of the array or the last recipient of the array, then this will not copy of the array but rather use the original array. Otherwise, it will use a copy.

The above `ArrayScale` reactor modifies the array and then forwards it to its output port using the `SET_TOKEN()` macro. That macro further delegates to downstream reactors the responsibility for freeing dynamically allocated memory once all readers have completed their work.

If the above code were not to forward the array, then the dynamically allocated memory will be automatically freed when this reactor is done with it.

The above three reactors can be combined into a pipeline as follows:

```lf
main reactor ArrayScaleTest {
    s = new ArrayPrint();
    c = new ArrayScale();
    p = new Print();
    s.out -> c.in;
    c.out -> p.in;
}
```

In this composite, the array is allocated by `ArrayPrint`, modified by `ArrayScale`, and deallocated (freed) after `Print` has reacted. No copy is necessary because `ArrayScale` is the only recipient of the original array.

Inputs and outputs can also be dynamically allocated structs. In fact, Lingua Franca's C target will treat any input or output datatype that ends with `[]` or `*` specially by providing utilities for allocating memory and modifying and forwarding. Deallocation of the allocated memory is automatic. The complete set of utilities is given below.

### String Types

String types in C are `char*`. But, as explained above, types ending with `*` are interpreted specially to provide automatic memory management, which we generally don't want with strings (a string that is a compile-time constant must not be freed). You could enclose the type as `{= char* =}`, but to avoid this awkwardness, the header files include a typedef that permits using `string` instead of `char*`. For example (from [DelayString.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf)):

```lf-c
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

### Macros For Setting Output Values

In all of the following, <out> is the name of the output and <value> is the value to be sent.

> `SET(<out>, <value>);`

Set the specified output (or input of a contained reactor) to the specified value. This version is used for primitive type such as `int`, `double`, etc. as well as the built-in types `bool` and `string` (but only if the string is a statically allocated constant; otherwise, see `SET_NEW_ARRAY`). It can also be used for structs with a type defined by a `typedef` so that the type designating string does not end in '\*'. The value is copied and therefore the variable carrying the value can be subsequently modified without changing the output.

> `SET_ARRAY(<out>, <value>, <element_size>, <length>);`

This version is used for outputs with a type declaration ending with `[]` or `*`, such as `int[]`. This version is for use when the _value_ to be sent is in dynamically allocated memory that will need to be freed downstream. The allocated memory will be automatically freed when all recipients of the outputs are done with it. Since C does not encode array sizes as part of the array, the _length_ and _element_size_ must be given (the latter is the size of each element in bytes). See [SetArray.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetArray.lf).

> `SET_NEW(<out>);`

This version is used for outputs with a type declaration ending with `*` (see example below). This sets the `out` variable to point to newly allocated memory for storing the specified output type. After calling this function, the reaction should populate that memory with the content it intends to send to downstream reactors. This macro is equivalent to `SET_NEW_ARRAY(out, 1)`. See [StructPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructPrint.lf)

> `SET_NEW_ARRAY(<out>, <length>);`

This version is used for outputs with a type declaration ending with `[]` or `*`. This sets the _out_ variable to point to newly allocated memory sufficient to hold an array of the specified length containing the output type in each element. The caller should subsequently populate the array with the contents that it intends to send to downstream reactors. See [ArrayPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayPrint.lf).

**Dynamically allocated strings:** If an output is to be a dynamically allocated string, as opposed to a static string constant, then you can use `SET_NEW_ARRAY` to allocate the memory, and the memory will be automatically freed downstream after the all users have read the string. To do this, set the output type to `char[]` or `char*` rather than `string` and call `SET_NEW_ARRAY` with the desired length. After this, _out_ will point to a char array of the required length. You can then populate it with your desired string, e.g. using `snprintf()`. See [DistributedToken.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/federated/DistributedToken.lf)

> `SET_PRESENT(<out>);`

This version just sets the `<out>->is_present` variable corresponding to the specified output to true. This is normally used with array outputs with fixed sizes and statically allocated structs. In these cases, the values in the output are normally written directly to the array or struct. See [ArrayAsType.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsType.lf)

> `SET_TOKEN(<out>, <value>);`

This version is used for outputs with a type declaration ending with `*` (any pointer) or `[]` (any array). The `<value>` argument should be a struct of type `token_t`. This can be the trickiest form to use, but it is rarely necessary for the programmer to create their own (dynamically allocated) instance of `token_t`. Consider the [SetToken.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetToken.lf) example:

```lf-c
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

All of the `SET` macros will overwrite any output value previously set at the same logical time and will cause the final output value to be sent to all reactors connected to the output. They also all set a local `<out>->is_present` variable to true. This can be used to subsequently test whether the output value has been set.

### Dynamically Allocated Structs

The `SET_NEW` and `SET_TOKEN` macros can be used to send `structs` of arbitrary complexity. For example:

```lf-c
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

The $preamble$ declares a struct type `hello_t` with two fields, and the `SET_NEW` macro allocates memory to contain such a struct. The subsequent code populates that memory. A reactor receiving this struct might look like this:

```lf-c
reactor Print() {
    input in:hello_t*;
    reaction(in) {=
        printf("Received: name = %s, value = %d\n",
            in->value->name, in->value->value
        );
    =}
}
```

Just as with arrays, an input with a pointer type can be declared $mutable$, in which case it is safe to modify the fields and forward the struct.

Occasionally, you will want an input or output type to be a pointer, but you don't want the automatic memory allocation and deallocation. A simple example is a string type, which in C is `char*`. Consider the following (erroneous) reactor:

```lf-c
reactor Erroneous {
    output out:char*;
    reaction(startup) -> out {=
        SET(out, "Hello World");
    =}
}
```

An output data type that ends with `*` signals to Lingua Franca that the message is dynamically allocated and must be freed downstream after all recipients are done with it. But the `"Hello World"` string here is statically allocated, so an error will occur when the last downstream reactor to use this message attempts to free the allocated memory. To avoid this for strings, you can use the `string` type, defined in `reactor.h`, as follows:

```lf-c
reactor Fixed {
    output out:string;
    reaction(startup) -> out {=
        SET(out, "Hello World");
    =}
}
```

The `string` type is equivalent to `char*`, but since it doesn't end with `*`, it does not signal to Lingua Franca that the type is dynamically allocated. Lingua Franca only handles allocation and deallocation for types that are specified literally with a final `*` in the type name. The same trick can be used for any type where you don't want automatic allocation and deallocation. E.g., the [SendsPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendsPointerTest.lf) example looks like this:

```lf-c
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

</div>

<div class="lf-cpp">

In the body of a reaction in the C++ target, the value of an input is obtained using the syntax `*name.get()`, where `name` is the name of the input port. Similarly, outputs are set using a `set()` method on an output port. For examples, see [Inputs and Outputs](/docs/handbook/inputs-and-outputs).

Note that `get()` always returns a pointer to the actual value. Thus the pointer needs to be dereferenced with `*` to obtain the value. (See [Sending and Receiving Large Data Types](#sending-and-receiving-large-data-types) for an explanation of the exact mechanisms behind this pointer access).
To determine whether an input is present, `name.is_present()` can be used. Since `get()` returns a `nullptr` if no value is present, `name.get() != nullptr` can be used alternatively for checking presence.

### Sending and Receiving Large Data Types

You can define your own datatypes in C++ or use types defined in a library and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsType.lf) example:

```lf-cpp
reactor StructAsType {
    public preamble {=
        struct Hello {
            std::string name;
            int value;
        };
    =}

    output out:Hello;
    reaction(startup) -> out {=
        Hello hello{"Earth, 42};
        out.set(hello);
    =}
}
```

The **preamble** code defines a struct datatype. In the reaction to **startup**, the reactor creates an instance of this struct on the stack (as a local variable named `hello`) and then copies that instance to the output using the `set()` method. For this reason, the C++ reactor runtime provides more sophisticated ways to allocate objects and send them via ports.

The C++ library defines two types of smart pointers that the runtime uses internally to implement the exchange of data between ports. These are `reactor::MutableValuePtr<T>` and `reactor::ImmutableValuePtr<T>`. `reactor::MutableValuePtr<T>` is a wrapper around [`std::unique_ptr`](https://en.cppreference.com/w/cpp/memory/unique_ptr) and provides read and write access to the value hold, while ensuring that the value has a unique owner. In contrast, `reactor::ImmutableValuePtr<T>` is a wrapper around [`std::shared_pointer`](https://en.cppreference.com/w/cpp/memory/shared_ptr) and provides read only (const) access to the value it holds. This allows data to be shared between reactions of various reactors, while guarantee data consistency. Similar to `std::make_unique` and `std::make_shared`, the reactor library provides convenient function for creating mutable and immutable values pointers: `reactor::make_mutable_value<T>(...)` and `reactor::make_immutable_value<T>(...)`.

In fact this code from the example above:

```lf-cpp
Hello hello{"Earth, 42};
out.set(hello);
```

implicitly invokes `reactor::make_immutable_value<Hello>(hello)` and could be rewritten as

```lf-cpp
Hello hello{"Earth, 42};
out.set(reactor::make_immutable_value<Hello>(hello));
```

This will invoke the copy constructor of `Hello`, copying its content from the `hello` instance to the newly created `reactor::ImmutableValuePtr<Hello>`.

Since copying large objects is inefficient, the move semantics of C++ can be used to move the ownership of object instead of copying it. This can be done in the following two ways. First, by directly creating a mutable or immutable value pointer, where a mutable pointer allows modification of the object after it has been created:

```lf-cpp
auto hello = reactor::make_mutable_value<Hello>("Earth", 42);
hello->name = "Mars";
out.set(std::move(hello));
```

An example of this can be found in [StructPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructPrint.lf). Not that after the call to `std::move`, hello is `nullptr` and the reaction cannot modify the object anymore. Alternatively, if no modification is requires, the object can be instantiated directly in the call to `set()` as follows:

```lf-cpp
out.set({"Earth", 42});
```

An example of this can be found in [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsTypeDirect.lf).

Getting a value from an input port of type `T` via `get()` always returns an `reactor::ImmutableValuePtr<T>`. This ensures that the value cannot be modified by multiple reactors receiving the same value, as this could lead to an inconsistent state and nondeterminism in a multi-threaded execution. An immutable value pointer can be converted to a mutable pointer by calling `get_mutable_copy`. For instance, the [ArrayScale](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/ArrayScale.lf) reactor modifies elements of the array it receives before sending it to the next reactor:

```lf-cpp
reactor Scale(scale:int(2)) {
    input in:int[3];
    output out:int[3];

    reaction(in) -> out {=
        auto array = in.get().get_mutable_copy();
        for(int i = 0; i < array->size(); i++) {
            (*array)[i] = (*array)[i] * scale;
        }
        out.set(std::move(array));
    =}
}
```

Currently `get_mutable_copy()` always copies the contained value to safely create a mutable pointer. However, a future implementation could optimize this by checking if any other reaction is accessing the same value. If not, the value can simply be moved from the immutable pointer to a mutable one.

</div>

<div class="lf-py">

In the body of a reaction in the Python target, the value of an input is obtained using the syntax `name.value`, where `name` is the name of the input port. To determine whether an input is present, use `name.is_present`. To produce an output, use the syntax `name.set(value)`. The `value` can be any valid Python object. For simple examples, see [Inputs and Outputs](/docs/handbook/inputs-and-outputs).

### Sending and Receiving Objects

You can define your own data types in Python and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsType.lf) example:

```lf-py
target Python {files: include/hello.py};

preamble {=
import hello
=}

reactor Source {
    output out;

    reaction(startup) -> out {=
        temp = hello.hello("Earth", 42)
        out.set(temp)
    =}
}
```

The top-level preamble has imported the [hello](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/include/hello.py) module, which contains the following class:

```python
class hello:
    def __init__(self, name = "", value = 0):
        self.name = name
        self.value = value
```

In the reaction to **startup**, the reactor has created an instance object of this class (as local variable named `temp`) and passed it downstream using the `set` method on output port `out`.

Alternatively, you can forego the variable and pass an instance object of the class directly to the port value, as is used in the [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsTypeDirect.lf) example:

```lf-py
reactor Source {
    output out;
    reaction(startup) -> out {=
        out.value = hello.hello()
        out.value.name = "Earth"
        out.value.value = 42
        out.set(out.value)
    =}
}
```

The call to the `set` function is necessary to inform downstream reactors that the class object has a new value. In short, the `set` method is defined as follows:

> `<port>.set(<value>)`: Set the specified output port (or input of a contained reactor) to the specified value. This value can be any Python object (including `None` and objects of type `Any`). The value is copied and therefore the variable carrying the value can be subsequently modified without changing the output.

A reactor receiving the class object message can take advantage of Python's duck typing and directly access the object:

```lf-py
reactor Print(expected(42)) {
    input _in;
    reaction(_in) {=
        print("Received: name = {:s}, value = {:d}\n".format(_in.value.name,
                                                             _in.value.value))
    =}
}
```

**Note:** The `hello` module has been imported using a top-level preamble, therefore, the contents of the module are available to all reactors defined in the current Lingua Franca file (similar situation arises if the `hello` class itself was in the top-level preamble).

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Time

<div class="lf-c">

In the C target, the value of a time instant or interval is an integer specifying a number of nanoseconds. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Time in the C target is a `long long`, which is (normally) a 64 bit signed number. Since a 64-bit number has a limited range, this measure of time instants will overflow in approximately the year 2262. For better code clarity, two types are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h), `instant_t` and `interval_t`, which you can use for time instants and intervals respectively. These are both equivalent to `long long`, but using those types will insulate your code against changes and platform-specific customizations.

Lingua Franca uses a superdense model of time. A reaction is invoked at a logical **tag**, a struct consists of a `time` value (an `instant_t`, which is a `long long`) and a `microstep` value (a `microstep_t`, which is an unsigned `int`). The tag is guaranteed to not increase during the execution of a reaction. Outputs produced by a reaction have the same tag as the inputs, actions, or timers that trigger the reaction, and hence are **logically simultaneous**.

The time structs and functions for working with time are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h). The most useful functions are:

- `tag_t get_current_tag()`: Get the current tag at which this reaction has been invoked.
- `instant_t get_logical_time()`: Get the current logical time (the first part of the current tag).
- `microstep_t get_microstep() `: Get the current microstep (the second part of the current tag).
- `interval_t get_elapsed_logical_time()`: Get the logical time elapsed since program start.
- `int compare_tags(tag_t, tag_t)`: Compare two tags, returning -1, 0, or 1 for less than, equal, and greater than.

There are also some useful functions for accessing physical time:

- `instant_t get_physical_time()`: Get the current physical time.
- `instant_t get_elapsed_physical_time()`: Get the physical time elapsed since program start.
- `instant_t get_start_time()`: Get the starting physical and logical time.

The last of these is both a physical and logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/GetTime.lf) example:

```lf-c
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

You can also obtain the _elapsed_ logical time since the start of execution:

```lf-c
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

```lf-c
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

```lf-c
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

Notice that these numbers are increasing by _roughly_ one second each time. If you set the `fast` target parameter to `true`, then physical time will elapse much faster than logical time.

Working with nanoseconds in C code can be tedious if you are interested in longer durations. For convenience, a set of macros are available to the C programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in C code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided macros are `NSEC`, `USEC` (for microseconds), `MSEC`, `SEC`, `MINUTE`, `HOUR`, `DAY`, and `WEEK`. You may also use the plural of any of these. Examples are given in the next section.

</div>

<div class="lf-cpp">

Timers are specified exactly as in the [Time and Timers](/docs/handbook/time-and-timers). When working with time in the C++ code body of a reaction, however, you will need to know a bit about its internal representation.

The reactor-cpp library uses [`std::chrono`](https://en.cppreference.com/w/cpp/chrono) for representing time. Specifically, the library defines two types for representing durations and timepoints: `reactor::Duration` and `reactor::TimePoint`. `reactor::Duration` is an alias for [`std::chrono::nanosecods`](https://en.cppreference.com/w/cpp/chrono/duration). `reactor::TimePoint` is alias for [`std::chrono::time_point<std::chrono::system_clock, std::chrono::nanoseconds>`](https://en.cppreference.com/w/cpp/chrono/time_point). As you can see from these definitions, the smallest time step that can be represented is one nanosecond. Note that `reactor::TimePoint` describes a specific point in time and is associated with a specific clock, whereas `reactor::Duration` defines a time interval between two time points.

Lingua Franca uses a superdense model of logical time. A reaction is invoked at a logical **tag**. In the C++ library, a tag is represented by the class `reactor::Tag`. In essence, this class is a tuple of a `reactor::TimePoint` representing a specific point in logical time and a microstep value (of type `reactor::mstep_t`, which is an alias for `unsigned long`). `reactor::Tag` provides two methods for getting the time point or the microstep:

```lf-cpp
const TimePoint& time_point() const;
const mstep_t& micro_step() const;
```

The C++ code in reaction bodies has access to library functions that allow to retrieve the current logical or physical time:

- `TimePoint get_physical_time()`: Get the current physical time.
- `TimePoint get_logcial_time()`: Get the current logical time.
- `Duration get_elapsed_physical_time()`: Get the physical time elapsed since program start.
- `Duration get_elapsed_logical_time()`: Get the logical time elapsed since program start.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/GetTime.lf) example:

```lf-cpp
main reactor {
    timer t(0, 1 sec);
    reaction(t) {=
        auto logical = get_logical_time();
        std::cout << "Logical time is " << logical << std::endl;
    =}
}
```

Note that the `<<` operator is overloaded for both `reactor::TimePoint` and `reactor::Duration` and will print the time information accordingly.

When executing the above program, you will see something like this:

```
[INFO]  Starting the execution
Logical time is 2021-05-19 14:06:09.496828396
Logical time is 2021-05-19 14:06:10.496828396
Logical time is 2021-05-19 14:06:11.496828396
Logical time is 2021-05-19 14:06:11.496828396
...
```

If you look closely, you will see that each printed logical time is one second larger than the previous one.

You can also obtain the _elapsed_ logical time since the start of execution:

```lf-cpp
main reactor {
    timer t(0, 1 sec);
    reaction(t) {=
        auto elapsed = get_elapsed_logical_time();
        std::cout << "Elapsed logical time is " << elapsed << std::endl;
        std::cout << "In seconds: " <<  std::chrono::duration_cast<std::chrono::seconds>(elapsed) << std::endl;
    =}
}
```

Using `std::chrono` it is also possible to convert between time units and directly print the number of elapsed seconds as seen above. The resulting output of this program will be:

```
[INFO]  Starting the execution
Elapsed logical time is 0 nsecs
In seconds: 0 secs
Elapsed logical time is 1000000000 nsecs
In seconds: 1 secs
Elapsed logical time is 2000000000 nsecs
In seconds: 2 secs
...
```

You can also get physical and elapsed physical time:

```lf-cpp
main reactor {
    timer t(0, 1 sec);
	reaction(t) {=
        auto logical = get_logical_time();
        auto physical = get_physical_time();
		auto elapsed = get_elapsed_physical_time();
        std::cout << "Physical time is " << physical << std::endl;
        std::cout << "Elapsed physical time is " << elapsed << std::endl;
        std::cout << "Time lag is " << physical - logical << std::endl;
   =}
}
```

Notice that the physical times are increasing by _roughly_ one second in each reaction. The output also shows the lag between physical and logical time. If you set the `fast` target parameter to `true`, then physical time will elapse much faster than logical time. The above program will produce something like this:

```
[INFO]  Starting the execution
Physical time is 2021-05-19 14:25:18.070523014
Elapsed physical time is 2601601 nsecs
Time lag is 2598229 nsecs
Physical time is 2021-05-19 14:25:19.068038275
Elapsed physical time is 1000113888 nsecs
Time lag is 113490 nsecs
[INFO]  Physical time is Terminating the execution
2021-05-19 14:25:20.068153026
Elapsed physical time is 2000228689 nsecs
Time lag is 228241 nsecs
```

For specifying time durations in code [chrono](https://en.cppreference.com/w/cpp/header/chrono) provides convenient literal operators in `std::chrono_literals`. This namespace is automatically included for all reaction bodies. Thus, we can simply write:

```lf-cpp
std::cout << 42us << std::endl;
std::cout << 1ms << std::endl;
std::cout << 3s << std::endl;
```

which prints:

```
42 usecs
1 msecs
3 secs
```

</div>

<div class="lf-py">

Timers are specified exactly as in the [Time and Timers](/docs/handbook/time-and-timers). When working with time in the Python code body of a reaction, however, you will need to know a bit about its internal representation.

In the Python target, similar to the C target, the value of a time instant or interval is an integer specifying a number of nanoseconds. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system (on some embedded platforms without real-time clocks, it will be set to zero instead).

The functions for working with time and tags are defined in [pythontarget.c](https://github.com/lf-lang/reactor-c-py/blob/main/lib/pythontarget.c#L961). The most useful functions are:

- `get_current_tag() -> Tag`: Returns a Tag instance of the current tag at which this reaction has been invoked.
- `get_logical_time() -> int`: Get the current logical time (the first part of the current tag).
- `get_microstep() -> unsigned int`: Get the current microstep (the second part of the current tag).
- `get_elapsed_logical_time() -> int`: Get the logical time elapsed since program start.
- `compare_tags(Tag, Tag) -> int`: Compare two `Tag` instances, returning -1, 0, or 1 for less than, equal, and greater than. `Tag`s can also be compared using rich comparators (ex. `<`, `>`, `==`), which returns `True` or `False`.

`Tag`s can be initialized using `Tag(time=some_number, microstep=some_other_number)`.

There are also some useful functions for accessing physical time:

- `get_physical_time() -> int`: Get the current physical time.
- `get_elapsed_physical_time() -> int`: Get the physical time elapsed since program start.
- `get_start_time() -> int`: Get the starting physical and logical time.

The last of these is both a physical and logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/GetTime.lf) example:

```lf-py
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        logical = get_logical_time()
        print("Logical time is ", logical)
    =}
}
```

When executed, you will get something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Logical time is  1604587862864237900
Logical time is  1604587863864237900
Logical time is  1604587864864237900
...
```

The first two lines give the current time-of-day provided by the execution platform at the start of execution. This is used to initialize logical time. Subsequent values of logical time are printed out in their raw form, rather than the friendlier form in the first two lines. If you look closely, you will see that each number is one second larger than the previous number, where one second is 1000000000 nanoseconds.

You can also obtain the _elapsed_ logical time since the start of execution:

```lf-py
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        elapsed = get_elapsed_logical_time()
        print("Elapsed logical time is ", elapsed)
    =}
}
```

This will produce:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Elapsed logical time is  0
Elapsed logical time is  1000000000
Elapsed logical time is  2000000000
...
```

You can also get physical time, which comes from your platform's real-time clock:

```lf-py
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        physical = get_physical_time()
        print("Physical time is ", physical)
    =}
}
```

This will produce something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Physical time is  1604587862864343500
Physical time is  1604587863864401900
Physical time is  1604587864864395200
...
```

Finally, you can get elapsed physical time:

```lf-py
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        elapsed_physical = get_elapsed_physical_time()
        print("Elapsed physical time is ", elapsed_physical)
    =}
}
```

This will produce something like this:

```bash
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Elapsed physical time is  110200
Elapsed physical time is  1000185400
Elapsed physical time is  2000178600
...
```

Notice that these numbers are increasing by roughly one second each time. If you set the `fast` target parameter to `true`, then physical time will elapse much faster than logical time.

Working with nanoseconds in the Python code can be tedious if you are interested in longer durations. For convenience, a set of functions are available to the Python programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in Python code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided functions are `NSEC`, `USEC` (for microseconds), `MSEC`, `SEC`, `MINUTE`, `HOUR`, `DAY`, and `WEEK`. You may also use the plural of any of these. Examples are given in the next section.

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Actions

<div class="lf-c">

Actions are described in the [Actions](/docs/handbook/actions). If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from [Composing Reactors](/docs/handbook/composing-reactors) that the $after$ keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayInt.lf) example:

```lf-c
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
```

Using this reactor as follows

```lf
    d = new Delay();
    source.out -> d.in;
    d.in -> sink.out
```

is equivalent to

```lf
    source.out -> sink.in after 100 msec
```

(except that our `DelayInt` reactor will only work with data type `int`).

The action `d` is specified with a type `int`. The reaction to the input `in` declares as its effect the action `d`. This declaration makes it possible for the reaction to schedule a future triggering of `d`. The reaction uses one of several variants of the **schedule** function, namely **schedule_int**, a convenience function provided because integer payloads on actions are very common. We will see below, however, that payloads can have any data type.

The first reaction declares that it is triggered by `d` and has effect `out`. To read the value, it uses the `d->value` variable. Because this reaction is first, the `out` at any logical time can be produced before the input `in` is even known to be present. Hence, this reactor can be used in a feedback loop, where `out` triggers a downstream reactor to send a message back to `in` of this same reactor. If the reactions were given in the opposite order, there would be causality loop and compilation would fail.

If you are not sure whether an action carries a value, you can test for it as follows:

```lf-c
    reaction(d) -> out {=
        if (d->has_value) {
            SET(out, d->value);
        }
    =}
```

It is possible to both be triggered by and schedule an action the same reaction. For example, this [CountSelf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/CountSelf.lf) reactor will produce a counting sequence after it is triggered the first time:

```lf-c
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

</div>

<div class="lf-cpp">

The C++ provides a simple interface for scheduling actions via a `schedule()` method. Actions are described in the [Language Specification](language-specification#action-declaration) document. Consider the [Schedule](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Schedule.lf) reactor:

```lf-cpp
reactor Schedule {
	input x:int;
    logical action a;
    reaction(a) {=
         auto elapsed_time = get_elapsed_logical_time();
         std::cout << "Action triggered at logical time " << elapsed_time.count()
                  << " after start" << std::endl; elapsed_time);
    =}
    reaction(x) -> a {=
        a.schedule(200ms);
    =}
}
```

When this reactor receives an input `x`, it calls `schedule()` on the action `a`, specifying a logical time offset of 200 milliseconds. The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. At that logical time, the second reaction will trigger and will use the `get_elapsed_logical_time()` function to determine how much logical time has elapsed since the start of execution.

Notice that after the logical time offset of 200 msec, there may be another input `x` simultaneous with the action `a`. Because the reaction to `a` is given first, it will execute first. This becomes important when such a reactor is put into a feedback loop (see below).

**TODO: Explain physical actions as well!**

### Zero-Delay Actions

If the specified delay in a `schedule()` is omitted or is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time _t_, and you call `schedule()` in one of the following ways:

```lf-cpp
a.schedule();
a.schedule(0s);
a.schedule(reactor::Duration::zero());
```

then when the reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous.

As discussed above the he metric time is visible to the rogrammer and can be obtained in a reaction using either `get_elapsed_logical_time()` or `get_logical_time()`.

As described in the [Language Specification](language-specification#action-declaration) document, action declarations can have a _min_delay_ parameter. This modifies the timestamp further. Also, the action declaration may be **physical** rather than **logical**, in which case, the assigned timestamp will depend on the physical clock of the executing platform.

### Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from the [Contained Reactors](language-specification#Contained-Reactors) section in the Language Specification document that the **after** keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/tud-ccc/reactor-cpp/blob/master/include/reactor-cpp/logical_time.hh) example:

```lf-cpp
reactor Delay(delay:time(100 msec)) {
    input in:int;
    output out:int;
    logical action d:int;
    reaction(in) -> d {=
        d.schedule(in.get(), delay);
    =}
    reaction(d) -> out {=
        if (d.is_present()) {
            out.set(d.get());
        }
    =}
}
```

Using this reactor as follows

```lf-cpp
d = new Delay();
source.out -> d.in;
d.in -> sink.out
```

is equivalent to

```lf-cpp
source.out -> sink.in after 100 msec
```

(except that our `Delay` reactor will only work with data type `int`).

The action `d` is specified with a type `int`. The reaction to the input `in` declares as its effect the action `d`. This declaration makes it possible for the reaction to schedule a future triggering of `d`. In the C++ target, actions use the same mechanism for passing data via value pointers as do ports. In the example above, the `reactor::ImmutablValuePtr<int>` derived by the call to `in.get()` is passed directly to `schedule()`. Similarly, the value can later be retrieved from the action with `d.get()` and passed to the output port.

The first reaction declares that it is triggered by `d` and has effect `out`. Because this reaction is first, the `out` at any logical time can be produced before the input `in` is even known to be present. Hence, this reactor can be used in a feedback loop, where `out` triggers a downstream reactor to send a message back to `in` of this same reactor. If the reactions were given in the opposite order, there would be causality loop and compilation would fail.

If you are not sure whether an action carries a value, you can test for it using `is_present()`:

```lf-cpp
reaction(d) -> out {=
    if (d.is_present()) {
        out.set(d.get());
    }
=}
```

It is possible to both be triggered by and schedule an action the same reaction. For example, this reactor will produce a counting sequence after it is triggered the first time:

```lf-cpp
reactor CountSelf(delay:time(100 msec)) {
    output out:int;
    logical action a:int;
    reaction(startup) -> a, out {=
        out.set(0);
        a.schedule_int(1, delay);
    =}
    reaction(a) -> a, out {=
        out.set(a.get());
        a.schedule_int(*a.get() + 1, delay);
    =}
}
```

Of course, to produce a counting sequence, it would be more efficient to use a state variable.

</div>

<div class="lf-py">

Actions are described in the [Actions](/docs/handbook/actions) and, in the Python target, do not have a data type even when they carry a value. The Python target provides a `.schedule()` method to trigger an action at a future logical time. For examples, see [Actions](/docs/handbook/actions).

The logical time is visible to the Python programmer and can be obtained in a reaction using either `get_elapsed_logical_time()`, as above or `get_logical_time()`. The latter function returns the number of nanoseconds elapsed since the start time, and the former returns the number of nanoseconds elapsed since January 1, 1970.

Actions can also carry a **value**, a Python object that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message.

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Schedule Functions

<div class="lf-c">

Actions with values can be rather tricky to use because the value must usually be carried in dynamically allocated memory. It will not work for value to refer to a state variable of the reactor because that state variable will likely have changed value by the time the reactions to the action are invoked. Several variants of the `schedule` function are provided to make it easier to pass values across time in varying circumstances.

> `schedule(<action>, <offset>);`

This is the simplest version as it carries no value. The action need not have a data type.

> `schedule_int(<action>, <offset>, <value>);`

This version carries an `int` value. The datatype of the action is required to be `int`.

> `schedule_token(<action>, <offset>, <value>);`

This version carries a **token**, which has type `token_t` and points to the value, which can have any type. There is a `create_token()` function that can be used to create a token, but programmers will rarely need to use this. Instead, you can use `schedule_value()` (see below), which will automatically create a token. Alternatively, for inputs with types ending in `*` or `[]`, the value is wrapped in a token, and the token can be obtained using the syntax `inputname->token` in a reaction and then forwarded using `schedule_token()` (see [Dynamically Allocated Structs](#Dynamically-Allocated-Structs) above). If the input is mutable, the reaction can then even modify the value pointed to by the token and/or use `schedule_token()` to send the token to a future logical time. For example, the [DelayPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayPointer.lf) reactor realizes a logical delay for any datatype carried by a token:

```lf-c
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

> `schedule_value**(<action>, <offset>, <value>, <length>);`

This version is used to send into the future a value that has been dynamically allocated malloc. It will be automatically freed when it is no longer needed. The _value_ argument is a pointer to the memory containing the value. The _length_ argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly. See [ScheduleValue.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ScheduleValue.lf).

> `schedule_copy(<action>, <offset>, <value>, <length>);`

This version is for sending a copy of some data pointed to by the `<value>` argument. The data is assumed to be a scalar or array of type matching the `<action>` type. The `<length>` argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly.

Occasionally, an action payload may not be dynamically allocated nor freed. For example, it could be a pointer to a statically allocated string. If you know this to be the case, the [DelayString](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf) reactor will realize a logical time delay on such a string:

```lf-c
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

</div>

<div class="lf-cpp">

<span class="warning">FIXME: Refactor from above Actions section.</span>

</div>

<div class="lf-py">

The Python target provides a `.schedule()` method to trigger an action at a future logical time. Actions are described in the [Language Specification](language-specification#action-declaration) document. Consider the [Schedule](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Schedule.lf) reactor:

```lf-py
target Python;
reactor Schedule {
    input x;
    logical action a;
    reaction(a) {=
        elapsed_time = get_elapsed_logical_time()
        print("Action triggered at logical time {:d} nsec after start.".format(elapsed_time))
    =}
    reaction(x) -> a {=
        a.schedule(MSEC(200))
    =}
}
```

When this reactor receives an input `x`, it calls `a.schedule()`, specifying the action `a` to be triggered and the logical time offset (200 msec). The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. At that logical time, the second reaction will trigger and will use the `get_elapsed_logical_time()` function to determine how much logical time has elapsed since the start of execution.

Notice that after the logical time offset of 200 msec, there may be another input `x` simultaneous with the action `a`. Because the reaction to `a` is given first, it will execute first. This becomes important when such a reactor is put into a feedback loop (see below).

### Zero-Delay actions

If the specified delay in a `.schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](https://github.com/lf-lang/lingua-franca/wiki/language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time t, and you call `.schedule()` as follows:

```
a.schedule(0)
```

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous.

The metric time is visible to the Python programmer and can be obtained in a reaction using either `get_elapsed_logical_time()`, as above or `get_logical_time()`. The latter function also returns an `int` (aka `instant_t`), but its meaning is now the time elapsed since January 1, 1970 in nanoseconds.

As described in the [Language Specification](https://github.com/lf-lang/lingua-franca/wiki/language-specification#action-declaration) document, action declarations can have a _min_delay_ parameter. This modifies the timestamp further. Also, the action declaration may be **physical** rather than **logical**, in which case the assigned timestap will depend on the physical clock of the executing platform.

## Actions With Values

Actions can also carry a **value**, a Python object that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from the [Contained Reactors](https://github.com/lf-lang/lingua-franca/wiki/language-specification#Contained-Reactors) section in the Language Specification document that the **after** keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/DelayInt.lf) example:

```lf-py
reactor Delay(delay(100 msec)) {
    input _in;
    output out;
    logical action a;
    reaction(a) -> out {=
        if (a.value is not None) and a.is_present:
            out.set(a.value)
    =}
    reaction(_in) -> a {=
        a.schedule(self.delay, _in.value)
    =}
}
```

Using this reactor as follows:

```
d = new Delay();
source.out -> d._in;
d._in -> sink.out;
```

is equivalent to:

```
source.out -> sink.in after 100 msec;
```

The reaction to the input `in` declares as its effect the action `a`. This declaration makes it possible for the reaction to schedule a future triggering of `a`. As with other constructs in the Python reactor target, types are avoided.

The first reaction declares that it is triggered by `a` and has effect `out`. To
read the value, it uses the `a.value` class variable. Because this reaction is
first, the `out` at any logical time can be produced before the input `_in` is
even known to be present. Hence, this reactor can be used in a feedback loop,
where `out` triggers a downstream reactor to send a message back to `_in` of
this same reactor. If the reactions were given in the opposite order, there
would be causality loop and compilation would fail.

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Stopping Execution

<div class="lf-c lf-py">

A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in function `request_stop()`, which takes no arguments. In a non-federated execution, the actual last tag of the program will be one microstep later than the tag at which `request_stop()` was called. For example, if the current tag is `(2 seconds, 0)`, the last (stop) tag will be `(2 seconds, 1)`. In a federated execution, however, the stop time will likely be larger than the current logical time. All federates are assured of stopping at the same logical time.

</div>

<div class="lf-cpp">

A reaction may request that the execution stops after all events with the current timestamp have been processed by calling `environment()->sync_shutdown()`. There is also a method `environment()->async_shutdown()`
which may be invoked from outside an reaction, like an external thread.

</div>

<div class="lf-py">

A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in function `request_stop()`, which takes no arguments. In a non-federated execution, the actual last tag of the program will be one microstep later than the tag at which `request_stop()` was called. For example, if the current tag is `(2 seconds, 0)`, the last (stop) tag will be `(2 seconds, 1)`.

> :spiral_notepad: The [[timeout | Target-Specification#timeout]] target specification will take precedence over this function. For example, if a program has a timeout of `2 seconds` and `request_stop()` is called at the `(2 seconds, 0)` tag, the last tag will still be `(2 seconds, 0)`.

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Log and Debug Information

<div class="lf-c">

A suite of useful functions is provided in [util.h](https://github.com/lf-lang/reactor-c/blob/main/core/utils/util.h) for producing messages to be made visible when the generated program is run. Of course, you can always use `printf`, but this is not a good choice for logging or debug information, and it is not a good choice when output needs to be redirected to a window or some other user interface (see for example the [sensor simulator](https://github.com/lf-lang/reactor-c/blob/main/util/sensor_simulator.h)). Also, in federated execution, these functions identify which federate is producing the message. The functions are listed below. The arguments for all of these are identical to `printf` with the exception that a trailing newline is automatically added and therefore need not be included in the format string.

- `DEBUG_PRINT(format, ...)`: Use this for verbose messages that are only needed during debugging. Nothing is printed unless the [target](/docs/handbook/target-specification#logging) parameter `logging` is set to `debug`. THe overhead is minimized when nothing is to be printed.

- `LOG_PRINT(format, ...)`: Use this for messages that are useful logs of the execution. Nothing is printed unless the [target parameter `logging`](/docs/handbook/target-specification#logging) is set to `log` or `debug`. This is a macro so that overhead is minimized when nothing is to be printed.

- `info_print(format, ...)`: Use this for messages that should normally be printed but may need to be redirected to a user interface such as a window or terminal (see `register_print_function` below). These messages can be suppressed by setting the [logging target property](/docs/handbook/target-specification#logging) to `warn` or `error`.

- `warning_print(format, ...)`: Use this for warning messages. These messages can be suppressed by setting the [logging target property](/docs/handbook/target-specification#logging) to `error`.

- `error_print(format, ...)`: Use this for error messages. These messages are not suppressed by any [logging target property](/docs/handbook/target-specification#logging).

- `error_print_and_exit(format, ...)`: Use this for catastrophic errors.

In addition, a utility function is provided to register a function to redirect printed outputs:

- `register_print_function(function)`: Register a function that will be used instead of `printf` to print messages generated by any of the above functions. The function should accept the same arguments as `printf`.

</div>

<div class="lf-cpp">

The reactor-cpp library provides logging utilities in [logging.hh](https://github.com/tud-ccc/reactor-cpp/blob/master/include/reactor-cpp/logging.hh) for producing messages to be made visible when the generated program is run. Of course `std::cout` or `printf` can be used for the same purpose, but the logging mechanism provided by reactor-cpp is thread-safe ensuring that messages produced in parallel reactions are not interleaved with each other and provides common way for turning messages of a certain severity on and off.

In particular, reactor-cpp provides the following logging interfaces:

- `reactor::Debug()`: for verbose debug messages
- `reactor::Info()`: for info messages of general interest, info is the default severity level
- `reactor::Warning()`: for warning messages
- `reactor::Error()`: for errors

These utilities can be used analogues to `std::cout`. For instance:

```lf-cpp
reactor::Info() << "Hello World! It is " << get_physical_time();
```

Note that unlike `std::cout` the new line delimiter is automatically added to the end of the message.

Which type of messages are actually produced by the compiled program can be controlled with the `log-level` target property.

</div>

<div class="lf-py">

The Python supports the [logging](/docs/handbook/target-declaration#logging) target specification. This will cause the runtime to produce more or less information about the execution. However, user-facing functions for different logging levels are not yet implemented (see issue [#619](https://github.com/lf-lang/lingua-franca/issues/619)).

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Target Implementation Details

<div class="lf-c">

### Included Libraries

The generated code includes the following standard C libraries, so there is no need for a reactor definition to explicitly include them if they are needed:

- stdio.h
- stdlib.h
- string.h
- time.h
- errno.h

In addition, the multithreaded implementation uses

- pthread.h

### Single Threaded Implementation

The runtime library for the single-threaded implementation is in the following files:

- reactor.c
- reactor_common.c (included in the above using #include)
- pqueue.c

Three header files provide the interfaces:

- reactor.h
- ctarget.h
- pqueue.h

The strategy is to have two queues of pending accessor invocations, one that is sorted by timestamp (the **event queue**) and one that is sorted by priority (the **reaction queue**). Execution proceeds as follows:

1. At initialization, an event for each timer is put on the event queue and logical time is initialized to the current time, represented as the number of nanoseconds elapsed since January 1, 1970.

2. At each logical time, pull all events from event queue that have the same earliest time stamp, find the reactions that these events trigger, and put them on the reaction queue. If there are no events on the event queue, then exit the program (unless the `--keepalive true` command-line argument is given).

3. Wait until physical time matches or exceeds that earliest timestamp (unless the `--fast true` command-line argument is given). Then advance logical time to match that earliest timestamp.

4. Execute reactions in order of priority from the reaction queue. These reactions may produce outputs, which results in more events getting put on the reaction queue. Those reactions are assured of having lower priority than the reaction that is executing. If a reaction calls `schedule()`, an event will be put on the event queue, not the reaction queue.

5. When the reaction queue is empty, go to 2.

### Multithreaded Implementation

The runtime library for the multithreaded implementation is in the following files:

- reactor_threaded.c
- reactor_common.c (included in the above using #include)
- pqueue.c

The same two header files provide the interfaces:

- reactor.h
- pqueue.h

The default number of worker threads is given by the `workers` argument in the [target](/docs/handbook/target-specification#threading) statement.
This can be overridden with the `--workers` [command-line argument](#command-line-arguments).
By default, the number of workers will match the number of cores on the execution platform.

Upon initialization, the main thread will create the specified number of worker threads.
A good choice is for this number to match the number of available cores.
Execution proceeds in a manner similar to the [single threaded implementation](single-threaded-implementation)
except that the worker threads concurrently draw reactions from the reaction queue.
The execution algorithm ensures that no reaction executes until all reactions that it depends on that are also
on the reaction queue have executed at the current logical time.

</div>

<div class="lf-cpp">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-py">

The Python target is built on top of the C runtime to enable maximum efficiency where possible. The Python target uses the single threaded C runtime by default but will switch to the multithreaded C runtime if a physical action is detected. The [threading](/docs/handbook/target-specification#threading) target property can be used to override this behavior.

Running [lfc](/docs/handbook/command-line-tools) on a `XXX.lf` program that uses the Python target specification will create the following files:

```
├── src
│   └── XXX.lf
└── src-gen
    └── XXX
        ├── core
        │   ...             # C runtime files
        ├── ctarget.c       # C target API implementations
        ├── ctarget.h       # C target API definitions
        ├── pythontarget.c  # Python target API implementations
        ├── pythontarget.h  # Python target API definitions
        ├── setup.py        # Setup file used to install the Python C extension
        ├── XXX.c           # Source code of the Python C extension
        └── XXX.py          # Actual Python code containing reactors and reaction code
```

There are two major components in the `src-gen/XXX` directory that together enable the execution of a Python target application:

- A [XXX.py](#the-xxxpy-file-containing-user-code) file containing the user code (e.g., reactor definitions and reactions) and
- the source code for a [Python C extension module](#the-generated-linguafrancaxxx-python-module-a-c-extension-module) called `LinguaFrancaXXX` containing the C runtime, as well as hooks to execute the user-defined reactions.

The interactions between the `src-gen/XXX/XXX.py` file and the `LinguaFrancaXXX` module are explained [below](#interactions-between-xxxpy-and-linguafrancaxxx).

### The `XXX.py` file containing user code

The `XXX.py` file contains all the reactor definitions in the form of Python classes. The contents of a reactor are converted as follows:

- Each **Reaction** in a reactor definition will be converted to a class method.
- Each **Parameter** will be converted to a class [property](https://docs.python.org/3/library/functions.html?highlight=property#property) to make it read-only.
- Each **State** variable will be converted to an [instance variable](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables).
- Each trigger and effect will be converted to an object passed as a method function argument to reaction methods, allowing the body of the reaction to access them.
- Each reactor **Preamble** will be put in the class definition verbatim.

Finally, each reactor class instantiation will be converted to a Python object class instantiation.

For example, imagine the following program:

```lf-py
# src/XXX.lf
target Python;
reactor Foo(bar(0)) {
    preamble {=
        import random
    =}
    state baz
    input _in
    logical action act
    reaction(_in, act) {=
        # Body of the reaction
        self.random.seed() # Note the use of self
    =}
}
main reactor {
    foo = new Foo()
}
```

Th reactor `Foo` and its instance, `foo`, will be converted to

```lf-py
# src-gen/XXX/XXX.py
...

# Python class for reactor Foo
class _Foo:

    # From the preamble, verbatim:
    import random
    def __init__(self, **kwargs):
        #Define parameters and their default values
        self._bar = 0
        # Handle parameters that are set in instantiation
        self.__dict__.update(kwargs)

        # Define state variables
        self.baz = None

    @property
    def bar(self):
        return self._bar

    def reaction_function_0(self , _in, act):
        # Body of the reaction
        self.random.seed() # Note the use of self
        return 0


# Instantiate classes
xxx_foo_lf = \
    [_Foo(bank_index = 0, \
        _bar=0)]

...
```

### The generated LinguaFrancaXXX Python module (a C extension module)

The rest of the files in `src-gen/XXX` form a [Python C extension module](https://docs.python.org/3/extending/building.html#building-c-and-c-extensions) called `LinguaFrancaXXX` that can be installed by executing `python3 -m pip install .` in the `src-gen/XXX/` folder. In this case, `pip` will read the instructions in the `src-gen/XXX/setup.py` file and install a `LinguaFrancaXXX` module in your local Python module installation directory.

**Note:** LinguaFrancaXXX does not necessarily have to be installed if you are using the "traditional" Python implementation (CPython) directly. You could simply use `python3 setup.py build` to build the module in the `src-gen/XXX` folder. However, we have found that [other C Python implementations](https://www.python.org/download/alternatives/) such as Anaconda will not work with this kind of local module.

As mentioned before, the LinguaFrancaXXX module is separate from `src-gen/XXX/XXX.py` but interacts with it. Next, we explain this interaction.

### Interactions between XXX.py and LinguaFrancaXXX

The LinguaFrancaXXX module is imported in `src-gen/XXX/XXX.py`:

```
from LinguaFrancaXXX import *
```

This is done to enable the main function in `src-gen/XXX/XXX.py` to make a call to the `start()` function, which is part of the generated (and installed) `LinguaFrancaXXX` module. This function will start the main event handling loop of the C runtime.

From then on, `LinguaFrancaXXX` will call reactions that are defined in `src-gen/XXX/XXX.py` when needed.

### The LinguaFrancaBase package

[LinguaFrancaBase](https://pypi.org/project/LinguaFrancaBase/) is a package that contains several helper methods and definitions that are necessary for the Python target to work. This module is installable via `python3 -m pip install LinguaFrancaBase` but is automatically installed if needed during the installation of `LinguaFrancaXXX`. The source code of this package can be found [on GitHub](https://github.com/lf-lang/reactor-c-py).

This package's modules are imported in the `XXX.py` program:

```
from LinguaFrancaBase.constants import * #Useful constants
from LinguaFrancaBase.functions import * #Useful helper functions
from LinguaFrancaBase.classes import * #Useful classes
```

### Already imported Python modules

The following packages are already imported and thus do not need to be re-imported by the user:

```
import sys
import copy
```

</div>

<div class="lf-ts">

<span class="warning">FIXME: Get from below</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Get from below</span>

</div>

[comment]: <> (================= END =====================)

[comment]: <> (================= NEW LANGUAGE =====================)

</div>

[comment]: <> (================= FIXME: Fold what's below into above sections =====================)

<div class="lf-rs">

### Target properties summary

Target properties may be mentioned like so:

```rust
target Rust {
    // enables single-file project layout
    single-file-project: false,
    // timeout for the execution. The program will shutdown at most after the specified duration.
    timeout: 3 sec,

    cargo-features: ["cli"]
}
```

The full list of supported target properties:

- `build-type: [Debug | Release | RelWithDebInfo | RelMinSize]` - profile to use for the cargo build command. This property uses the CMake names: `Debug` corresponds to Cargo's `dev` profile, and `Release` is self-explanatory. The other two profiles are mapped to custom Cargo profiles, and are special cases of `Release`.
- `cargo-features: <string array>` - list of features of the generated crate. Supported are:
  - "cli" - enable [command-line argument parsing](#cli)
- `cargo-dependencies: { ... }` - list of dependencies to include in the generated Cargo.toml file. The value of this parameter is a map of package name to _dependency-spec_ (see [Specifying dependencies](#specifying-dependencies)).
- `export-dependency-graph: [true|false]` - dump the dependency graph to a file in DOT format before starting the execution. If a [CLI](#cli) is generated, the target property is ignored, and the user should instead use the `--export-graph` flag of the generated program.
- `rust-include: <string array>` - includes a set of Rust modules in the generated project. See [Linking support files](#linking-support-files).
- `single-file-project: [true|false]` - enables [single-file project layout](#single-file-layout)
- `timeout: <time value>` - timeout for the execution. The program will shutdown the specified amount of (logical) time after the start of its execution.
- `keepalive: [true|false]` - supported for compatiblity with standard parameters but is ignored in the Rust target. The runtime framework is smart enough to stay put when some threads may push asynchronous events, and only shutdown when we know the event queue will remain empty forever.

Note that the `logging` target property is ignored by the Rust target, as the levels used are incompatible with the Rust standard levels. See [Logging levels](#logging-levels).

### The executable

The executable name is the name of the main reactor _transformed to snake_case_: `main reactor RustProgram` will generate `rust_program`.

#### CLI

The generated executable may feature a command-line interface (CLI), if it uses the `cargo-features: ["cli"]` target property. When that feature is enabled:

- some target properties become settable at runtime:
  - `--timeout <time value>`: override the default timeout mentioned as a target property. The syntax for times is just like the LF one (eg `1msec`, `"2 seconds"`).
  - `--threads <number>`: override the default thread count mentioned as a target property. This option is **ignored** unless the runtime crate has been built with the feature `parallel-runtime`.
  - `--export-graph`: export the dependency graph (corresponds to `export-dependency-graph` target property). This is a flag, ie, absent means false, present means true. This means the value of the target property is ignored and not used as default.
  - `--log-level`: corresponds to the `logging` target property, but note that the levels have different meanings, and the target property is ignored. See [Logging levels](#logging-levels).
- parameters of the main reactor are translated to CLI parameters.
  - Each LF parameter named `param` corresponds to a CLI parameter named `--main-param`. Underscores in the LF parameter name are replaced by hyphens.
  - The type of each parameters must implement the trait [`FromStr`](https://doc.rust-lang.org/std/str/trait.FromStr.html).

When the `cli` feature is disabled, the parameters of the main reactor will each assume their default value.

#### Logging levels

The executable reacts to the environment variable `RUST_LOG`, which sets the logging level of the application. Possible values are
`off`, `error`, `warn`, `info`, `debug`, `trace`

Error and warning logs are on by default. Enabling a level enables all greater levels (ie, `RUST_LOG=info` also enables `warn` and `error`, but not `trace` or `debug`).

Logging can also be turned on with the `--log-level` CLI option, if the application features a [CLI](#cli).

Note that the `logging` target property is ignored, as its levels do not match the Rust standard levels we use (those of the [`log` crate](https://docs.rs/log/)).

Note that when building with a release profile (i.e., target property `build-type` is not `Debug`), all log statements with level `debug` and `trace` are removed from the executable, and cannot be turned on at runtime. A warning is produced by the executable if you try to use these levels explicitly.

### File layout

The Rust code generator generates a Cargo project with a classical layout:

```
├── Cargo.lock
├── Cargo.toml
├── src
│   ├── main.rs
│   └── reactors
│       ├── mod.rs
|       ├── ...
|
└── target
    ├── ...
```

The module structure is as follows:

- the crate has a module `reactors`
- each LF reactor has its own submodule of `reactors`. For instance, `Minimal.lf` will generate `minimal.rs`. The name is transformed to snake_case.

This means that to refer to the contents of another reactor module, e.g. that of `Other.lf`, you have to write `super::other::Foo`. This is relevant to access `preamble` items.

#### Single-file layout

The Rust target supports an alternative file layout, where all reactors are generated into the `main.rs` file, making the project fit in a single file (excluding `Cargo.toml`). _The module structure is unchanged:_ the file still contains a `mod reactors { ... }` within which each reactor has its `mod foo { ... }`. You can thus change the layout without having to update any LF code.

Set the target property `single-file-project: true` to use this layout.

Note: this alternative layout is provided for the purposes of making self-contained benchmark files. Generating actual runnable benchmarks from an LF file may be explored in the future.

### Specifying dependencies

The Rust code generator leverages Cargo to allow LF programs to profit from Rust's large package ecosystem. The code generator may also link support files written in pure Rust into the generated crate. Target properties are used to achieve all this.

#### Adding cargo dependencies

The `cargo-dependencies` target property may be used to specify dependencies on crates coming from `crates.io`. Here's an example:

```ruby
target Rust {
   cargo-dependencies: {
      termcolor: "0.8"
   }
};
```

The value of the _cargo-dependencies_ property is a map of crate identifiers to a _dependency-spec_. An informal example follows:

```js
cargo-dependencies: {
   // Name-of-the-crate: "version"
   rand: "0.8",
   // Equivalent to using an explicit map:
   rand: {
     version: "0.8"
   },
   // The map allows specifying more details
   rand: {
     // A path to a local unpublished crate.
     // Note 'path' is mutually exclusive with 'git'.
     path: "/home/me/Git/local-rand-clone"
   },
   rand: {
     // A URL to a git repo
     git: "https://github.com/me/rand",
     // Specify an explicit Git revision number
     rev: "abcdef1234"
   },
   rand: {
     version: "0.8",
     // you can specify cargo features
     features: ["some-cargo-feature",]
   }
}
```

When a _dependency-spec_ is specified as an object, its key-value pairs correspond directly to those of a [Cargo dependency specification](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#specifying-dependencies-from-git-repositories). For instance for the following dependency spec:

```js
   rand: {
     version: "0.8",
     // you can specify cargo features
     features: ["some-cargo-feature",]
   }
```

we add the following to the generated `Cargo.toml`:

```toml
[dependencies.rand]
version = "0.8"
features = ["some-cargo-feature"]
```

Not all keys are necessarily supported though, eg the `registry` key is not supported (yet).

#### Configuring the runtime

The runtime crate can be configured just like other crates, using the `cargo-dependencies` target property, eg:

```js
cargo-dependencies: {
   reactor_rt: {
     features: ["parallel-runtime"]
   }
}
```

The dependency is always included, with defaults picked by LFC. The location information (_path_/_git_/_version_ key) is optional.
See [reactor_rt](https://lf-lang.org/reactor-rust/reactor_rt/index.html) for the supported features.

#### Linking support files

You can link-in additional rust modules using the `rust-include` target property:

```ruby
target Rust {
  rust-include: ["foo.rs"]
};
```

The property is a list of paths (relative to the directory containing the `.lf` file). Each path should either point to a Rust file (`.rs`), or a directory that contains a `mod.rs` file. Each of those will be copied to the `src` directory of the generated Cargo project, and linked in to the `main.rs` file.

To refer to the included module, you can use e.g. `crate::foo` if your module is named `foo`.

### Generation scheme

Each reactor generates its own `struct` which contains state variables. For instance,

<table>
<thead>
<tr>
<th>LF</th>
<th>Generated Rust</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```rust
reactor SomeReactor {
  state field: u32(0)
}
```

</td>

<td>

```rust
struct SomeReactor {
  field: u32
}
```

</td>

</tr>
</tbody>
</table>

In the following we refer to that struct as the _state struct_.

#### Reactions

Reactions are each generated in a separate method of the reactor struct. Reaction names are unspecified and may be mangled to prevent explicit calling. The parameters of that method are

- `&mut self`: the state struct described above,
- `ctx: &mut ReactionCtx`: the context object for the reaction execution,
- For each dependency, a parameter is generated.
  - If the dependency is a component of this reactor, the name of the parameter is just the name of the component
  - If the dependency is a port of a child reactor, the name of the parameter is `<name of the child instance>__<name of the port>`, e.g. `child__out` for `child.out`.
  - The type of the parameter depends on the kind of dependency and of component:
  <table>
  <thead>
  <tr>
  <th>Component</th>
  <th>Use/trigger dependency</th>
  <th>Effect dependency</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>

Port of type `T`

</td>
<td>

`&ReadablePort<T>`

</td>

<td>

`WritablePort<T>`

</td>

</tr>

<tr>
<td>

Logical action of type `T`

</td>
<td>

`&LogicalAction<T>`

</td>

<td>

`&mut LogicalAction<T>`

</td>

</tr>

<tr>
<td>

Physical action of type `T`

</td>
<td>

`&PhysicalActionRef<T>`

</td>

<td>

`&mut PhysicalActionRef<T>`

</td>
</tr>

<tr>
<td>Timer</td>
<td>

`&Timer`

</td>

<td>

n/a

</td>
</tr>

<tr>
<td>

Port bank of type `T`

</td>
<td>

`&ReadablePortBank<T>`

</td>

<td>

`WritablePortBank<T>`

</td>

</tr>

</tbody>
</table>

Undeclared dependencies, and dependencies on timers and `startup` or `shutdown`, do not generate a parameter.

The [`ReactionCtx`](https://lf-lang.org/reactor-rust/reactor_rt/struct.ReactionCtx.html) object is a mediator to manipulate all those dependency objects. It has methods to set ports, schedule actions, retrieve the current logical time, etc.

For instance:

```rust
reactor Source {
    output out: i32;
    reaction(startup) -> out {=
        ctx.set(out, 76600)
    =}
}
```

In this example, the context object `ctx` is used to set a port to a value. The port is in scope as `out`.

> :warning: TODO when the runtime crate is public link to the docs, they should be the most exhaustive documentation.

#### Actions

Within a reaction, actions may be scheduled using the [`schedule`](https://lf-lang.org/reactor-rust/reactor_rt/struct.ReactionCtx.html#method.schedule) function:

```rust
// schedule without additional delay
ctx.schedule(act, Asap);
// schedule with an additional delay
ctx.schedule(act, after!(20 ms));
// that's shorthand for
ctx.schedule(act, After(Duration.of_millis(20)));
```

Actions may carry values if they mention a data type, for instance:

```rust
logical action act: u32;
```

Within a reaction, you can schedule that action with a value like so

```rust
ctx.schedule_with_v(act, Asap, 30);
```

you can get the value from another reaction like so:

```rust
if let Some(value) = ctx.get_action(act) {
  // a value is present at this tag
} else {
  // value was not specified
}
```

If an action does not mention a data type, the type is defaulted to `()`.

[comment]: <> (================= NEW LANGUAGE =====================)

<div class="lf-ts">

## The TypeScript Target Specification

To have Lingua Franca generate TypeScript code, start your `.lf` file with the following target specification:

    target TypeScript;

A TypeScript target specification may optionally include the following parameters:

- `fast [true|false]`: Whether to execute as fast as possible ignoring real time. This defaults to false.
- `keepalive [true|false]`: Whether to continue executing even when there are no events on the event queue. The default is false. Usually, you will want to set this to true when you have **physical action**s.
- `logging [ERROR|WARN|INFO|LOG|DEBUG]`: The level of diagnostic messages about execution to print to the console. A message will print if this parameter is greater than or equal to the level of the message (`ERROR` < `WARN` < `INFO` < `LOG` < `DEBUG`). Internally this is handled by the [ulog module](https://www.npmjs.com/package/ulog).
- `timeout <n> <units>`: The amount of logical time to run before exiting. By default, the program will run forever or until forcibly stopped, with control-C, for example.

For example, for the TypeScript target, in a source file named `Foo.lf`, you might specify:

    target TypeScript {
        fast: true,
        timeout: 10 secs,
        logging: INFO,

    };

The `fast` option given above specifies to execute the file as fast as possible, ignoring timing delays.

The `logging` option indicates diagnostic messages tagged as `ERROR`, `WARN`, and `INFO` should print to the console. Messages tagged `LOG` or `DEBUG` will not print.

The `timeout` option specifies to stop after 10 seconds of logical time have elapsed.

## Command-Line Arguments

The generated JavaScript program understands the following command-line arguments, each of which has a short form (one character) and a long form:

- `-f, --fast [true | false]`: Specifies whether to wait for physical time to match logical time. The default is `false`. If this is `true`, then the program will execute as fast as possible, letting logical time advance faster than physical time.
- `-o, --timeout '<duration> <units>'`: Stop execution when logical time has advanced by the specified _duration_. The units can be any of nsec, usec, msec, sec, minute, hour, day, week, or the plurals of those. For the duration and units of a timeout argument to be parsed correctly as a single value, these should be specified in quotes with no leading or trailing space (eg '5 sec').
- `-k, --keepalive [true | false]`: Specifies whether to stop execution if there are no events to process. This defaults to `false`, meaning that the program will stop executing when there are no more events on the event queue. If you set this to `true`, then the program will keep executing until either the `timeout` logical time is reached or the program is externally killed. If you have `physical action`s, it usually makes sense to set this to `true`.
- `-l, --logging [ERROR | WARN | INFO | LOG | DEBUG]`: The level of logging messages from the reactor-ts runtime to to print to the console. Messages tagged with a given type (error, warn, etc.) will print if this argument is greater than or equal to the level of the message (`ERROR` < `WARN` < `INFO` < `LOG` < `DEBUG`).
- `-h, --help`: Print this usage guide. The program will not execute if this flag is present.

If provided, a command line argument will override whatever value the corresponding target property had specified in the source .lf file.

Command line options are parsed by the [command-line-arguments](https://github.com/75lb/command-line-args) module with [these rules](https://github.com/75lb/command-line-args/wiki/Notation-rules). For example

```
$ node <LF_file_name>/dist/<LF_file_name>.js -f false --keepalive=true -o '4 sec' -l INFO
```

is a valid setting.

Any errors in command-line arguments result in printing the above information. The program will not execute if there is a parsing error for command-line arguments.

### Custom Command-Line Arguments

User-defined command-line arguments may be created by giving the main reactor [parameters](#using-parameters). Assigning the main reactor a parameter of type `string`, `number`, `boolean`, or `time` will add an argument with corresponding name and type to the generated program's command-line-interface. Custom arguments will also appear in the generated program's usage guide (from the `--help` option). If the generated program is executed with a value specified for a custom command-line argument, that value will override the default value for the corresponding parameter. Arguments typed `string`, `number`, and `boolean` are parsed in the expected way, but `time` arguments must be specified on the command line like the `--timeout` property as `'<duration> <units>'` (in quotes).

Note: Custom arguments may not have the same names as standard arguments like `timeout` or `keepalive`.

For example this reactor has a custom command line argument named `customArg` of type `number` and default value `2`:

```
target TypeScript;
main reactor clArg(customArg:number(2)) {
    reaction (startup) {=
        console.log(customArg);
    =}
}
```

If this reactor is compiled from the file `simpleCLArgs.lf`, executing

```
node simpleCLArgs/dist/simpleCLArgs.js
```

outputs the default value `2`. But running

```
node simpleCLArgs/dist/simpleCLArgs.js --customArg=42
```

outputs `42`. Additionally, we can view documentation for the custom command line argument with the `--help` command.

```
node simpleCLArgs/dist/simpleCLArgs.js -h
```

The program will generate the standard usage guide, but also

```
--customArg '<duration> <units>'                    Custom argument. Refer to
                                                      <path>/simpleCLArgs.lf
                                                      for documentation.
```

### Additional types for Custom Command-Line Arguments

Main reactor parameters that are not typed `string`, `number`, `boolean`, or `time` will not create custom command-line arguments. However, that doesn't mean it is impossible to obtain other types from the command line, just use a `string` and specify how the parsing is done yourself. See below for an example of a reactor that parses a custom command-line argument of type `string` into a state variable of type `Array<number>` using `JSON.parse` and a [user-defined type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

```
target TypeScript;
main reactor customType(arrayArg:string("")) {
    preamble {=
        function isArrayOfNumbers(x: any): x is Array<number> {
            for (let item of x) {
                if (typeof item !== "number") {
                    return false;
                }
            }
            return true;
        }
    =}
    state foo:{=Array<number>=}({=[]=});
    reaction (startup) {=
        let parsedArgument = JSON.parse(customType);
        if (isArrayOfNumbers(parsedArgument)) {
            foo = parsedArgument;
            }
        else {
            throw new Error("Custom command line argument is not an array of numbers.");
        }
        console.log(foo);
    =}
}
```

## Imports

The [import statement](Language-Specification#import-statement) can be used to share reactor definitions across several applications. Suppose for example that we modify the above `Minimal.lf` program as follows and store this in a file called `HelloWorld.lf`:

```
target TypeScript;
reactor HelloWorldInside {
    timer t;
    reaction(t) {=
        console.log("Hello World.");
    =}
}
main reactor HelloWorld {
    a = new HelloWorldInside();
}
```

This can be compiled and run, and its behavior will be identical to the version above.
But now, this can be imported into another reactor definition as follows:

```
target TypeScript;
import HelloWorld.lf;
main reactor TwoHelloWorlds {
    a = new HelloWorldInside();
    b = new HelloWorldInside();
}
```

This will create two instances of the HelloWorld reactor, and when executed, will print "Hello World" twice.

A more interesting illustration of imports can be found in the `Import.lf` test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS).

## Preamble

Reactions may contain arbitrary TypeScript code, but often it is convenient for that code to invoke node modules or to share function/type/class definitions. For these purposes, a reactor may include a **preamble** section. For example, the following reactor uses Node's built-in path module to extract the base name from a path:

```
target TypeScript;
main reactor Preamble {
    preamble {=
        import * as path from 'path';
    =}
    reaction (startup) {=
        var filename = path.basename('/Users/Refsnes/demo_path.js');
        console.log(filename);
    =}
}
```

This will print:

```
demo_path.js
```

By putting the `import` in the **preamble**, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file. It's a bit more complicated to [set up node.js modules from npm](#using-node-modules) that aren't built-in, but the reaction code to `import` them is the same as what you see here.

You can also use the preamble to define functions that are shared across reactions and reactors:

```
main reactor Preamble {
    preamble {=
        function add42( i:number) {
            return i + 42;
        }
    =}
    timer t;
    reaction(t) {=
        let s = "42";
        let radix = 10;
        let i = parseInt(s, radix);
        console.log("Converted string " + s + " to number " + i);
        console.log("42 plus 42 is " + add42(42));
    =}
}
```

Not surprisingly, this will print:

```
Converted string 42 to number 42
42 plus 42 is 84
```

### Using Node Modules

Installing Node.js modules for TypeScript reactors with `npm` is essentially the same as installing modules for an ordinary Node.js program. First, write a Lingua Franca program (`Foo.lf`) and compile it. It may not type check if if you're [importing modules in the preamble](#preamble) and you haven't installed the modules yet, but compiling your program will cause the TypeScript code generator to [produce a project](#typescript-target-implementation-details) for your program. There should now be a package.json file in the same directory as your .lf file. Open a terminal and navigate to that directory. You can use the standard [`npm install`](https://docs.npmjs.com/cli/install) command to install modules for your TypeScript reactors.

The important takeaway here is with the package.json file and the compiled JavaScript in the Foo/dist/ directory, you have a standard Node.js program that executes as such. You can modify and debug it just as you would a Node.js program.

## Reactions

Recall that a reaction is defined within a reactor using the following syntax:

> **reaction**(_triggers_) _uses_ -> _effects_ {=<br/> > &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the TypeScript target.

### Types

In Lingua Franca, reactor elements like inputs, outputs, actions, parameters, and state are typed using target language types. For the TypeScript target, [TypeScript types](https://www.typescriptlang.org/docs/handbook/basic-types.html) are generally acceptable with two notable exceptions:

- Custom types (and classes) must be defined in the [preamble](#preamble) before they may be used.
- `undefined` is not a valid type for an input, output, or action. This is because `undefined` is used to designate the absence of an input, output, or action during a reaction.

**To benefit from type checking, you should declare types for your reactor elements.** If a type isn't declared for a state variable, it is assigned the type [`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type). If a type isn't declared for an input, output, or action, it is assigned the [reactor-ts](https://github.com/lf-lang/reactor-ts) type `Present` which is defined as

```
export type Present = (number | string | boolean | symbol | object | null);
```

### Inputs and Outputs

In the body of a reaction in the TypeScript target, inputs are simply referred to by name. An input of type `t` is available within the body of a reaction as a local variable of type `t | undefined`. To determine whether an input is present, test the value of the input against `undefined`. An `undefined` input is not present.

**WARNING** Be sure to use the `===` or `!==` operator and not `==` or `!=` to test against `undefined`. In JavaScript/TypeScript the comparison `undefined == null` yields the value `true`. It may also be tempting to rely upon the falsy evaluation of `undefined` within an `if` statement, but this may introduce bugs. For example a reaction that tests the presence of input `x` with `if (x) { ... }` will not correctly identify potentially valid present values such as `0`, `false`, or `""`.

For example, the `Determinism.lf` test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS) includes the following reactor:

```
reactor Destination {
    input x:number;
    input y:number;
    reaction(x, y) {=
        let sum = 0;
        if (x !== undefined) {
            sum += x;
        }
        if (y !== undefined) {
            sum += y;
        }
        console.log("Received " + sum);
        if (sum != 2) {
            console.log("FAILURE: Expected 2.");
            util.failure();
        }
    =}
}
```

The reaction refers to the inputs `x` and `y` by name and tests for their presence by testing `x` and `y` against `undefined`. If a reaction is triggered by just one input, then normally it is not necessary to test for its presence. It will always be present. However TypeScript's type system is not smart enough to know such an input will never have type `undefined` if there's no test against `undefined` within the reaction. An explicit type annotation (for example `x = x as t;` where `t` is the type of the input) may be necessary to avoid type errors from the compiler. In the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:

```
reaction(x) y {=
    let sum = x as number;
    if (y !== undefined) {
        sum += y;
    }
    console.log("Received " + sum + ".");
=}
```

It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Like inputs, an output of type `t` is available within the body of a reaction as a local variable of type `t | undefined`. The local variable for each output is initialized to the output's current value. Outputs are set by assigning a (non-`undefined`) value to its local variable (no changes will be made to an output if it has the value `undefined` at the end of a reaction). Whatever value an output's local variable has at the end of the reaction will be set to that output. If an output's local variable has the value `undefined` at the end of the reaction, that output will not be set and connected downstream inputs will be absent. For example, we can further modify the above example as follows:

```
output z:number;
reaction(x) y -> z {=
    let sum = x as number;
    if (y !== undefined) {
        sum += y;
    }
    z = sum;
=}
```

If an output gets set more than once at any logical time, downstream reactors will see only the _final_ value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can do that using a `!== undefined` test for that output. For example, the following reactor will always produce the output 42:

```
reactor TestForPreviousOutput {
    output out:number;
    reaction(startup) -> out {=
        if (Math.random() > 0.5) {
            out = 21;
        }
    =}
    reaction(startup) -> out {=
        let previous_output = out;
        if (previous_output) {
            out = 2 * previous_output;
        } else {
            out = 42;
        }
    =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

### Using State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor will produce the output sequence 0, 1, 2, 3, ... :

```
reactor Count {
    state count:number(0);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        count++;
        y = count;
    =}
}
```

The declaration on the second line gives the variable the name "count", declares its type to be `number`, and initializes its value to 0. The type and initial value can be enclosed in the Typescript-code delimitters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

In the body of the reaction, the reactor's state variable is referenced by way of a local variable of the same name. The local variable will contain the current value of the state at the beginning of the reaction. The final value of the local variable will be used to update the state at the end of the reaction.

It may be tempting to declare state variables in the **preamble**, as follows:

```
reactor FlawedCount {
    preamble {=
        let count = 0;
    =}
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        count++;
        y = count;
    =}
}
```

This will produce a sequence of integers, but if there is more than one instance of the reactor, those instances will share the same variable count. Hence, **don't do this**! Sharing variables across instances of reactors violates a basic principle, which is that reactors communicate only by sending messages to one another. Sharing variables will make your program nondeterministic. If you have multiple instances of the above FlawedCount reactor, the outputs produced by each instance will not be predictable, and in an asynchronous implementation, will also not be repeatable.

A state variable may be a time value, declared as follows:

```
    state time_value:time(100 msec);
```

The `time_value` variable will be of type `TimeValue`, which is an object used to represent a time in the TypeScript Target. Refer to the section on [timed behavior](#timed-behavior) for more information.

A state variable can have an array or object value. For example, the following reactor computes the **moving average** of the last four inputs each time it receives an input:

```
reactor MovingAverage {
    state delay_line:{=Array<number>=}({= [0.0, 0.0, 0.0] =});
    state index:number(0);
    input x:number;
    output out:number;
    reaction(x) -> out {=
        x = x as number;
        // Calculate the output.
        let sum = x;
        for (let i = 0; i < 3; i++) {
            sum += delay_line[i];
        }
        out = sum/4.0;

        // Insert the input in the delay line.
        delay_line[index] = x;

        // Update the index for the next input.
        index++;
        if (index >= 3) {
            index = 0;
        }
    =}
}
```

The second line declares that the type of the state variable is an array of `number`s with the initial value of the array being a three-element array filled with zeros.

States whose type are objects can similarly be initialized. Declarations can take an object literal as the initial value:

```
state myLiteral:{= {foo: number, bar: string} =}({= {foo: 42, bar: "baz"} =});
```

or use `new`:

```
state mySet:{=Set<number>=}({= new Set<number>() =});
```

### Using Parameters

Reactor parameters are also referenced in the TypeScript code as local variables. The example below modifies the above `Count` reactor so that its stride is a parameter:

```
target TypeScript;
reactor Count(stride:number(1)) {
    state count:number(0);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y = count;
        count += stride;
    =}
}
reactor Display {
    input x:number;
    reaction(x) {=
        console.log("Received: " + x + ".");
    =}
}
main reactor Stride {
    c = new Count(stride = 2);
    d = new Display();
    c.y -> d.x;
}
```

The second line defines the `stride` parameter, gives its type, and gives its initial value. As with state variables, the type and initial value can be enclosed in `{= ... =}` if necessary. The parameter is referenced in the reaction by referring to the local variable `stride`.

When the reactor is instantiated, the default parameter value can be overridden. This is done in the above example near the bottom with the line:

```
    c = new Count(stride = 2);
```

If there is more than one parameter, use a comma separated list of assignments.

Parameters in Lingua Franca are immutable. To encourage correct usage, parameter variables within a reaction are local `const` variables. If you feel tempted to use a mutable parameter, instead try using the parameter to initialize state and modify the state variable instead. This is illustrated below by a further modification to the Stride example where it takes an initial "start" value for count as a second parameter:

```
target TypeScript;
reactor Count(stride:number(1), start:number(5)) {
    state count:number(start);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y = count;
        count += stride;
    =}
}
reactor Display {
    input x:number;
    reaction(x) {=
        console.log("Received: " + x + ".");
    =}
}
main reactor Stride {
    c = new Count(stride = 2, start = 10);
    d = new Display();
    c.y -> d.x;
}
```

Parameters can have array or object values. Here is an example that outputs the elements of an array as a sequence of individual messages:

```
reactor Source(sequence:{=Array<number>=}({= [0, 1, 2] =})) {
    output out:number;
    state count:number(0);
    logical action next;
    reaction(startup, next) -> out, next {=
        out = sequence[count];
        count++;
        if (count < sequence.length) {
            actions.next.schedule(0, null);
        }
    =}
}
```

The **logical action** named `next` and the `schedule` function are explained below in [Scheduling Delayed Reactions](#Scheduling-Delayed-Reactions), but here they are used simply to repeat the reaction until all elements of the array have been sent.

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is a TypeScript array literal. Since this is TypeScript syntax, not Lingua Franca syntax, the initial value needs to be surrounded with the target code delimiters, `{= ... =}`. The default value can be overridden when instantiating the reactor using a similar syntax:

```
s = new Source(sequence={= [1, 2, 3, 4] =});
```

Both default and overridden values for parameters can also be created with the `new` keyword:

```
reactor Source(sequence:{=Array<number>=}({= new Array<number>() =})) {
```

and

```
s = new Source(sequence={= new Array<number() =});
```

### Sending and Receiving Custom Types

You can define your own datatypes in TypeScript and send and receive those. Consider the following example:

```
reactor CustomType {
    preamble {=
        type custom = string | null;
    =}
    output out:custom;
    reaction(startup) -> out {=
        out = null;
    =}
}
```

The **preamble** code defines a custom union type of `string` and `null`.

## Timed Behavior

See [Summary of Time Functions](#summary-of-time-functions) and [Utility Function Reference](#utility-function-reference) for a quick API reference.

Timers are specified exactly as in the [Lingua Franca language specification](Language-Specification#timer-declaration). When working with time in the TypeScript code body of a reaction, however, you will need to know a bit about its internal representation.

A `TimeValue` is an class defined in the TypeScript target library file `time.ts` to represent a time instant or interval. For your convenience `TimeValue` and other classes from the `time.ts` library mentioned in these instructions are automatically imported into scope of your reactions. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Internally a `TimeValue` uses two numbers to represent the time. To prevent overflow (which would occur for time intervals spanning more than 0.29 years if a single JavaScript number, which has 2^53 bits of precision, were to be used), we use _two_ numbers to store a time value. The first number denotes the number of whole seconds in the interval or instant; the second number denotes the remaining number of nanoseconds in the interval or instant. The first number represents the number of seconds, the second number represents the number of nanoseconds. These fields are not accessible to the programmer, instead `TimeValue`s may be manipulated by an [API](#summary-of-time-functions) with functions for addition, subtraction, and comparison.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider:

```
target TypeScript;
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let logical:TimeValue = util.getCurrentLogicalTime()
        console.log("Logical time is " + logical + ".");
    =}
}
```

When executed, you will get something like this:

```
Logical time is (1584666585 secs; 805146880 nsecs).
Logical time is (1584666586 secs; 805146880 nsecs).
Logical time is (1584666587 secs; 805146880 nsecs).
...
```

Subsequent values of logical time are printed out in their raw form, of seconds and nanoseconds. If you look closely, you will see that each number is one second larger than the previous number.

You can also obtain the _elapsed_ logical time since the start of execution, rather than exact logical time:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let logical:TimeValue = util.getElapsedLogicalTime()
        console.log("Logical time is " + logical + ".");
    =}
}
```

This will produce:

```
Logical time is (0 secs; 0 nsecs).
Logical time is (1 secs; 0 nsecs).
Logical time is (2 secs; 0 nsecs).
...
```

You can get physical time, which comes from your platform's real-time clock:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let physical:TimeValue = util.getCurrentPhysicalTime()
        console.log("Physical time is " + physical + ".");
    =}
}
```

This will produce something like this:

```
Physical time is (1584666801 secs; 644171008 nsecs).
Physical time is (1584666802 secs; 642269952 nsecs).
Physical time is (1584666803 secs; 642278912 nsecs).
...
```

Notice that these numbers are increasing by _roughly_ one second each time.

You can also get _elapsed_ physical time from the start of execution:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let physical:TimeValue = util.getElapsedPhysicalTime()
        console.log("Physical time is " + physical + ".");
    =}
}
```

This will produce something like:

```
Physical time is (0 secs; 2260992 nsecs).
Physical time is (1 secs; 166912 nsecs).
Physical time is (2 secs; 136960 nsecs).
...
```

You can create a `TimeValue` yourself with the `UnitBasedTimeValue` class. `UnitBasedTimeValue` is a subclass of `TimeValue` and can be used wherever you could also use a `TimeValue` directly obtained from one of the `util` functions. A `UnitBasedTimeValue` is constructed with a whole number and a `TimeUnit`. A `TimeUnit` is an enum from the `time.ts` library with convenient labels for common time units. These are nsec, usec, msec, sec (or secs), minute (or minutes), hour (or hours), day (or days), and week (or weeks).

This reactor has an example of a UnitBasedTimeValue.

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let myTimeValue:TimeValue = new UnitBasedTimeValue(200, TimeUnit.msec);
        let logical:TimeValue = util.getCurrentLogicalTime()
        console.log("My custom time value is " + myTimeValue + ".");
    =}
```

This will produce:

```
My custom time value is 200 msec.
My custom time value is 200 msec.
My custom time value is 200 msec.
...
```

### Tags

The TypeScript target provides a utility to get the current `Tag` of a reaction. Recall that time in Lingua Franca is superdense and each `TimeValue `is paired with an integer "microstep" index to track the number of iterations at a particular `TimeValue`. A `Tag` is this combination of a TimeValue and a "microstep". The `time.ts` library provides functions for adding, subtracting, and comparing `Tag`s.

You can get the current `Tag` in your reactions. This example illustrates tags with a [Zero-Delay Action](#zero-delay-actions):

```
target TypeScript;
main reactor GetTime {
    timer t(0, 1 sec);
    logical action a;
    reaction(t) -> a {=
        let superdense:Tag = util.getCurrentTag();
        console.log("First iteration - the tag is: " + superdense + ".");
        actions.a.schedule(0, null);
    =}
    reaction(a) {=
        let superdense:Tag = util.getCurrentTag();
        let timePart:TimeValue = superdense.time;
        let microstepPart:number = superdense.microstep;
        console.log("Second iteration - the time part of the tag is:  " + timePart + ".");
        console.log("Second iteration - the microstep part of the tag is:  " + microstepPart + ".");
    =}
}
```

This will produce:

```
First iteration - the tag is: ((1584669987 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669987 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
First iteration - the tag is: ((1584669988 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669988 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
First iteration - the tag is: ((1584669989 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669989 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
...
```

The first reaction prints the "First iteration" part of the output at microstep 0. The second reaction occurs one microstep later (explained in [Scheduling Delayed Reactions](#scheduling-delayed-reactions)) and illustrates how to split a `Tag` into its constituent `TimeValue` and microstep.

### Scheduling Delayed Reactions

Each action listed as an **effect** for a reaction is available as a schedulable object in the reaction body via the `actions` object. The TypeScript target provides a special `actions` object with a property for each schedulable action. Schedulable actions (of type `t`) have the object method:

```
schedule: (extraDelay: TimeValue | 0, value?: T) => void;
```

The first argument can either be the literal 0 (shorthand for 0 seconds) or a `TimeValue`/`UnitBasedTimeValue`. The second argument is the value for the action. Consider the following reactor:

```
target TypeScript;
reactor Schedule {
    input x:number;
    logical action a;
    reaction(x) -> a {=
        actions.a.schedule(new UnitBasedTimeValue(200, TimeUnit.msec), null);
    =}
    reaction(a) {=
        let elapsedTime = util.getElapsedLogicalTime();
        console.log("Action triggered at logical time " + elapsedTime + " after start.");
    =}
}
```

When this reactor receives an input `x`, it calls `schedule()` on the action `a`, so it will be triggered at the logical time offset (200 msec) with a null value. The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. This will trigger the second reaction, which will use the `util.getElapsedLogicalTime()` function to determine how much logical time has elapsed since the start of execution. The third argument to the `schedule()` function is a **value**, data that can be carried by the action, which is explained below. In the above example, there is no value.

### Zero-Delay Actions

If the specified delay in a `schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time _t_, and you call `schedule()` as follows:

```
actions.a.schedule(0);
```

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous. These reactions execute with different [Tags](#tags).

## Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. The most common use of this is to implement a logical delay, where a value provided at an input is produced on an output with a larger logical timestamp. To accomplish that, it is much easier to use the **after** keyword on a connection between reactors. Nevertheless, in this section, we explain how to directly use actions with value. In fact, the **after** keyword is implemented as described below.

If you are familiar with other targets (like C) you may notice it is much easier to schedule actions with values in TypeScript because of TypeScript/JavaScript's garbage collected memory management. The following example implements a logical delay using an action with a value.

```
reactor Delay(delay:time(100 msec)) {
    input x:number;
    output out:number;
    logical action a:number;
    reaction(x) -> a {=
        actions.a.schedule(delay, x as number);
    =}
    reaction(a) -> out {=
        if (a !== null){
            out = a as number
        }
    =}
}
```

The action `a` is specified with a type `number`. The first reaction declares `a` as its effect. This declaration makes it possible for the reaction to schedule a future triggering of `a`. It's necessary to explicitly annotate the type of `x` as a number in the schedule function because TypeScript doesn't know the only trigger of a reaction must be present in that reaction.

The second reaction declares that it is triggered by `a` and has effect `out`. When a reaction triggers or uses an action the value of that action is made available within the reaction as a local variable with the name of the action. This variable will take on the value of the action and it will have the value `undefined` if that action is absent because it was not scheduled for this reaction.

The local variable cannot be used directly to schedule an action. As described above, an action `a` can only be scheduled in a reaction when it is 1) declared as an effect and 2) referenced through a property of the `actions` object. The reason for this implementation is that `actions.a` refers to the **action**, not its value, and it is possible to use both the action and the value in the same reaction. For example, the following reaction will produce a counting sequence after it is triggered the first time:

```
reaction(a) -> out, a {=
    if (a !== null) {
        a = a as number;
        out = a;
        let newValue = a++;
        actions.a.schedule(delay, newValue);
    }
=}
```

## Stopping Execution

A reaction may request that the execution stop by calling the function `util.requestShutdown()` which takes no arguments. Execution will not stop immediately when this function is called; all events with the current tag will finish processing and execution will continue for one more microstep to give shutdown triggers a chance to execute. After this additional step, execution will terminate.

## TypeScript Target Implementation Details

When a TypeScript reactor is compiled, the generated code is placed inside a project directory. This is because there are two steps of compilation. First, the Lingua Franca compiler generates a TypeScript project from the TypeScript reactor code. Second, the Lingua Franca compiler runs a TypeScript compiler on the generated TypeScript project to produce executable JavaScript. This is illustrated below:

```
Lingua Franca (.lf) ==> TypeScript (.ts) ==> JavaScript (.js)
```

Assuming the directory containing our Lingua Franca file `Foo.lf` is named `TS`, the compiler will generate the following:

1. TS/package.json
2. TS/node_modules
3. TS/Foo/tsconfig.json
4. TS/Foo/babel.config.js
5. TS/Foo/src/
6. TS/Foo/dist/

Items 1, 3, and 4 are configuration files for the generated project. Item 2 is a node_modules directory with contents specified by item 1. Item 5 is the directory for generated TypeScript code. Item 6 is the directory for compiled JavaScript code. In addition to the generated code for your Lingua Franca program, items 5 and 6 include libraries from the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule.

The Lingua Franca compiler automatically invokes other programs as it compiles a Lingua Franca (.lf) file to a Node.js executable JavaScript (.js) file. The files package.json, babel.config.js, and tsconfig.json are used to configure the behavior of those other programs. Whenever you compile a .lf file for the first time, the Lingua Franca compiler will copy default versions of these configuration files into the new project so the other programs can run. **The Lingua Franca compiler will only copy a default configuration file into a project if that file is not already present in the generated project.** This means you, the reactor programmer, may safely modify these configuration files to control the finer points of compilation. Beware, other generated files in the project's src and dist directories may be overwritten by the compiler.

### package.json

Node.js uses a [package.json](https://nodejs.org/en/knowledge/getting-started/npm/what-is-the-file-package-json/) file to describe metadata relevant to a Node project. This includes a list of project dependencies (i.e. modules) used by the project. When the Lingua Franca compiler copies a default package.json file into a Lingua Franca project that doesn't already have a package.json, the compiler runs the command `npm install` to create a node_modules directory. The default package.json only lists dependencies for the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule. [Follow these instructions](#using-node-modules) to modify package.json if you want to use other Node modules in your reactors.

### tsconfig.json

After generating a TypeScript program from a .lf file, the Lingua Franca compiler uses the TypeScript compiler `tsc` to run a type check. The behavior of `tsc` is configured by the [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file. You probably won't need to modify tsconfig.json, but you can if you know what you're doing.

### babel.config.js

If the `tsc` type check was successful, the Lingua Franca compiler uses `babel` to compile the generated TypeScript code into JavaScript. (This [blog post](https://iamturns.com/typescript-babel/) articulates the advantages of using `babel` over `tsc` to generate JavaScript.) There are many different flavors of JavaScript and the [babel.config.js](https://babeljs.io/docs/en/configuration) file specifies exactly what `babel` should generate. This is the file to edit if you want the Lingua Franca compiler to produce a different version of JavaScript as its final output.

## Debugging Type Errors

Let's take the [minimal reactor example](#a-minimal-example), and intentionally break it by adding a type error into the reaction.

```
target TypeScript;
main reactor ReactionTypeError {
    timer t;
    reaction(t) {=
        let foo:number = "THIS IS NOT A NUMBER";
        console.log("Hello World.");
    =}
}
```

This reactor will not compile, and should you attempt to compile it you will get an output from the compiler which looks something like this:

```
--- Standard output from command:
src/ReactionTypeError.ts(23,25): error TS2322: Type '"THIS IS NOT A NUMBER"' is not assignable to type 'number'.

--- End of standard output.
```

In particular the output

```
src/ReactionTypeError.ts(23,25): error TS2322: Type '"THIS IS NOT A NUMBER"' is not assignable to type 'number'.
```

identifies the problem: surprisingly, the string `"THIS IS NOT A NUMBER"` is not a number. However the line information `(23,25)` is a little confusing because it points to the location of the type error **in the generated** .ts file `ReactionTypeError/src/ReactionTypeError.ts` not in the original .lf file `ReactionTypeError.lf`. The .ts files produced by the TypeScript code generator are quite readable if you are familiar with the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule, but even if you aren't familiar it is not too difficult to track down the problem. Just open `ReactionTypeError/src/ReactionTypeError.ts` in your favorite text editor (we recommend [Visual Studio](https://code.visualstudio.com/docs/languages/typescript) for its excellent TypeScript integration) and look at line 23.

```
14        this.addReaction(
15            new Triggers(this.t),
16            new Args(this.t),
17            function (this, __t: Readable<Tag>) {
18                // =============== START react prologue
19                const util = this.util;
20                let t = __t.get();
21                // =============== END react prologue
22                try {
23                    let foo:number = "THIS IS NOT A NUMBER";
24                    console.log("Hello World.");
25                } finally {
26                    // =============== START react epilogue
27
28                    // =============== END react epilogue
29                }
30            }
31        );
```

There (inside the try block) we can find the problematic reaction code. _Reaction code is copied verbatim into generated .ts files_.

It can be a bit harder to interpret type errors outside of reaction code, but most type error messages are still relatively clear. For example if you attempt to connect a reactor output to an incompatibly typed input like:

```
target TypeScript;
main reactor ConnectionError {
    s = new Sender();
    r = new Receiver();
    s.foo -> r.bar;
}
reactor Sender {
    output foo:number;
}
reactor Receiver {
    input bar:string;
}
```

you should get an error like

```
--- Standard output from command:
src/InputTypeError.ts(36,23): error TS2345: Argument of type 'OutPort<number>' is not assignable to parameter of type 'Port<string>'.
  Types of property 'value' are incompatible.
    Type 'number | undefined' is not assignable to type 'string | undefined'.
      Type 'number' is not assignable to type 'string | undefined'.

--- End of standard output.
```

The key message being `Argument of type 'OutPort<number>' is not assignable to parameter of type 'Port<string>'`.

One last tip: if you attempt to reference a port, action, timer etc. named `foo` that isn't declared in the triggers, uses, or effects declaration of the reaction, you will get the error `Cannot find name 'foo'` in the reaction body.

## Utility Function Reference

These utility functions may be called within a TypeScript reaction:

`util.requestShutdown(): void` Ends execution after one microstep. See [Stopping Execution](#stopping-execution).

`util.getCurrentTag(): Tag` Gets the current (logical) tag. See [Tags](#tags).

`util.getCurrentLogicalTime(): TimeValue` Gets the current logical TimeValue. See [Time](#timed-behavior).

`util.getCurrentPhysicalTime(): TimeValue` Gets the current physical TimeValue. See [Time](#timed-behavior).

`util.getElapsedLogicalTime(): TimeValue` Gets the elapsed logical TimeValue from execution start. See [Time](#timed-behavior).

`util.getElapsedPhysicalTime(): TimeValue` Gets the elapsed physical TimeValue from execution start. See [Time](#timed-behavior).

`util.success(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default success callback. FIXME: Currently doesn't do anything in Lingua Franca.

`util.failure(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default failure callback. Throws an error.

## Summary of Time Functions

See [Time](#timed-behavior). These time functions are defined in the [time.ts](https://github.com/lf-lang/reactor-ts/blob/master/src/core/time.ts) library of [reactor-ts](https://github.com/lf-lang/reactor-ts).

`UnitBasedTimeValue(value: number, unit:TimeUnit)` Constructor for `UnitBasedTimeValue`, a programmer-friendly subclass of TimeValue. Use a number and a `TimeUnit` enum.

```
enum TimeUnit {
    nsec,
    usec,
    msec,
    sec,
    secs,
    minute,
    minutes,
    hour,
    hours,
    day,
    days,
    week,
    weeks
}
```

`TimeValue.add(other: TimeValue): TimeValue` Adds `this` to `other`.

`TimeValue.subtract(other: TimeValue): TimeValue` Subtracts `other` from `this`. A negative result is an error.

`TimeValue.difference(other: TimeValue): TimeValue` Obtain absolute value of `other` minus `this`.

`TimeValue.isEqualTo(other: TimeValue): boolean` Returns true if `this` and `other` represents the same TimeValue. Otherwise false.

`TimeValue.isZero(): boolean` Returns true if `this` represents a 0 TimeValue.

`TimeValue.isEarlierThan(other: TimeValue): boolean` Returns true if `this` < `other`. Otherwise false.

`Tag.isSmallerThan(other: Tag): boolean` Returns true if `this` < `other`. Otherwise false.

`Tag.isSimultaneousWith(other: Tag): boolean` Returns true if `this` and `other` represents the same Tag. Otherwise false.

`Tag.getLaterTag(delay: TimeValue): Tag` Returns a tag with the time part of this TimeValue incremented by delay.

`Tag.getMicroStepLater(): Tag` Returns a tag with the microstep part of this TimeValue incremented by 1.

`getTimeDifference(other: Tag): TimeValue` Returns a TimeValue that represents the absolute (i.e., positive) time difference between `this` and `other`.

## Building Reactor-ts Documentation

FIXME: Host these docs somewhere.

To build and view proper documentation for `time.ts` (and other reactor-ts libraries), install [typedoc](https://typedoc.org/) and run

```
typedoc --out docs src
```

from the root of the [reactor-ts](https://github.com/lf-lang/reactor-ts). You probably already have the reactor-ts submodule at

```
lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/
```

You should see an output like.

```
Using TypeScript 3.8.3 from /usr/local/lib/node_modules/typescript/lib
Rendering [========================================] 100%

Documentation generated at /Users/<username>/git/lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/docs
```

Open that path in a browser with `/index.html` appended to the end like

```
/Users/<username>/git/lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/docs/index.html
```

to navigate the docs.
