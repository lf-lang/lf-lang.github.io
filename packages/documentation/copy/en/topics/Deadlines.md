---
title: "Deadlines"
layout: docs
permalink: /docs/handbook/deadlines
oneline: "Deadlines in Lingua Franca."
preamble: >
---

$page-showing-target$

Lingua Franca includes a notion of a **deadline**, which is a constraint on the relation between logical time and physical time. Specifically, a program may specify that the invocation of a reaction must occur within some _physical_ time interval of the _logical_ time of the message. If a reaction is invoked at logical time 12 noon, for example, and the reaction has a deadline of one hour, then the reaction is required to be invoked before the physical-time clock of the execution platform reaches 1 PM. If the deadline is violated, then the specified deadline handler is invoked instead of the reaction.

## Purposes for Deadlines

A deadline in an LF program serves two purposes. First, it can guide scheduling in that a scheduler may prioritize reactions with deadlines over those without or those with longer deadlines. For this purpose, if a reaction has a deadline, then all upstream reactions on which it depends (without logical delay) inherit its deadline. Hence, those upstream reactions will also be given higher priority.

Second, the deadline mechanism provides a **fault handler**, a section of code to invoke when the deadline requirement is violated. Because invocation of the fault handler depends on factors beyond the control of the LF program, an LF program with deadlines becomes **nondeterministic**. The behavior of the program depends on the exact timing of the execution.

There remains the question of when the fault handler should be invoked. By default, deadlines in LF are **lazy**, meaning that the fault handler is invoked at the logical time of the event triggering the reaction whose deadline is missed. Specifically, the possible violation of a deadline is not checked until the reaction with the deadline is ready to execute. Only then is the determination made whether to invoke the regular reaction or the fault handler.

## Deadline Specification

A deadline is specified as follows:

$start(Deadline)$

```lf-c
target C;
reactor Deadline {
  input x:int;
  output d:int; // Produced if the deadline is violated.
  reaction(x) -> d {=
    printf("Normal reaction.\n");
  =} deadline(10 msec) {=
    printf("Deadline violation detected.\n");
    lf_set(d, x->value);
  =}
}
```

```lf-cpp
target Cpp;
reactor Deadline {
  input x:int;
  output d:int; // Produced if the deadline is violated.
  reaction(x) -> d {=
    std::cout << "Normal reaction." << std::endl;
  =} deadline(10ms) {=
    std::cout << "Deadline violation detected." << std::endl;
    d.set(*x.get());
  =}
}
```

```lf-py
target Python;
reactor Deadline {
  input x;
  output d; // Produced if the deadline is violated.
  reaction(x) -> d {=
    print("Normal reaction.")
  =} deadline(10 msec) {=
    print("Deadline violation detected.")
    d.set(x.value)
  =}
}
```

```lf-ts
target TypeScript
reactor Deadline {
  input x:number
  output d:number // Produced if the deadline is violated.
  reaction(x) -> d {=
    console.log("Normal reaction.")
  =} deadline(10 msec) {=
    console.log("Deadline violation detected.")
    d = x
  =}
}
```

```lf-rs
WARNING: No source file found: ../code/rs/src/Deadline.lf
```

$end(Deadline)$

This reactor specifies a deadline of 10 milliseconds (this can be a parameter of the reactor). If the reaction to `x` is triggered later in physical time than 10 msec past the timestamp of `x`, then the second body of code is executed instead of the first. That second body of code has access to anything the first body of code has access to, including the input `x` and the output `d`. The output can be used to notify the rest of the system that a deadline violation occurred. This reactor can be tested as follows:

$start(DeadlineTest)$

```lf-c
target C
import Deadline from "Deadline.lf"
preamble {=
  #include "platform.h"
=}
main reactor {
  logical action a
  d = new Deadline()
  reaction(startup) -> d.x, a {=
    lf_set(d.x, 0);
    lf_schedule(a, 0);
  =}
  reaction(a) -> d.x {=
    lf_set(d.x, 0);
    lf_sleep(MSEC(20));
  =}
  reaction(d.d) {=
    printf("Deadline reactor produced an output.\n");
  =}
}
```

```lf-cpp
target Cpp;
import Deadline from "Deadline.lf";
main reactor {
  logical action a;
  d = new Deadline();
  reaction(startup) -> d.x, a {=
    d.x.set(0);
    a.schedule(0ms);
  =}
  reaction(a) -> d.x {=
    d.x.set(0);
    std::this_thread::sleep_for(20ms);
  =}
  reaction(d.d) {=
    std::cout << "Deadline reactor produced an output." << std::endl;
  =}
}
```

