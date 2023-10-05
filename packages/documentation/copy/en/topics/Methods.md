---
title: "Methods"
layout: docs
permalink: /docs/handbook/methods
oneline: "Methods in Lingua Franca."
preamble: >
---

## Method Declaration

<div class="lf-ts lf-rs">

The $target-language$ target does not currently support methods.

</div>

<div class="lf-cpp lf-c lf-py">

<div class="lf-cpp lf-c">

Sometimes logic needs to be shared between reactions. In this case, methods can be used to implement the shared logic, and these methods can then be called from reaction bodies. A method declaration has one of the forms:

```lf
  method <name>() {= ... =}
  method <name>():<type> {= ... =}
  method <name>(<argument_name>:<type>, ...) {= ... =}
  method <name>(<argument_name>:<type>, ...):<type> {= ... =}
```

The first form defines a method with no arguments and no return value. The second form defines a method with the return type `<type>` but no arguments. The third form defines a method with a comma-separated list of arguments given by their name and type, but without a return value. Finally, the fourth form is similar to the third, but adds a return type.

</div>

<div class="lf-py">

A method declaration has the forms:

```lf
  method <name>() {= ... =}
```

</div>

<div class="lf-cpp">

The $method$ keyword can optionally be prefixed with the $const$ qualifier, which indicates that the method has only read access to the reactor's state.

</div>

Methods are particularly useful in reactors that need to perform certain operations on state variables and/or parameters that are shared between reactions or that are too complex to be implemented in a single reaction. Analogous to class methods, methods in LF can access all state variables and parameters, and can be invoked from all reaction bodies or from other methods. Methods may also recursively invoke themselves. Consider the following example:

$start(Methods)$

```lf-c
target C
main reactor Methods {
  state foo: int = 2
  method getFoo(): int {=
    return self->foo;
  =}
  method add(x: int) {=
    self->foo += x;
  =}
  reaction(startup) {=
    lf_print("Foo is initialized to %d", getFoo());
    add(40);
    lf_print("2 + 40 = %d", getFoo());
  =}
}
```

```lf-cpp
target Cpp
main reactor Methods {
  state foo: int(2)
  const method getFoo(): int {=
    return foo;
  =}
  method add(x: int) {=
    foo += x;
  =}
  reaction(startup) {=
    std::cout << "Foo is initialized to " << getFoo() << '\n';
    add(40);
    std::cout << "2 + 40 = " << getFoo() << '\n';
  =}
}
```

```lf-py
target Python
main reactor Methods {
  state foo = 2
  method getFoo() {=
    return self.foo
  =}
  method add(x) {=
    self.foo += x
  =}
  reaction(startup) {=
    print(f"Foo is initialized to {self.getFoo()}.")
    self.add(40)
    print(f"2 + 40 = {self.getFoo()}.")
  =}
}
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Methods.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Methods.lf
```

$end(Methods)$

This reactor defines two methods `getFoo` and `add`.
<span class="lf-cpp">
`getFoo` is qualified as a const method, which indicates that it has read-only
access to the state variables. This is directly translated to a C++ const method
in the code generation process.
</span>
The `getFoo` method receives no arguments and returns an integer (`int`)
indicating the current value of the `foo` state variable. The `add` method
returns nothing
<span class="lf-cpp lf-c">
(`void`)
</span>
and receives one integer argument, which it uses to increment `foo`. Both
methods are visible in all reactions of the reactor. In this example, the
reaction to startup calls both methods in order to read and modify its state.

</div>
