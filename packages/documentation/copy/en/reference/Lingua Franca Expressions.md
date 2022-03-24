---
title: "Lingua Franca Expressions"
layout: docs
permalink: /docs/handbook/lingua-franca-expressions
oneline: "Expressions in Lingua Franca."
preamble: >
---

## Lingua Franca Expressions

A subset of LF syntax is used to write _expressions_, which represent target language values. Expressions are used in [state variable](#State-declaration) initializers, default values for [parameters](#Parameter-declarations), and [parameter assignments](#Contained-reactors).

Expressions in LF support only simple forms, that are intended to be common across languages. Their precise meaning (eg the target language types they are compatible with) is target-specific and not specified here.

### Basic expressions

The most basic expression forms, which are supported by all target languages, are the following:

- Literals:
  - Numeric literals, eg `1`, `-120`, `1.5`. Note that the sign, if any, is part of the literal and must not be separated by whitespace.
  - String literals, eg `"abcd"`. String literals always use double-quotes, even in languages which support other forms (like Python).
  - Character literals. eg `'a'`. Single-quoted literals must be exactly one character long --even in Python.
  - Boolean literals: `true`, `false`, `True`, `False`. The latter two are there for Python.
- Parameter references, which are simple identifiers (eg `foo`). Any identifier in expression position must refer to a parameter of the enclosing reactor.
- Time values, eg `1 msec` or `10 seconds`. The syntax of time values is `integer time_unit`, where `time_unit` is one of the following

  - **nsec**: nanoseconds
  - **usec**: microseconds
  - **msec**: milliseconds
  - **sec** or **second**: seconds
  - **minute**: 60 seconds
  - **hour**: 60 minutes
  - **day**: 24 hours
  - **week**: 7 days

  Each of these units also support a pluralized version (eg `nsecs`, `minutes`, `days`), which means the same thing.

  The time value `0` may have no unit. Except in this specific case, the unit is always required.

  Time values are compatible with the `time` type.

- Escaped target-language expression, eg `{= foo() =}`. This syntax is used to write any expression which does not fall into one of the other forms described here. The contents are not parsed and are used verbatim in the generated file.

  The variables in scope are target-specific.

### Complex expressions

Some targets may make use of a few other syntactic forms for expressions. These syntactic forms may be acribed a different meaning by different targets, to keep the source language close in meaning to the target language.

We describe here these syntactic forms and what meaning they have in each target.

- Bracket-list syntax, eg `[1, 2, 3]`. This syntax is used to create a list in Python. It is not supported by any other target at the moment.
  ```python
  state x([1,2,3])
  ```

#### Initializer pseudo-expressions

Some "expression" forms are only acceptable as the initializer of a state variable or parameter, but not in other places (like inside a list expression). These are

- Tuple syntax, eg `(1, 2, 3)`. This syntax is used:

  - in the Python target, to create a tuple value. Tuples are different from lists in that they are immutable.
  - in C++, to pass arguments to a constructor:

    ```cpp
    state x: int[](1,2);
    ```

    In that example, the initializer expression is translated to `new std::vector(1,2)`. See also [C++ target documentation](https://github.com/lf-lang/lingua-franca/wiki/Writing-Reactors-in-Cpp#using-state-variables).

  - in C and all other targets, to create a target-specific array value. In the Python target, this is accomplished by the bracket-list syntax `[1,2,3]` instead. Note that to create a zero- or one-element array, fat braces are usually required. For instance in C:

  ```c
    state x: int[](1,2,3); // creates an int array, basically `int x[] = {1,2,3};`
    state x: int[](1);     // `int x[] = 1;` - type error!
    state x: int[]({= {1} =})  // one element array: `int x[] = {1};`
  ```

- Brace-list syntax, eg `{1, 2, 3}`. This syntax is at the moment only supported by the C++ target. It's used to initialize a vector with the initializer list syntax instead of a constructor call.
