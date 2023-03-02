---
title: "Expressions"
layout: docs
permalink: /docs/handbook/expressions
oneline: "Expressions in Lingua Franca."
preamble: >
---

$page-showing-target$

A subset of LF syntax is used to write _expressions_, which represent values in the target language. Expressions are used to initialize state variable and to give values to parameters. Arbitrary expressions in the target language can always be given within delimiters `{= ... =}`, but simple forms do not require the delimiters. These simple forms are documented here.

## Basic expressions

The most basic expression forms, which are supported by all target languages, are the following:

- Literals:
  - Numeric literals, e.g. `1`, `-120`, `1.5`, `3.14e10`. Note that the sign, if any, is part of the literal and must not be separated by whitespace.
  - String literals, e.g. `"abcd"`. String literals always use double-quotes, even in languages which support other forms (like Python).
  - Character literals. e.g. `'a'`. Single-quoted literals must be exactly one character long --even in Python.
  - Boolean literals: `true`, `false`, `True`, `False`. The latter two are there for Python.
- Parameter references, which are simple identifiers (e.g. `foo`). Any identifier in expression position must refer to a parameter of the enclosing reactor.
- Time values, e.g. `1 msec` or `10 seconds`. The syntax of time values is `integer time_unit`, where `time_unit` is one of the following:

  - **nsec** or **ns**: nanoseconds
  - **usec** or **us**: microseconds
  - **msec** or **ms**: milliseconds
  - **sec**, **second**, or **s**: seconds
  - **minute** or **min**: 60 seconds
  - **hour**: 60 minutes
  - **day**: 24 hours
  - **week**: 7 days

  Each of these units also support a plural version (e.g., `nsecs`, `minutes`, and `days`), which means the same thing.

  The time value `0` need not be given a unit, but for all other values, the unit is required.

  Time values are compatible with the `time` type.

- Escaped target-language expression, e.g. `{= foo() =}`. This syntax is used to write any expression which does not fall into one of the other forms described here. The contents are not parsed and are used verbatim in the generated file.

<div class="lf-c">

For instance, to have a 2-dimensional array as a parameter in C:

```lf-c
reactor Foo(param: {= int[][] =} = {= { {1}, {2} } =}) {
    ...
}
```

Both `int[][]` and `{ {1}, {2} }` are C fragments here, not LF.

</div>

<div class="lf-py">

For instance, to assign a 2-dimensional list as an initial value to a parameter
in the Python target:

```lf-py
reactor Foo(param = {= [[1, 2, 3], [4, 5, 6]] =}) {
    ...
}
```

</div>

## Collections

$page-showing-target$

To avoid the awkwardness of using the code delimiters `{= ... =}`, Lingua Franca supports some expression forms directly, depending on the target language. The meaning of these expressions may be different in each target language, but it is consistent with the target language's own interpretation of these constructs (eg `[1, 2, 3]` in the Python target is a list, in the Rust target it's an array).

<div class="lf-cpp">

In C++, initial values for a parameter or state can be used to pass arguments to a constructor, as in the following example:

```lf-cpp
    state x: int[](1,2);
```

Here, the type `int[]` is translated by the code generator into `std::vector` and the `(1,2)` to constructor arguments, as in `new std::vector(1,2)`. See the [Target Language Details](/docs/handbook/target-language-details) for details and alternative syntaxes.

</div>

<!-- 
TODO these are commented out because they don't have any special syntax currently.

<div class="lf-c">

In C, a parameter or state may be given an array value as in the following example:

```lf-c
reactor Foo(param: double[] = {= { 0.0, 1.0, 2.0 } =}) {
    ...
}
```

This will become an array of length three. When instantiating this reactor, the default parameter value can be overridden using a similar syntax:

```lf-c
main reactor {
    f = new Foo(param = {= { 3.3, 4.4, 5.5 } =});
}
```

See the [Target Language Details](/docs/handbook/target-language-details) for details and alternative syntaxes.

</div>
<div class="lf-py">

The Python target supports a shorthand to write a python list, using Python-like syntax:

```lf-py
reactor Foo(param = [1, 2, 3]) {
    state x = [1, 2, 3]
}
```

See the [Target Language Details](/docs/handbook/target-language-details) for details and alternative syntaxes.

</div>

<div class="lf-ts">

In TypeScript, a parameter or state variable may be assigned an array expression as its initial value, as in the following example:

```lf-ts
reactor Foo(param: Array<number> = {= [1, 2, 3] =}) {
    state x: Array<number> = {= [0.1, 0.2, 0.3] =};
}
```

See the [TypeScript reactor documentation](/docs/handbook/target-language-details) for details and alternative syntaxes.

</div>

<div class="lf-rs warning">

FIXME: Rust
-->

</div>
