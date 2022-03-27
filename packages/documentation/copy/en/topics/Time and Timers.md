---
title: "Time and Timers"
layout: docs
permalink: /docs/handbook/time-and-timers
oneline: "Time and timers in Lingua Franca."
preamble: >
---

## Timers

A key property of Lingua Franca is **logical time**. All events occur at an instant in logical time. By default, the runtime system does its best to align logical time with **physical time**, which is some measurement of time on the execution platform. The **lag** is defined to be physical time minus logical time, and the goal of the runtime system is maintain a small non-negative lag.

The **lag** is allowed to go negative only if the [`fast` target property](/docs/handbook/target-specification#fast) or the [--fast](/docs/handbook/target-specification#command-line-arguments) is set to `true`. In that case, the program will execute as fast as possible with no regard to physical time.

The simplest use of logical time in Lingua Franca is to invoke a reaction periodically. This is done by first declaring a $timer$ using this syntax:

```lf
    timer** <name>(<offset>, <period>);
```

The `<period>`, which is optional, specifies the time interval between timer events. The `<offset>`, which is also optional, specifies the (logical) time interval between when the program starts executing and the first timer event occurs. If no period is given, then the timer event occurs only once. If neither an offset nor a period is specified, then the one timer event occurs at program start, simultaneous with the $startup$ event.

The period and offset are given by a number and a units, for example, `10 msec`. See the [expressions documentation](/docs/handbook/expressions#basic-expressions) for allowable units. Consider the following example:

$start(Timer)$

```lf-c
target C;
main reactor Timer {
    timer t(0, 1 sec);
    reaction(t) {=
        printf("Logical time is %lld.\n", get_logical_time());
    =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/Timer.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/Timer.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/Timer.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Timer.lf
```

$end(Timer)$

This specifies a timer named `t` that will first trigger at the start of execution and then repeatedly trigger at intervals of one second. Notice that the time units can only be left off if the value is zero. Each target provides a built-in function for retrieving the logical time at which the reaction is invoked. On most platforms (with the exception of some embedded platforms), the returned value is a 64-bit number representing the number of nanoseconds that have elapsed since January 1, 1970. Executing the above displays something like the following:

```
Logical time is 1648402121312985000.
Logical time is 1648402122312985000.
Logical time is 1648402123312985000.
...
```

The output lines appear at one second intervals unless the `fast` option has been specified.

The times above a bit hard to read, so, for convenience, each target provides a built-in function to retrieve the _elapsed_ time. For example:

$start(TimeElapsed)$

```lf-c
target C;
main reactor TimeElapsed {
    timer t(0, 1 sec);
    reaction(t) {=
        printf(
            "Elapsed logical time is %lld.\n",
            get_elapsed_logical_time()
        );
    =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/TimeElapsed.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/TimeElapsed.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/TimeElapsed.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/TimeElapsed.lf
```

$end(TimeElapsed)$

See the
<span class="lf-c">[C reactors documentation](/docs/handbook/c-reactors#timed-behavior)</span>
<span class="lf-cpp">[C++ reactors documentation](/docs/handbook/cpp-reactors#timed-behavior)</span>
<span class="lf-py">[Python reactors documentation](/docs/handbook/python-reactors#timed-behavior)</span>
<span class="lf-ts">[TypeScript reactors documentation](/docs/handbook/ts-reactors#timed-behavior)</span>
<span class="lf-rs">[Rust reactors documentation](/docs/handbook/rust-reactors#timed-behavior)</span>
for the full set of functions provided for accessing time values.

Executing this program will produce something like this:

```
Elapsed logical time is 0.
Elapsed logical time is 1000000000.
Elapsed logical time is 2000000000.
...
```

The following program compares logical ands physical time:

$start(TimeLag)$

```lf-c
target C;
main reactor TimeLag {
    timer t(0, 1 sec);
    reaction(t) {=
        interval_t t = get_elapsed_logical_time();
        interval_t T = get_elapsed_physical_time();
        printf(
            "Elapsed logical time: %lld, physical time: %lld, lag: %lld\n",
            t, T, T-t
        );
    =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/TimeLag.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/TimeLag.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/TimeLag.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/TimeLag.lf
```

$end(TimeLag)$

Execution will show something like this:

```
Elapsed logical time: 0, physical time: 855000, lag: 855000
Elapsed logical time: 1000000000, physical time: 1004714000, lag: 4714000
Elapsed logical time: 2000000000, physical time: 2004663000, lag: 4663000
Elapsed logical time: 3000000000, physical time: 3000210000, lag: 210000
...
```

In this case, the lag varies from a few hundred microseconds to a small number of milliseconds.

## FIXME

The times specified are logical times. Specifically, if two timers have the same _offset_ and _period_, then they are logically simultaneous. No observer will be able to see that one timer has triggered and the other has not. Even though these are logical times, the runtime system will make an effort to align those times to physical times. Such alignment can never be perfect, and its accuracy will depend on the execution platform.

Both arguments are optional, with both having default value zero. An _offset_ of zero or greater specifies the minimum time delay between the time at the start of execution and when the action is triggered. The _period_ is zero or greater, where a value of zero specifies that the reactions should be triggered exactly once,
whereas a value greater than zero specifies that they should be triggered repeatedly with the period given.

To cause a reaction to be invoked at the start of execution, a special **startup** trigger is provided:

```
reactor Foo {
    reaction(startup) {=
        ... perform initialization ...
    =}
}
```

The **startup** trigger is equivalent to a timer with no _offset_ or _period_.

## Superdense Time

In the sematics of Lingua Franca, a reaction is invoked at a **tag**, which consists of a **logical time** and a **microstep**. LF programs make a distinction between **logical time** and **physical time**. Physical time is time as measured by some physical clock on the execution platform, usually provided to the runtime system through an operating-system service. Logical time, in contrast, advances in a very controlled manner that makes building deterministic concurrent programs much easier. Logical time (together with the microstep) gives events a definitive order (or unambiguously makes them **simultaneous**). A reaction is always invoked at a well-defined tag, and neither the logical time nor the microstep advance during the execution of a reaction. As a consequence, if a reaction is triggered by an input event with tag _g_, and that reaction produces an output, then the output event will be **logically simultaneous** with the input. In other words, reactions are **logically instantaneous** (for an exception, see [Logical Execution Time](/docs/handbook/logical-execution-time)).

By default, when the program is run, logical time will advance at roughly the same rate as physical time. There are two exceptions. First, if your program specifies so much computation that the execution cannot keep up with physical time, then the **lag** (physical time minus logical time) will increase. Second, if you specify the **fast** option as a [target or command-line option](/docs/handbook/target-specification), then the program will execute as fast as possible and logical time advance much faster than physical time, making the **lag** negative.

For the above `Destination` reactor, at a particular tag, one of both of the inputs may be **present** or **absent**. If either is present, then the reaction will be invoked. If they are both present, then the input events are said to be **logically simultaneous**.

**NOTE:** if a reaction fails to test for the presence of an input and reads its value anyway, then the result it will get is undefined and may be target dependent. In the C target, as of this writing, the value read will be the most recently seen input value, or, if no input event has occurred at an earlier logical time, then zero or NULL, depending on the datatype of the input. In the TS target, the value will be **undefined**, a legitimate value in TypeScript.

All target languages provide the same basic set of mechanisms. These mechanisms include:

- Obtaining the current logical time (logical time does not advance during the execution of a reaction, so the execution of a reaction is logically instantaneous).
- Determining whether inputs are present at the current logical time and reading their value if they are. If a reaction is triggered by exactly one input, then that input will always be present. But if there are multiple triggers, or if the input is specified in the _uses_ field, then the input may not be present when the reaction is invoked.
- Setting output values. Reactions in a reactor may set an output value more than once at any instant of logical time, but only the last of the values set will be sent on the output port.
- Scheduling future actions.
