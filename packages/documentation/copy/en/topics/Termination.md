---
title: "Termination"
layout: docs
permalink: /docs/handbook/termination
oneline: "Terminating a Lingua Franca execution."
preamble: >
---

## Shutdown Reactions

There are several mechanisms for terminating a Lingua Franca in an orderly fashion.
All of these mechanisms result in a **final tag** at which any reaction that declares $shutdown$ as a trigger will be invoked (recall that a **tag** is a tuple (**logical time**, **microstep**)). Other reactions may also be invoked at this final tag, and the order in which reactions are invoked will be constrained by the normal precedence rules.

If a reaction triggered by $shutdown$ produces outputs, then downstream reactors will also be invoked at the final tag. If the reaction schedules any actions by calling `schedule()`, those will be ignored. In fact, any event after the final tag will be ignored. After the completion of the final tag, the program will exit.

There are four ways to terminate a program:

- **Timeout**: The program specifies the last logical time at which reactions should be triggered.
- **Starvation**: At the conclusion of some tag, there are no events in the event queue at future tags.
- **Stop request**: Some reaction requests that the program terminate.
- **External signal**: Program is terminated externally using operating services like control-C or `kill`.

We address each of these in turn.

## Timeout

The [target property `timeout`](/docs/handbook/target-specification#timeout) specifies the last logical time at which reactions should be triggered. The last invocation of reactions will be at tag (`timeout`, 0).

There is a significant subtlety when using [physical connections](/docs/handbook/composing-reactors#physical-connections), which are connections using the syntax `~>`. Such connections specify that the tag at the receiving end will be based on the physical time at which the message is received. If the tag assigned at the receiving end is greater than the final tag, then the message is lost. Hence, **messages sent near the `timeout` time are likely to be lost!**

## Starvation

If a Lingua Franca program has no [physical actions](/docs/handbook/actions#physical-actions), and if at any time during execution there are no future events waiting to be processed, then there is no possibility for any more reactions to occur and the program will exit. This situation is called **starvation**. If there is a **timer** anywhere in the program with a period, then this condition never occurs.

One subtlety is that reactions triggered by $shutdown$ will be invoked one microstep later than the last tag at which there was an event. They cannot be invoked at the same tag because it is only after that last tag has completed that the runtime system can be sure that there are no future events. It would not be correct to trigger the $shutdown$ reactions at that point because it would be impossible to respect the required reaction ordering.

<div class="lf-c lf-py lf-ts">

Starvation termination is not currently implemented for federated execution. You will need to use one of the other mechanisms to terminate a federated program.

</div>

## Stop Request

If a reaction calls the built-in `request_stop()` function, then it is requesting that the program cease execution as soon as possible. This cessation will normally occur in the next microstep. The current tag will be completed as normal. Then the tag will be advanced by one microstep, and reactions triggered by $shutdown$ will be executed, along with any other reactions with triggers at that tag, with all reactions executed in precedence order.

<div class="lf-c lf-py lf-ts">

In a federated execution, things are more complicated. In general, it is not possible to cease execution in the next microstep because this would mean that every federate has a communication channel to every other with delay equal to one microstep. This this does not create a causality loop, but it means that all federates have to advance time in lockstep, which creates a global barrier synchronization that would likely kill performance. It will also make decentralized coordination impossible because the safe-to-process (STP) threshold for all federates will diverge to infinity.

For **centralized coordination**, when a reaction in a federate calls `request_stop()`, the federate sends a **STOP_REQUEST** message to the RTI with its current timestamp _t_ as a payload and completes execution of any other reactions triggered at the current tag. It then blocks, waiting for a **STOP_GRANTED** message with a timestamp payload _s_. If _s_ > _t_, then it sets `timeout` = _s_ and continues executing, using the timeout mechanism (see above) to stop. If _s_ = _t_, then schedules the shutdown phase to occur one microstep later, as in the unfederated case.

When the RTI receives a **STOP_REQUEST** message from a federate, it forwards it to all other federates and waits for a reply from all. Each reply will have a timestamp payload. The RTI chooses _s_, the largest of these timestamps, and sends a **STOP_GRANTED** message to all federates with payload _s_.

When a federate receives a **STOP_REQUEST** message, it replies with its current logical time _t_, completes its current tag (if one is progress), and blocks, waiting for a **STOP_GRANTED** message from the RTI. When it gets the reply with payload _s_, if _s_ > _t_, then it sets `timeout` = _s_ and continues executing, using the timeout mechanism (see above) to stop. If _s_ = _t_, then it schedules the shutdown phase to occur one microstep later, as in the unfederated case.

</div>

## External Signal

A control-C or other kill signal to a running Lingua Franca program will cause execution to stop immediately.

<div class="lf-c lf-py lf-ts">

For federated programs, each federate and the RTI catches external signals to shut down in an orderly way.

When a federate gets such an external signal (e.g. control-C), it sends a **RESIGN** message to the RTI and an **EOF** (end of file) on each socket connection to another federate. It then closes all sockets and shut down. The RTI and all other federates should continue running until some other termination condition occurs.

When the RTI gets such an external signal (e.g. control-C), it broadcasts a **STOP_REQUEST** message to all federates, wait for their replies (with a timeout in case the federate or the network has failed), choose the maximum timestamp _s_ on the replies, broadcast a **STOP_GRANTED** message to all federates with payload _s_, and wait for **LOGICAL_TIME_COMPLETE** messages as above.

</div>
