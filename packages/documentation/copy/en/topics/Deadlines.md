---
title: "Deadlines"
layout: docs
permalink: /docs/handbook/deadlines
oneline: "Deadlines in Lingua Franca."
preamble: >
---

## Deadlines

Lingua Franca includes a notion of a **deadline**, which is a relation between logical time and physical time. Specifically, a program may specify that the invocation of a reaction must occur within some physical-time interval of the logical timestamp of the message. If a reaction is invoked at logical time 12 noon, for example, and the reaction has a deadline of one hour, then the reaction is required to be invoked before the physical-time clock of the execution platform reaches 1 PM. If the deadline is violated, then the specified deadline handler is invoked instead of the reaction. For example (see [Deadline](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Deadline.lf)):

```
reactor Deadline() {
    input x:int;
    output d:int; // Produced if the deadline is violated.
    reaction(x) -> d {=
        printf("Normal reaction.\n");
    =} deadline(10 msec) {=
        printf("Deadline violation detected.\n");
        SET(d, x->value);
    =}
```

This reactor specifies a deadline of 10 milliseconds (this can be a parameter of the reactor). If the reaction to `x` is triggered later in physical time than 10 msec past the timestamp of `x`, then the second body of code is executed instead of the first. That second body of code has access to anything the first body of code has access to, including the input `x` and the output `d`. The output can be used to notify the rest of the system that a deadline violation occurred.

The amount of the deadline, of course, can be given by a parameter.

A sometimes useful pattern is when a container reactor reacts to deadline violations in a contained reactor. The [DeadlineHandledAbove](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DeadlineHandledAbove.lf) example illustrates this:

```
target C;
reactor Deadline() {
    input x:int;
    output deadline_violation:bool;
    reaction(x) -> deadline_violation {=
        ... normal code to execute ...
    =} deadline(100 msec) {=
        printf("Deadline violation detected.\n");
        SET(deadline_violation, true);
    =}
}
main reactor DeadlineHandledAbove {
    d = new Deadline();
    ...
    reaction(d.deadline_violation) {=
        ... handle the deadline violation ...
    =}
}
```
