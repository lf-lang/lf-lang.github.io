---
title: "Target Language Details"
layout: docs
permalink: /docs/handbook/target-language-details
oneline: "Detailed reference for each target langauge."
preamble: >
---

[comment]: <> (Unfortunately, HTML has on include function, so we)
[comment]: <> (have to put all the target languages in one file.)

$page-showing-target$

[comment]: <> (================= NEW SECTION =====================)

## Overview

<div class="lf-c">

In the C reactor target for Lingua Franca, reactions are written in C and the code generator generates one or more standalone C programs that can be compiled and run on several platforms. It has been tested on macOS, Linux, Windows, and at least one bare-iron embedded platform. The single-threaded version (which you get by setting the [`threading` target parameter](/docs/handbook/target-declaration#threading) to `false`) is the most portable, requiring only a handful of common C libraries (see [Included Libraries](#included-libraries) below). The multithreaded version requires a small subset of the POSIX thread library (`pthreads`) and transparently executes in parallel on a multicore machine while preserving the deterministic semantics of Lingua Franca.

Note that C is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Here, we provide some guidelines for a style for writing reactors that will be safe.

**NOTE:** If you intend to use C++ code or import C++ libraries in the C target, we provide a special CCpp target that automatically uses a C++ compiler by default. Alternatively, you might want to use the Cpp target.

</div>

<div class="lf-cpp">

In the C++ reactor target for Lingua Franca, reactions are written in C++ and the code generator generates a standalone C++ program that can be compiled and run on all major platforms. Our continuous integration ensures compatibility with Windows, macOS, and Linux.
The C++ target solely depends on a working C++ build system including a recent C++ compiler (supporting C++17) and [CMake](https://cmake.org/) (>= 3.5). It relies on the [reactor-cpp](https://github.com/lf-lang/reactor-cpp) runtime, which is automatically fetched and compiled in the background by the Lingua Franca compiler.

Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe.

</div>

<div class="lf-py">

In the Python reactor target for Lingua Franca, reactions are written in Python. The user-written reactors are then generated into a Python 3 script that can be executed on several platforms. The Python target has been tested on Linux, macOS, and Windows. To facilitate efficient and fast execution of Python code, the generated program relies on a C extension to facilitate Lingua Franca API such as `set` and `schedule`. To learn more about the structure of the generated Python program see [Implementation Details](#target-implementation-details).

Python reactors can bring the vast library of scientific modules that exist for Python into a Lingua Franca program. Moreover, since the Python reactor target is based on a fast and efficient C runtime library, Lingua Franca programs can execute much faster than native equivalent Python programs in many cases. Finally, interoperability with C reactors is planned for the future.

In comparison to the C target, the Python target can be up to an order of magnitude slower. However, depending on the type of application and the implementation optimizations in Python, you can achieve an on-par performance to the C target in many applications.

**NOTE:** A [Python C
extension](https://docs.python.org/3/extending/extending.html) is
generated for each Lingua Franca program (see [Implementation
Details](#target-implementation-details)). This extension module will
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

Documentation for the runtime API is available here: https://lf-lang.github.io/reactor-rust/

LF-Rust generates a Cargo project per compiled main reactor. This specification assumes in some places that the user is somewhat familiar with how Cargo works.
If you're not, here's a primer:

- a Rust project (and its library artifact) are called a _crate_.
- Cargo is the Rust package manager and build tool. LF/Rust uses Cargo to build the generated project.
- Rust has extensive support for conditional compilation. Cargo _features_ are commonly used to enable or disable the compilation of parts of a crate. A feature may also pull in additional dependencies. Cargo features only influence the compilation process; if you don't mention the correct feature flags at compilation time, those features cannot be made available at runtime. The Rust reactor runtime crate uses Cargo features to conditionally enable some features, e.g., command-line argument parsing.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Requirements

<div class="lf-c">

The following tools are required in order to compile the generated C source code:

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

**NOTE:** The Python target requires a C implementation of Python (nicknamed CPython). This is what you will get if you use the above link, or with most of the alternative Python installations such as Anaconda. See [Python download alternatives](https://www.python.org/download/alternatives/) for more details.

The Python reactor target relies on `setuptools` to be able to compile a [Python
C extension](https://docs.python.org/3/extending/extending.html) for each LF
program.

<!-- To install `pip3`, you can follow instructions [here](https://pip.pypa.io/en/stable/installation/). -->

To install `setuptools` using `pip3`, do this:

```sh
pip3 install setuptools
```

</div>

<div class="lf-ts">

First, make sure Node.js is installed on your machine. You can [download Node.js here](https://nodejs.org/en/download/). The npm package manager comes along with Node.

After installing Node, you may optionally install the TypeScript compiler.

```sh
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

- The C target does make any distinction between $private$ and $public$ $preamble$.

</div>

<div class="lf-cpp">

The C++ target does not yet implement:

- $extends$
- $federated$
- [Modal reactors](/docs/handbook/modal-models)

</div>

<div class="lf-py">

- The Lingua Franca lexer does not support single-quoted strings in Python. This limitation also applies to target property values. You must use double quotes.

</div>

<div class="lf-ts">

- The $federated$ implementation in the TypeScript target is still quite preliminary.

- The TypeScript target does not yet implement methods.

- The TypeScript target does not yet implement [modal reactors](/docs/handbook/modal-models)

</div>

<div class="lf-rs">

The Rust target does not yet implement:

- $federated$
- [Modal reactors](/docs/handbook/modal-models)

</div>

[comment]: <> (================= NEW SECTION =====================)

## The Target Specification

<div class="lf-c">

To have Lingua Franca generate C code, start your `.lf` file with one of the following target specifications:

```lf
  target C <options>
  target CCpp <options>
```

Note that for all LF statements, a final semicolon is optional. If you are writing your code in C, you may want to include the final semicolon for uniformity.

For options to the target specification, see [detailed documentation of the target options](/docs/handbook/target-declaration).

The second form, `CCpp`, is used when you wish to use a C++ compiler to compile
the generated code, thereby allowing your C reactors to call C++ code.

<!-- The C target uses a C compiler by default, and will fail to compile mixed C/C++ language programs. As a remedy, the `CCpp` target uses the C runtime but employs a C++ compiler to compile your program. To use it, simply replace `target C` with `target CCpp`. -->

Here is a minimal example of a program written in the `CCpp` target, taken from [HelloWorldCCPP.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/target/HelloWorldCCPP.lf):

```lf-c
target CCpp
reactor HelloWorld {
  preamble {=
    #include <iostream> // Note that no C++ header will be included by default.
  =}
  reaction(startup) {=
    std::cout << "Hello World." << std::endl;
  =}
}
main reactor {
  a = new HelloWorld()
}
```

**Note:** Unless some feature in the C target is needed, we recommend using the Cpp target that uses a runtime that is written natively in C++.

**Note:** A `.lf` file that uses the `CCpp` target cannot and should not be imported to a `.lf` file that uses the `C` target. Although these two targets use essentially the same runtime, such a scenario can cause unintended compile errors.

</div>

<div class="lf-cpp">

To have Lingua Franca generate C++ code, start your `.lf` file with the following target specification:

```lf
    target Cpp
```

Note that for all LF statements, a final semicolon is optional. If you are writing your code in C++, you may want to include the final semicolon for uniformity.

For options to the target specification, see [detailed documentation of the target options](/docs/handbook/target-declaration).

</div>

<div class="lf-py">

To have Lingua Franca generate Python code, start your `.lf` file with the following target specification:

```lf
    target Python
```

Note that for all LF statements, a final semicolon is optional.

For options to the target specification, see [detailed documentation of the target options](/docs/handbook/target-declaration).

</div>

<div class="lf-ts">

To have Lingua Franca generate TypeScript code, start your `.lf` file with the following target specification:

```lf
    target TypeScript
```

Note that for all LF statements, a final semicolon is optional.

The supported target parameters and command-line options are documented in the [Target Declaration](/docs/handbook/target-declaration) documentation.

</div>

<div class="lf-rs">

To have Lingua Franca generate Rust code, start your `.lf` file with the following target specification:

```lf
    target Rust
```

Note that for all LF statements, a final semicolon is optional. If you are writing your code in Rust, you may want to include the final semicolon for uniformity.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Parameters and State Variables

<div class="lf-c">

Reactor parameters and state variables are referenced in the C code using the
`self` struct. The following
[Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Stride.lf)
example modifies the `Count` reactor in [State
Declaration](/docs/handbook/parameters-and-state-variables#state-declaration) to
include both a parameter and a state variable:

```lf-c
reactor Count(stride: int = 1) {
  state count: int = 1
  output y: int
  timer t(0, 100 msec)
  reaction(t) -> y {=
    lf_set(y, self->count);
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
  output y: int
  timer t(0, 100 msec)

  reaction(t) -> y {=
    lf_set(y, count++);
  =}
}
```

This will produce a sequence of integers, but if there is more than one instance of the reactor, those instances will share the same variable count. Hence, **don't do this**! Sharing variables across instances of reactors violates a basic principle, which is that reactors communicate only by sending messages to one another. Sharing variables will make your program nondeterministic. If you have multiple instances of the above FlawedCount reactor, the outputs produced by each instance will not be predictable, and in a multithreaded implementation, will also not be repeatable.

### Array Values for Parameters

Parameters and state variables can have array values, though some care is needed. The [ArrayAsParameter](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayAsParameter.lf) example outputs the elements of an array as a sequence of individual messages:

```lf-c
reactor Source(sequence: int[] = {0, 1, 2}, n_sequence: int = 3) {
  output out: int
  state count: int = 0
  logical action next

  reaction(startup, next) -> out, next {=
    lf_set(out, self->sequence[self->count]);
    self->count++;
    if (self->count < self->n_sequence) {
      lf_schedule(next, 0);
    }
  =}
}
```

This uses a [$logical$ $action$](/docs/handbook/actions#logical-actions) to repeat the reaction, sending one element of the array in each invocation.

In C, arrays do not encode their own length, so a separate parameter `n_sequence` is used for the array length. Obviously, there is potential here for errors, where the array length doesn't match the length parameter.

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is that of a Lingua Franca list, `{0, 1, 2}`, which gets converted by the code generator into a C static initializer. The default value can be overridden when instantiating the reactor using a similar syntax:

```lf
  s = new Source(sequence = {1, 2, 3, 4}, n_sequence=4)
```

### Array Values for States

A state variable can also have an array value. For example, the [MovingAverage](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/MovingAverage.lf) reactor computes the **moving average** of the last four inputs each time it receives an input:

```lf-c
reactor MovingAverageImpl {
  state delay_line: double[] = {0.0, 0.0, 0.0}
  state index: int = 0
  input in: double
  output out: double

  reaction(in) -> out {=
    // Calculate the output.
    double sum = in->value;
    for (int i = 0; i < 3; i++) {
      sum += self->delay_line[i];
    }
    lf_set(out, sum/4.0);

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
target C
preamble {=
  typedef struct hello_t {
    char* name;
    int value;
  } hello_t;
=}
main reactor StructAsState {
  state s: hello_t = {"Earth", 42}
  reaction(startup) {=
    printf("State s.name=\"%s\", value=%d.\n", self->s.name, self->s.value);
  =}
}
```

Notice that state `s` is given type `hello_t`, which is defined in the $preamble$. The initial value just lists the initial values of each of the fields of the struct in the order they are declared.

Parameters are similar:

```lf-c
target C
preamble {=
  typedef struct hello_t {
    char* name;
    int value;
  } hello_t;
=}
main reactor StructParameter(p: hello_t = {"Earth", 42}) {
  reaction(startup) {=
    printf("Parameter p.name=\"%s\", value=%d.\n", self->p.name, self->p.value);
  =}
}
```

</div>

<div class="lf-cpp">

Reactor parameters are internally declared as `const` by the code generator and initialized during reactor instantiation. Thus, the value of a parameter may not be changed. See [Parameters and State](/docs/handbook/parameters-and-state-variables) for examples.

### Array-Valued Parameters

Also parameters can have fixed- or variable-sized array values. The [ArrayAsParameter](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/ArrayAsParameter.lf) example outputs the elements of an array as a sequence of individual messages:

```lf-cpp
reactor Source(sequence: std::vector<int> = {0, 1, 2}) {
  output out: size_t
  state count: size_t = 0
  logical action next: void

  reaction(startup, next) -> out, next {=
    out.set(sequence[count]);
    count++;
    if (count < sequence.size()) {
      next.schedule();
    }
  =}
}
```

Here, the type of `sequence` is explicitly given as `std::vector<int>`.
A more compact alternative syntax is as follows:

```
sequence: int[] = {0, 1, 2}
```

The type `int[]` is converted to `std::vector<int>` by the code generator.
Another alternative syntax is:

```
sequence: int[]({0, 1, 2})
```

Here, the static initializer `{0, 1, 2}` is passed as a single argument to the constructor of `std::vector`.

The main reactor can be parameterized:

```lf-cpp
main reactor Hello(msg: std::string("World")) {
  reaction(startup) {=
    std::cout << "Hello " << msg << "!\n";
  =}
}
```

This program will print "Hello World!" by default. However, since `msg` is a main reactor parameter, the C++ code generator will extend the command-line argument parser and allow to override `msg` when invoking the program. For instance,

```sh
bin/Hello --msg Earth
```

will result in "Hello Earth!" being printed.

### State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor (see [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/lib/Count.lf) and [CountTest.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/CountTest.lf)) will produce the output sequence 1, 2, 3, ... :

```lf-cpp
reactor Count {
  state count: int = 0
  output c: int
  timer t(0, 1 s)
  reaction(t) -> c {=
    count++;
    c.set(count);
  =}
}
```

The declaration on the second line gives the variable the name `count`, declares its type to be `int`, and initializes its value to 0. The type and initial value can be enclosed in the C++-code delimiters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

In the body of the reaction, the state variable is automatically in scope and can be referenced directly by its name. Since all reactions, state variables, and parameters of a reactor are members of the same class, reactions can also reference state variables (or parameters) using the `this` pointer: `this->name`.

A state variable may be a time value, declared as follows:

```lf-cpp
  state time_value:time = 100 ms;
```

The type of the generated `time_value` variable will be `reactor::Duration`, which is an alias for [`std::chrono::nanoseconds`](https://en.cppreference.com/w/cpp/chrono/duration).

For the C++ target, Lingua Franca provides two alternative styles for initializing state variables. We can write `state foo:int(42)` or `state foo:int{42}`. This allows to distinguish between the different initialization styles in C++. `foo:int(42)` will be translated to `int foo(42)` and ` foo:int{42}` will be translated to `int foo{42}` in the generated code. Generally speaking, the `{...}` style should be preferred in C++, but it is not always applicable. Hence we allow the LF programmer to choose the style. Due to the peculiarities of C++, this is particularly important for more complex data types. For instance, `state foo:std::vector<int>(4,2)` would be initialized to the list `[2,2,2,2]` whereas `state foo:std::vector<int>{4,2}` would be initialized to the list `[4,2]`.

State variables can have array values. For example, the [MovingAverage] (https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/MovingAverage.lf) reactor computes the **moving average** of the last four inputs each time it receives an input:

```lf-cpp
reactor MovingAverageImpl {
  state delay_line: double[3]{0.0, 0.0, 0.0}
  state index: int = 0
  input in: double
  output out: double

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

The second line can equivalently be given with an assignment operator:

```
  state delay_line: double[3] = {0.0, 0.0, 0.0}
```

State variables with more complex types such as classes or structs can be similarly initialized. See [StructAsState.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsState.lf).

</div>

<div class="lf-py">

Reactor parameters and state variables are referenced in the Python code using
the syntax `self.<name>`, where `<name>` is the name of the parameter or state
variable. The following
[Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/Stride.lf)
example modifies the `Count` reactor in [State
Declaration](/docs/handbook/parameters-and-state-variables#state-declaration) to
include both a parameter and a state variable:

```lf-py
reactor Count(stride=1) {
  state count = 1
  output y
  timer t(0, 100 msec)
  reaction(t) -> y {=
    y.set(self.count)
    self.count += self.stride
  =}
}
```

This defines a `stride` parameter with initial value `1` and a `count` state
variable with the same initial value. These are referenced in the reaction with
the syntax `self.stride` and `self.count` respectively. Note that state
variables and parameters do not have types in the Python reactor target. See [Parameters
and State](/docs/handbook/parameters-and-state-variables) for more examples.

**The Reactor Class:**
The code generator synthesizes a class in Python for each reactor class in LF,
with a constructor (i.e., `def __init__(self, ...):`) that creates an instance
of this class and initializes its parameters and state variables as [instance
variables](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables).
These parameters and state variables can then subsequently be accessed directly
using the `self` reference in the body of reactions.

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

### Array Expressions for State Variables and Parameters

Array parameters and state variables are implemented using Python lists and initialized using a parentheized list. In the following example, the
parameter `sequence` and the state variable `x` have an initial value that is a Python list `[1, 2, 3]`:

```lf-py
reactor Foo(param = {= [1, 2, 3] =}) {
  state x = {= [1, 2, 3] =}
  ...
}
```

Their elements may be accessed as arrays in the body of a reaction, for example `self.x[i]`, where `i` is an array index.

The parameter may be overridden with a different list at instantiation:

```lf-py
main reactor {
  f = new Foo(param = {= [3, 4, 5, 6]} )
}
```

As with any ordinary Python list or tuple, `len()` can been used to deduce the
length. In the above, `len(self.x)` and `len(self.param)` will return the lengths of the two lists.

### Assigning Arbitrary Initial Expressions to State Variables and Parameters

As used for lists above, the code delimiters `{= ... =}` can allow for assignment of arbitrary Python
expressions as initial values for state variables and parameters. The following example, taken from
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
  state s = {= self.hello("Earth", 42) =}

  reaction(startup) {=
    # will print "State s.name="Earth", value=42."
    print("State s.name=\"{:s}\", value={:d}.".format(self.s.name, self.s.value))
  =}
}
```

Notice that a class `hello` is defined in the preamble. The state variable `s` is then initialized to an instance of `hello` constructed within the `{= ... =}` delimiters.

</div>

<div class="lf-ts">

In the TypeScript target, all [TypeScript types](https://www.typescriptlang.org/docs/handbook/basic-types.html) are generally acceptable for parameters and state variables. Custom types (and classes) must be defined in the $preamble$ before they may be used.

**To benefit from type checking, you should declare types for your reactor elements.** If a type isn't declared for a state variable, it is assigned the type [`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type).

For example, the following reactor will produce the output sequence 0, 1, 2, 3, ... :

```lf-ts
reactor Count {
  state count:number = 0;
  output y:number;
  timer t(0, 100 ms);
  reaction(t) -> y {=
    count++;
    y = count;
  =}
}
```

The declaration on the second line gives the variable the name "count", declares its type to be `number`, and initializes its value to 0. The type and initial value can be enclosed in the Typescript-code delimiters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

In the body of the reaction, the reactor's state variable is referenced by way of a local variable of the same name. The local variable will contain the current value of the state at the beginning of the reaction. The final value of the local variable will be used to update the state at the end of the reaction.

It may be tempting to declare state variables in the **preamble**, as follows:

```lf-ts
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

```lf-ts
  state time_value:time = 100 ms
```

The `time_value` variable will be of type `TimeValue`, which is an object used to represent a time in the TypeScript Target. Refer to the section on [timed behavior](#timed-behavior) for more information.

A state variable can have an array or object value. For example, the following reactor computes the **moving average** of the last four inputs each time it receives an input (from [MovingAverageImpl](https://github.com/lf-lang/lingua-franca/blob/master/test/TypeScript/src/MovingAverage.lf)):

```lf-ts
reactor MovingAverage {
  state delay_line: {= Array<number> =} = {= [0.0, 0.0, 0.0] =}
  state index: number = 0
  input x: number
  output out: number

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

```lf-ts
state myLiteral:{= {foo: number, bar: string} =} = {= {foo: 42, bar: "baz"} =};
```

or use `new`:

```lf-ts
state mySet:{=Set<number>=} = {= new Set<number>() =};
```

Reactor parameters are also referenced in the TypeScript code as local variables. The example below modifies the `Count` reactor so that its stride is a parameter:

```lf-ts
target TypeScript
reactor Count(stride:number = 1) {
  state count:number = 0;
  output y:number;
  timer t(0, 100 ms);
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

```lf-ts
  c = new Count(stride = 2);
```

If there is more than one parameter, use a comma separated list of assignments.

Parameters in Lingua Franca are immutable. To encourage correct usage, parameter variables within a reaction are local `const` variables. If you feel tempted to use a mutable parameter, instead try using the parameter to initialize state and modify the state variable instead. This is illustrated below by a further modification to the Stride example where it takes an initial "start" value for count as a second parameter:

```lf-ts
target TypeScript
reactor Count(stride:number = 1, start:number = 5) {
  state count:number = start;
  output y:number;
  timer t(0, 100 ms);
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

### Array or Object Parameters

Parameters can have array or object values. Here is an example that outputs the elements of an array as a sequence of individual messages:

```lf-ts
reactor Source(sequence:{=Array<number>=} = {= [0, 1, 2] =}) {
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

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is a TypeScript array literal. Since this is TypeScript syntax, not Lingua Franca syntax, the initial value needs to be surrounded with the target code delimiters, `{= ... =}`. The default value can be overridden when instantiating the reactor using a similar syntax:

```lf-ts
  s = new Source(sequence = {= [1, 2, 3, 4] =});
```

Both default and overridden values for parameters can also be created with the `new` keyword:

```lf-ts
reactor Source(sequence:{=Array<number>=} = {= new Array<number>() =}) {
```

and

```lf-ts
s = new Source(sequence = {= new Array<number() =});
```

</div>

<div class="lf-rs">

Parameters and state variables in Rust are accessed on the `self` structure, as shown in [Parameter Declaration](/docs/handbook/parameters-and-state-variables#parameter-declaration).


</div>

[comment]: <> (================= NEW SECTION =====================)

## Inputs and Outputs

<div class="lf-c">

In the body of a reaction in the C target, the value of an input is obtained using the syntax `name->value`, where `name` is the name of the input port. See, for example, the `Destination` reactor in [Input and Output Declarations](/docs/handbook/inputs-and-outputs#input-and-output-declarations).

To set the value of outputs, use `lf_set`. See, for example, the `Double` reactor in [Input and Output Declarations](/docs/handbook/inputs-and-outputs#input-and-output-declarations).)

An output may even be set in different reactions of the same reactor at the same tag. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name->is_present` to determine whether the output has been set. For example, the `Source` reactor in the test case [TestForPreviousOutput](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/TestForPreviousOutput.lf) will always produce the output 42:

```lf-c
reactor Source {
  output out: int
  reaction(startup) -> out {=
    // Set a seed for random number generation based on the current time.
    srand(time(0));
    // Randomly produce an output or not.
    if (rand() % 2) {
      lf_set(out, 21);
    }
  =}
  reaction(startup) -> out {=
    if (out->is_present) {
      lf_set(out, 2 * out->value);
    } else {
      lf_set(out, 42);
    }
  =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

### Sending and Receiving Data

You can define your own data types in C and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/StructAsType.lf) example:

```lf-c
preamble {=
  typedef struct hello_t {
    char* name;
    int value;
  } hello_t;
=}
reactor StructAsType {
  output out:hello_t;
  reaction(startup) -> out {=
    struct hello_t temp = {"Earth", 42};
    lf_set(out, temp);
  =}
}
```

The $preamble$ code defines a struct data type. In the reaction to $startup$, the reactor creates an instance of this struct on the stack (as a local variable named `temp`) and then copies that struct to the output using the `lf_set` macro.

For large structs, it may be inefficient to create a struct on the stack and copy it to the output, as done above. You can use a pointer type instead. See [below](#dynamically-allocated-data) for details.

A reactor receiving the struct message uses the struct as normal in C:

```lf-c
reactor Print() {
  input in:hello_t;
  reaction(in) {=
    printf("Received: name = %s, value = %d\n", in->value.name, in->value.value);
  =}
}
```

The preamble should not be repeated in this reactor definition if the two reactors are defined together because this will trigger an error when the compiler thinks that `hello_t` is being redefined.

### Persistent Inputs

In the C target, inputs are persistent. You can read an input even when there is no event present and the value of that input will be the most recently received value or an instance of the input type filled with zeros. For example:

```lf-c
target C
reactor Source {
  output out: int
  timer t(100 ms, 200 ms)
  state count: int = 1
  reaction(t) -> out {=
    lf_set(out, self->count++);
  =}
}
reactor Sink {
  input in: int
  timer t(0, 100 ms)
  reaction(t) in {=
    printf("Value of the input is %d at time %lld\n", in->value, lf_time_logical_elapsed());
  =}
}
main reactor {
  source = new Source()
  sink = new Sink()
  source.out -> sink.in
}
```

The `Source` reactor produces output 1 at 100ms and 2 at 300ms.
The `Sink` reactor reads every 100ms starting at 0.
Notice that it uses the input `in` but is not triggered by it.
The result of running this program is:

```
Value of the input is 0 at time 0
Value of the input is 1 at time 100000000
Value of the input is 1 at time 200000000
Value of the input is 2 at time 300000000
Value of the input is 2 at time 400000000
...
```

The first output is 0 (an `int` initialized with zero), and subsequently, each output is read twice.

### Fixed Length Array Inputs and Outputs

When inputs and outputs are fixed-length arrays, the memory to contain the array is automatically provided as part of the reactor instance. You can write directly to it, and then just call `lf_set_present` to alert the system that the output is present. For example:

```lf-c
reactor Source {
  output out: int[3]
  reaction(startup) -> out {=
    out->value[0] = 0;
    out->value[1] = 1;
    out->value[2] = 2;
    lf_set_present(out);
  =}
}
```

In general, this will work for any data type that can be copied by a simple assignment operator (see below for how to handle more complex data types).

Reading the array is equally simple:

```lf-c
reactor Print(scale: int(1)) {  // The scale parameter is just for testing.
  input in: int[3]
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

### Variable Length Array Inputs and Outputs

Above, the array size is fixed and must be known throughout the program. A more flexible mechanism leaves the array size unspecified in the types of the inputs and outputs and uses `lf_set_array` instead of `lf_set` to inform the system of the array length. For example,

```lf-c
reactor Source {
  output out: int[]
  reaction(startup) -> out {=
    // Dynamically allocate an output array of length 3.
    int* array = (int*)malloc(3 * sizeof(int));
    // Populate the array.
    array[0] = 0;
    array[1] = 1;
    array[2] = 2;
    // Set the output, specifying the array length.
    lf_set_array(out, array, 3);
  =}
}
```

The array length will be available at the receiving end, which may look like this:

```lf-c
reactor Print {
  input in: int[]
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

### Dynamically Allocated Data

A much more flexible way to communicate complex data types is to set dynamically allocated memory on an output port. This can be done in a way that automatically handles freeing the memory when all users of the data are done with it. The reactor that allocates the memory cannot know when downstream reactors are done with the data, so Lingua Franca provides utilities for managing this using reference counting. You can specify a destructor on a port and pass a pointer to a dynamically allocated object as illustrated in the [SetDestructor](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetDestructor.lf) example.

Suppose the data structure of interest, its constructor, destructor, and copy_constructor are defined as follows:

```c
preamble {=
  typedef struct int_array_t {
    int* data;
    size_t length;
  } int_array_t;

  int_array_t* int_array_constructor(size_t length) {
    int_array_t* result = (int_array_t*) malloc(sizeof(int_array_t));
    result->data = (int*) calloc(length, sizeof(int));
    result->length = length;
    return result;
  }

  void int_array_destructor(void* array) {
    free(((int_array_t*) array)->data);
    free(array);
  }

  void* int_array_copy_constructor(void* array) {
    int_array_t* source = (int_array_t*) array;
    int_array_t* copy = (int_array_t*) malloc(sizeof(int_array_t));
    copy->data = (int*) calloc(source->length, sizeof(int));
    copy->length = source->length;
    for (size_t i = 0; i < source->length; i++) {
      copy->data[i] = source->data[i];
    }
    return (void*) copy;
  }
=}
```

Then, the sender reactor would use `lf_set_destructor` to specify how the memory set on an output port should be freed:

```lf-c
reactor Source {
  output out:int_array_t*;
  reaction(startup) -> out {=
    lf_set_destructor(out, int_array_destructor);
    lf_set_copy_constructor(out, int_array_copy_constructor);
  }
  reaction(startup) -> out {=
    int_array_t* array =  int_array_constructor(2);
    for (size_t i = 0; i < array->length; i++) {
      array->data[i] = i;
    }
    lf_set(out, array);
  =}
}
```

The first reaction specifies the destructor and copy constructor (the latter of which will be used if any downstream reactor has a mutable input or wishes to make a writable copy).

**IMPORTANT:** The array constructed should be sent to only one output port using `lf_set`. If you need to send it to more than one output port or to use it as the payload of an action, you should use `lf_set_token`.

<span class="warning">**FIXME:** Show how to do this.</span>

A reactor receiving this array is straightforward. It just references the array elements as usual in C, as illustrated by this example:

```lf-c
reactor Print() {
  input in:int_array_t*;
  reaction(in) {=
    printf("Received: [");
    for (int i = 0; i < in->value->length; i++) {
      if (i > 0) printf(", ");
      printf("%d", in->value->data[i]);
    }
    printf("]\n");
  =}
}
```

The deallocation of memory for the data will occur automatically after the last reactor that receives a pointer to the data has finished using it, using the destructor specified by `lf_set_destructor` or `free` if none specified.

Occasionally, you will want an input or output type to be a pointer, but you don't want the automatic memory allocation and deallocation. A simple example is a string type, which in C is `char*`. Consider the following (erroneous) reactor:

```lf-c
reactor Erroneous {
  output out:char*;
  reaction(startup) -> out {=
    lf_set(out, "Hello World");
  =}
}
```

An output data type that ends with `*` signals to Lingua Franca that the message
is dynamically allocated and must be freed downstream after all recipients are
done with it. But the `"Hello World"` string here is statically allocated, so an
error will occur when the last downstream reactor to use this message attempts
to free the allocated memory. To avoid this for strings, you can use a special
`string` type as follows:

```lf-c
reactor Fixed {
  output out:string;
  reaction(startup) -> out {=
    lf_set(out, "Hello World");
  =}
}
```

The `string` type is equivalent to `char*`, but since it doesn't end with `*`, it does not signal to Lingua Franca that the type is dynamically allocated. Lingua Franca only handles allocation and deallocation for types that are specified literally with a final `*` in the type name. The same trick can be used for any type where you don't want automatic allocation and deallocation. E.g., the [SendsPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendsPointerTest.lf) example looks like this:

```lf-c
reactor SendsPointer  {
  preamble {=
    typedef int* int_pointer;
  =}
  output out:int_pointer
  reaction(startup) -> out {=
    static int my_constant = 42;
    lf_set(out, &my_constant;)
  =}
}
```

The above technique can be used to abuse the reactor model of computation by communicating pointers to shared variables. This is generally a bad idea unless those shared variables are immutable. The result will likely be nondeterministic. Also, communicating pointers across machines that do not share memory will not work at all.

### Mutable Inputs

Although it cannot be enforced in C, a receiving reactor should not modify the values provided by an input. Inputs are logically _immutable_ because there may be several recipients. Any recipient that wishes to modify the input should make a copy of it. Fortunately, a utility is provided for this pattern. Consider the [ArrayScale](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ArrayScale.lf) example, here modified to use the above `int_array_t` data type:

```lf-c
reactor ArrayScale(scale:int(2)) {
  mutable input in:int_array_t*;
  output out:int_array_t*;
  reaction(in) -> out {=
    for(int i = 0; i < in->length; i++) {
      in->value[i] *= self->scale;
    }
    lf_set_token(out, in->token);
  =}
}
```

Here, the input is declared $mutable$, which means that any reaction is free to
modify the input. If this reactor is the only recipient of the array or the last
recipient of the array, then this will not make a copy of the array but rather use
the original array. Otherwise, it will use a copy. By default, `memcpy` is used to copy the data. However, the sender can also specify
a copy constructor to be used by calling `lf_set_copy_constructor` on the
output port, as explained below.

**Important:** Notice that the above `ArrayScale` reactor modifies the array and then forwards it to its output port using the `lf_set_token()` macro. That macro further delegates to downstream reactors the responsibility for freeing dynamically allocated memory once all readers have completed their work. It will not work to just use `lf_set`, passing it the value.
This will result in a memory error, yielding a message like the following:

```
    malloc: *** error for object 0x600002674070: pointer being freed was not allocated
```

If the above code were not to forward the array, then the dynamically allocated memory will be automatically freed when this reactor is done with it.

Three of the above reactors can be combined into a pipeline as follows:

```lf
main reactor ArrayScaleTest {
  s = new Source();
  c = new ArrayScale();
  p = new Print();
  s.out -> c.in;
  c.out -> p.in;
}
```

In this composite, the array is allocated by `ArrayPrint`, modified by `ArrayScale`, and deallocated (freed) after `Print` has reacted. No copy is necessary because `ArrayScale` is the only recipient of the original array.

Inputs and outputs can also be dynamically allocated structs. In fact, Lingua Franca's C target will treat any input or output data type that ends with `[]` or `*` specially by providing utilities for allocating memory and modifying and forwarding. Deallocation of the allocated memory is automatic. The complete set of utilities is given below.

### String Types

String types in C are `char*`. But, as explained above, types ending with `*` are interpreted specially to provide automatic memory management, which we generally don't want with strings (a string that is a compile-time constant must not be freed). You could enclose the type as `{= char* =}`, but to avoid this awkwardness, the header files include a typedef that permits using `string` instead of `char*`. For example (from [DelayString.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf)):

```lf-c
reactor DelayString(delay:time = 100 ms)) {
  input in:string;
  output out:string;
  logical action a:string;
  reaction(a) -> out {=
    lf_set(out, a->value);
  =}
  reaction(in) -> a {=
    // The following copies the char*, not the string.
    lf_schedule_copy(a, self->delay, &(in->value), 1);
  =}
}
```

### Macros For Setting Output Values

In all of the following, `<out>` is the name of the output and `<value>` is the value to be sent.

> `lf_set(<out>, <value>);`

Set the specified output (or input of a contained reactor) to the specified
value using shallow copy. `lf_set` can be used with all supported data types
(including type declarations that end with `*` or `[]`).

> `lf_set_token(<out>, <token>);`

This version is used to directly set the underlying reference-counted token in
outputs with a type declaration ending with `*` (any pointer) or `[]` (any
array). The `<value>` argument should be a struct of type `token_t`. It should
be rarely necessary to have the need to create your own (dynamically allocated)
instance of `token_t`.

Consider the
[SetToken.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SetToken.lf)
example:

```lf-c
reactor Source {
  output out:int*
  logical action a:int
  reaction(startup) -> a {=
    lf_schedule_int(a, MSEC(200), 42);
  =}
  reaction(a) -> out {=
    lf_set_token(out, a->token);
  =}
}
```

Here, the first reaction schedules an integer-valued action to trigger after 200 milliseconds. As explained below, action payloads are carried by tokens. The second reaction grabs the token rather than the value using the syntax `a->token` (the name of the action followed by `->token`). It then forwards the token to the output. The output data type is `int*` not `int` because the token carries a pointer to dynamically allocated memory that contains the value. All inputs and outputs with types ending in `*` or `[]` are carried by tokens.

> `lf_set_destructor(<out>, <destructor>);`

Specify the destructor `destructor` used to deallocate any dynamic data set on the output port `out`.

> `lf_set_copy_constructor(<out>, <copy_constructor>);`

Specify the `copy_constructor` used to copy construct any dynamic data set on the output port `out` if the receiving port is $mutable$.

`lf_set` (and `lf_set_token`) will overwrite any output value previously set at the same logical time and will cause the final output value to be sent to all reactors connected to the output. They also set a local `<out>->is_present` variable to true. This can be used to subsequently test whether the output value has been set.

</div>

<div class="lf-cpp">

In the body of a reaction in the C++ target, the value of an input is obtained using the syntax `*name.get()`, where `name` is the name of the input port. Similarly, outputs are set using a `set()` method on an output port. For examples, see [Inputs and Outputs](/docs/handbook/inputs-and-outputs).

Note that `get()` always returns a pointer to the actual value. Thus the pointer needs to be dereferenced with `*` to obtain the value. (See [Sending and Receiving Large Data Types](#sending-and-receiving-large-data-types) for an explanation of the exact mechanisms behind this pointer access).
To determine whether an input is present, `name.is_present()` can be used. Since `get()` returns a `nullptr` if no value is present, `name.get() != nullptr` can be used alternatively for checking presence.

### Sending and Receiving Large Data Types

You can define your own data types in C++ or use types defined in a library and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsType.lf) example:

```lf-cpp
public preamble {=
  struct Hello {
    std::string name;
    int value;
  };
=}
reactor StructAsType {
  output out: Hello;
  reaction(startup) -> out {=
    Hello hello{"Earth, 42};
    out.set(hello);
  =}
}
```

The $public$ $preamble$ code defines a struct data type. In the reaction to $startup$, the reactor creates an instance of this struct on the stack (as a local variable named `hello`) and then copies that instance to the output using the `set()` method. For this reason, the C++ reactor runtime provides more sophisticated ways to allocate objects and send them via ports.

The C++ library defines two types of smart pointers that the runtime uses internally to implement the exchange of data between ports. These are `reactor::MutableValuePtr<T>` and `reactor::ImmutableValuePtr<T>`. `reactor::MutableValuePtr<T>` is a wrapper around [`std::unique_ptr`](https://en.cppreference.com/w/cpp/memory/unique_ptr) and provides read and write access to the value hold, while ensuring that the value has a unique owner. In contrast, `reactor::ImmutableValuePtr<T>` is a wrapper around [`std::shared_pointer`](https://en.cppreference.com/w/cpp/memory/shared_ptr) and provides read only (const) access to the value it holds. This allows data to be shared between reactions of various reactors, while guarantee data consistency. Similar to `std::make_unique` and `std::make_shared`, the reactor library provides convenient function for creating mutable and immutable values pointers: `reactor::make_mutable_value<T>(...)` and `reactor::make_immutable_value<T>(...)`.

In fact this code from the example above:

```cpp
    Hello hello{"Earth, 42"};
    out.set(hello);
```

implicitly invokes `reactor::make_immutable_value<Hello>(hello)` and could be rewritten as

```cpp
    Hello hello{"Earth, 42"};
    out.set(reactor::make_immutable_value<Hello>(hello));
```

This will invoke the copy constructor of `Hello`, copying its content from the `hello` instance to the newly created `reactor::ImmutableValuePtr<Hello>`.

Since copying large objects is inefficient, the move semantics of C++ can be used to move the ownership of object instead of copying it. This can be done in the following two ways. First, by directly creating a mutable or immutable value pointer, where a mutable pointer allows modification of the object after it has been created:

```cpp
    auto hello = reactor::make_mutable_value<Hello>("Earth", 42);
    hello->name = "Mars";
    out.set(std::move(hello));
```

An example of this can be found in [StructPrint.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructPrint.lf). Not that after the call to `std::move`, hello is `nullptr` and the reaction cannot modify the object anymore. Alternatively, if no modification is requires, the object can be instantiated directly in the call to `set()` as follows:

```cpp
    out.set({"Earth", 42});
```

An example of this can be found in [StructAsTypeDirect](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/StructAsTypeDirect.lf).

Getting a value from an input port of type `T` via `get()` always returns an `reactor::ImmutableValuePtr<T>`. This ensures that the value cannot be modified by multiple reactors receiving the same value, as this could lead to an inconsistent state and nondeterminism in a multi-threaded execution. An immutable value pointer can be converted to a mutable pointer by calling `get_mutable_copy`. For instance, the [ArrayScale](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/ArrayScale.lf) reactor modifies elements of the array it receives before sending it to the next reactor:

```lf-cpp
reactor Scale(scale:int = 2) {
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

In the body of a reaction in the Python target, the value of an input is
obtained using the syntax `name.value`, where `name` is the name of the input
port. To determine whether an input is present, use `name.is_present`. To
produce an output, use the syntax `name.set(value)`. The `value` can be any
valid Python object. For simple examples, see [Inputs and
Outputs](/docs/handbook/inputs-and-outputs).

### Sending and Receiving Objects

You can define your own data types in Python and send and receive those. Consider the [StructAsType](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/StructAsType.lf) example:

```lf-py
target Python {
  files: include/hello.py
}
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

The `set` method is defined as follows:

> `<port>.set(<value>)`: Set the specified output port (or input of a contained
> reactor) to the specified value. This value can be any Python object
> (including `None` and objects of type `Any`). The value is
> copied and therefore the variable carrying the value can be subsequently
> modified without changing the output.

A reactor receiving the class object message can subsequently access the object
using `<port>.value`:

```lf-py
reactor Print(expected(42)) {
  input _in;
  reaction(_in) {=
    print("Received: name = {:s}, value = {:d}\n".format(_in.value.name,
                                                         _in.value.value))
  =}
}
```

**Note:** The `hello` module has been imported using a top-level preamble, therefore, the contents of the module are available to all reactors defined in the current Lingua Franca file (a similar situation arises if the `hello` class itself was in the top-level preamble).

</div>

<div class="lf-ts">

In the TypeScript target, all [TypeScript types](https://www.typescriptlang.org/docs/handbook/basic-types.html) are generally acceptable for inputs and outputs with one notable exception:

- `undefined` is not a valid type for an input, output, or action. This is because `undefined` is used to designate the absence of an input, output, or action during a reaction.

As with parameters and state variables, custom types (and classes) must be defined in the [preamble](#preamble) before they may be used.

**To benefit from type checking, you should declare types for your reactor elements.** If a type isn't declared for an input, output, or action, it is assigned the [reactor-ts](https://github.com/lf-lang/reactor-ts) type `Present` which is defined as

```lf-ts
export type Present = (number | string | boolean | symbol | object | null);
```

In the body of a reaction in the TypeScript target, inputs are simply referred to by name. An input of type `t` is available within the body of a reaction as a local variable of type `t | undefined`. To determine whether an input is present, test the value of the input against `undefined`. An `undefined` input is not present.

**WARNING** Be sure to use the `===` or `!==` operator and not `==` or `!=` to test against `undefined`. In JavaScript/TypeScript the comparison `undefined == null` yields the value `true`. It may also be tempting to rely upon the falsy evaluation of `undefined` within an `if` statement, but this may introduce bugs. For example a reaction that tests the presence of input `x` with `if (x) { ... }` will not correctly identify potentially valid present values such as `0`, `false`, or `""`.

For example, the [Determinism.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/TypeScript/src/Determinism.lf) test case includes the following reactor:

```lf-ts
reactor Destination {
  input x: number
  input y: number
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
      util.requestErrorStop("FAILURE: Expected 2.")
    }
  =}
}
```

The reaction refers to the inputs `x` and `y` by name and tests for their presence by testing `x` and `y` against `undefined`. If a reaction is triggered by just one input, then normally it is not necessary to test for its presence. It will always be present. However TypeScript's type system is not smart enough to know such an input will never have type `undefined` if there's no test against `undefined` within the reaction. An explicit type annotation (for example `x = x as t;` where `t` is the type of the input) may be necessary to avoid type errors from the compiler. In the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:

```lf-ts
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

```lf-ts
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

```lf-ts
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

### Sending and Receiving Custom Types

You can define your own data types in TypeScript and send and receive those. Consider the following example:

```lf-ts
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

The $preamble$ code defines a custom union type of `string` and `null`.

</div>

<div class="lf-rs">

Inputs and outputs in the Rust target are accessed using the `set` and `get` methods of the `ctx` objects, as shown in [Inputs and Outputs](/docs/handbook/inputs-and-outputs).

</div>

[comment]: <> (================= NEW SECTION =====================)

## Time

<div class="lf-c">

In the C target, the value of a time instant or interval is an integer specifying a number of nanoseconds. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Time in the C target is a `int64_t`, which is a 64-bit signed number. Since a 64-bit number has a limited range, this measure of time instants will overflow in approximately the year 2262. For better code clarity, two types are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h), `instant_t` and `interval_t`, which you can use for time instants and intervals respectively. These are both equivalent to `int64_t`, but using those types will insulate your code against changes and platform-specific customizations.

Lingua Franca uses a superdense model of time. A reaction is invoked at a logical **tag**, a struct consisting of a `time` value (an `instant_t`, which is a `int64_t`) and a `microstep` value (a `microstep_t`, which is an `uint32_t`). The tag is guaranteed to not increase during the execution of a reaction. Outputs produced by a reaction have the same tag as the inputs, actions, or timers that trigger the reaction, and hence are **logically simultaneous**.

The time structs and functions for working with time are defined in [tag.h](https://github.com/lf-lang/reactor-c/blob/main/core/tag.h). The most useful functions are:

- `tag_t lf_tag()`: Get the current tag at which this reaction has been invoked.
- `int lf_tag_compare(tag_t, tag_t)`: Compare two tags, returning -1, 0, or 1 for less than, equal, and greater than.
- `instant_t lf_time_logical()`: Get the current logical time (the first part of the current tag).
- `interval_t lf_time_logical_elapsed()`: Get the logical time elapsed since program start.

There are also some useful functions for accessing physical time:

- `instant_t lf_time_physical()`: Get the current physical time.
- `instant_t lf_time_physical_elapsed()`: Get the physical time elapsed since program start.
- `instant_t lf_time_start()`: Get the starting physical and logical time.

The last of these is both a physical and logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/GetTime.lf) example:

```lf-c
main reactor GetTime {
  timer t(0, 1 sec);
  reaction(t) {=
    instant_t logical = lf_time_logical();
    printf("Logical time is %ld.\n", logical);
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
    interval_t elapsed = lf_time_logical_elapsed();
    printf("Elapsed logical time is %ld.\n", elapsed);
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
    instant_t physical = lf_time_physical();
    printf("Physical time is %ld.\n", physical);
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
    instant_t elapsed_physical = lf_time_physical_elapsed();
    printf("Elapsed physical time is %ld.\n", elapsed_physical);
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

Notice that these numbers are increasing by _roughly_ one second each time. If you set the `fast` target parameter to `true`, then logical time will elapse much faster than physical time.

Working with nanoseconds in C code can be tedious if you are interested in longer durations. For convenience, a set of macros are available to the C programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in C code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided macros are `NSEC`, `USEC` (for microseconds), `MSEC`, `SEC`, `MINUTE`, `HOUR`, `DAY`, and `WEEK`. You may also use the plural of any of these. Examples are given in the next section.

</div>

<div class="lf-cpp">

Timers are specified exactly as in the [Time and Timers](/docs/handbook/time-and-timers). When working with time in the C++ code body of a reaction, however, you will need to know a bit about its internal representation.

The reactor-cpp library uses [`std::chrono`](https://en.cppreference.com/w/cpp/chrono) for representing time. Specifically, the library defines two types for representing durations and timepoints: `reactor::Duration` and `reactor::TimePoint`. `reactor::Duration` is an alias for [`std::chrono::nanosecods`](https://en.cppreference.com/w/cpp/chrono/duration). `reactor::TimePoint` is alias for [`std::chrono::time_point<std::chrono::system_clock, std::chrono::nanoseconds>`](https://en.cppreference.com/w/cpp/chrono/time_point). As you can see from these definitions, the smallest time step that can be represented is one nanosecond. Note that `reactor::TimePoint` describes a specific point in time and is associated with a specific clock, whereas `reactor::Duration` defines a time interval between two time points.

Lingua Franca uses a superdense model of logical time. A reaction is invoked at a logical **tag**. In the C++ library, a tag is represented by the class `reactor::Tag`. In essence, this class is a tuple of a `reactor::TimePoint` representing a specific point in logical time and a microstep value (of type `reactor::mstep_t`, which is an alias for `unsigned long`). `reactor::Tag` provides two methods for getting the time point or the microstep:

```cpp
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

```cpp
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

In the Python target, similar to the C target, the value of a time instant or
interval is an integer specifying a number of nanoseconds. An instant is the
number of nanoseconds that have elapsed since January 1, 1970. An interval is
the difference between two instants.

The functions for working with time and tags are:

- `lf.tag() -> Tag`: Returns a Tag instance of the current tag at which this reaction has been invoked.
- `lf.tag_compare(Tag, Tag) -> int`: Compare two `Tag` instances, returning -1, 0, or 1 for less than, equal, and greater than. `Tag`s can also be compared using rich comparators (ex. `<`, `>`, `==`), which returns `True` or `False`.
- `lf.time.logical() -> int`: Get the current logical time (the first part of the current tag).
- `lf.time.logical_elapsed() -> int`: Get the logical time elapsed since program start.

`Tag`s can be initialized using `Tag(time=some_number, microstep=some_other_number)`.

There are also some useful functions for accessing physical time:

- `lf.time.physical() -> int`: Get the current physical time.
- `lf.time.physical_elapsed() -> int`: Get the physical time elapsed since program start.
- `lf.time.start() -> int`: Get the starting physical and logical time.

The last of these is both a physical and a logical time because, at the start of execution, the starting logical time is set equal to the current physical time as measured by a local clock.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider the [GetTime.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/GetTime.lf) example:

```lf-py
main reactor GetTime {
  timer t(0, 1 sec);
  reaction(t) {=
    logical = lf.time.logical()
    print("Logical time is ", logical)
  =}
}
```

When executed, you will get something like this:

```
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
    elapsed = lf.time.logical_elapsed()
    print("Elapsed logical time is ", elapsed)
  =}
}
```

This will produce:

```
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
    physical = lf.time.physical()
    print("Physical time is ", physical)
  =}
}
```

This will produce something like this:

```
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
    elapsed_physical = lf.time.physical_elapsed()
    print("Elapsed physical time is ", elapsed_physical)
  =}
}
```

This will produce something like this:

```
---- Start execution at time Thu Nov  5 08:51:02 2020
---- plus 864237900 nanoseconds.
Elapsed physical time is  110200
Elapsed physical time is  1000185400
Elapsed physical time is  2000178600
...
```

Notice that these numbers are increasing by roughly one second each time. If you set the `fast` target parameter to `true`, then logical time will elapse much faster than physical time.

Working with nanoseconds in the Python code can be tedious if you are interested in longer durations. For convenience, a set of functions are available to the Python programmer to convert time units into the required nanoseconds. For example, you can specify 200 msec in Python code as `MSEC(200)` or two weeks as `WEEKS(2)`. The provided functions are `NSEC`, `USEC` (for microseconds), `MSEC`, `SEC`, `MINUTE`, `HOUR`, `DAY`, and `WEEK`. You may also use the plural of any of these. Examples are given in the next section.

</div>

<div class="lf-ts">

See [Summary of Time Functions](#summary-of-time-functions) and [Utility Function Reference](#utility-function-reference) for a quick API reference.

Timers are specified exactly as in the [Time and Timers](/docs/handbook/time-and-timers) section. When working with time in the TypeScript code body of a reaction, however, you will need to know a bit about its internal representation.

A `TimeValue` is an class defined in the TypeScript target library file `time.ts` to represent a time instant or interval. For your convenience `TimeValue` and other classes from the `time.ts` library mentioned in these instructions are automatically imported into scope of your reactions. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Internally a `TimeValue` uses two numbers to represent the time. To prevent overflow (which would occur for time intervals spanning more than 0.29 years if a single JavaScript number, which has 2^53 bits of precision, were to be used), we use _two_ numbers to store a time value. The first number denotes the number of whole seconds in the interval or instant; the second number denotes the remaining number of nanoseconds in the interval or instant. The first number represents the number of seconds, the second number represents the number of nanoseconds. These fields are not accessible to the programmer, instead `TimeValue`s may be manipulated by an [API](#summary-of-time-functions) with functions for addition, subtraction, and comparison.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider:

```lf-ts
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

```lf-ts
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

```lf-ts
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

```lf-ts
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

```lf-ts
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

```lf-ts
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

### Summary of Time Functions

See [Time](#timed-behavior). These time functions are defined in the [time.ts](https://github.com/lf-lang/reactor-ts/blob/master/src/core/time.ts) library of [reactor-ts](https://github.com/lf-lang/reactor-ts).

`UnitBasedTimeValue(value: number, unit:TimeUnit)` Constructor for `UnitBasedTimeValue`, a programmer-friendly subclass of TimeValue. Use a number and a `TimeUnit` enum.

```ts
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
  weeks,
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

</div>

<div class="lf-rs">

<span class="warning">FIXME: details needed here on time in Rust.</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Actions

<div class="lf-c">

Actions are described in [Actions](/docs/handbook/actions). If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from [Composing Reactors](/docs/handbook/composing-reactors) that the $after$ keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayInt.lf) example:

```lf-c
reactor Delay(delay: time = 100 ms) {
  input in: int
  output out: int
  logical action a: int
  reaction(a) -> out {=
    if (a->has_value && a->is_present) lf_set(out, a->value);
  =}
  reaction(in) -> a {=
    // Use specialized form of schedule for integer payloads.
    lf_schedule_int(a, self->delay, in->value);
  =}
}
```

Using this reactor as follows

```lf
  delay = new Delay();
  source.out -> delay.in;
  delay.in -> sink.out
```

is equivalent to

```lf
    source.out -> sink.in after 100 ms
```

(except that our `Delay` reactor will only work with data type `int`).

**Note:** The reaction to `a` is given before the reaction to `in` above. This is important because if both inputs are present at the same tag, the first reaction must be executed before the second. Because of this reaction ordering, it is possible to create a program that has a feedback loop where the output of the `Delay` reactor propagates back to an input at the same tag. If the reactions were given in the opposite order, then such a program would result in a **causality loop**.

In the `Delay` reactor, the action `a` is specified with a type `int`. The reaction to the input `in` declares as its effect the action `a`. This declaration makes it possible for the reaction to schedule a future triggering of `a`. The reaction uses one of several variants of the **lf_schedule** function, namely **lf_schedule_int**, a convenience function provided because integer payloads on actions are very common. We will see below, however, that payloads can have any data type.

The first reaction declares that it is triggered by `a` and has effect `out`. To
read the value, it uses the `a->value` variable. Because this reaction is first,
the `out` at any logical time can be produced before the input `in` is even
known to be present. Hence, this reactor can be used in a feedback loop, where
`out` triggers a downstream reactor to send a message back to `in` of this same
reactor. If the reactions were given in the opposite order, there would be a
causality loop and compilation would fail.

If you are not sure whether an action carries a value, you can test for it as follows:

```lf-c
  reaction(a) -> out {=
    if (a->has_value) {
      lf_set(out, a->value);
    }
  =}
```

It is possible to both be triggered by and schedule an action in the same
reaction. For example, the
following [CountSelf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/CountSelf.lf)
reactor will produce a counting sequence after it is triggered the first time:

```lf-c
reactor CountSelf(delay: time = 100 msec) {
  output out: int
  logical action a: int
  reaction(startup) -> a, out {=
    lf_set(out, 0);
    lf_schedule_int(a, self->delay, 1);
  =}
  reaction(a) -> a, out {=
    lf_set(out, a->value);
    lf_schedule_int(a, self->delay, a->value + 1);
  =}
}
```

Of course, to produce a counting sequence, it would be more efficient to use a state variable.

</div>

<div class="lf-cpp">

The C++ provides a simple interface for scheduling actions via a `schedule()` method. Actions are described in the [Actions](/docs/handbook/actions) document. Consider the [Schedule](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Schedule.lf) reactor:

```lf-cpp
reactor Schedule {
  input x: int
  logical action a: void
  reaction(x) -> a {=
    a.schedule(200ms);
  =}

  reaction(a) {=
    auto elapsed_time = get_elapsed_logical_time();
    std::cout << "Action triggered at logical time " << elapsed_time.count()
          << " after start" << std::endl;
  =}
}
```

When this reactor receives an input `x`, it calls `schedule()` on the action `a`, specifying a logical time offset of 200 milliseconds. The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. At that logical time, the second reaction will trigger and will use the `get_elapsed_logical_time()` function to determine how much logical time has elapsed since the start of execution.

Notice that after the logical time offset of 200 msec, there may be another input `x` simultaneous with the action `a`. Because the reaction to `a` is given first, it will execute first. This becomes important when such a reactor is put into a feedback loop (see below).

Physical actions work exactly as described in the [Physical Actions](/docs/handbook/actions#physical-actions) section.

### Zero-Delay Actions

If the specified delay in a `schedule()` is omitted or is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](/docs/handbook/superdense-time)). Hence, if the input `x` arrives at metric logical time _t_, and you call `schedule()` in one of the following ways:

```cpp
a.schedule();
a.schedule(0s);
a.schedule(reactor::Duration::zero());
```

then when the reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous.

As discussed above the he metric time is visible to the programmer and can be obtained in a reaction using either `get_elapsed_logical_time()` or `get_logical_time()`.

As described in the [Action](/docs/handbook/actions) document, action declarations can have a _min_delay_ parameter. This modifies the timestamp further. Also, the action declaration may be **physical** rather than **logical**, in which case, the assigned timestamp will depend on the physical clock of the executing platform.

### Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. This is particularly useful for physical actions that are externally triggered because it enables the action to convey information to the reactor. This could be, for example, the body of an incoming network message or a numerical reading from a sensor.

Recall from the [Composing Reactors](/docs/handbook/composing-reactors#connections-with-logical-delays) section that the **after** keyword on a connection between ports introduces a logical delay. This is actually implemented using a logical action. We illustrate how this is done using the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/DelayInt.lf) example:

```lf-cpp
reactor Delay(delay: time = 100 ms) {
  input in: int
  output out: int
  logical action d: int
  reaction(d) -> out {=
    if (d.is_present()) {
      out.set(d.get());
    }
  =}
  reaction(in) -> d {=
    d.schedule(in.get(), delay);
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
source.out -> sink.in after 100 ms
```

(except that our `Delay` reactor will only work with data type `int`).

**Note:** The reaction to `d` is given before the reaction to `in` above. This is important because if both inputs are present at the same tag, the first reaction must be executed before the second. Because of this reaction ordering, it is possible to create a program that has a feedback loop where the output of the `Delay` reactor propagates back to an input at the same tag. If the reactions were given in the opposite order, then such a program would result in a **causality loop**.

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

Actions are described [here](/docs/handbook/actions). Actions can carry a
**value**, a Python object that becomes available to any reaction triggered by
the action. This is particularly useful for physical actions that are externally
triggered because it enables the action to convey information to the reactor.
This could be, for example, the body of an incoming network message or a
numerical reading from a sensor. Note that actions do not have a data
type in the Python target, even when they carry a value.

Recall from [Composing Reactors](/docs/handbook/composing-reactors) that the
$after$ keyword on a connection between ports introduces a logical delay. This
is actually implemented using a logical action. We illustrate how this is done
using the
`Delay` reactor in the [DelayInt](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/DelayInt.lf)
example:

```lf-py
reactor Delay(delay = 100 ms) {
  input _in
  output out
  logical action a
  reaction(a) -> out {=
    if (a.value is not None) and a.is_present:
      out.set(a.value)
  =}
  reaction(_in) -> a {=
    a.schedule(self.delay, _in.value)
  =}
}
```

Using this reactor as follows

```lf
    delay = new Delay()
    <source_port_reference> -> delay._in
    delay._in -> <destination_port_reference>
```

is equivalent to

```lf
    <source_port_reference> -> <destination_port_reference> after 100 ms
```

In the `Delay` reactor, the reaction to the input `_in` declares as its effect
the action `a`. This declaration makes it possible for the reaction to schedule
a future triggering of `a` using the
[`a.schedule()`](/docs/handbook/target-language-details#schedule-functions)
method.

The first reaction declares that it is triggered by `a` and has effect `out`. To
read the value, it uses the `a.value` syntax. Because this reaction is first,
the `out` at any logical time can be produced before the input `_in` is even
known to be present. Hence, this reactor can be used in a feedback loop, where
`out` triggers a downstream reactor to send a message back to `_in` of this same
reactor. If the reactions were given in the opposite order, there would be a
causality loop and compilation would fail.

If you are not sure whether an action carries a value, you can test for it as follows:

```lf-py
  reaction(a) -> out {=
    if (a.value is not None):
      out.set(a.value)
  =}
```

It is possible to both be triggered by and schedule an action in the same
reaction. For example, the
following [CountSelf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/CountSelf.lf)
reactor will produce a counting sequence after it is triggered the first time:

```lf-py
reactor CountSelf(delay = 100 ms) {
  output out
  logical action a
  reaction(startup) -> a, out {=
    out.set(0)
    a.schedule(self.delay, 1)
  =}
  reaction(a) -> a, out {=
    out.set(a.value)
    a.schedule(self.delay, a.value + 1)
  =}
}
```

Of course, to produce a counting sequence, it would be more efficient to use a state variable.

</div>

<div class="lf-ts">

Each action listed as an **effect** for a reaction is available as a schedulable object in the reaction body via the `actions` object. The TypeScript target provides a special `actions` object with a property for each schedulable action. Schedulable actions (of type `t`) have the object method:

```lf-ts
schedule: (extraDelay: TimeValue | 0, value?: T) => void;
```

The first argument can either be the literal 0 (shorthand for 0 seconds) or a `TimeValue`/`UnitBasedTimeValue`. The second argument is the value for the action. Consider the following reactor:

```lf-ts
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

When this reactor receives an input `x`, it calls `schedule()` on the action `a`, so it will be triggered at the logical time offset (200 msec) with a null value. The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. This will trigger the second reaction, which will use the `util.getElapsedLogicalTime()` function to determine how much logical time has elapsed since the start of execution. The second argument to the `schedule()` function is a **value**, data that can be carried by the action, which is explained below. In the above example, there is no value.

### Zero-Delay Actions

If the specified delay in a `schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](/docs/handbook/superdense-time)). Hence, if the input `x` arrives at metric logical time _t_, and you call `schedule()` as follows:

```lf-ts
actions.a.schedule(0);
```

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the _previous_ microstep). The reaction to `x` and the reaction to `a` occur at the same metric time _t_, but separated by one microstep, so these two reactions are _not_ logically simultaneous. These reactions execute with different [Tags](#tags).

### Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. The most common use of this is to implement a logical delay, where a value provided at an input is produced on an output with a larger logical timestamp. To accomplish that, it is much easier to use the **after** keyword on a connection between reactors. Nevertheless, in this section, we explain how to directly use actions with value. In fact, the **after** keyword is implemented as described below.

If you are familiar with other targets (like C) you may notice it is much easier to schedule actions with values in TypeScript because of TypeScript/JavaScript's garbage collected memory management. The following example implements a logical delay using an action with a value.

```lf-ts
reactor Delay(delay:time(100 ms)) {
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

```lf-ts
reaction(a) -> out, a {=
  if (a !== null) {
    a = a as number;
    out = a;
    let newValue = a++;
    actions.a.schedule(delay, newValue);
  }
=}
```

</div>

<div class="lf-rs">

Actions may carry values if they mention a data type, for instance:

```lf-rust
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

If an action does not mention a data type, the type defaults to `()`.

</div>

[comment]: <> (================= NEW SECTION =====================)

### Schedule Functions

<div class="lf-c">

Actions with values can be rather tricky to use because the value must usually be carried in dynamically allocated memory. It will not work for value to refer to a state variable of the reactor because that state variable will likely have changed value by the time the reactions to the action are invoked. Several variants of the `lf_schedule` function are provided to make it easier to pass values across time in varying circumstances.

> `lf_schedule(<action>, <offset>);`

This is the simplest version as it carries no value. The action need not have a data type.

> `lf_schedule_int(<action>, <offset>, <value>);`

This version carries an `int` value. The data type of the action is required to be `int`.

> `lf_schedule_token(<action>, <offset>, <value>);`

This version carries a **token**, which has type `token_t` and points to the value, which can have any type. There is a `create_token()` function that can be used to create a token, but programmers will rarely need to use this. Instead, you can use `lf_schedule_value()` (see below), which will automatically create a token. Alternatively, for inputs with types ending in `*` or `[]`, the value is wrapped in a token, and the token can be obtained using the syntax `inputname->token` in a reaction and then forwarded using `lf_schedule_token()` (see [Dynamically Allocated Structs](#Dynamically-Allocated-Structs) above). If the input is mutable, the reaction can then even modify the value pointed to by the token and/or use `lf_schedule_token()` to send the token to a future logical time. For example, the [DelayPointer](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayPointer.lf) reactor realizes a logical delay for any data type carried by a token:

```lf-c
reactor DelayPointer(delay:time(100 ms)) {
  input in:void*;
  output out:void*;
  logical action a:void*;
  reaction(a) -> out {=
    // Using lf_set_token delegates responsibility for
    // freeing the allocated memory downstream.
    lf_set_token(out, a->token);
  =}
  reaction(in) -> a {=
    // Schedule the actual token from the input rather than
    // a new token with a copy of the input value.
    lf_schedule_token(a, self->delay, in->token);
  =}
}
```

> `lf_schedule_value(<action>, <offset>, <value>, <length>);`

This version is used to send into the future a value that has been dynamically allocated using malloc. It will be automatically freed when it is no longer needed. The _value_ argument is a pointer to the memory containing the value. The _length_ argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly. See [ScheduleValue.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/ScheduleValue.lf).

> `lf_schedule_copy(<action>, <offset>, <value>, <length>);`

This version is for sending a copy of some data pointed to by the `<value>` argument. The data is assumed to be a scalar or array of type matching the `<action>` type. The `<length>` argument should be 1 if it is a not an array and the array length otherwise. This length will be needed downstream to interpret the data correctly.

Occasionally, an action payload may not be dynamically allocated nor freed. For example, it could be a pointer to a statically allocated string. If you know this to be the case, the [DelayString](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DelayString.lf) reactor will realize a logical time delay on such a string:

```lf-c
reactor DelayString(delay:time(100 msec)) {
  input in:string;
  output out:string;
  logical action a:string;
  reaction(a) -> out {=
    lf_set(out, a->value);
  =}
  reaction(in) -> a {=
    // The following copies the char*, not the string.
    lf_schedule_copy(a, self->delay, &(in->value), 1);
  =}
}
```

The data type `string` is an alias for `char*`, but Lingua Franca does not know this, so it creates a token that contains a copy of the pointer to the string rather than a copy of the string itself.

</div>

<div class="lf-cpp">

<span class="warning">FIXME: Give a list of schedule() functions with descriptions.</span>

</div>

<div class="lf-py">

The Python reactor target provides a `.schedule()` method to trigger an action at a
future logical time. The `.schedule()` method also optionally allows for a value
to be sent into the future. For example, take the
[ScheduleValue.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/ScheduleValue.lf):

```lf-py
main reactor ScheduleValue {
  logical action a;
  reaction(startup) -> a {=
    value = "Hello"
    a.schedule(0, value)
  =}
  reaction(a) {=
    print("Received: ", a.value)
    if a.value != "Hello":
      sys.stderr.write("FAILURE: Should have received 'Hello'\n")
      exit(1)
  =}
}
```

In this example, the logical action `a` is scheduled one
[microstep](/docs/handbook/superdense-time) in the future with a string `value`
containing `"Hello"`.

</div>

<div class="lf-ts">

<span class="warning">FIXME: List them here</span>

</div>

<div class="lf-rs">

Within a reaction, actions may be scheduled using the [`schedule`](https://lf-lang.github.io/reactor-rust/reactor_rt/struct.ReactionCtx.html#method.schedule) function:

```rust
// schedule without additional delay
ctx.schedule(act, Asap);
// schedule with an additional delay
ctx.schedule(act, after!(20 ms));
// that's shorthand for
ctx.schedule(act, After(Duration.of_millis(20)));
```

</div>

[comment]: <> (================= NEW SECTION =====================)

## Stopping Execution

<div class="lf-c">

A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in method `request_stop()`, which takes no arguments. In a non-federated execution, the actual last tag of the program will be one microstep later than the tag at which `request_stop()` was called. For example, if the current tag is `(2 seconds, 0)`, the last (stop) tag will be `(2 seconds, 1)`. In a federated execution, however, the stop time will likely be larger than the current logical time. All federates are assured of stopping at the same logical time.

> The [timeout](/docs/handbook/termination#timeout) target property will take precedence over this function. For example, if a program has a timeout of `2 seconds` and `request_stop()` is called at the `(2 seconds, 0)` tag, the last tag will still be `(2 seconds, 0)`.

</div>

<div class="lf-py">

A reaction may request that the execution stop after all events with the current timestamp have been processed by calling the built-in method `lf.request_stop()`, which takes no arguments. In a non-federated execution, the actual last tag of the program will be one microstep later than the tag at which `lf.request_stop()` was called. For example, if the current tag is `(2 seconds, 0)`, the last (stop) tag will be `(2 seconds, 1)`. In a federated execution, however, the stop time will likely be larger than the current logical time. All federates are assured of stopping at the same logical time.

> The [timeout](/docs/handbook/termination#timeout) target property will take precedence over this function. For example, if a program has a timeout of `2 seconds` and `request_stop()` is called at the `(2 seconds, 0)` tag, the last tag will still be `(2 seconds, 0)`.

</div>

<div class="lf-cpp">

A reaction may request that the execution stops after all events with the current timestamp have been processed by calling `environment()->sync_shutdown()`. There is also a method `environment()->async_shutdown()`
which may be invoked from outside an reaction, like an external thread.

</div>

<div class="lf-ts">

A reaction may request that the execution stop by calling the function `util.requestShutdown()` which takes no arguments. Execution will not stop immediately when this function is called; all events with the current tag will finish processing and execution will continue for one more microstep to give shutdown triggers a chance to execute. After this additional step, execution will terminate.

</div>

<div class="lf-rs">

<span class="warning">FIXME: Details needed here.</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

## Log and Debug Information

<div class="lf-c">

A suite of useful functions is provided in [util.h](https://www.lf-lang.org/reactor-c/d8/d3c/util_8h.html) for producing messages to be made visible when the generated program is run. Of course, you can always use `printf`, but this is not a good choice for logging or debug information, and it is not a good choice when output needs to be redirected to a window or some other user interface (see for example the [sensor simulator](https://github.com/lf-lang/reactor-c/blob/main/util/sensor_simulator.h)). Also, in federated execution, these functions identify which federate is producing the message. The functions are listed below. The arguments for all of these are identical to `printf` with the exception that a trailing newline is automatically added and therefore need not be included in the format string.

- `LF_PRINT_DEBUG(format, ...)`: Use this for verbose messages that are only needed during debugging. Nothing is printed unless the [target](/docs/handbook/target-declaration#logging) parameter `logging` is set to `debug`. THe overhead is minimized when nothing is to be printed.

- `LF_PRINT_LOG(format, ...)`: Use this for messages that are useful logs of the execution. Nothing is printed unless the [target parameter `logging`](/docs/handbook/target-declaration#logging) is set to `log` or `debug`. This is a macro so that overhead is minimized when nothing is to be printed.

- `lf_print(format, ...)`: Use this for messages that should normally be printed but may need to be redirected to a user interface such as a window or terminal (see `register_print_function` below). These messages can be suppressed by setting the [logging target property](/docs/handbook/target-declaration#logging) to `warn` or `error`.

- `lf_print_warning(format, ...)`: Use this for warning messages. These messages can be suppressed by setting the [logging target property](/docs/handbook/target-declaration#logging) to `error`.

- `lf_print_error(format, ...)`: Use this for error messages. These messages are not suppressed by any [logging target property](/docs/handbook/target-declaration#logging).

- `lf_print_error_and_exit(format, ...)`: Use this for catastrophic errors.

In addition, a utility function is provided to register a function to redirect printed outputs:

- `lf_register_print_function(function)`: Register a function that will be used instead of `printf` to print messages generated by any of the above functions. The function should accept the same arguments as `printf`.

</div>

<div class="lf-cpp">

The reactor-cpp library provides logging utilities in [logging.hh](https://github.com/tud-ccc/reactor-cpp/blob/master/include/reactor-cpp/logging.hh) for producing messages to be made visible when the generated program is run. Of course `std::cout` or `printf` can be used for the same purpose, but the logging mechanism provided by reactor-cpp is thread-safe ensuring that messages produced in parallel reactions are not interleaved with each other and provides common way for turning messages of a certain severity on and off.

In particular, reactor-cpp provides the following logging interfaces:

- `reactor::Debug()`: for verbose debug messages
- `reactor::Info()`: for info messages of general interest, info is the default severity level
- `reactor::Warning()`: for warning messages
- `reactor::Error()`: for errors

These utilities can be used analogues to `std::cout`. For instance:

```cpp
reactor::Info() << "Hello World! It is " << get_physical_time();
```

Note that unlike `std::cout` the new line delimiter is automatically added to the end of the message.

Which type of messages are actually produced by the compiled program can be controlled with the `log-level` target property.

</div>

<div class="lf-py">

The Python supports the [logging](/docs/handbook/target-declaration#logging) target specification. This will cause the runtime to produce more or less information about the execution. However, user-facing functions for different logging levels are not yet implemented (see issue [#619](https://github.com/lf-lang/lingua-franca/issues/619)).

</div>

<div class="lf-ts">

<span class="warning">FIXME: Details needed here.</span>

</div>

<div class="lf-rs">

The executable reacts to the environment variable `RUST_LOG`, which sets the logging level of the application. Possible values are
`off`, `error`, `warn`, `info`, `debug`, `trace`

Error and warning logs are on by default. Enabling a level enables all greater levels (i.e., `RUST_LOG=info` also enables `warn` and `error`, but not `trace` or `debug`).

Logging can also be turned on with the `--log-level` CLI option, if the application features a [CLI](/docs/handbook/target-declaration#command-line-arguments).

Note that the `logging` target property is ignored, as its levels do not match the Rust standard levels we use (those of the [`log` crate](https://docs.rs/log/)).

Note that when building with a release profile (i.e., target property `build-type` is not `Debug`), all log statements with level `debug` and `trace` are removed from the executable, and cannot be turned on at runtime. A warning is produced by the executable if you try to use these levels explicitly.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Libraries Available to Programmers

<div class="lf-c">

#### Libraries Available in All Programs

Reactions in C can use a number of pre-defined functions, macros, and constants without having to explicitly include any header files:

- **Time and tags** ([tag.h](https://www.lf-lang.org/reactor-c/d2/dcd/tag_8h.html)):

  - Specifying time value, such as `MSEC` and `FOREVER`
  - Time data types, such as `tag_t` and `instant_t`
  - Obtaining tag and time information, e.g. `lf_time_logical` and `lf_time_physical`

- **Ports**

  - Writing to output ports, such as `lf_set` and `lf_set_token` ([set.h](https://www.lf-lang.org/reactor-c/d4/d13/set_8h.html))
  - Iterating over sparse multiports, such as `lf_multiport_iterator` and `lf_multiport_next` ([port.h](https://www.lf-lang.org/reactor-c/da/d00/port_8h.html))

- **Scheduling actions**

  - Schedule future events, such as `lf_schedule` and `lf_schedule_value` ([api.h](https://www.lf-lang.org/reactor-c/dc/d65/api_8h.html))

- **File Access**

  - LF_SOURCE_DIRECTORY: A C string giving the full path to the directory containing the `.lf` file of the program.
  - LF_PACKAGE_DIRECTORY: A C string giving the full path to the directory that is the root of the project or package (normally, the directory above the `src` directory).
  - LF_FILE_SEPARATOR: A C string giving the file separator for the platform containing the `.lf` file ("/" for Unix-like systems, "\\" for Windows).

These are useful when your application needs to open and read additional files. For example, the following C code can be used to open a file in a subdirectory called `dir` of the directory that contains the `.lf` file:

```
    const char* path = LF_SOURCE_DIRECTORY LF_FILE_SEPARATOR "dir" LF_FILE_SEPARATOR "filename"
    FILE* fp = fopen(path, "rb");
```

- **Miscellaneous**

  - Changing modes in modal models, `lf_set_mode` ([set.h](https://www.lf-lang.org/reactor-c/d4/d13/set_8h.html))
  - Checking deadlines, `lf_check_deadline` ([api.h](https://www.lf-lang.org/reactor-c/dc/d65/api_8h.html))
  - Defining and recording tracepoints, such as `register_user_trace_event` and `tracepoint` ([trace.h](https://www.lf-lang.org/reactor-c/d1/d1b/trace_8h.html))
  - Printing utilities, such as `lf_print` and `lf_print_error` ([util.h](https://www.lf-lang.org/reactor-c/d8/d3c/util_8h.html))
  - Logging utilities, such as `LF_PRINT_LOG` and `LF_PRINT_DEBUG` ([util.h](https://www.lf-lang.org/reactor-c/d8/d3c/util_8h.html))

#### Standard C Libraries

The generated C code automatically includes the following [standard C libraries](https://en.wikipedia.org/wiki/C_standard_library) (see also the [C standard library header files](https://en.cppreference.com/w/c/header)):

- limits.h (Defines `INT_MIN`, `INT_MAX`, etc.)
- stdbool.h (Defines `bool` datatype and `true` and `false` constants)
- stddef.h (Defines `size_t`, `NULL`, etc.)
- stdint.h (Defines `int64_t`, `int32_t`, etc.)
- stdlib.h (Defines `exit`, `getenv`, `atoi`, etc.)

Hence, programmers are free to use functions from these libraries without explicitly providing a `#include` statement. Nevertheless, providing one is harmless and may be good form. In particular, future releases may not include these header files

#### Available Libraries Requiring #include

More sophisticated library functions require a `#include` statement in a $preamble$.
Specifically, [platform.h](https://www.lf-lang.org/reactor-c/de/d03/platform_8h.html) includes the following:

- Sleep functions such as `lf_sleep`
- Mutual exclusion such as `lf_critial_section_enter` and `lf_critical_section_exit`
- Threading functions such as `lf_thread_create`

The threading functions are only available for platforms that support multithreading.

#### Available Libraries Requiring #include, a files entry, and a cmake-include

A few utility libraries are provided, but require considerably more setup.
These also help to illustrate how to incorporate your own libraries.

- Audio functions (for Linux and Mac only): [audio_loop.h](https://www.lf-lang.org/reactor-c/d1/dcb/audio__loop_8h.html)
- Audio file reader: [wave_file_reader.h](https://www.lf-lang.org/reactor-c/d3/d8a/wave__file__reader_8h.html)
- A double-ended queue: [deque.h](https://www.lf-lang.org/reactor-c/dc/d44/deque_8h.html)
- An ncurses terminal interface for I/O: [sensor_simulator.h](https://www.lf-lang.org/reactor-c/dc/de9/sensor__simulator_8h.html)

</div>

<div class="lf-cpp">

<span class="warning">FIXME: Details needed here.</span>

</div>

<div class="lf-py">

<span class="warning">FIXME: Details needed here.</span>

</div>

<div class="lf-ts">

<span class="warning">FIXME: Details needed here.</span>

</div>

<div class="lf-rs">

<span class="warning">FIXME: Details needed here.</span>

</div>

[comment]: <> (================= NEW SECTION =====================)

<div class="lf-c lf-py">

## Scheduler Target Property

The `scheduler` target property is used to select the scheduler used by the C runtime. This scheduler determines the exact order in which reactions are processed, as long as the order complies with the deterministic semantics of Lingua Franca. It also assigns reactions to user-level threads and can thereby influence the assignment of reactions to processors.

Because the C runtime scheduler operates at a higher level of abstraction than the OS, none of the scheduling policies that we currently support allow preemption; furthermore, they do not control migration of threads between processors.

Another limitation of these schedulers is that they are constrained to process the reaction graph breadth-first. We define the _level_ of a reaction _r_ to be the length of the longest chain of causally dependent reactions that are all (causally) upstream of _r_. Current LF schedulers process one level of reactions at a time, but this constraint is more restrictive than necessary to implement Lingua Franca's semantics and is notable only for its effect on execution times.

The following schedulers are available:

- `GEDF_NP` (global earliest-deadline-first): This scheduler is the default scheduler for programs that have deadlines. When the semantics of Lingua Franca allows for concurrent execution of two or more ready reactions with the same level at a particular tag, this scheduler will prioritize the reaction with the earliest deadline to run first (but with the limitation that reaction executions are non-preemptive). Reactions with no explicit deadline implicitly have an infinitely late deadline.
- `NP` (non-preemptive): This scheduler is the default scheduler for programs that have no deadlines. It makes minimal guarantees about its behavior, and this allows it to include optimizations that can result in lower execution times than the GEDF_NP scheduler.
- `adaptive`: This scheduler behaves similarly to the `NP` scheduler, with the additional limitation that it is designed for applications that can tolerate potentially wide variability in physical execution times. It performs experiments and measures execution times at runtime to determine the degree of exploitable parallelism in various parts of the program. This lets it automate judgments which are made more naively by the other schedulers and which are typically made by the programmer in general-purpose languages.
- `GEDF_NP_CI` (global earliest-deadline-first, with chain ID): This scheduler implements the same policy as `GEDF_NP`, but it is designed for an optimization called chain ID that is described on page 92 [here](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2020/EECS-2020-235.pdf). This optimization is currently disabled because it is not yet fully developed, so we advise against the use of this scheduler in practical applications.

</div>

[comment]: <> (================= NEW SECTION =====================)

## Target Implementation Details

<div class="lf-c">

### Included Libraries

Definitions for the following do not need to be explicitly included because the code generator exposes them in the user namespace automatically:

- Functions and macros used to set ports and iterate over multiports
- Functions and macros used to schedule actions
- Functions and macros used to set a reactor's mode
- Functions and macros used to create trace points
- Logging utility functions
- Typedefs relating to time and logical time, including `tag_t`, `instant_t`, `interval_t`, and `microstep_t`
- API functions for obtaining timing information about the current program execution, including the current physical and logical time

Some standard C libraries are exposed to the user through `reactor.h`, including `stddef.h`,
`stdio.h`, and `stdlib.h`. In addition, `math.h` gets automatically included. However, users who wish to avoid breaking changes between releases should
consider including these libraries explicitly instead of relying on their being exposed by the
runtime.

Users who wish to include functionality that has a platform-specific implementation may choose to
explicitly include `platform.h`, which provides a uniform interface for various concurrency
primitives and sleep functions.

### Multithreaded Implementation

By default, the C runtime system uses multiple worker threads in order to take advantage of multicore execution. The number of worker threads will match the number of cores on the machine unless the `workers` argument is given in the [target](/docs/handbook/target-declaration#threading) statement or the `--workers` [command-line argument](/docs/handbook/target-declaration#command-line-arguments) is given.

Upon initialization, the main thread will create the specified number of worker threads.
Execution proceeds in a manner similar to the [single threaded implementation](#single-threaded-implementation)
except that the worker threads concurrently draw reactions from the reaction queue.
The execution algorithm ensures that no reaction executes until all reactions that it depends on have executed or it has been determined that they will not execute at the current tag.

### Single Threaded Implementation

By giving the `single-threaded` (target option)[/docs/handbook/target-declaration#single-threaded] or the `--single-threaded` (command-line argument)[/docs/handbook/target-declaration#command-line-arguments], the generated program will execute the program using only a single thread. This option is most useful for creating programs to run on bare-metal microprocessors that have no threading support. On such platforms, mutual exclusion is typically realized by disabling interrupts.

The execution strategy is to have two queues of pending accessor invocations, one that is sorted by
tag (the **event queue**) and one that is sorted by priority (the **reaction queue**).
Execution proceeds as follows:

1. At initialization, an event for each timer is put on the event queue and logical time is initialized to the current time, represented as the number of nanoseconds elapsed since January 1, 1970.

2. At each logical time, pull all events from event queue that have the same earliest tag, find the reactions that these events trigger, and put them on the reaction queue. If there are no events on the event queue, then exit the program (unless the `--keepalive true` (command-line argument)[/docs/handbook/target-declaration#command-line-arguments] is given).

3. Wait until physical time matches or exceeds that earliest timestamp (unless the `--fast true` (command-line argument)[/docs/handbook/target-declaration#command-line-arguments] is given). Then advance logical time to match that earliest timestamp.

4. Execute reactions in order of priority from the reaction queue. These reactions may produce outputs, which results in more events getting put on the reaction queue. Those reactions are assured of having lower priority than the reaction that is executing. If a reaction calls `lf_schedule()`, an event will be put on the event queue, not the reaction queue.

5. When the reaction queue is empty, go to 2.

</div>

<div class="lf-cpp">

Unlike the C target, the Cpp target implements more of the analysis and setup of a Lingua Franca in the runtime system. The runtime system is define in the [reactor-cpp](https://github.com/lf-lang/reactor-cpp) repository on GitHub. See that repo for details.

</div>

<div class="lf-py">

The Python target is built on top of the C runtime to enable maximum efficiency where possible. It uses the single-threaded C runtime by default but will switch to the multi-threaded C runtime if a physical action is detected. The [threading](/docs/handbook/target-declaration#threading) target property can be used to override this behavior.

Running [lfc](/docs/handbook/command-line-tools) on a `XXX.lf` program that uses the Python target specification on a
Linux machine will create the following files (other operating systems will have
a slightly different structure and/or files):

```shell
├── src
│   └── XXX.lf
└── src-gen
    └── XXX
        ###### Files related to the Python C extension module for XXX ######
        ├── build               # Temporary files for setuptools
        ├── core                # Core C runtime files
        ├── ctarget.c           # C target API implementations
        ├── ctarget.h           # C target API definitions
        ├── LinguaFrancaXXX*.so # The Python C extension module for XXX
        ├── pythontarget.c      # Python target API implementations
        ├── pythontarget.h      # Python target API definitions
        ├── setup.py            # Setup file used to build the Python C extension
        ├── XXX.c               # Source code of the Python C extension
        ###### Files containing the Python code ######
        └── XXX.py              # Python file containing reactors and reaction code
```

There are two major components in the `src-gen/XXX` directory that together enable the execution of a Python target application:

- An [XXX.py](#the-xxxpy-file-containing-user-code) file containing the user code (e.g., reactor definitions and reactions).
- The source code for a [Python C extension module](#the-generated-linguafrancaxxx-python-module-a-c-extension-module) called `LinguaFrancaXXX` containing the C runtime, as well as hooks to execute the user-defined reactions.

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

```python
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
xxx_lf = [None] * 1
xxx_foo_lf = [None] * 1
# Start initializing XXX of class XXX
for xxx_i in range(1):
    bank_index = xxx_i
    xxx_lf[0] = _XXX(
        _bank_index = 0,
    )
    # Start initializing XXX.foo of class Foo
    for xxx_foo_i in range(1):
        bank_index = xxx_foo_i
        xxx_foo_lf[0] = _Foo(
            _bank_index = 0,
            _bar=0,
        )
...
```

### The generated LinguaFrancaXXX Python module (a C extension module)

The rest of the files in `src-gen/XXX` form a [Python C extension
module](https://docs.python.org/3/extending/building.html#building-c-and-c-extensions)
called `LinguaFrancaXXX` that can be built by executing `python3 setup.py build_ext --inplace` in the `src-gen/XXX/` folder. In this case, Python will
read the instructions in the `src-gen/XXX/setup.py` file and build a
`LinguaFrancaXXX` module in `src-gen/XXX/`. The `--inplace` flag puts the
compiled extension (the `LinguaFrancaXXX*.so` in the example above) in the
`src-gen` directory alongside the `XXX.py` file.

As mentioned before, the LinguaFrancaXXX module is separate from
`src-gen/XXX/XXX.py` but interacts with it. Next, we explain this interaction.

### Interactions between XXX.py and LinguaFrancaXXX

The LinguaFrancaXXX module is imported in `src-gen/XXX/XXX.py`:

```python
from LinguaFrancaXXX import *
```

This is done to enable the main function in `src-gen/XXX/XXX.py` to make a call to the `start()` function, which is part of the generated (and installed) `LinguaFrancaXXX` module. This function will start the main event handling loop of the C runtime.

From then on, `LinguaFrancaXXX` will call reactions that are defined in `src-gen/XXX/XXX.py` when needed.

### The LinguaFrancaBase package

[LinguaFrancaBase](https://pypi.org/project/LinguaFrancaBase/) is a package that contains several helper methods and definitions that are necessary for the Python target to work. This module is installable via `python3 -m pip install LinguaFrancaBase` but is automatically installed if needed during the installation of `LinguaFrancaXXX`. The source code of this package can be found [on GitHub](https://github.com/lf-lang/reactor-c-py).

This package's modules are imported in the `XXX.py` program:

```python
from LinguaFrancaBase.constants import * #Useful constants
from LinguaFrancaBase.functions import * #Useful helper functions
from LinguaFrancaBase.classes import * #Useful classes
```

### Already imported Python modules

The following packages are already imported and thus do not need to be re-imported by the user:

```python
import os
import sys
import copy
```

</div>

<div class="lf-ts">

When a TypeScript reactor is compiled, the generated code is placed inside a project directory. This is because there are two steps of compilation. First, the Lingua Franca compiler generates a TypeScript project from the TypeScript reactor code. Second, the Lingua Franca compiler runs a TypeScript compiler on the generated TypeScript project to produce executable JavaScript. This is illustrated below:

```lf-ts
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

### Debugging Type Errors

Let's take the [minimal reactor example](#a-minimal-example), and intentionally break it by adding a type error into the reaction.

```lf-ts
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

```lf-ts
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

```lf-ts
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

### Utility Function Reference

These utility functions may be called within a TypeScript reaction:

`util.requestShutdown(): void` Ends execution after one microstep. See [Stopping Execution](#stopping-execution).

`util.getCurrentTag(): Tag` Gets the current (logical) tag. See [Tags](#tags).

`util.getCurrentLogicalTime(): TimeValue` Gets the current logical TimeValue. See [Time](#timed-behavior).

`util.getCurrentPhysicalTime(): TimeValue` Gets the current physical TimeValue. See [Time](#timed-behavior).

`util.getElapsedLogicalTime(): TimeValue` Gets the elapsed logical TimeValue from execution start. See [Time](#timed-behavior).

`util.getElapsedPhysicalTime(): TimeValue` Gets the elapsed physical TimeValue from execution start. See [Time](#timed-behavior).

`util.success(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default success callback. FIXME: Currently doesn't do anything in Lingua Franca.

`util.failure(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default failure callback. Throws an error.

### Building Reactor-ts Documentation

To build and view proper documentation for `time.ts` (and other reactor-ts libraries), install [typedoc](https://typedoc.org/) and run

```sh
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

</div>

<div class="lf-rs">

### Target Properties

Target properties may be mentioned like so:

```lf-rust
target Rust {
    // enables single-file project layout
    single-file-project: false,
    // timeout for the execution. The program will shutdown at most after the specified duration.
    timeout: 3 sec,

    cargo-features: ["cli"]
}
```

See [Target Declaration](/docs/handbook/target-declaration) for the full list of supported target properties.

### The Executable

The executable name is the name of the main reactor _transformed to snake_case_: `main reactor RustProgram` will generate `rust_program`. See [Command-Line Arguments](/docs/handbook/target-declaration#command-line-arguments) for details.

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

```lf-rust
target Rust {
   cargo-dependencies: {
      termcolor: "0.8"
   }
};
```

The value of the _cargo-dependencies_ property is a map of crate identifiers to a _dependency-spec_. An informal example follows:

```json
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

```json
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

Not all keys are necessarily supported though, e.g. the `registry` key is not supported (yet).

#### Configuring the runtime

The runtime crate can be configured just like other crates, using the `cargo-dependencies` target property, e.g.:

```json
cargo-dependencies: {
   reactor_rt: {
     features: ["parallel-runtime"]
   }
}
```

The dependency is always included, with defaults picked by LFC. The location information (_path_/_git_/_version_ key) is optional.
See [reactor_rt](https://lf-lang.github.io/reactor-rust/reactor_rt/index.html) for the supported features.

#### Linking support files

You can link-in additional rust modules using the `rust-include` target property:

```lf-rust
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

```lf-rust
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

The [`ReactionCtx`](https://lf-lang.github.io/reactor-rust/reactor_rt/struct.ReactionCtx.html) object is a mediator to manipulate all those dependency objects. It has methods to set ports, schedule actions, retrieve the current logical time, etc.

For instance:

```lf-rust
reactor Source {
    output out: i32;
    reaction(startup) -> out {=
        ctx.set(out, 76600)
    =}
}
```

In this example, the context object `ctx` is used to set a port to a value. The port is in scope as `out`.

> :warning: TODO when the runtime crate is public link to the docs, they should be the most exhaustive documentation.

</div>
````
