---
title: "Time and Timers"
layout: docs
permalink: /docs/handbook/time-and-timers
oneline: "Time and timers in Lingua Franca."
preamble: >
---

$page-showing-target$

## Timers

A key property of Lingua Franca is **logical time**. All events occur at an instant in logical time. By default, the runtime system does its best to align logical time with **physical time**, which is some measurement of time on the execution platform. The **lag** is defined to be physical time minus logical time, and the goal of the runtime system is maintain a small non-negative lag.

The **lag** is allowed to go negative only if the [`fast` target property](/docs/handbook/target-specification#fast) or the [--fast](/docs/handbook/target-specification#command-line-arguments) is set to `true`. In that case, the program will execute as fast as possible with no regard to physical time.

The simplest use of logical time in Lingua Franca is to invoke a reaction periodically. This is done by first declaring a $timer$ using this syntax:

```lf
    timer <name>(<offset>, <period>);
```

The `<period>`, which is optional, specifies the time interval between timer events. The `<offset>`, which is also optional, specifies the (logical) time interval between when the program starts executing and the first timer event. If no period is given, then the timer event occurs only once. If neither an offset nor a period is specified, then one timer event occurs at program start, simultaneous with the $startup$ event.

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

This specifies a timer named `t` that will first trigger at the start of execution and then repeatedly trigger at intervals of one second. Notice that the time units can be left off if the value is zero.

Each target provides a built-in function for retrieving the logical time at which the reaction is invoked,
<span class="lf-c">`get_logical_time()`</span>
<span class="lf-cpp warning">FIXME</span>
<span class="lf-py warning">FIXME</span>
<span class="lf-ts warning">FIXME</span>
<span class="lf-rs warning">FIXME</span>.
On most platforms (with the exception of some embedded platforms), the returned value is a 64-bit number representing the number of nanoseconds that have elapsed since January 1, 1970. Executing the above displays something like the following:

```
Logical time is 1648402121312985000.
Logical time is 1648402122312985000.
Logical time is 1648402123312985000.
...
```

The output lines appear at one second intervals unless the `fast` option has been specified.

## Elapsed Time

The times above are a bit hard to read, so, for convenience, each target provides a built-in function to retrieve the _elapsed_ time. For example:

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

## Comparing Logical and Physical Times

The following program compares logical and physical times:

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

In this case, the lag varies from a few hundred microseconds to a small number of milliseconds. The amount of lag will depend on the execution platform.

## Simultaneity and Instantaneity

If two timers have the same _offset_ and _period_, then their events are logically simultaneous. No observer will be able to see that one timer has triggered and the other has not.

A reaction is always invoked at a well-defined logical time, and logical time does not advance during its execution. Any output produced by the reaction will be **logically simultaneous** with the input. In other words, reactions are **logically instantaneous** (for an exception, see [Logical Execution Time](/docs/handbook/logical-execution-time)). Physical time, however, does elapse during execution of a reaction.

## Timeout

By default, a Lingua Franca program will terminate when there are no more events to process. If there is a timer with a non-zero period, then there will always be more events to process, so the default execution will be unbounded. To specify a finite execution horizon, you can either specify a [`timeout` target property](/docs/handbook/target-specification#timeout) or a [`--timeout command-line option](ocs/handbook/target-specification#command-line-arguments). For example, the following `timeout` property will cause the above timer with a period of one second to terminate after 11 events:

```lf-c
target C {
    timeout: 10 sec
}
```

```lf-cpp
target Cpp {
    timeout: 10 sec
}
```

```lf-py
target Python {
    timeout: 10 sec
}
```

```lf-ts
target TypeScript {
    timeout: 10 sec
}
```

```lf-rs
target Rust {
    timeout: 10 sec
}
```

## Startup and Shutdown

To cause a reaction to be invoked at the start of execution, a special **startup** trigger is provided:

```lf
reactor Foo {
    reaction(startup) {=
        ... perform initialization ...
    =}
}
```

The **startup** trigger is equivalent to a timer with no _offset_ or _period_.

To cause a reaction to be invoked at the end of execution, a special **shutdown** trigger is provided. Consider the following reactor, commonly used to build regression tests:

$start(TestCount)$

```lf-c
target C;
reactor TestCount(start:int(0), stride:int(1), num_inputs:int(1)) {
    state count:int(start);
    state inputs_received:int(0);
    input x:int;
    reaction(x) {=
        printf("Received %d.\n", x->value);
        if (x->value != self->count) {
            printf("ERROR: Expected %d.\n", self->count);
            exit(1);
        }
        self->count += self->stride;
        self->inputs_received++;
    =}
    reaction(shutdown) {=
        printf("Shutdown invoked.\n");
        if (self->inputs_received != self->num_inputs) {
            printf("ERROR: Expected to receive %d inputs, but got %d.\n",
                self->num_inputs,
                self->inputs_received
            );
            exit(2);
        }
    =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/TestCount.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/TestCount.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/TestCount.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/TestCount.lf
```

$end(TestCount)$

This reactor tests its inputs against expected values, which are expected to start with the value given by the `start` parameter and increase by `stride` with each successive input. It expects to receive a total of `num_inputs` input events. It checks the total number of inputs received in its $shutdown$ reaction.

The **shutdown** trigger typically occurs at [microstep](/docs/handbook/actions#superdense-time) 0, but may occur at a larger microstep. See [Superdense Time](/docs/handbook/actions#superdense-time) and [Termination](/docs/handbook/termination).
