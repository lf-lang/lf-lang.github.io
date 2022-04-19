---
title: Cpp Reactors
layout: docs
permalink: /docs/handbook/cpp-reactors
oneline: "Writing Reactors in C++."
preamble: >
---

In the C++ reactor target for Lingua Franca, reactions are written in C++ and the code generator generates a standalone C++ program that can be compiled and run on all major platforms. Our continous integration ensures compatibility with Windows, MacOS and Linux.
The C++ target solely depends on a working C++ build system including a recent C++ compiler (supporting C++17) and [CMake](https://cmake.org/) (>= 3.5). It relies on the [reactor-cpp](https://github.com/lf-lang/reactor-cpp) runtime, which is automatically fetched and compiled in the background by the Lingua Franca compiler.

Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe.

## Setup

The following tools are required in order to compile the generated C++ source code:

- A recent C++ compiler supporting C++17
- A recent version of cmake (At least 3.5)


## A Minimal Example

A "hello world" reactor for the C++ target looks like this:

```lf-cpp
target Cpp;

main reactor {
    reaction(startup) {=
        std::cout << "Hello World!" << std::endl;
    =}
}
```

The `startup` action is a special [action](language-specification/Language\ Specification) that triggers at the start of the program execution causing the [reaction](language-specification/Language\ Specification#Reaction-Declaration) to execute. This program can be found in a file called [Minimal.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Minimal.lf) in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/Cpp), where you can also find quite a few more interesting examples. If you compile this using the [`lfc` command-line compiler](Command-Line-Tools) or the [Eclipse-based IDE](downloading-and-building/Developer-Eclipse-Setup-with-Oomph), then generated source files will be put into a subdirectory called `src-gen/Minimal`. In addition, an executable binary will be compiled using your system's C++ compiler. The resulting executable will be called `Minimial` and be put in a subdirectory called `bin`. If you are in the C++ test directory, you can execute it in a shell as follows:

```
 bin/Minimal
```

The resulting output should look something like this:

```
[INFO]  Starting the execution
Hello World!
[INFO]  Terminating the execution
```

## The C++ Target Specification

To have Lingua Franca generate C++ code, start your `.lf` file with the following target specification:

    target Cpp;

A C++ target specification may optionally include the following parameters:

- `build-type "type"`: The _build type_ to be used by the C++ compiler. This can be any of Release, Debug, RelWithDebInfo and MinSizeRel. It defaults to Release.
- `cmake-include "file"`: An optional _file_ to be included by the generated cmake build system. This gives control over the way LF programs are build and allows for instance to include and link to external libraries. (See [`AsyncCallvack.lf`](https://github.com/lf-lang/lingua-franca/blob/master/xtext/org.icyphy.linguafranca/src/test/Cpp/AsyncCallback.lf) for an example)
- `compiler "command"`: The _command_ to use to compile the generated code. Normally CMake selects the best compiler for your system, but you can use this parameter to point it to your preferred compiler.
- `external-runtime-path "path"`: When specified, the resulting binary links to a pre-compiled external runtime library located in _path_ instead of the default one.
- `export-dependency-graph [true|false]`: Whether the compiled binary will export its internal dependency graph as a dot graph when executed. This is a debugging utility.
- `fast [true|false]`: Whether to execute as fast as possible ignoring real time. This defaults to false.
- `keepalive [true|false]`: Whether to continue executing even when there are no events on the event queue. The default is false. Usually, you will want to set this to true when you have **physical action**s.
- `logging [ERROR|WARN|INF|DEBUG]`: The level of diagnostic messages about execution to print to the console. A message will print if this parameter is greater than or equal to the level of the message (`ERROR` < `WARN` < `INFO` < `DEBUG`).
- `no-compile [true|false]`: If this is set to true, then the Lingua Franca compiler will only generate code and not run the C++ compiler. This defaults to false.
- `no-runtime-validation [true|false]`: If this is set to true, then all runtime checks in [reactor-cpp](https://github.com/lf-lang/reactor-cpp) will be disabled. This brings a slight performance boost but should be used with care and only on tested programs. This defaults to false.
- `runtime-version "version"`: Specify the _version_ of the runtime library the compiled binary should link against. _version_ can be any tag, branch name or git hash in the [reactor-cpp](https://github.com/lf-lang/reactor-cpp) repository.
- `threads <n>`: The number of worker threads _n_ that are used to execute reactions. This is required to be a positive integer. If this is not specified or set to zero, then the number of worker threads will be set to the number of hardware threads of the executing system. If this is set to one, the scheduler will not create any worker threads and instead inline the execution of reactions. This is an optimization and avoids any unnecessary synchronization. Note that, in contrast to the C target, the single threaded implementation is still thread safe and asynchronous reaction scheduling is supported.
- `timeout <n> <unit>`: This specifies to stop after the specified amount of logical time has elapsed. All events at that logical time that have microstep 0 will be processed, but not events with later tags. If any reactor calls `request_stop` before this logical time, then the program may stop at an earlier logical time. If no timeout is specified and `request_stop` is not called, then the program will continue to run until stopped by some other mechanism (such as Control-C).

## Command-Line Arguments

The generated C++ program understands the following command-line arguments, each of which has a short form (one character) and a long form:

- `-f, --fast`: If set, then the program will execute as fast as possible, letting logical time advance faster than physical time.
- `-o, --timeout '<duration> <units>'`: Stop execution when logical time has advanced by the specified _duration_. The units can be any of nsec, usec, msec, sec, minute, hour, day, week, or the plurals of those.
- `-k, --keepalive`: If set, then the program will keep executing until either the `timeout` logical time is reached or the program is externally killed. If you have `physical action`s, it usually makes sense to set this.
- `-t, --threads <n>`: Use n worker threads for executing reactions.
- `-h, --help`: Print the above information.

If the main reactor declares parameters, these parameters will appear as additional CLI options that can be specified when invoking the binary (see [Using Parameters](#using-parameters)).

## Imports

The [import statement](Language-Specification#import-statement) can be used to share reactor definitions across several applications. Suppose for example that we modify the above Minimal.lf program as follows and store this in a file called [HelloWorld.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/HelloWorld.lf):
```lf-cpp
target Cpp;
reactor HelloWorld {
    reaction(startup) {=
        std::cout << "Hello World.\n";
    =}
}
main reactor HelloWorldTest {
    a = new HelloWorld();
}
```
This can be compiled and run, and its behavior will be identical to the version above.
But now, this can be imported into another reactor definition as follows:
```lf-cpp
target Cpp;
import HelloWorld.lf;
main reactor TwoHelloWorlds {
    a = new HelloWorld();
    b = new HelloWorld();
}
```
This will create two instances of the HelloWorld reactor, and when executed, will print "Hello World" twice.

Note that in the above example, the order in which the two reactions are invoked is undefined
because there is no causal relationship between them. In fact, you might see garbled output as on default multiple worker threads are used to execute the program and `std::cout` is not thread safe. You can restrict execution to one thread if you modify the target specification to say:
```lf-cpp
target Cpp {threads: 1};
```
A more interesting illustration of imports can be found in the [Import.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Import.lf) test case.

## Preamble

Reactions may contain arbitrary C++ code, but often it is convenient for that code to invoke external libraries or to share type and/or method definitions. For either purpose, a reactor may include a **preamble** section. For example, the following reactor uses `atoi` from the common `stdlib` C library to convert a string to an integer:

```lf-cpp
main reactor Preamble {
    private preamble {=
        include <cstdlib>
    =}

    timer t;
    reaction(t) {=
        const char* s = "42";
        int i = atoi(s);
        std::cout << "Converted string << s << " to nt " << i << '\n';
    =}
}
```

This will print:

```
Converted string 42 to int 42.
```

By putting the `#include` in the **preamble**, the library becomes available in all reactions of this reactor. Note the **private** qualifier before the **preamble** keyword. This ensures that the preamble is only visible to the reactions defined in this reactor and not to any other reactors. In contrast, the **public** qualifier ensures that the preamble is also visible to other reactors in files that import the reactor defining the public preamble.

See for instance the reactor in [Preamble.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Preamble.lf):

```lf-cpp
reactor Preamble {
    public preamble {=
        struct MyStruct {
            int foo;
            std::string bar;
        };
    =}

    private preamble {=
        auto add_42(int i) noexcept -> int {
            return i + 42;
        }
    =}

    logical action a:MyStruct;

    reaction(startup) {=
        a.schedule({add_42(42), "baz"});
    =}

    reaction(a) {=
        auto& value = *a.get();
        std::cout << "Received " << value.foo << " and '" << value.bar << "'\n";
    =}
}

```

It defines both, a public and a private preamble. The public preamble defines the type `MyStruct`. This type definition will be visible to all elements of the `Preamble` reactor as well as to all reactors defined in files that import `Preamble`. The private preamble defines the function `add_42(int i)`. This function will only be usable to reactions within the `Preamble` reactor.

You can think of public and private preambles as the equivalent of header files and source files in C++. In fact, the public preamble will be translated to a header file and the private preamble to a source file. As a rule of thumb, all types that are used in port or action definitions as well as in state variables or parameters should be defined in a public preamble. Also declarations of functions to be shared across reactors should be placed in the public preamble. Everything else, like function definitions or types that are used only within reactions should be placed in a private preamble.

Note that preambles can also be specified on the file level. These file level preambles are visible to all reactors within the file. An example of this can be found in [PreambleFile.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/target/PreambleFile.lf).

Admittedly, the precise interactions of preambles and imports can become confusing. The preamble mechanism will likely be refined in future revisions.

Note that functions defined in the preamble cannot access members such as state variables of the reactor unless they are explicitly passed as arguments. If access to the inner state of a reactor is required, [methods](Reactions and Methods#Method Declaration) present a viable and easy to use alternative.

## Reactions

Recall that a reaction is defined within a reactor using the following syntax:

> **reaction**(_triggers_) _uses_ -> _effects_ {=<br/> > &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the C++ target.

### Inputs and Outputs

In the body of a reaction in the C++ target, the value of an input is obtained using the syntax `*name.get()`, where `name` is the name of the input port. Note that `get()` always returns a pointer to the actual value. Thus the pointer needs to be dereferenced with `*` to obtain the value. (See [Sending and Receiving Large Data Types](#sending-and-receiving-large-data-types) for an explanation of the exact mechanisms behind this pointer access).
To determine whether an input is present, `name.is_present()` can be used. Since `get()` returns a `nullptr` if no value is present, `name.get() != nullptr` can be used alternatively for checking presence.

For example, the [Determinism.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Determinism.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/Cpp) includes the following reactor:

```lf-cpp
reactor Destination {
    input x:int;
    input y:int;
    reaction(x, y) {=
        int sum = 0;
        if (x.is_present()) {
            sum += *x.get();
        }
        if (y.is_present()) {
            sum += *y.get();
        }
        std::cout << "Received " << sum << std::endl;
    =}
}
```
The reaction refers to the inputs `x` and `y` and tests for the presence of values using `x.is_present()` and `y.is_present()`. If a reaction is triggered by just one input, then normally it is not necessary to test for its presence; it will always be present. But in the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:
```lf-cpp
reaction(x) y {=
    int sum = *x.get();
    if (y.is_present()) {
        sum += *y.get();
    }
    std::cout << "Received " << sum << std::endl;
=}
```
It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Outputs are set using a `set()` method on an output port. For example, we can further modify the above example as follows:
```lf-cpp
output z:int;
reaction(x) y -> z {=
    int sum = *x.get();
    if (y.is_present()) {
        sum += *y.get();
    }
    z.set(sum);
=}
```
If an output gets set more than once at any logical time, downstream reactors will see only the _final_ value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name.is_present()` to determine whether the output has been set. For example, the following reactor (see [TestForPreviousOutput.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/TestForPreviousOutput.lf)) will always produce the output 42:

```lf-cpp
reactor Source {
    output out:int;
    reaction(startup) -> out {=
        // Set a seed for random number generation based on the current time.
        std::srand(std::time(nullptr));
        // Randomly produce an output or not.
        if (std::rand() % 2) {
            out.set(21);
        }
    =}
    reaction(startup) -> out {=
        if (out.is_present()) {
            int previous_output = *out.get();
            out.set(2 * previous_output);
        } else {
            out.set(42);
        }
    =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

### Using State Variables

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

### Using Parameters

Reactor parameters work similar to state variables in C++. However, they are always declared as `const` and initialized during reactor instantiation. Thus, the value of a parameter may not be changed. For example, the [Stride](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/Stride.lf) reactor modifies the above `Count` reactor so that its stride is a parameter:

```lf-cpp
reactor Count(stride:int(1)) {
    state count:int(0);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y.set(count);
        count += stride;
    =}
}
reactor Display {
    input x:int;
    reaction(x) {=
    	std::cout << "Received " << *x.get() << std::endl;
    =}
}
main reactor Stride {
    c = new Count(stride = 2);
    d = new Display();
    c.y -> d.x;
}
```

The first line defines the `stride` parameter, gives its type, and gives its initial value. As with state variables, the type and initial value can be enclosed in `{= ... =}` if necessary.

When the reactor is instantiated, the default parameter value can be overridden. This is done in the above example near the bottom with the line:

```lf-cpp
c = new Count(stride = 2);
```

If there is more than one parameter, use a comma separated list of assignments.

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

The **logical action** named `next` and the `schedule` method are explained below in [Scheduling Delayed Reactions](#Scheduling-Delayed-Reactions); here they are used simply to repeat the reaction until all elements of the array have been sent. Note that similiar aas for state variables, curly braces `{...}` can optionally be used for initialization.

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

```
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

## Timed Behavior

Timers are specified exactly as in the [Lingua Franca language specification](Language-Specification#timer-declaration). When working with time in the C++ code body of a reaction, however, you will need to know a bit about its internal representation.

The Reactor C++ library uses [`std::chrono`](https://en.cppreference.com/w/cpp/chrono) for representing time. Specifically, the library defines two types for representing durations and timepoints: `reactor::Duration` and `reactor::TimePoint`. `reactor::Duration` is an alias for [`std::chrono::nanosecods`](https://en.cppreference.com/w/cpp/chrono/duration). `reactor::TimePoint` is alias for [`std::chrono::time_point<std::chrono::system_clock, std::chrono::nanoseconds>`](https://en.cppreference.com/w/cpp/chrono/time_point). As you can see from these definitions, the smallest time step that can be represented is one nanosecond. Note that `reactor::TimePoint` describes a specific point in time and is associated with a specific clock, whereas `reactor::Duration` defines a time interval between two time points.

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

```
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

### Scheduling Delayed Reactions

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

## Actions With Values

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

## Stopping Execution

A reaction may request that the execution stops after all events with the current timestamp have been processed by calling `environment()->sync_shutdown()`. There is also a method `environment()->async_shutdown()`
which may be invoked from outside an reaction, like an external thread.

## Log and Debug Information

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
