---
title: "Logical Time and Microsteps"
layout: docs
permalink: /docs/handbook/logical-time-and-microsteps
oneline: "Tags, logical time, and microsteps in Lingua Franca."
preamble: >
---

## Tags, Logical Time, and Microsteps

In the sematics of Lingua Franca, a reaction is invoked at a **tag**, which consists of a **logical time** and a **microstep**. LF programs make a distinction between **logical time** and **physical time**. Physical time is time as measured by some physical clock on the execution platform, usually provided to the runtime system through an operating-system service. Logical time, in contrast, advances in a very controlled manner that makes building deterministic concurrent programs much easier. Logical time (together with the microstep) gives events a definitive order (or unambiguously makes them **simultaneous**). A reaction is always invoked at a well-defined tag, and neither the logical time nor the microstep advance during the execution of a reaction. As a consequence, if a reaction is triggered by an input event with tag _g_, and that reaction produces an output, then the output event will be **logically simultaneous** with the input. In other words, reactions are **logically instantaneous** (for an exception, see [Logical Execution Time](/docs/handbook/logical-execution-time)).

By default, when the program is run, logical time will advance at roughly the same rate as physical time. There are two exceptions. First, if your program specifies so much computation that the execution cannot keep up with physical time, then the **lag** (physical time minus logical time) will increase. Second, if you specify the **fast** option as a [target or command-line option](/docs/handbook/target-specification), then the program will execute as fast as possible and logical time advance much faster than physical time, making the **lag** negative.

For the above `Destination` reactor, at a particular tag, one of both of the inputs may be **present** or **absent**. If either is present, then the reaction will be invoked. If they are both present, then the input events are said to be **logically simultaneous**.
