---
slug: maxwait-patterns
title: "Maxwait Patterns"
authors: [fra-p, depetrol, eal]
tags: [lingua franca, federation, decentralized, maxwait, absent_after, distributed patterns, consistency]
---

Distributed time-sensitive systems must balance **consistency** (agreement on shared information) and **availability** (responding within timing bounds). Lingua Franca's [decentralized coordination](/docs/writing-reactors/distributed-execution#decentralized-coordination) exposes this tradeoff through two attributes: **maxwait** and **absent_after**. This post walks through examples from Paladino, Li, and Lee's "Maxwait: A Generalized Mechanism for Distributed Time-Sensitive Systems," showing that many classical distributed coordination strategies and common patterns—Chandy–Misra with or without null messages, ACID/CRDT-style coordination-free execution, optimistic execution with rollback, logical execution time (LET), publish-subscribe, actors, and RPC with futures—amount to choosing appropriate **maxwait** and **absent_after** values. See the related [LF meeting recording](https://drive.google.com/drive/u/0/folders/1puJdbrsgG0WhaGsOEJVUM_8NgBkeSmwH/view?usp=share_link).

{/* truncate */}

## A Refresher on Maxwait and Absent-After

With [decentralized coordination](/docs/writing-reactors/distributed-execution#decentralized-coordination), each federate advances its logical time locally. A federate can advance to tag _g_ = (_t_, _m_) when either:

1. **All inputs are known up to and including** _g_—i.e., every input port has received a message with tag ≥ _g_ (or is disconnected), or  
2. **The federate's physical clock ≥ _t_ + maxwait**—a timeout expires, and the federate assumes any unresolved ports will not receive messages with timestamp ≤ _t_.

The **maxwait** attribute is put just before the LF statement that instantiates a federate:

```lf-c
federated reactor {
  @maxwait(time value)
  d = new ReactorClass()
}
```
If no such attribute appears, the maxwait defaults to zero. The time value specifies how long (in physical time) a federate should wait for inputs to become known before advancing to a logical time. Setting maxwait to `forever` means the federate never advances on timeout; it always waits for all inputs to become known. Setting it to a finite value (e.g. `50 ms`) bounds how long the federate waits before assuming unknown inputs are absent. If the timeout expires and an input is assumed absent at some timestamp _t_, the federate may later receive a message with timestamp ≤ _t_; that message is **tardy** and triggers an [STP (safe-to-process) violation](/docs/writing-reactors/distributed-execution#tardy-message-handling). You can handle tardy messages with a `tardy` handler.

The **absent_after** attribute is put just before a connection between federates:

```lf-c
federated reactor {
  ...
  @absent_after(100 ms)
  fed1.out -> fed2.in
}
```
It specifies a timeout such that, after the federate has advanced to tag _t_, if an input on that connection is still unknown when the timeout expires, the runtime **assumes that input absent at tag _t_**. Unlike maxwait (which governs when the federate may advance at all), absent_after lets you delay only those reactions that depend on specific inputs, while still allowing the federate to advance and run other reactions. That is what enables request–response patterns like RPC with futures.

With that in place, we can see how different choices realize different distributed patterns.

---

## Coordination Techniques for Consistency

### Conservative Coordination Without Null Messages

Conservative techniques enforce in-order processing by waiting for all relevant inputs before advancing. [Chandy-and-Misra-style coordination](https://doi.org/10.1109/TSE.1979.230182) uses only condition (1): advance only when all inputs are known. There is no timeout.
We achieve that in LF by setting **maxwait** to **`forever`**. The federate never advances on timeout; it always waits for every input to become known.

A classic example is an **aircraft door** that must be disarmed before opening. A cockpit issues an open command; a camera checks for a ramp and sends a disarm signal. The door must process both open and disarm, and **disarm before open** when they share the same tag. The open command often arrives before the camera’s result. The door therefore must wait for both inputs before acting.

![AircraftDoor diagram](../static/img/blog/AircraftDoor.svg)

The [Decentralized Consistency](/blog/decentralized-consistency) post discusses this in detail. The crucial part is:

```lf-c
federated reactor {
  c = new Cockpit()
  v = new Camera()
  @maxwait(forever)
  d = new Door()
  c.open -> d.open
  c.open -> v.check_ramp
  v.ramp_present -> d.disarm
}
```

With `@maxwait(forever)`, the `Door` federate never advances until it has received something (open or disarm) on each port up to the current tag. Consistency is prioritized over availability: we prefer to block indefinitely rather than open without knowing the camera’s verdict.

### Conservative Coordination With Null Messages

If you still want logical-time consistency but cannot afford to wait forever, **null messages** can help. Producers periodically send “no data” messages so that consumers know “nothing with timestamp ≤ _t_ will arrive” and can advance.

Consider a **distributed banking** setup: two ATMs send deposit/withdrawal requests to two account managers that maintain a replicated balance. We want both managers to process requests in timestamp order. Each ATM wraps a timer; when the timer fires without a user request, it sends a null message (e.g. zero-valued). Account managers use `@maxwait(forever)` and process inputs in tag order. The **period of the null messages** effectively controls how long the system waits for real data before assuming “absent” and advancing.

```lf-c
reactor ATMWrapper(..., null_msg_period: time = 1s) {
  input in: int
  output received: int
  timer t(0, null_msg_period)
  w = new ATM(...)
  in -> w.response
  reaction(w.received, t) -> received {=
    if (w.received->is_present) {
      lf_set(received, w.received->value);
    } else {
      lf_set(received, 0);  // Null message
    }
  =}
}

federated reactor {
  w1 = new ATMWrapper(...)
  w2 = new ATMWrapper(...)
  @maxwait(forever)
  a1 = new AccountManager()
  @maxwait(forever)
  a2 = new AccountManager()
  // ... connections ...
}
```

The response time depends on the null-message period and network latency. Failures can still block progress, however. The next patterns relax coordination to improve availability.

### Coordination-Free: ACID, CRDTs, CALM

Some systems achieve **eventual consistency** without enforcing order, using **associative, commutative, idempotent** operations ([ACID 2.0](https://doi.org/10.48550/arXiv.0909.1788)), [CRDTs](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type), or **[CALM](https://doi.org/10.48550/arXiv.2210.12605)** (consistency as logical monotonicity). Updates commute, so order does not affect the final state.
When our updates satisfy this property, then it is safe in LF to set **maxwait** to **0**. This will process inputs as soon as they arrive, without waiting for other ports. To avoid errors when tardy messages show up, we use an empty **tardy** handler that effectively “ignores” tardiness and still runs the normal reaction.

```lf-c
reactor ACIDAccountManager() {
  input in1: int
  input in2: int
  output out: int
  state balance: int = 0
  reaction(in1, in2) -> out {=
    if (in1->is_present) self->balance += in1->value;
    if (in2->is_present) self->balance += in2->value;
    lf_set(out, self->balance);
  =} tardy
}

federated reactor {
  w1 = new ATM(...)
  w2 = new ATM(...)
  @maxwait(0)
  a1 = new ACIDAccountManager()
  @maxwait(0)
  a2 = new ACIDAccountManager()
  // ... connections ...
}
```

With `maxwait(0)`, both managers react as soon as they have any input. The empty `tardy` handler tells the runtime to invoke the normal reaction even when a message is tardy; with associative, commutative updates, that still yields eventual consistency. You gain availability and simple failure semantics, but you give up strict ordering (e.g. overdraft checks that depend on order).

### Optimistic Execution With Rollback

**Optimistic** strategies (e.g. [Time Warp](https://doi.org/10.1145/3916.3988)) process events as they arrive and roll back if a later message reveals out-of-order processing. In LF we can combine **bounded maxwait** with **rollback-style** logic.

Example: **AccountManagerWithRecovery** uses `maxwait = 30 ms` so ATMs get a response within ~30 ms. Managers use a local balance estimate to allow/deny withdrawals. A separate **Balance** subsystem maintains a timestamp-consistent “true” balance with `maxwait(forever)`, and feeds it back to the managers with a logical **after 10 s** delay. Managers therefore work with a slightly stale but consistent view. Violations (e.g. tardy balance updates) can be detected and handled (e.g. take ATM offline, trigger recovery).

So: **finite maxwait** gives you a clear **consistency–availability tradeoff**: you bound wait time and explicitly accept possible inconsistency or roll back when bounds are exceeded.

### Bounded Maxwait and Real-Time: Sensor Fusion

Many cyber-physical applications need **both** consistency (e.g. sensor fusion) and **availability** (e.g. deadlines). The [automatic emergency braking (AEB)](/blog/decentralized-consistency#multirate-inputs-automatic-emergency-braking) example illustrates the tension:

- At multiples of 100 ms, both lidar and radar produce data; we need **both** before fusing → consistency suggests **maxwait = 50 ms** (or `forever`).
- At 50 ms, 150 ms, … only lidar produces data; we should react immediately → availability suggests **maxwait = 0**.

We cannot use a single static maxwait without sacrificing one or the other. The solution is **dynamic maxwait**: use `lf_set_fed_maxwait()` in the reaction to alternate between `50 ms` (when expecting both sensors) and `0` (when expecting only lidar). The [Decentralized Consistency](/blog/decentralized-consistency) post shows the full pattern.

![AutomaticEmergencyBrakingSystem diagram](../static/img/blog/AutomaticEmergencyBrakingSystem.svg)

### Fault Detection in Bounded Time

With **bounded maxwait**, we can detect **missing inputs** in bounded time. If we add a **timer** that triggers at the same logical instants we expect data, the reaction runs when the timer fires. With finite maxwait, the federate will advance at latest when the timeout expires. The reaction can then check `is_present` on each input: missing data means a fault (e.g. sensor or link failure).

The same idea applies to the aircraft door: the cockpit (or door) can send periodic heartbeats. The door uses a timer and bounded maxwait; if a heartbeat is missing by the timeout, we detect the fault even under full network failure (as long as the door’s host is up). So **maxwait** not only controls consistency vs. availability but also enables **time-bounded fault detection**.

### Logical Execution Time (LET)

In **LET**, outputs are produced at logical time _t_ + _E_ for a given execution time _E_. A typical pattern: a fast loop (sensor → controller → actuator) and a slower **StateEstimator** that buffers samples, computes an estimate, and sends it back with an **after** delay. The estimator uses **maxwait(forever)** so it always waits for the required number of samples before computing. The fast loop uses **maxwait(0)** and assumes the estimate arrives within the LET. If we add a timer and check for the estimate’s presence at the expected tag, we can **detect LET violations** (compute + network took longer than _E_) and handle them in a fault handler.

### Publish–Subscribe

In pub-sub, subscribers receive messages on topics; with multiple topics, **order is typically unspecified**. In LF, a “topic” is an output port; subscribers connect to it. Setting **maxwait = 0** (the default) means the subscriber advances as soon as it can and handles messages when they arrive—similar to pub-sub. You still get timestamps and [clock synchronization](/docs/writing-reactors/distributed-execution#clock-synchronization); tardy handlers can use `intended_tag` to reason about ordering when violations occur, which ordinary pub-sub does not provide.

### Actors

Actor frameworks (e.g. Akka, CAF) process messages one at a time per actor but do not enforce global order. Again, **maxwait = 0** yields “process when something arrives” semantics, close to actors. LF’s port-based communication keeps reactors independent of who is connected, and timestamps plus tardy handling add structure that plain actors lack.

### Remote Procedure Calls and Futures

Here **absent_after** becomes essential. Consider a **Delegator** that sends work to **Worker** reactors and must aggregate their responses. We want:

- **Reaction 1** (triggered by the request): start workers immediately.
- **Reaction 2** (triggered by trigger and responses): run only when **both** responses have arrived, or when we have given up waiting.

With **maxwait = 0** alone, the federate advances immediately on the trigger; reaction 2 would run even if responses are not yet present, unless we block it. **absent_after** applies **per connection**: after the federate has advanced to tag _t_, if a response on that connection is still unknown when **absent_after** expires, that input is **assumed absent at _t_**. So we can delay only the aggregation reaction until responses arrive or the timeout fires.

```lf-c
// Connections from workers to delegator:
@absent_after(100 ms)
w1.out -> d.resp1
@absent_after(100 ms)
w2.out -> d.resp2
```

With **maxwait(0)** and **absent_after(100 ms)**:

- The delegator advances on the trigger and runs reaction 1, starting the workers.
- Reaction 2 is held until both `resp1` and `resp2` are known or their **absent_after** timeouts expire. Then we can check `is_present`, compute the result or handle “workers didn’t respond in time.”

Setting **absent_after** to **`forever`** gives a **futures**-like discipline: we always wait for both responses before running reaction 2. Other reactions (e.g. between 1 and 2) can do work while waiting, just as with futures.

---

## Summary

| Pattern | maxwait | absent_after | Notes |
|--------|---------|--------------|--------|
| Chandy–Misra (no null msgs) | `forever` | — | Advance only when all inputs known |
| Conservative + null messages | `forever` | — | Null msgs signal “nothing up to _t_”; period sets effective wait |
| ACID / CRDT / CALM | `0` | — | Process as messages arrive; tardy handler as needed |
| Optimistic / rollback | finite (e.g. 30 ms) | — | Bound wait; accept possible inconsistency / recovery |
| Sensor fusion (multirate) | dynamic (0 / 50 ms) | — | `lf_set_fed_maxwait` to alternate |
| LET | `forever` (estimator), `0` (loop) | — | LET enforced by `after`; optional fault detection via timer |
| Pub-sub / actors | `0` | — | Handle when arrives; timestamps + tardy add structure |
| RPC / futures | `0` | `100 ms` or `forever` | `absent_after` delays only dependent reactions |

Decentralized coordination in Lingua Franca, with **maxwait** and **absent_after**, is general enough to capture these patterns. The same mechanism lets you choose consistency vs. availability, add time-bounded fault detection, and mix strategies (e.g. conservative door plus optimistic banking) within one framework. For more detail, see the [distributed execution docs](/docs/writing-reactors/distributed-execution) and [research on Lingua Franca](https://www.lf-lang.org/research).
