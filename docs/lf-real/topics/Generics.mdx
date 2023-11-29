---
title: "Generic Reactors"
layout: docs
permalink: /docs/handbook/generics
oneline: "Defining generic reactors in Lingua Franca."
preamble: >
---

<div class="lf-rs lf-py lf-ts">

**Generic reactors are not supported in $target-language$.**

</div>

<div class="lf-cpp lf-c">

$page-showing-target$

## Generic Reactors

Sometimes it is useful to implement a generic pattern without knowing the concrete types used. For instance, it could be useful to implement a delay reactor that forwards all values it receives with a fixed delay, regardless of their datatype. For this pattern, it is not required to know the concrete type in advance, and we would like to reuse the same logic for different types. This can be achieved with generic reactors in LF. Consider the following example:

$start(GenericDelay)$

```lf-c
target C
reactor Delay<T>(delay: time = 0) {
  input in: T
  output out: T
  logical action a(delay): T
  reaction(a) -> out {= lf_set(out, a->value); =}
  reaction(in) -> a {= lf_schedule_copy(a, self->delay, &in->value, 1); =}
}
main reactor {
  d = new Delay<int>(delay = 100 ms)
  reaction(startup) -> d.in {= lf_set(d.in, 42); =}
  reaction(d.out) {=
    printf("Received %d at time %lld.\n", d.out->value, lf_time_logical_elapsed());
  =}
}
```

```lf-cpp
target Cpp
reactor Delay<T>(delay: time = 0) {
  input in: T
  output out: T
  logical action a(delay): T
  reaction(a) -> out {= out.set(a.get()); =}
  reaction(in) -> a {= a.schedule(in.get(), delay); =}
}
main reactor {
  d = new Delay<int>(delay = 100 ms)
  reaction(startup) -> d.in {= d.in.set(42); =}
  reaction(d.out) {=
    std::cout << "received " << *d.out.get() << " at time "
        << get_elapsed_logical_time() << std::endl;
  =}
}
```

```lf-py
WARNING: No source file found: ../code/py/src/GenericDelay.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/GenericDelay.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/GenericDelay.lf
```

$end(GenericDelay)$

The example above defines a generic reactor `Delay` which has a type parameter named `T`. Its input, output and logical action are all of type `T`. The logic implemented in the reactions is straightforward. The reaction to `in` schedules the logical action `a` with the configured delay and the received value. The reaction to `a` simply forwards this value to the output port at a later tag. The concrete type `T`, however, is not relevant for this implementation and will be filled in only when the reactor is instantiated. In our example, the main reactor instantiates `Delay`, specifying `int` as the type to be assigned to `T`. As a consequence, we can set an integer on `d`'s input port and receive an integer on its output. If we wanted instead to delay a string, we can do this as follows:

$start(GenericString)$

```lf-c
target C
import Delay from "GenericDelay.lf"
main reactor {
  d = new Delay<string>(delay = 100 ms)
  reaction(startup) -> d.in {=
    lf_set(d.in, "foo");
  =}
  reaction(d.out) {=
    printf("Received %s at time %lld.\n", d.out->value, lf_time_logical_elapsed());
  =}
}
```

```lf-cpp
target Cpp
import Delay from "GenericDelay.lf"
main reactor {
  d = new Delay<{= std::string =}>(delay = 100 ms)
  reaction(startup) -> d.in {=
    d.in.set("foo");
  =}
  reaction(d.out) {=
    std::cout << "received " << *d.out.get() << " at time "
        << get_elapsed_logical_time() << std::endl;
  =}
}
```

```lf-py
WARNING: No source file found: ../code/py/src/GenericString.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/GenericString.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/GenericString.lf
```

$end(GenericString)$

Reactor definitions may also specify multiple type parameters. Moreover, type parameters are not limited to ports and actions, but can also be used in state variables, parameters, or methods. For instance, we can define the following reactor:

```lf
reactor Generic<T, U, V>(bar: T) {
  state baz: U

  input in: V

  method (x: T, y: U): V {= /* ... */ =}
}
```

This reactor could be instantiated for example like this:

```lf
g = new Generic<float, int, bool>()
```

</div>
