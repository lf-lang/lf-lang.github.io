---
title: "Time and Timers"
layout: docs
permalink: /docs/handbook/time-and-timers
oneline: "Time and timers in Lingua Franca."
preamble: >
---

$page-showing-target$

## Logical Time

A key property of Lingua Franca is **logical time**. All events occur at an instant in logical time. By default, the runtime system does its best to align logical time with **physical time**, which is some measurement of time on the execution platform. The **lag** is defined to be physical time minus logical time, and the goal of the runtime system is maintain a small non-negative lag.

The **lag** is allowed to go negative only if the [`fast` target property](/docs/handbook/target-declaration#fast) or the [--fast](/docs/handbook/target-declaration#command-line-arguments) is set to `true`. In that case, the program will execute as fast as possible with no regard to physical time.

<div class="lf-c lf-cpp lf-rs">

In Lingua Franca, $time$ is a data type.
A parameter, state variable, port, or action may have type $time$.
<span class="lf-c">In the C target, time values internally have type `instant_t` or `interval_t`,
both of which are (usually) equivalent to the C type `long long`.</span>
<span class="lf-cpp">In the Cpp target, time values internally have the type `std::chrono::nanoseconds`. For details, see the [Target Language Reference](/docs/handbook/target-language-reference).</span>
<span class="lf-rs warning">In the Rust target, time values internally have type FIXME.</span>

</div>

## Time Values

A time value is given with units (unless the value is 0, in which case the units can be omitted).
The allowable units are:

- For nanoseconds: `ns`, `nsec`, or `nsecs`
- For microseconds: `us`, `usec`, or `usecs`
- For milliseconds: `ms`, `msec`, or `msecs`
- For seconds: `s`, `sec`, `secs`, `second`, or `seconds`
- For minutes: `min`, `minute`, `mins`, or `minutes`
- For hours: `h`, `hour`, or `hours`
- For days: `d`, `day`, or `days`
- For weeks: `week` or `weeks`

The following example illustrates using time values for parameters and state variables:

$start(SlowingClock)$

```lf-c
target C;
main reactor SlowingClock(start:time(100 msec), incr:time(100 msec)) {
    state interval:time(start);
    logical action a;
    reaction(startup) -> a {=
        lf_schedule(a, self->start);
    =}
    reaction(a) -> a {=
        instant_t elapsed_logical_time = get_elapsed_logical_time();
        printf("Logical time since start: \%lld nsec.\n",
            elapsed_logical_time
        );
        self->interval += self->incr;
        lf_schedule(a, self->interval);
    =}
}

```

```lf-cpp
target Cpp;

main reactor SlowingClock(start:time(100 msec), incr:time(100 msec)) {
    state interval:time(start);
    logical action a;
    reaction(startup) -> a {=
        a.schedule(start);
    =}

    reaction(a) -> a {=
        auto elapsed_logical_time = get_elapsed_logical_time();
        std::cout << "Logical time since start: " << elapsed_logical_time << " nsec" << std::endl;
        interval += incr;
        a.schedule(interval);
    =}
}

```

```lf-py
target Python;
main reactor SlowingClock(start(100 msec), incr(100 msec)) {
    state interval(start);
    logical action a;
    reaction(startup) -> a {=
        a.schedule(self.start)
    =}
    reaction(a) -> a {=
        elapsed_logical_time = get_elapsed_logical_time()
        print(
            f"Logical time since start: {elapsed_logical_time} nsec."
        )
        self.interval += self.incr
        a.schedule(self.interval)
    =}
}

```

```lf-ts
target TypeScript
main reactor SlowingClock(start:time(100 msec), incr:time(100 msec)) {
    state interval:time(start)
    logical action a
    reaction(startup) -> a {=
        actions.a.schedule(start, null);
    =}
    reaction(a) -> a {=
        console.log(`Logical time since start: ${util.getElapsedLogicalTime()}`)
        interval = interval.add(incr)
        actions.a.schedule(interval, null)
    =}
}

```

```lf-rs
target Rust;
main reactor SlowingClock(start:time(100 msec), incr:time(100 msec)) {
    state start(start);
    state incr(incr);
    state interval:time(start);
    state expected_time:time();
    logical action a;
    reaction(startup) -> a {=
        ctx.schedule(a, After(self.start));
    =}
    reaction(a) -> a {=
        println!(
            "Logical time since start: {} nsec.",
            ctx.get_elapsed_logical_time().as_nanos(),
        );
        self.interval += self.incr;
        ctx.schedule(a, After(self.interval));
        self.expected_time += self.interval;
    =}
}

```

$end(SlowingClock)$

This has two time parameters, `start` and `incr`, each with default value `100 msec` <span class="lf-c lf-cpp lf-rs">and type $time$</span>. This parameter is used to initialize the `interval` state variable, which also stores a time. The $logical$ $action$ `a`, explained [below](/docs/handbook/actions#logical-actions), is used to schedule events to occur at time `start` after program startup and then at intervals that are increased each time by `incr`. The result of executing this program will look like this:

```
Logical time since start: 100000000 nsec.
Logical time since start: 300000000 nsec.
Logical time since start: 600000000 nsec.
Logical time since start: 1000000000 nsec.
...
```

## Timers

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
target Cpp;

main reactor Timer {
    timer t(0, 1s);

    reaction(t) {=
        std::cout << "Logical time is: " << get_logical_time() << std::endl;
    =}
}

```

```lf-py
target Python;
main reactor Timer {
    timer t(0, 1 sec);
    reaction(t) {=
        print(f"Logical time is {get_logical_time()}.")
    =}
}
```

```lf-ts
target TypeScript
main reactor Timer {
    timer t(0, 1 sec)
    reaction(t) {=
        console.log(`Logical time is ${util.getCurrentLogicalTime()}.`)
    =}
}

```

```lf-rs
target Rust;
main reactor Timer {
    timer t(0, 1 sec);
    reaction(t) {=
        println!(
            "Logical time is {}.",
            ctx.get_elapsed_logical_time().as_nanos(),
        );
    =}
}
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
target Cpp;

main reactor TimeElapsed {
    timer t(0, 1s);

    reaction(t) {=
        std::cout << "Elapsed logical time is " << get_elapsed_logical_time() << std::endl;
    =}
}

```

```lf-py
target Python;
main reactor TimeElapsed {
    timer t(0, 1 sec);
    reaction(t) {=
        print(
            f"Elapsed logical time is {get_elapsed_logical_time()}."
        )
    =}
}
```

```lf-ts
target TypeScript
main reactor TimeElapsed {
    timer t(0, 1 sec)
    reaction(t) {=
        console.log(`Elapsed logical time is ${util.getElapsedLogicalTime()}`)
    =}
}

```

```lf-rs
target Rust;
main reactor TimeElapsed {
    timer t(0, 1 sec);
    reaction(t) {=
        println!(
            "Elapsed logical time is {}.",
            ctx.get_elapsed_logical_time().as_nanos(),
        );
    =}
}
```

$end(TimeElapsed)$

See the [Target Language Reference](/docs/handbook/target-language-reference) for the full set of functions provided for accessing time values.

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
target Cpp;

main reactor TimeLag {
    timer t(0, 1s);
    reaction(t) {=
        auto logical_time = get_elapsed_logical_time();
        auto physical_time = get_elapsed_physical_time();
        std::cout << "Elapsed logical time: " << logical_time 
            << " physical time: " << physical_time 
            << " lag: " << physical_time - logical_time <<  std::endl;
    =}
}

```

```lf-py
target Python;
main reactor TimeLag {
    timer t(0, 1 sec);
    reaction(t) {=
        t = get_elapsed_logical_time()
        T = get_elapsed_physical_time()
        print(
            f"Elapsed logical time: {t}, physical time: {T}, lag: {T-t}"
        )
    =}
}
```

```lf-ts
target TypeScript
main reactor TimeLag {
    timer t(0, 1 sec)
    reaction(t) {=
        const t = util.getElapsedLogicalTime()
        const T = util.getElapsedPhysicalTime()
        console.log(`Elapsed logical time: ${t}, physical time: ${T}, lag: ${T.subtract(t)}`)
    =}
}

```

```lf-rs
target Rust;
main reactor TimeLag {
    timer t(0, 1 sec);
    reaction(t) {=
        let t = ctx.get_elapsed_logical_time();
        let T = ctx.get_elapsed_physical_time();
        println!(
            "Elapsed logical time: {}, physical time: {}, lag: {}",
            t.as_nanos(),
            T.as_nanos(),
            (T-t).as_nanos(),
        );
    =}
}
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

By default, a Lingua Franca program will terminate when there are no more events to process. If there is a timer with a non-zero period, then there will always be more events to process, so the default execution will be unbounded. To specify a finite execution horizon, you can either specify a [`timeout` target property](/docs/handbook/target-declaration#timeout) or a [`--timeout command-line option](ocs/handbook/target-declaration#command-line-arguments). For example, the following `timeout` property will cause the above timer with a period of one second to terminate after 11 events:

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
target Cpp;

reactor TestCount(start:int(0), stride:int(1), num_inputs:int(1)) {
    state count:int(start);
    state inputs_received:int(0);
    input x:int;

    reaction(x) {=
        auto value = *x.get();
        std::cout << "Received " <<  value << std::endl;
        if (value != count) {
            std::cerr << "ERROR: Expected: "<< count << std::endl;
            exit(1);
        }
        count += stride;
        inputs_received++;
    =}

    reaction(shutdown) {=
        std::cout << "Shutdown invoked." << std::endl;
        if (inputs_received != num_inputs) {
            std::cerr << "ERROR: Expected to receive " << num_inputs 
                << " inputs, but got " << inputs_received << std::endl;
            exit(2);
        }
    =}
}

```

```lf-py
target Python;
reactor TestCount(start(0), stride(1), num_inputs(1)) {
    state count(start);
    state inputs_received(0);
    input x;
    reaction(x) {=
        print(f"Received {x.value}.")
        if x.value != self.count:
            sys.stderr.write(f"ERROR: Expected {self.count}.\n")
            exit(1)
        self.count += self.stride
        self.inputs_received += 1
    =}
    reaction(shutdown) {=
        print("Shutdown invoked.")
        if self.inputs_received != self.num_inputs:
            sys.stderr.write(
                f"ERROR: Expected to receive {self.num_inputs} inputs, but got {self.inputs_received}.\n"
            )
            exit(2)
    =}
}
```

```lf-ts
target TypeScript
reactor TestCount(start:number(0), stride:number(1), numInputs:number(1)) {
    state count:number(start)
    state inputsReceived:number(0)
    input x:number
    reaction(x) {=
        console.log(`Received ${x}`)
        if (x != count) {
            console.error(`ERROR: Expected ${count}.`)
            process.exit(1)
        }
        count += stride;
        inputsReceived++
    =}
    reaction(shutdown) {=
        console.log("Shutdown invoked.")
        if (inputsReceived != numInputs) {
            console.error(`ERROR: Expected to receive ${numInputs}, but got ${inputsReceived}.`)
            process.exit(2)
        }
    =}
}

```

```lf-rs
target Rust;
reactor TestCount(start:u32(0), stride:u32(1), num_inputs:u32(1)) {
    state stride(stride);
    state num_inputs(num_inputs);
    state count:u32(start);
    state inputs_received:u32(0);
    input x:u32;
    reaction(x) {=
        let x = ctx.get(x).unwrap();
        println!("Received {}.", x);
        if x != self.count {
            println!("ERROR: Expected {}.", self.count);
            std::process::exit(1);
        }
        self.count += self.stride;
        self.inputs_received += 1;
    =}
    reaction(shutdown) {=
        println!("Shutdown invoked.");
        if self.inputs_received != self.num_inputs {
            println!(
                "ERROR: Expected to receive {} inputs, but got {}.",
                self.num_inputs,
                self.inputs_received
            );
            std::process::exit(2);
        }
    =}
}
```

$end(TestCount)$

This reactor tests its inputs against expected values, which are expected to start with the value given by the `start` parameter and increase by `stride` with each successive input. It expects to receive a total of `num_inputs` input events. It checks the total number of inputs received in its $shutdown$ reaction.

The **shutdown** trigger typically occurs at [microstep](/docs/handbook/actions#superdense-time) 0, but may occur at a larger microstep. See [Superdense Time](/docs/handbook/actions#superdense-time) and [Termination](/docs/handbook/termination).
