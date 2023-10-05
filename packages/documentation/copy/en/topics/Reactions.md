---
title: "Reactions"
layout: docs
permalink: /docs/handbook/reactions
oneline: "Reactions in Lingua Franca."
preamble: >
---


## Reaction Declaration

A reaction declaration has the following form:

```lf
  reaction [<name>] (<triggers>) [<uses>] [-> <effects>] [{= ... body ...=}]
```

Each reaction declares its triggers, uses, and effects:
- The **triggers** field can be a comma-separated list of input ports, [output ports of contained reactors](/docs/handbook/composing-reactors#hierarchy), [timers](/docs/handbook/time-and-timers#timers), [actions](/docs/handbook/actions), or the special events $startup$, $shutdown$, and $reset$ (explained [here](#startup-shutdown-and-reset-reactions)). There must be at least one trigger for each reaction.
- The **uses** field, which is optional, specifies input ports (or output ports of contained reactors) that do not trigger execution of the reaction but may be read by the reaction.
- The **effects** field, which is also optional, is a comma-separated lists of output ports ports, input ports of contained reactors, or [actions](/docs/handbook/actions).

Reactions may optionally be named. The name is cosmetic and may serve as additional documentation. Note that reactions cannot be called like functions, even if they are named.

The reaction's behavior is defined by its body, which should be given in the target programming language. Note that the reaction body may only read from actions and ports that it has declared as triggers or uses, and it may only write to actions and ports that is has declared as an effect. The target code generators implement a scoping mechanism, such that only variables that are declared in the reaction signature are accessible in the reaction body.

In some targets, the reaction body may be omitted and the body can be defined natively in the target language in an external file. See the section on [Bodyless Reactions](#bodyless-reactions) for details.

## Reaction Order

A reactor may have multiple reactions, and more than one reaction may be enabled at any given tag. In Lingua Franca semantics, if two or more reactions of the same reactor are **simultaneously enabled**, then they will be invoked sequentially in the order in which they are declared. More strongly, the reactions of a reactor are **mutually exclusive** and are invoked in tag order primarily and declaration order secondarily. Consider the following example:

$start(Alignment)$

```lf-c
target C {
  timeout: 3 secs
}
main reactor Alignment {
  state s: int = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self->s += 1;
  =}
  reaction(t2) {=
    self->s -= 2;
  =}
  reaction(t4) {=
    printf("s = %d\n", self->s);
  =}
}
```

```lf-cpp
target Cpp {
  timeout: 3 s
}
main reactor Alignment {
  state s: int(0)
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  timer t4(400 ms, 400 ms)
  reaction(t1) {=
    s += 1;
  =}
  reaction(t2) {=
    s -= 2;
  =}
  reaction(t4) {=
    std::cout << "s = " << std::to_string(s) << std::endl;
  =}
}
```

```lf-py
target Python {
  timeout: 3 secs
}
main reactor Alignment {
  state s = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self.s += 1
  =}
  reaction(t2) {=
    self.s -= 2
  =}
  reaction(t4) {=
    print(f"s = {self.s}")
  =}
}
```

```lf-ts
target TypeScript {
  timeout: 3 s
}
main reactor Alignment {
  state s: number = 0
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  timer t4(400 ms, 400 ms)
  reaction(t1) {=
    s += 1
  =}
  reaction(t2) {=
    s -= 2
  =}
  reaction(t4) {=
    console.log(`s = ${s}`)
  =}
}
```

```lf-rs
target Rust {
  timeout: 3 secs
}
main reactor Alignment {
  state s: u32 = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self.s += 1;
  =}
  reaction(t2) {=
    self.s -= 2;
  =}
  reaction(t4) {=
    println!("s = {}", self.s);
  =}
}
```

$end(Alignment)$

Every 100 ms, this increments the state variable `s` by 1, every 200 ms, it decrements `s` by 2, and every 400 ms, it prints the value of `s`. When these reactions align, they are invoked in declaration order, and, as a result, the printed value of `s` is always 0.

## Overwriting Outputs

Just as the reactions of the `Alignment` reactor overwrite the state variable `s`, logically simultaneous reactions can overwrite outputs. Consider the following example:

$start(Overwriting)$

```lf-c
target C
reactor Overwriting {
  output y: int
  state s: int = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self->s += 1;
    lf_set(y, self->s);
  =}
  reaction(t2) -> y {=
    self->s -= 2;
    lf_set(y, self->s);
  =}
}
```

```lf-cpp
target Cpp
reactor Overwriting {
  output y: int
  state s: int(0)
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  reaction(t1) -> y {=
    s += 1;
    y.set(s);
  =}
  reaction(t2) -> y {=
    s -= 2;
    y.set(s);
  =}
}
```

```lf-py
target Python
reactor Overwriting {
  output y
  state s = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self.s += 1
    y.set(self.s)
  =}
  reaction(t2) -> y {=
    self.s -= 2
    y.set(self.s)
  =}
}
```

```lf-ts
target TypeScript
reactor Overwriting {
  output y: number
  state s: number = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    s += 1
    y = s
  =}
  reaction(t2) -> y {=
    s -= 2
    y = s
  =}
}
```

```lf-rs
target Rust
reactor Overwriting {
  output y: u32
  state s: u32 = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self.s += 1;
    ctx.set(y, self.s);
  =}
  reaction(t2) -> y {=
    self.s -= 2;
    ctx.set(y, self.s);
  =}
}
```

$end(Overwriting)$

Here, the reaction to `t1` will set the output to 1 or 2, but every time it sets it to 2, the second reaction (to `t2`) will overwrite the output with the value 0. As a consequence, the outputs will be 1, 0, 1, 0, ... deterministically.

## Reacting to Outputs of Contained Reactors

A reaction may be triggered by the an input to the reactor, but also by an output of a contained reactor, as illustrated in the following example:

$start(Contained)$

```lf-c
target C
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if (s.y->value != 0 && s.y->value != 1) {
      lf_print_error_and_exit("Outputs should only be 0 or 1!");
    }
  =}
}
```

```lf-cpp
target Cpp
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    auto is_correct = [](auto value){
      return value == 0 || value == 1;
    };
    if (s.y.is_present() && !is_correct(*s.y.get())) {
      std::cout << "Output shoudl only be 0 or 1!" << std::endl;
    }
  =}
}
```

```lf-py
target Python
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if s.y.value != 0 and s.y.value != 1:
      sys.stderr.write("ERROR: Outputs should only be 0 or 1!\n")
      exit(1)
  =}
}
```

```lf-ts
target TypeScript
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if (s.y != 0 && s.y != 1) {
      util.requestErrorStop("Outputs should only be 0 or 1!")
    }
  =}
}
```

```lf-rs
target Rust
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    let value = ctx.get(s__y).unwrap();
    if value != 0 && value != 1 {
      eprintln!("Output schould only be 0 or 1!");
      ctx.request_stop(Asap);
    }
  =}
}
```

$end(Contained)$

<img alt="Lingua Franca diagram" src="../../../../../img/diagrams/Contained.svg" width="300"/>

This instantiates the above `Overwriting` reactor and monitors its outputs.

## Triggering Contained Reactors

A reaction can set the input of a contained reactor, thereby triggering its reactions, as illustrated in the following example:

$start(Triggering)$

```lf-c
target C
reactor Inside {
  input x: int
  reaction(x) {=
    printf("Received %d\n", x->value);=
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    lf_set(i.x, 42);
  =}
}
```

```lf-cpp
target Cpp
reactor Inside {
  input x: int
  reaction(x) {=
    std::cout << "Received " << std::to_string(*x.get()) << std::endl;
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x.set(42);
  =}
}
```

```lf-py
target Python
reactor Inside {
  input x
  reaction(x) {=
    print(f"Received {x.value}")
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x.set(42);
  =}
}
```

```lf-ts
target TypeScript
reactor Inside {
  input x: number
  reaction(x) {=
    console.log("Received ${x}");
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x = 42
  =}
}
```

```lf-rs
target Rust
reactor Inside {
  input x: u32
  reaction(x) {=
    println!("Received {}", ctx.get(x).unwrap());
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    ctx.set(i__x, 42);
  =}
}
```

$end(Triggering)$

The reaction to $startup$ declares the input port of the inside reactor as an effect and then sets it with value 42.
This will cause the inside reactor's reaction to execute and print `Received 42`.

## Startup, Shutdown, and Reset Reactions

Reactions may be triggered by the special events $startup$, $shutdown$, or $reset$.
For example,

```lf
  reaction(startup) {=
    // ... Do something
  =}
```

A reaction to $startup$ is triggered at the very first tag when the program begins (or, if within a mode of a [modal reactor](/docs/handbook/modal-models), when the mode is first entered).
This reaction will be logically simultaneous with reactions to [timers](/docs/handbook/time-and-timers) that have a zero offset.
As usual, for logically simultaneous reactions declared within the same reactor, the order in which they are invoked will be governed by the order in which they are declared.

A reaction to $shutdown$ is invoked at program termination.
See the [Termination](/docs/handbook/termination) section for details.

<div class="lf-cpp lf-ts lf-rs">

Reactions to the $reset$ event are not supported in $target-language$ because [modal reactors](/docs/handbook/modal-models) are not supported.

</div>

<div class="lf-c lf-py">

A reaction to the $reset$ event is invoked if the reaction or reactor is within a mode of a [modal reactor](/docs/handbook/modal-models) and the mode is entered via a reset transition.
For details, see the [Modal Reactors](/docs/handbook/modal-models) section.

</div>


## Bodyless Reactions

Sometimes, it is inconvenient to mix Lingua Franca code with target code. Rather than _defining_ reactions (i.e., complete with inlined target code), it is also possible to just _declare_ them and provide implementations in a separate file. The syntax of reaction declarations is the same as for reaction definitions, except they have no implementation. Reaction declarations can be thought of as function prototypes.

<div class="lf-c">

### Example

Consider the following program that has a single reaction named `hello` and is triggered at startup.
It has no implementation.

```lf-c
target C {
  cmake-include: ["hello.cmake"],
  files: ["hello.c"]
}

main reactor HelloDecl {

  reaction hello(startup)

}
```

The `cmake-include` target property is used to make the build system aware of an externally supplied implementation. The contents of `hello.cmake` is as follows:

```cmake
target_sources(${LF_MAIN_TARGET} PRIVATE hello.c)
```

The `files` target property is used to make accessible the file that has the implementation in `hello.c,
which could look something like this:

```c
#include <stdio.h>
#include "../include/HelloDecl/HelloDecl.h"

void hello(hellodecl_self_t* self) {
    printf("Hello declaration!\n");
}
```

### File Structure

In the above example, the C file uses `#include` to import a file called `HelloDecl.h`. The `HelloDecl.h` file
is generated from the Lingua Franca source file when the LF program is compiled. The file
`HelloDecl.h` is named after the main reactor, which is called `HelloDecl`, and its parent
directory, `include/HelloDecl`, is named after the file, `HelloDecl.lf`.

In general, compiling a Lingua Franca program that uses reaction declarations will always generate a
directory in the `include` directory for each file in the program. This directory will contain a
header file for each reactor that is defined in the file.

As another example, if an LF program consists of files `F1.lf` and `F2.lf`, where `F1.lf` defines reactors
`A` and `B` and `F2.lf` defines the reactor `C` and the main reactor `F2`, then the directory structure
will look something like this:

```
include/
├ F1/
│ ├ A.h
│ └ B.h
└ F2/
  ├ C.h
  └ F2.h
src/
├ F1.lf  // defines A and B
└ F2.lf  // defines C and F2
src-gen/
```

There is no particular location where you are required to place your C files or your CMake files.
For example, you may choose to place them in a directory called `c` that is a sibling of the `src`
directory.

### The Generated Header Files

The generated header files are necessary in order to separate your C code from your LF code because
they describe the signatures of the reaction functions that you must implement.

In addition, they define structs that will be referenced by the reaction bodies. This includes the
`self` struct of the reactor to which the header file corresponds, as well as structs for its ports,
its actions, and the ports of its child reactors.

As with preambles, programmer discipline is required to avoid breaking the deterministic semantics
of Lingua Franca. In particular, although the information exposed in these header files allows
regular C code to operate on ports and self structs, such information must not be saved in global or
static variables.

### Linking Your C Code

As with any Lingua Franca project that uses external C files, projects involving external reactions
must use the `cmake-include` target property to link those files into the main target.

The file referenced by the `cmake-include` target property has the following syntax:

```cmake
target_sources(${LF_MAIN_TARGET} PRIVATE <files>)
```

where `<files>` is a list of the C files you need to link, with paths given relative to the project
root (the parent of the `src` directory).

</div>

<div class="lf-cpp">

### Example

Consider the following program that has a single reaction named `hello` and is triggered at startup.
It has no implementation.

```lf-cpp
target Cpp {
  cmake-include: ["hello.cmake"],
}

main reactor HelloDecl {

  reaction hello(startup)

}
```

The behavior of the `hello` reaction is provided using a method definition in an external C++ file `hello.cc`.

```cpp
#include "HelloDecl/HelloDecl.hh" // include the code generated reactor class

// define the reaction implementation
void HelloDecl::Inner::hello([[maybe_unused]] const reactor::StartupTrigger& startup) {
  std::cout << "Hello World." << std::endl;
}
```

Using the `cmake-include` target property, we can make the build system aware of this externally supplied implementation. The contents of `hello.cmake` is as follows:

```cmake
target_sources(${LF_MAIN_TARGET} PRIVATE hello.cc)
```
Note that this mechanism can be used to add arbitrary additional resources such as additional headers and implementation files or 3rd party libraries to the compilation.

### Header Files and Method Signatures

In order to provide an implementation of a reaction method, it is important to know the header file that declares the reactor class as well as the precise signature of the method implementing the reaction body.

The LF compiler generates a header file for each reactor that gets defined in LF code. The header file is named after the corresponding reactor and prefixed by the path to the LF file that defines the reactor. Consider the following example project structure:
```
src/
├ A.lf   // defines Foo
└ sub/
  └ B.lf // defines Bar
```
In this case, the compiler will generate two header files `A/Foo.hh` and `sub/B/Bar.hh`, which would need to be included by an external implementation file.

The precise method signature depends on the name of the reactor, the name of the reactions, and the precise triggers, sources, and effects that are defined in the LF code.
The return type is always void. A reaction `foo` in a reactor `Bar` will be named `Bar::Inner::foo`. Note that each reactor class in the C++ target defines an `Inner` class which contains all reactions as well as the parameters and state variables. This is done to deliberately restrict the scope of reaction bodies in order to avoid accidental violations of reactor semantics.
Any declared triggers, sources or effects are given to the reaction method via method arguments. The precise arguments and their types depend on the LF code. If in doubt, please check the signature used in the generated header file under `src-gen/<lf-file>`, where `<lf-file>` corresponds to the LF file that you are compiling.
</div>

<div class="lf-py lf-ts lf-rs">

The $target-language$ target does not currently support reaction declarations.

</div>
