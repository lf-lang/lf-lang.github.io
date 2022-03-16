---
title: "Composing Reactors"
layout: docs
permalink: /docs/handbook/composing-reactors
oneline: "Composing reactors in Lingua Franca."
preamble: >
---

$page-showing-target$

In this section, we will endow reactors with inputs and outputs, connect reactors, and build hierarchies of contained reactors.

## Input Declaration

An input declaration has the form:

> $input$ _name_[:_type_]{lf-c lf-cpp lf-ts lf-rs}

FIXME: No Gain reactor.
The `Gain` reactor given above provides an example. The _type_ is just like parameter types.

An input may have the modifier **mutable**, as follows:

> **mutable input** _name_:_type_

This is a directive to the code generator indicating that reactions that read this input will also modify the value of the input. Without this modifier, inputs are **immutable**; modifying them is disallowed. The precise mechanism for making use of mutable inputs is target-language specific. See, for example, the [C language target](writing-reactors-in-c#Sending-and-Receiving-Arrays-and-Structs).

An input port may have more than one **channel**. See [multiports documentation](Multiports-and-Banks-of-Reactors#multiports).

## Output Declaration

An output declaration has the form:

> **output** _name_:_type_;

The `Gain` reactor given above provides an example. The _type_ is just like parameter types.

An output port may have more than one **channel**. See [multiports documentation](Multiports-and-Banks-of-Reactors#multiports).

## Referring to Inputs and Outputs in Reactions

Recall that a reaction is defined within a reactor using the following syntax:

> **reaction**(_triggers_) _uses_ -> _effects_ {=<br/> > &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the C target.

In the body of a reaction in the C target, the value of an input is obtained using the syntax `name->value`, where `name` is the name of the input port. To determine whether an input is present, use `name->is_present`. For example, the [Determinism.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Determinism.lf) test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/C) includes the following reactor:

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

The reaction refers to the input values `x->value` and `y->value` and tests for their presence by referring to the variables `x->is_present` and `y->is_present`. If a reaction is triggered by just one input, then normally it is not necessary to test for its presence; it will always be present. But in the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:

```
    reaction(x) y {=
        int sum = x->value;
        if (y->is_present) {
            sum += y->value;
        }
        printf("Received %d.\n", sum);
    =}
```

It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Outputs are set using a `SET` macro. For example, we can further modify the above example as follows:

```
    output z:int;
    reaction(x) y -> z {=
        int sum = x->value;
        if (y->is_present) {
            sum += y->value;
        }
        SET(z, sum);
    =}
```

The `SET` macro is shorthand for this:

```
    z->value = sum;
    z->is_present = true;
```

There are several variants of the `SET` macro, and the one you should use depends on the type of the output. The simple version shown above works for all primitive C type (int, double, etc.) as well as the `bool` and `string` types that Lingua Franca defines. For the other variants, see [Sending and Receiving Arrays and Structs](#Sending-and-Receiving-Arrays-and-Structs) below.

If an output gets set more than once at any logical time, downstream reactors will see only the _final_ value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can check `name->is_present` to determine whether the output has been set. For example, the following reactor (see [TestForPreviousOutput.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/TestForPreviousOutput.lf)) will always produce the output 42:

```
reactor TestForPreviousOutput {
    output out:int;
    reaction(startup) -> out {=
        // Set a seed for random number generation based on the current time.
        srand(time(0));
        // Randomly produce an output or not.
        if (rand() % 2) {
            SET(out, 21);
        }
    =}
    reaction(startup) -> out {=
        if (out->is_present) {
            SET(out, 2 * out->value);
        } else {
            SET(out, 42);
        }
    =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42.

## Contained Reactors

Reactors can contain instances of other reactors defined in the same file or in an imported file. Assuming the above [Count reactor](#state-declaration) is stored in a file [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/lib/Count.lf), then [CountTest](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/CountTest.lf) is an example that imports and instantiates it to test the reactor:

```
target C;
import Count.lf;
reactor Test {
    input c:int;
    state i:int(0);
    reaction(c) {=
        printf("Received %d.\n", c->value);
        (self->i)++;
        if (c->value != self->i) {
            printf("ERROR: Expected %d but got %d\n.", self->i, c->value);
            exit(1);
        }
    =}
    reaction(shutdown) {=
        if (self->i != 4) {
            printf("ERROR: Test should have reacted 4 times, but reacted %d times.\n", self->i);
            exit(2);
        }
    =}
}

main reactor CountTest {
    count = new Count();
    test = new Test();
    count.out -> test.c;
}
```

An instance is created with the syntax:

> _instance_name_ = **new** _class_name_(_parameters_);

A bank with several instances can be created in one such statement, as explained in the [banks of reactors documentation](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The _parameters_ argument has the form:

> _parameter1_name_ = _parameter1_value_, _parameter2_name_ = _parameter2_value_, ...

Connections between ports are specified with the syntax:

> _output_port_ -> _input_port_

where the ports are either _instance_name.port_name_ or just _port_name_, where the latter form denotes a port belonging to the reactor that contains the instances.

### Physical Connections

A subtle and rarely used variant is a **physical connection**, denoted `~>`. In such a connection, the logical time at the recipient is derived from the local physical clock rather than being equal to the logical time at the sender. The physical time will always exceed the logical time of the sender, so this type of connection incurs a nondeterministic positive logical time delay. Physical connections are useful sometimes in [[Distributed-Execution]] in situations where the nondeterministic logical delay is tolerable. Such connections are more efficient because timestamps need not be transmitted and messages do not need to flow through through a centralized coordinator (if a centralized coordinator is being used).

### Connections with Delays

Connections may include a **logical delay** using the **after** keyword, as follows:

> _output_port_ -> _input_port_ **after** 10 **msec**

This means that the logical time of the message delivered to the _input_port_ will be 10 milliseconds larger than the logical time of the reaction that wrote to _output_port_. If the time value is greater than zero, then the event will appear at microstep 0. If it is equal to zero, then it will appear at the current microstep plus one.

When there are multiports or banks of reactors, several channels can be connected with a single connection statement. See [Multiports and Banks of Reactors](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The following example defines a reactor that adds a counting sequence to its input. It uses the above Count and Add reactors (see [Hierarchy2](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Hierarchy2.lf)):

```
import Count.lf;
import Add.lf;
reactor AddCount {
    input in:int;
    output out:int;
    count = new Count();
    add = new Add();
    in -> add.in1;
    count.out -> add.in2;
    add.out -> out;
}
```

A reactor that contains other reactors may, within a reaction, send data to the contained reactor. The following example illustrates this (see [SendingInside](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendingInside.lf)):

```
target C;
reactor Printer {
	input x:int;
	reaction(x) {=
		printf("Inside reactor received: %d\n", x->value);
	=}
}
main reactor SendingInside {
	p = new Printer();
	reaction(startup) -> p.x {=
		SET(p.x, 1);
	=}
}
```

Running this will print:

```
Inside reactor received: 1
```
