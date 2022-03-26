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
target C;
reactor Double {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        SET(y, x->value * 2);
    =}
}
```

```lf-py
WARNING: No source file found: ../code/py/src/Double.lf

```

```lf-ts
WARNING: No source file found: ../code/ts/src/Double.lf

```

```lf-rs
WARNING: No source file found: ../code/rs/src/Double.lf

```

$end(Double)$

Notice how the input value is accessed and how the output value is set. This is done differently for each target language. See
<span class="lf-c">[C Reactors](/docs/handbook/c-reactors)</span>
<span class="lf-cpp">[C++ Reactors](/docs/handbook/cpp-reactors)</span>
<span class="lf-py">[Python Reactors](/docs/handbook/python-reactors)</span>
<span class="lf-ts">[TypeScriupt Reactors](/docs/handbook/typescript-reactors)</span>
<span class="lf-rs">[Rust Reactors](/docs/handbook/rust-reactors)</span>
for detailed documentation of these mechanisms.

<div class="lf-c lf-cpp lf-ts lf-rs">

The **type** of a port is a type in the target language plus the special type $time$. A type may also be specified using a **code block**, delimited by the same delimeters `{= ... =}` that separate target language code from Lingua Franca code in reactions. Any valid target-language type designator can be given within these delimiters. See [Lingua Franca Types](/docs/handbook/lingua-franca-types) for details.

</div>

## Triggers, Effects, and Uses

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
WARNING: No source file found: ../code/cpp/src/Destination.lf

```

```lf-py
WARNING: No source file found: ../code/py/src/Destination.lf

```

```lf-ts
WARNING: No source file found: ../code/ts/src/Destination.lf

```

```lf-rs
WARNING: No source file found: ../code/rs/src/Destination.lf

```

$end(Destination)$

## Reactions

The general form a $reaction$ is

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
