---
title: "Actions"
layout: docs
permalink: /docs/handbook/actions
oneline: "Actions in Lingua Franca."
preamble: >
---

### Action Declaration

An **action**, like an input, can cause reactions to be invoked. Whereas inputs are provided by other reactors, actions are scheduled by this reactor itself, either in response to some observed external event or as a delayed response to some input event. The action can be scheduled by a reactor by invoking a [**schedule** function](#scheduling-future-reactions) in a reaction or in an asynchronous callback function.

An action declaration is either physical or logical:

> **physical action** _name_(_min_delay_, _min_spacing_, _policy_):_type_;<br> > **logical action** _name_(_min_delay_, _min_spacing_, _policy_):_type_;<br>

The _min_delay_, _min_spacing_, and _policy_ are all optional. If only one argument is given in parentheses, then it is interpreted as an _min_delay_, if two are given, then they are interpreted as _min_delay_ and _min_spacing_, etc. The _min_delay_ and _min_spacing_ have to be a time value. The _policy_ argument is a string that can be one of the following: `'defer'` (default), `'drop'`, or `'replace'`.

An action will trigger at a logical time that depends on the arguments given to the schedule function, the _min_delay_, _min_spacing_, and _policy_ arguments above, and whether the action is physical or logical.

If the **logical** keyword is given, then the tag assigned to the event resulting from a call to [**schedule** function](#scheduling-future-reactions) is computed as follows. First, let _t_ be the _current logical time_. For a logical action, the `schedule` function must be invoked from within a reaction (synchronously), so _t_ is just the logical time of that reaction.

The (preliminary) tag of the action is then just _t_ plus _min_delay_ plus the _offset_ argument to [**schedule** function](#scheduling-future-reactions).

If the **physical** keyword is given, then the physical clock on the local platform is used as the timestamp assigned to the action. Moreover, for a physical action, unlike a logical action, the `schedule` function can be invoked from outside of any reaction (asynchronously), e.g. from an interrupt service routine or callback function.

If a _min_spacing_ has been declared, then a minimum distance between the tags of two subsequently scheduled events on the same action is enforced. If the preliminary tag is closer to the tag of the previously scheduled event (if there is one), then _policy_ determines how the given constraints is enforced.

- `'drop'`: the new event is dropped and `schedule` returns without having modified the event queue.
- `'replace'`: the payload of the new event is assigned to the preceding event if it is still pending in the event queue; no new event is added to the event queue in this case. If the preceding event has already been pulled from the event queue, the default `'defer'` policy is applied.
- `'defer'`: the event is added to the event queue with a tag that is equal to earliest time that satisfies the minimal spacing requirement. Assuming the tag of the preceding event is _t_prev_, then the tag of the new event simply becomes _t_prev_ + _min_spacing_.

Note that while the `'defer'` policy is conservative in the sense that it does not discard events, it could potentially cause an unbounded growth of the event queue.

In all cases, the logical time of a new event will always be strictly greater than the logical time at which it is scheduled by at least one microstep (see the [Time](#Time) section).

The default _min_delay_ is zero. The default _min_spacing_ is undefined (meaning that no minimum spacing constraint is enforced). If a `min_spacing` is defined, it has to be strictly greater than zero, and greater than or equal to the time precision of the target (for the C target, it is one nanosecond).

The _min_delay_ parameter in the **action** declaration is static (set at compile time), while the _offset_ parameter given to the schedule function may be dynamically set at runtime. Hence, for static analysis and scheduling, the **action**'s' _min_delay_ parameter can be assumed to be a _minimum delay_ for analysis purposes.

#### Discussion

Logical actions are used to schedule events at a future logical time relative to the current logical time. Physical time is ignored. They must be scheduled within reactions, and the timestamp of the scheduled event will be relative to the current logical time of the reaction that schedules them. It is an error to schedule a logical action asynchronously, outside of the context of a reaction. Asynchronous actions are required to be **physical**.

Physical actions are typically used to assign timestamps to externally triggered events, such as the arrival of a network message or the acquisition of sensor data, where the time at which these external events occurs is of interest. There are (at least) three interesting use cases:

1. An asynchronous event, such as a callback function or interrupt service routine (ISR), is invoked at a physical time _t_ and schedules an action with timestamp _T_=_t_. To get this behavior, just set the physical action to have _min_delay_ = 0 and call the schedule function with _offset_ = 0. The _min_spacing_ can be useful here to prevent these external events from overwhelming the software system.
2. A periodic task that is occasionally modified by a sporadic sensor. In this case, you can set _min_delay_ = _period_ and call schedule with _offset_ = 0. The resulting timestamp of the sporadic sensor event will always align with the periodic events. This is similar to periodic polling, but without the overhead of polling the sensor when nothing interesting is happening.
3. You can impose a minimum physical time delay between an event's occurrence, such as a push of a button, and system response by adjusting the _offset_.

### Actions With Values

If an action is declared with a _type_, then it can carry a **value**, a data value passed to the **schedule** function. This value will be available to any reaction that is triggered by the action. The specific mechanism, however, is target-language dependent. See the [C target](Writing-reactors-in-C#actions-with-values) for an example.

### Scheduling Future Reactions

Each target language provides some mechanism for scheduling future reactions. Typically, this takes the form of a `schedule` function that takes as an argument an [action](#Action-Declaration), a time interval, and (perhaps optionally), a payload. For example, in the [C target](Writing-Reactors-in-C#Reaction-Body), in the following program, each reaction to the timer `t` schedules another reaction to occur 100 msec later:

```
target C;
main reactor Schedule {
    timer t(0, 1 sec);
    logical action a;
    reaction(t) -> a {=
        schedule(a, MSEC(100));
    =}
    reaction(a) {=
        printf("Nanoseconds since start: %lld.\n", get_elapsed_logical_time());
    =}
}
```

When executed, this will produce the following output:

```
Start execution at time Sun Aug 11 04:11:57 2019
plus 919310000 nanoseconds.
Nanoseconds since start: 100000000.
Nanoseconds since start: 1100000000.
Nanoseconds since start: 2100000000.
...
```

This action has no datatype and carries no value, but, as explained below, an action can carry a value.

### Asynchronous Callbacks

In targets that support multitasking, the `schedule` function, which schedules future reactions, may be safely invoked on a **physical action** in code that is not part of a reaction. For example, in the multithreaded version of the [C target](Writing-Reactors-in-C#Reaction-Body), `schedule` may be invoked in an interrupt service routine. The reaction(s) that are scheduled are guaranteed to occur at a time that is strictly larger than the current logical time of any reactions that are being interrupted.

### Superdense Time

Lingua Franca uses a concept known as **superdense time**, where two time values that appear to be the same are not logically simultaneous. At every logical time value, for example midnight on January 1, 1970, there exist a logical sequence of **microsteps** that are not simultaneous. The [Microsteps](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Microsteps.lf) example illustrates this:

```
target C;
reactor Destination {
    input x:int;
    input y:int;
    reaction(x, y) {=
        printf("Time since start: %lld.\n", get_elapsed_logical_time());
        if (x->is_present) {
            printf("  x is present.\n");
        }
        if (y->is_present) {
            printf("  y is present.\n");
        }
    =}
}
main reactor Microsteps {
    timer start;
    logical action repeat;
    d = new Destination();
    reaction(start) -> d.x, repeat {=
        SET(d.x, 1);
        schedule(repeat, 0);
    =}
    reaction(repeat) -> d.y {=
        SET(d.y, 1);
    =}
}
```

The `Destination` reactor has two inputs, `x` and `y`, and it simply reports at each logical time where either is present what is the logical time and which is present. The `Microsteps` reactor initializes things with a reaction to the one-time timer event `start` by sending data to the `x` input of `Destination`. It then schedules a `repeat` action.

Note that time delay in the call to `schedule` is zero. However, any reaction scheduled by `schedule` is required to occur **strictly later** than current logical time. In Lingua Franca, this is handled by scheduling the `repeat` reaction to occur one **microstep** later. The output printed, therefore, will look like this:

```
Time since start: 0.
  x is present.
Time since start: 0.
  y is present.
```

Note that the numerical time reported by `get_elapsed_logical_time()` has not advanced in the second reaction, but the fact that `x` is not present in the second reaction proves that the first reaction and the second are not logically simultaneous. The second occurs one microstep later.

Note that it is possible to write code that will prevent logical time from advancing except by microsteps. For example, we could replace the reaction to `repeat` in `Main` with this one:

```
    reaction(repeat) -> d.y, repeat {=
        SET(d.y, 1);
        schedule(repeat, 0);
    =}
```

This would create what is known as a **stuttering Zeno** condition, where logical time cannot advance. The output will be an unbounded sequence like this:

```
Time since start: 0.
  x is present.
Time since start: 0.
  y is present.
Time since start: 0.
  y is present.
Time since start: 0.
  y is present.
...
```

### Startup and Shutdown Reactions

Two special triggers are supported, **startup** and **shutdown**. A reaction that specifies the **startup** trigger will be invoked at the start of execution of the model. The following two syntaxes have exactly the same effect:

```
    reaction(startup) {= ... =}
```

and

```
    timer t;
    reaction(t) {= ... =}
```

In other words, **startup** is a timer that triggers once at the first logical time of execution. As with any other reaction, the reaction can also be triggered by inputs and can produce outputs or schedule actions.

The **shutdown** trigger is slightly different. A shutdown reaction is specified as follows:

```
   reaction(shutdown) {= ... =}
```

This reaction will be invoked when the program terminates normally (there are no more events, some reaction has called a `request_stop()` utility provided in the target language, or the execution was specified to last a finite logical time). The reaction will be invoked at a logical time one microstep _later_ than the last logical time of the execution. In other words, the presence of this reaction means that the program will execute one extra logical time cycle beyond what it would have otherwise, and that logical time is one microstep later than what would have otherwise been the last logical time.

If the reaction produces outputs, then downstream reactors will also be invoked at that later logical time. If the reaction schedules future reactions, those will be ignored. After the completion of this final logical time cycle, one microstep later than the normal termination, the program will exit.
