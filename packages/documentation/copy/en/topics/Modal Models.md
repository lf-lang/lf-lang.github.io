---
title: "Modal Reactors"
layout: docs
permalink: /docs/handbook/modal-models
oneline: "Modal Reactors"
preamble: >
---

<div class="lf-cpp lf-rs lf-ts">

**Modal Reactors are currently not supported in $target-language$.**

</div>

<div class="lf-c lf-py">

$page-showing-target$

The basic idea of _modal reactors_ is to partition a reactor into disjoint subsets of reactions (or other components) that are associated with mutually exclusive _modes_.
In a modal reactor, only a single mode can be active at a particular logical time instant, meaning that activity in other modes is automatically suspended.
Transitioning between modes switches the reactor's behavior and provides control over continuing or resetting the previous history of the entered mode.

## Syntax

Modes can be defined in any reactor, except federated ones.
Each mode requires a unique (per reactor) name and can declare contents that are local to this mode.
There must be exactly one mode marked as $initial$.

```lf
reactor TwoModes {
  ...
  initial mode One {
    ...
  }
  mode Two {
    ...
  }
}
```

A mode can contain local state variables, timers, actions, reactions, reactor instantiations, and connections.
While modes cannot be nested in modes directly, hierarchical composition is possible through the instantiation of modal reactors.
The main exception in allowed contents in modes are port declarations, as these are only possible on reactor level.
Yet, modes share the scope with their reactor and, hence, can access ports, state variables, and parameters of the reactor.
Only the contents of other modes are excluded.
A modal reactor can still have reactions, reactor instantiations, etc., that are not located in modes and will consequently be executed independently from mode activity.

Mode transitions are declared within reactions.
If a reactor has modes, reactions inside modes are allowed to list them as effects.
Such an effect enables the use of the target language API to set the next mode.

```lf-c
reaction(trig) -> Two {=
  if (trig->value) {
    lf_set_mode(Two)
  }
=}
```

```lf-py
reaction(trig) -> Two {=
  if trig.value:
    Two.set()
=}
```

You can also specify the type of the transition by adding the modifier `reset(<mode>)` or `history(<mode>)` in the effects of the
reaction signature (i.e., after the `->`). For example, a history transition to the state `Two` is enabled by listing `history(Two)`
among the effects of the reaction. The `reset` variant is implicitly assumed when the mode is listed without modifier.

## Execution Semantics

The basic effect of modes is that only parts that are contained in the currently active mode (or outside any mode) are executed at any point in time.
This also holds for parts that are nested in multiple _ancestor modes_ due to hierarchy; consequently, all those ancestors must be active in order to execute.
Reactions in inactive modes are simply not executed, while all components that model timing behavior, namely timers, scheduled actions, and delayed connections, are subject to a concept of _local time_.
That means while a mode is inactive, the progress of time is suspended locally.
How the timing components behave when a mode becomes active depends on the transition type.
A mode can be _reset_ upon entry, returning it to its initial state.
Alternatively, it may be entered preserving its _history_, which only has an actual effect if the mode was active before.
In the latter case all timing components will continue their delays or period as if no time had passed during inactivity of the mode.
The following section will provide a more detailed explanation of this effect.

Upon reactor startup, the initial mode of each modal reactor is active, others are inactive.
If at a tag _(t, m)_, all reactions of this reactor and all its contents have finished executing, and a new mode was set in a reaction, the current mode will be deactivated and the new one will be activated for future execution.
This means no reaction of the newly active mode will execute at tag _(t, m)_; the earliest possible reaction in the new mode occurs one microstep later, at _(t, m+1)_.
Hence, if the newly active mode has for example a timer that will elapse with an offset of zero, it will trigger at _(t, m+1)_.
In case the mode itself does not require an immediate execution in the next microstep, it depends on future events, just as in the normal behavior of LF.
Hence, modes in the same reactor are always mutually exclusive w.r.t. superdense time.

A transition is triggered if a new mode is set in a reaction body.
As with setting output ports in reaction, a new mode can be set multiple times in the same or different reactions.
In the end, the fixed ordering of reactions determines the last effective value that will be used.
The new mode does not have to be a different one; it is possible for a mode to reset itself via a reset transition.

In case a mode is entered with the reset behavior:

- all contained modal reactors are reset to their initial mode (recursively),
- all contained timers are reset and start again awaiting their initial offset,
- all contained state variables that are marked for automatic reset are reset to their initial value,
- any contained reactions triggered by `reset` are executed, and
- all events (actions, timers, delayed connections) that were previously scheduled from within this mode are discarded.

Note that _contained_ refers to all contents defined locally in the mode and in local reactor instances (recursively) that are not otherwise enclosed in modes of lower levels.

