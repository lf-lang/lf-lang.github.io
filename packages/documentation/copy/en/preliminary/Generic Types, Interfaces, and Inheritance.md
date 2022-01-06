---
title: "Generic Types, Interfaces, and Inheritance"
layout: docs
permalink: /docs/handbook/generic-types-interfaces-inheritance
oneline: "Generic Types, Interfaces, and Inheritance (preliminary)"
preamble: >
---
_The following topics are meant as collections of design ideas, with the purpose of refining them into concrete design proposals._

# Generics
Reactor classes can be parameterized with type parameters as follows:
```
reactor Foo<S, T> {
    input:S;
    output:T;
}
```

## Type Constraints
We could like to combine generics with type constraints of the form `S extends Bar`, where `Bar` refers to a reactor class or interface. The meaning of extending or implementing a reactor class will mean something slightly different from what this means in the target language -- even if it features object orientation (OO). 

# Interfaces
While initially being tempted to distinguish interfaces from implementations, in an effort to promote simplicity, we (at least for the moment) propose not to. Only in case reactions and their signatures would be part of an interface and thus should be declared (without supplying an implementation) would there be a material difference between an interface and its implementation. Making reactions and their causality interfaces part of the reactor could prove useful, but it introduces a number of complications:
 - ...

# Inheritance
 - A reactor can extend multiple base classes;
 - Reactions are inherited in the order of declaration; and
 - Equally-named ports and actions between subclass and superclass must also be equally typed.

## Example