```lf-py
target Python;
import Deadline from "Deadline.lf";
preamble {= import time =}
main reactor {
  logical action a;
  d = new Deadline();
  reaction(startup) -> d.x, a {=
    d.x.set(0)
    a.schedule(0)
  =}
  reaction(a) -> d.x {=
    d.x.set(0)
    time.sleep(0.02)
  =}
  reaction(d.d) {=
    print("Deadline reactor produced an output.")
  =}
}
```

```lf-ts
target TypeScript
import Deadline from "Deadline.lf"
main reactor {
  logical action a
  d = new Deadline()
  reaction(startup) -> d.x, a {=
    d.x = 0
    actions.a.schedule(TimeValue.zero(), null)
  =}
  reaction(a) -> d.x {=
    d.x = 0
    for (const later = util.getCurrentPhysicalTime().add(TimeValue.msecs(20));
      util.getCurrentPhysicalTime() < later;) {
      // Take time...
    }
  =}
  reaction(d.d) {=
    console.log("Deadline reactor produced an output.")
  =}
}
```

```lf-rs
WARNING: No source file found: ../code/rs/src/DeadlineTest.lf
```

$end(DeadlineTest)$

<img alt="Lingua Franca diagram" src="../../../../../img/diagrams/DeadlineTest.svg" width="500"/>

Running this program will result in the following output:

```
Normal reaction.
Deadline violation detected.
Deadline reactor produced an output.
```

The first reaction of the `Deadline` reactor does not violate the deadline, but the second does. Notice that the sleep in the $main$ reactor occurs _after_ setting the output, but because of the deterministic semantics of LF, this does not matter. The actual value of an output cannot be known until every reaction that sets that output _completes_ its execution. Since this reaction takes at least 20 msec to complete, the deadline is assured of being violated.

Notice that the deadline is annotated in the diagram with a small clock symbol.

<div class="lf-c">

Notice that the deadline violation here is caused by an invocation of `lf_sleep`, defined in `"platform.h"` (see [Libraries Available to Programmers](/docs/handbook/target-language-details?target=c#libraries-available-to-programmers)).
It is not generally advisable for a reaction to sleep because this can block other reactions from executing.
But this is exactly what we are trying to accomplish here in order to force a deadline to be violated.

</div>

## Deadline Violations During Execution

Whether a deadline violation occurs is checked only _before_ invoking the reaction with a deadline. What if the reaction itself runs for long enough that the deadline gets violated _during_ the reaction execution? For this purpose, a target-language function is provided to check whether a deadline is violated during execution of a reaction with a deadline.

<div class="lf-py lf-ts lf-cpp lf-rs">

**NOTE**: As of this writing, this function is only implemented in the C target.

</div>

Consider this example:

$start(CheckDeadline)$

```lf-c
target C;
reactor Count {
  output out:int;
  reaction(startup) -> out {=
    int count = 0;
    while (!lf_check_deadline(self, true)) {
      count++;
    }
    lf_set(out, count);
  =} deadline (3 msec) {=
    printf("Stopped counting.\n");
  =}
}
main reactor {
  c = new Count();
  reaction(c.out) {=
    printf("Counted to %d\n", c.out->value);
  =}
}
```

```lf-cpp
WARNING: No source file found: ../code/cpp/src/CheckDeadline.lf
```

```lf-py
WARNING: No source file found: ../code/py/src/CheckDeadline.lf
```

```lf-ts
WARNING: No source file found: ../code/ts/src/CheckDeadline.lf
```

```lf-rs
WARNING: No source file found: ../code/rs/src/CheckDeadline.lf
```

$end(CheckDeadline)$

<div class="lf-c">

The `Count` reactor has a single reaction with a deadline of `3 msec`.
If the deadline is not already violated when this reaction becomes enabled (at startup), then the reaction begins executing a loop. In each iteration of the loop, it calls `lf_check_deadline(self, true)`, which returns `true` if the deadline has been violated and `false` otherwise. Hence, this reaction will increment the `count` variable as many times as possible before the deadline is violated and, at
that point, will exit the loop and produce on the output the count. Running this program will produce something like this:

```
Stopped counting.
Counted to 20257
```

This is a (rather trivial) example of an **anytime computation**. Such computations proceed to improve results until time runs out and then produce the most improved result.

The arguments to the `lf_check_deadline` are the `self` struct and a boolean that indicates whether the deadline violation handler should be invoked upon detecting a deadline violation. Because the argument is `true` above, the handler is invoked and `Stopped counting` is printed.

</div>
