---
title: Timing Analysis
layout: docs
permalink: /docs/handbook/timing-analysis
oneline: "Timing Analysis."
preamble: >
---
# Examples

## Precision-Timed Actuation (discussion Dec 2018)
Given a time unit c,
 - H3 reacts sporadically >= 100c (e.g., 10, 120, 230, ...)
 - H4 reacts periodically with period 50c (e.g., 0, 50, 100, ...)
 - Delay adds 100c to the timestamp of each incoming event
 - Actuate shall start executing H5 _before_ r.t. clock exceeds time stamp of incoming events
 
``` 
+--------+
|        |          +--------+     +-------+     +---------+
|   H3   +----------> H1     |     |       |     |         |
|        |          |        +-----> Delay +-----> Actuate |
+--------+    +-----> H2     |     |  100  |     |   (H5)  |
              |     +--------+     +-------+     +---------+
              |
+--------+    |
|        |    |
|   H4   +----+
|        |
+--------+
```

We can construct a dependency graph:

``` 
H3 ---> H1 ---> H2 ---> H5
            |
H4 ---------+
``` 

A feasible schedule requires that:
 - WCET(H3) + WCET(H1) + WCET(H2) <= 100c
 - WCET(H4) + WCET(H1) + WCET(H2) <= 100c

## Preemption Example

```
          T = 1s          C = 300ms
       +---------+      +----------+
       |         |      |   Corr   |
       |   GPS   +------> r1       +----+
       |         |      |          |    |
       +---------+      +----------+    |     +----------------+         D = 100ms
                                        |     |                |        +--------+
         T = 100ms                      +-----> r2             |        |        |
       +---------+                            |       Ctrl     +-------->  Act.  |
       |         |           +----------------> r3             |        |        |
       |  IMU    +-----------+                |                |        +--------+
       |         |                            +----------------+
       +---------+
```

This example needs the following:

 * r3 needs to preempt r1.
 * The event from GPS needs a delay of 300ms between Corr and Ctrl, so Ctrl never sees an older event.

If we want to avoid preemption, as this hurts WCET analysis:

 * Split reactor Corr. into three (or more) reactors and add a delay of 100 ms after each one.

For both solutions, the scheduler needs a "safe to process" analysis for reaction r3 to execute while r1 is
still executing for an older time-stamped event.

Preemption can be avoided when there are enough cores (or hardware threads in PRET) available to execute r1 and r3 concurrently.