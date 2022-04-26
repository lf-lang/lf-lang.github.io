---
title: "Parameters and State Variables"
layout: docs
permalink: /docs/handbook/parameters-and-state-variables
oneline: "Parameters and state variables in Lingua Franca."
preamble: >
---

$page-showing-target$

## Parameter Declaration

A reactor class definition can parameterized as follows:

<div class="lf-c lf-cpp lf-ts lf-rs">

```lf
reactor <class-name>(<param-name>:<type>(<expr>), ...) {
    ...
}
```

Each parameter has a _type annotation_, written `:<type>`, where `<type>` has one of the following forms:

- An identifier, such as `int`<span class="lf-cpp">, possibly followed by a type argument, e.g. `vector<int>`</span>.
- An array type `type[]`<span class="lf-c lf-cpp lf-rs"> and `type[integer]`</span>.
- The keyword $time$, which designates a time value.
- A code block delimitted by `{= ... =}`, where the contents is any valid type in the target language.

</div>

<div class="lf-c lf-cpp">

- A pointer type, such as `int*`.

</div>

<div class="lf-c">

Types ending with a `*` are treated specially by the C target. See the [Target Language Reference](/docs/handbook/target-language-reference).

To use strings conveniently in the C target, the "type" `string` is an alias for `{=const char*=}`.

</div>

<div class="lf-ts">

For example, `{= int | null =}` defines nullable integer type in TypeScript.

</div>

<div class="lf-py">

```lf
reactor <class-name>(<param-name>(<expr>), ... ) {
    ...
}
```

</div>

Each parameter must have a _default value_, written `(<expr>)`. An expression may be a numeric contant, a string enclosed in quotation marks, a time value such as `10 msec`, a list of values, or target-language code enclosed in `{= ... =}`, for example. See [Expressions](/docs/handbook/expressions) for full details on what expressions are valid.

For example, the `Double` reactor on the [previous page](/docs/handbook/inputs-and-outputs) can be replaced with a more general parameterized reactor `Scale` as follows:

$start(Scale)$

```lf-c
target C;
reactor Scale(factor:int(2)) {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        lf_set(y, x->value * self->factor);
    =}
}

```

```lf-cpp
target Cpp;

reactor Scale(factor:int(2)) {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        y.set(factor * *x.get());
    =}
}

```

```lf-py
target Python;
reactor Scale(factor(2)) {
    input x;
    output y;
    reaction(x) -> y {=
        y.set(x.value * self.factor)
    =}
}
```

```lf-ts
target TypeScript;
reactor Scale(factor:number(2)) {
    input x:number;
    output y:number;
    reaction(x) -> y {=
        if (x !== undefined) y = x * factor
    =}
}

```

```lf-rs
target Rust;
reactor Scale(factor:u32(2)) {
    state factor(factor);
    input x:u32;
    output y:u32;
    reaction(x) -> y {=
        let x = ctx.get(x).unwrap();
        ctx.set(y, x * self.factor);
    =}
}
```

$end(Scale)$

This reactor, given any input event `x` will produce an output `y` with value equal to the input scaled by the `factor` parameter. The default value of the `factor` parameter is 2, but this can be changed when the `Scale` reactor is instantiated.

Notice how, within the body of a reaction, the code accesses the parameter value. This is different for each target language. <span class="lf-c">In the C target, a `self` struct is provided that contains the parameter values.</span>

## State Declaration

A reactor declares a state variable as follows:

<div class="lf-c lf-cpp lf-ts lf-rs">

```lf
    state <name>:<type>(<value>);
```

The type can any of the same forms as for a parameter.

</div>

<div class="lf-py">

```lf
    state <name>(<value>);
```

</div>

The `<value>` is an initial value and, like parameter values, can be given as an [expression](/docs/handbook/expressions) or target language code with delimiters `{= ... =}`. The initial value can also be given as a parameter name. The value can be accessed and modified in a target-language-dependent way as illustrated by the following example:

$start(Count)$

```lf-c
target C;
reactor Count {
    state count:int(0);
    output y:int;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        lf_set(y, self->count++);
    =}
}

```

```lf-cpp
target Cpp;

reactor Count {
    state count:int(0);
    output y:int;
    timer t(0, 100ms);

    reaction(t) -> y {=
        y.set(count++);
    =}
}

```

```lf-py
target Python;
reactor Count {
    state count(0);
    output y;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y.set(self.count)
        self.count += 1
    =}
}

```

```lf-ts
WARNING: No source file found: ../code/ts/src/Count.lf
```

```lf-rs
target Rust;
reactor Count {
    state count:u32(0);
    output y:u32;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        ctx.set(y, self.count);
        self.count += 1;
    =}
}

```

$end(Count)$

This reactor has an integer state variable named `count`, and each time its reaction is invoked, it outputs the value of that state variable and increments it. The reaction is triggered by a $timer$, discussed in the next section.