Whenever a mode is entered with a reset transition, the subsequent timing behavior is as if the mode was never executed before.
If there are state variables that need to be reset or reinitialized, then this can be done in a reaction triggered by `reset` or by marking the state variable for automatic reset (e.g.,
<span class="lf-c">`reset state x:int(0)`</span>
<span class="lf-cpp warning">FIXME</span>
<span class="lf-py">`reset state x(0)`</span>
<span class="lf-ts warning">FIXME</span>
<span class="lf-rs warning">FIXME</span>
).
State variables are not reset automatically to their initial conditions because it is idiomatic for reactors to allocate resources or initialize subsystems (e.g., allocate memory or sockets, register an interrupt, or start a server) in reactions triggered by the `startup`, and to store references to these resources in state variables.
If these were to be automatically reset, those references would be lost.

On the other hand, if a mode has been active prior and is then re-entered via a `history` transition, no reset is performed.
Events originating from timers, scheduled actions, and delayed connections are adjusted to reflect a remaining delay equal to the remaining delay recorded at the instant the mode was previously deactivated.
As a consequence, a mode has a notion of local time that elapses only when the mode is active.

### Local Time

From the perspective of timers and actions, time is suspended when a mode is inactive.
This also applies to indirectly nested reactors within modes and connections with logical delays, if their source lies within a mode.

<img alt="Illustration of local time (model)" src="../../../../../img/modal_models/local_time.svg" width="400"/>

The above LF model illustrates the different characteristics of local time affecting timers and actions in the presence of the two transition types.

It consists of two modes `One` (the initial mode) and `Two`, both in the `Modal` reactor.
The `next` input toggles between these modes and is controlled by a reaction at the top level that is triggered by the timer `T`.
After one second, a mode switch is triggered periodically with a period one second.
Each mode has a timer `T1`/`T2` that triggers a reaction after an initial offset of 100 msec and then periodically after 750 msec.
This reaction then schedules a logical action with a delay of 500 msec (the actual target code does not add an additional delay over the minimum specified).
This action triggers the second reaction, which writes to the output `out`.
The main difference between the modes is that `One` is entered via a history transition, continuing its behavior, while `Two` is reset.
(History behavior is indicated by an "H" on the transition edge because it enters into the entire history of the mode.)

<img alt="Illustration of local time (trace)" src="../../../../../img/modal_models/local_time_trace.svg" width="600"/>

Above is the execution trace of the first 4 seconds of this program.
Below the timeline is the currently active mode and above the timeline are the model elements that are executed at certain points in time, together with indicating triggering and their relation through time.
For example, at 100 msec, the initial offset of timer `T1` elapses, which leads to the scheduling of the logical action in this mode.
The action triggers the reaction 500 msec later, at 600 msec, and thus causes an output.
The timing diagram illustrates the different handling of time between history transitions and reset transitions.
Specifically, when mode `One` is re-entered via a history transition, at time 2000 msec, the action triggered by `T1` before, at time 850 msec, resumes.
In contrast, when mode `Two` is re-entered via a reset transition, at time 3000 msec, the action triggered by `T2` before, at time 1850 msec, gets discarded.

<img alt="Illustration of local time (plot)" src="../../../../../img/modal_models/local_time_plot.svg" width="300"/>

The above plot illustrates the relation between global time in the environment and the localized time for each timer in the model.
Since the top-level reactor `TimingExample` is not enclosed by any mode, its time always corresponds to the global time.
Mode `One` is the initial mode and hence progresses in sync with `TimingExample` for the first second.
During inactivity of mode One the timer is suspended and does not advance in time.
At 2000 msec it continues relative to this time.
`T2` only starts advancing when the mode becomes active at 1000 msec.
The reentry via reset at 3000 msec causes the local time to be reset to zero.

### Startup and Shutdown

A challenge for modal execution is the handling `startup` and `shutdown` behavior.
These are commonly used for managing memory for state variables, handling connections to sensors or actuators, or starting/joining external threads.
If reactions to these triggers are located inside modes they are subject to a special execution regime.

First, `startup` reactions are invoked at most once at the first activation of a mode.
Second, `shutdown` reactions are executed when the reactor shuts down, **_irrespective_** of mode activity, but only if the enclosing modes have been activated at least once.
Hence, every startup has a corresponding shutdown.
Third, as mentioned before, the new `reset` trigger for reactions can be used, if a startup behavior should be re-executed if a mode is entered with a reset transition.

Note that this may have unexpected implications:

- Startup behavior inside modes may occur during execution and not only at program start.
- Multiple shutdown reactions may be executed, bypassing mutual exclusion of modes.
- Reactors that are designed without consideration of modes and use only `startup` (not `reset`) to trigger an execution chain, may not work in modes and cease to function if re-entered with a reset.

</div>
