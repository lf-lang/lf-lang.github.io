---
title: "Preambles and Methods"
layout: docs
permalink: /docs/handbook/preambles-and-methods
oneline: "Defining functions and methods in Lingua Franca."
preamble: >
---

$page-showing-target$

## Preamble

Reactions may contain arbitrary target-language code, but often it is convenient for that code to invoke external libraries or to share procedure definitions. For either purpose, a reactor may include a $preamble$ section.

<div class="lf-c">

For example, the following reactor uses the common `stdlib` C library to convert a string to an integer:

```lf-c
main reactor {
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

By putting the `#include` in the $preamble$, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file or in files that include this file.

You can also use the $preamble$ to define functions that are shared across reactions and reactors, as in this example:

```lf-c
main reactor {
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

A $preamble$ can also be put outside the $reactor$ definition.
Currently, in the C target, it makes no difference whether it is put inside or outside.

</div>

<div class="lf-cpp lf-py lf-ts lf-rs warning">

FIXME

</div>

## Methods

<div class="lf-c lf-py lf-ts lf-rs">

Methods are not currently implemented in the $target-language$ target.

</div>

<div class="lf-cpp warning">

FIXME

</div>
