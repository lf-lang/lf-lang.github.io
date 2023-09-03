---
title: "Reaction Declarations"
layout: docs
permalink: /docs/handbook/reaction-declarations
oneline: "Reaction declarations in Lingua Franca."
preamble: >
---

## Reaction Order

Sometimes, it is inconvenient to mix Lingua Franca code with target code. Rather than _defining_ reactions (i.e., complete with inlined target code), it is also possible to just _declare_ them, and provide implementations in a separate file. The syntax of reaction declarations is the same as for reaction definitions, except they have no implementation. Reaction declarations can be thought of as function prototypes or interfaces.

<div class="lf-c">
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
#include "include/HelloDecl/HelloDecl.h"

void hello(hellodecl_self_t* self) {
    printf("Hello declaration!\n");
}

```

</div>

<div class="lf-cpp">
FIXME
</div>

<div class="lf-py lf-ts lf-rs">

The $target-language$ target does not currently support reaction declarations.

</div>
