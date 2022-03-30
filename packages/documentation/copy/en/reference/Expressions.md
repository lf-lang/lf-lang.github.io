---
title: "Expressions"
layout: docs
permalink: /docs/handbook/expressions
oneline: "Expressions in Lingua Franca."
preamble: >
---

A subset of LF syntax is used to write _expressions_, which represent values in the target language. Expressions are used to initialize state variable and to give values to parameters. Arbitrary expressions in the target language can always be given within delitters `{= ... =}`, but simple forms do not require the delimitters. These simple forms are documented here.

## Basic expressions

The most basic expression forms, which are supported by all target languages, are the following:

- Literals:
  - Numeric literals, eg `1`, `-120`, `1.5`, `3.14e10`. Note that the sign, if any, is part of the literal and must not be separated by whitespace.
  - String literals, eg `"abcd"`. String literals always use double-quotes, even in languages which support other forms (like Python).
  - Character literals. eg `'a'`. Single-quoted literals must be exactly one character long --even in Python.
  - Boolean literals: `true`, `false`, `True`, `False`. The latter two are there for Python.
- Parameter references, which are simple identifiers (eg `foo`). Any identifier in expression position must refer to a parameter of the enclosing reactor.
- Time values, eg `1 msec` or `10 seconds`. The syntax of time values is `integer time_unit`, where `time_unit` is one of the following:

  - **nsec** or **ns**: nanoseconds
  - **usec** or **us**: microseconds
  - **msec** or **ms**: milliseconds
  - **sec**, **second**, or **s**: seconds
  - **minute** or **min**: 60 seconds
  - **hour**: 60 minutes
  - **day**: 24 hours
  - **week**: 7 days

  Each of these units also support a plural version (eg `nsecs`, `minutes`, `days`), which means the same thing.

  The time value `0` need not be given a unit, but for all other values, the unit is required.

  Time values are compatible with the `time` type.

- Escaped target-language expression, eg `{= foo() =}`. This syntax is used to write any expression which does not fall into one of the other forms described here. The contents are not parsed and are used verbatim in the generated file.

<div class="lf-c">

For instance, to have a 2-dimensional array as a parameter in C:

```
reactor Foo(param:{= int[][] =}({= { {1}, {2} } =})) {
    ...
}
```

Both `int[][]` and `{{1}, {2}}` are C fragments here, not LF.

</div>

## Collections

$page-showing-target$

To avoid the awkwardness of using the code delimiters `{= ... =}`, Lingua Franca supports initialization of simple arrays and similar structures. The interpretation is slightly different in each target language.

<div class="lf-c">

In C, a parameter or state may be given an array value as in the following example:

```lf
reactor Foo(param:double[](0.0, 1.0, 2.0)) {
    ...
}
```

This will become an array of length three. When intantiating this reactor, the default parameter value can be overridden using a similar syntax:

```lf
main reactor {
    f = new Foo(param = (3.3, 4.4, 5.5));
}
```

See the [C reactor documentation](/docs/handbook/c-reactors) for details and alternative syntaxes.

</div>

<div class="lf-cpp">

In C++, initial values for a parameter or state can be used to pass arguments to a constructor, as in the following example:

```lf-cpp
    state x: int[](1,2);
```

Here, the type `int[]` is translated by the code generator into `std::vector` and the `(1,2)` to constructor arguments, as in `new std::vector(1,2)`. See the [C++ reactor documentation](/docs/handbook/cpp-reactors#using-state-variables) for details and alternative syntaxes.

</div>

<div class="lf-py">

In Python, `[1, 2, 3]` defines a list, which is mutable, whereas `(1, 2, 3)` defines a tuple, which is not mutable. To support this distinction, both syntaxes are available in Lingua Franca without code delimiters. For example,

```lf-py
reactor Foo(param(1, 2, 3)) {
    ...
}
```

Notice that, even though the list is immutable (you cannot assign new values to its elements), the parameter can be overridden with _another_ mutable list when instantiating the reactor:

```lf-py
main reactor {
    f = new Foo(param = (3, 4, 5))
}
```

Parameters are assumed to be immutable after instantiation, but state variables usually need to be updated during execution. To permit that, a state variable can be initialized with a list as follows:

```lf-py
    state x([1,2,3])
```

See the [Python reactor documentation](/docs/handbook/cpp-reactors#python-reactors) for details and alternative syntaxes.

</div>

<div class="lf-ts warning">

FIXME: TS

</div>

<div class="lf-rs warning">

FIXME: Rust

</div>
