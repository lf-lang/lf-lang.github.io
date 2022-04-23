---
title: "Inputs and Outputs"
layout: docs
permalink: /docs/handbook/inputs-and-outputs
oneline: "Inputs, outputs, and reactions in Lingua Franca."
preamble: >
---

$page-showing-target$

In this section, we will endow reactors with inputs and outputs.

## Input and Output Declarations

Input and output declarations have the form:

<div class="lf-c lf-ts lf-rs lf-cpp">

```lf
    input <name>:<type>
    output <name>:<type>
```

</div>
<div class="lf-py">

```lf
    input <name>
    output <name>
```

</div>

For example, the following reactor doubles its input and sends the result to the output:

$start(Double)$

```lf-c
target C;
reactor Double {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        SET(y, x->value * 2);
    =}
}
```

```lf-cpp
target Cpp;

reactor Double {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        if (x.is_present()){
            y.set(*x.get() * 2);
        }
    =}
}


```

```lf-py
target Python;
reactor Double {
    input x;
    output y;
    reaction(x) -> y {=
        y.set(x.value * 2)
    =}
}
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Double.lf

```

```lf-rs
target Rust;
reactor Double {
    input x:u32;
    output y:u32;
    reaction(x) -> y {=
        ctx.set(y, ctx.get(x).unwrap() * 2);
    =}
}
```

$end(Double)$

Notice how the input value is accessed and how the output value is set. This is done differently for each target language. See the [Target Language Reference](/docs/handbook/target-language-reference) for detailed documentation of these mechanisms.
Setting an output within a reaction will trigger downstream reactions at the same [Logical Time](/docs/handbook/time-and-timers#logical-time) that the reaction is invoked (or, more precisely, at the same [tag](/docs/handbook/superdense-time#tag-vs-time)). If a particular output port is set more than once at any tag, the last set value will be the one that downstream reactions see. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

<div class="lf-c lf-cpp lf-ts lf-rs">

The **type** of a port is a type in the target language plus the special type $time$. A type may also be specified using a **code block**, delimited by the same delimeters `{= ... =}` that separate target language code from Lingua Franca code in reactions. Any valid target-language type designator can be given within these delimiters. See [Lingua Franca Types](/docs/handbook/lingua-franca-types) for details.

</div>

The $reaction$ declaration above indicates that an input event on port `x` is a **trigger** and that an output event on port `y` is a (potential) **effect**. A reaction can declare more than one trigger or effect by just listing them separated by commas. For example, the following reactor has two triggers and tests each input for presence before using it:

$start(Destination)$

```lf-c
target C;
reactor Destination {
    input x:int;
    input y:int;
    reaction(x, y) {=
        int sum = 0;
        if (x->is_present) {
            sum += x->value;
        }
        if (y->is_present) {
            sum += y->value;
        }
        printf("Received %d.\n", sum);
    =}
}
```

```lf-cpp
target Cpp;

reactor Destination {
    input x:int;
    input y:int;
    reaction(x, y) {=
        int sum = 0;
        if (x.is_present()) {
            sum += *x.get();
        }
        if (y.is_present()) {
            sum += *y.get();
        }

        std::cout << "Received: " << sum << std::endl; 
    =}
}

```

```lf-py
target Python;
reactor Destination {
    input x;
    input y;
    reaction(x, y) {=
        sum = 0
        if x.is_present:
            sum += x.value
        if y.is_present:
            sum += y.value
        print(f"Received {sum}")
    =}
}
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Destination.lf

```

```lf-rs
target Rust;
reactor Destination {
    input x:u32;
    input y:u32;
    reaction(x, y) {=
        let mut sum = 0;
        if let Some(x) = ctx.get(x) {
            sum += x;
        }
        if let Some(y) = ctx.get(y) {
            sum += y;
        }
        println!("Received {}.", sum);
    =}
}
```

$end(Destination)$

**NOTE:** if a reaction fails to test for the presence of an input and reads its value anyway, then the result it will get is target dependent.
<span class="lf-c">In the C target, the value read will be the most recently seen input value, or, if no input event has occurred at an earlier logical time, then zero or NULL, depending on the datatype of the input.</span>
<span class="lf-cpp">In the C++ target, a smart pointer is returned for present values and `nullptr` if the value is not present.
<span class="lf-py warning">FIXME.</span>
<span class="lf-ts">In the TS target, the value will be **undefined**, a legitimate value in TypeScript.</span>
<span class="lf-rs warning">FIXME.</span>

## Triggers, Effects, and Uses

The general form of a $reaction$ is

```lf
reaction (<triggers>) <uses> -> <effects> {=
    <target language code>
=}
```

The **triggers** field can be a comma-separated list of input ports, [output ports of contained reactors](/docs/handbook/hierarchy), [timers, actions](/docs/handbook/timers-and-actions), or the special events $startup$ and $shutdown$. There must be at least one trigger for each reaction. A reaction with a $startup$ trigger is invoked when the program begins executing, and a reaction with a $shutdown$ trigger is invoked at the end of execution.

The **uses** field, which is optional, specifies input ports (or [output ports of contained reactors](/docs/handbook/hierarchy)) that do not trigger execution of the reaction but may be read by the reaction.

The **effects** field, which is also optional, is a comma-separated lists of output ports ports, [input ports of contained reactors](/docs/handbook/hierarchy), or [actions](/docs/handbook/timers-and-actions).

## Mutable Inputs

Normally, a reaction does not modify the value of an input. An input is said to be **immutable**. The degree to which this is enforced varies by target language. Most of the target languages make it rather difficult to enforce, so the programmer needs to avoid modifying the input. Modifying an input value may lead to nondeterministic results.

Occassionally, it is useful to modify an input. For example, the input may be a large data structure, and a reaction may wish to make a small modification and forward the result to an output. To accomplish this, the programmer should declare the input **mutable** as follows:

<div class="lf-c lf-cpp lf-ts lf-rs>

```lf
    mutable input <name>:<type>;
```

</div>

<div class="lf-py>

```lf
    mutable input <name>;
```

</div>

This is a directive to the code generator indicating that reactions that read this input may also modify the value of the input. The code generator will attempt to optimize the scheduling to avoid copying the input value, but this may not be possible, in which case it will automatically insert a copy operation, making it safe to modify the input. The target-spefic reference documentation has more details about how this works.
