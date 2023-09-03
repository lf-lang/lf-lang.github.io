---
title: "Reaction Declarations"
layout: docs
permalink: /docs/handbook/reaction-declarations
oneline: "Reaction declarations in Lingua Franca."
preamble: >
---

Sometimes, it is inconvenient to mix Lingua Franca code with target code. Rather than _defining_ reactions (i.e., complete with inlined target code), it is also possible to just _declare_ them, and provide implementations in a separate file. The syntax of reaction declarations is the same as for reaction definitions, except they have no implementation. Reaction declarations can be thought of as function prototypes or interfaces.

<div class="lf-c">

## Example

Consider the following program that has a single reaction named `hello` and is triggered at startup.
It has no implementation. Instead, the `cmake-include` target property is used to make the build system aware of an externally supplied implementation. The `files` target property is used to make the file that has the implementation accessible.

```lf-c
target C {
  cmake-include: ["hello.cmake"],
  files: ["hello.c"]
}

main reactor HelloDecl {

  reaction hello(startup)

}

```

```cmake
target_sources(${LF_MAIN_TARGET} PRIVATE hello.c)
```

```c
#include <stdio.h>
#include "../include/HelloDecl/HelloDecl.h"

void hello(hellodecl_self_t* self) {
    printf("Hello declaration!\n");
}

```

## File Structure

In the above example, the C file used `#include` to import a file called `HelloDecl.h`. This file
was generated from the Lingua Franca source file when the LF program was compiled. The file
`HelloDecl.h` is named after the main reactor, which is called `HelloDecl`, and its parent
directory, `include/HelloDecl`, is named after the file, `HelloDecl.lf`.

In general, compiling a Lingua Franca program that uses reaction declarations will always generate a
directory in the `include` directory for each file in the program. This directory will contain a
header file for each reactor that is defined in the file.

As another example, if an LF program consists of files `F1` and `F2`, where `F1` defines reactors
`A` and `B` and `F2` defines the reactor `C` and the main reactor `F2`, then the directory structure
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

## The Generated Header Files

The generated header files are necessary in order to separate your C code from your LF code because
the describe the signatures of the reaction functions that you must implement.

In addition, they define structs that will be referenced by the reaction bodies. This includes the
`self` struct of the reactor to which the header file corresponds, as well as structs for its ports,
its actions, and the ports of its child reactors.

As with preambles, programmer discipline is required to avoid breaking the deterministic semantics
of Lingua Franca. In particular, although the information exposed in these header files allows
regular C code to operate on ports and self structs, such information must not be saved in global or
static variables.

## Linking Your C Code

As with any Lingua Franca project that uses external C files, projects involving external reactions
must use the `cmake-include` target property to link those files into the main target.

This is done using the syntax

```cmake
target_sources(${LF_MAIN_TARGET} PRIVATE <files>)
```

where `<files>` is a list of the C files you need to link, with paths given relative to the project
root (the parent of the `src` directory).

</div>

<div class="lf-cpp">
FIXME
</div>

<div class="lf-py lf-ts lf-rs">

The $target-language$ target does not currently support reaction declarations.

</div>
