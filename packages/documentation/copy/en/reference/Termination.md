---
title: "Termination"
layout: docs
permalink: /docs/handbook/termination
oneline: "Terminating a Lingua Franca execution."
preamble: >
---

There are a number of subtleties associated with the termination of Lingua Franca programs, particularly with federated execution. For the purposes of this discussion, **tag** refers to the tuple (**logical time**, **microstep**).

There are several ways to terminate a program:

- **Timeout**: The program specifies the last logical time at which reactions should be triggered.
- **Starvation**: At the conclusion of some tag, there are no events in the event queue at future tags.
- **Stop request**: Some reaction requests that the program terminate.
- **External signal**: Program is terminated externally with control-C or `kill`.

We address each of these in turn.

## Timeout

The target property `timeout` specifies the last logical time at which reactions should be triggered. The last invocation of reactions will be at tag (`timeout`, 0). The subtleties:

- **Schedule**: Any invocation of `schedule` that specifies a logical time greater than the timeout value is ignored. No event gets scheduled. Moreover, if `schedule` is invoked at logical time equal to `timeout`, then it is again ignored because that would have resulted in an event with tag (`timeout`, 1), which is greater than the final tag.

- **Shutdown reactions**: Reactions that are triggered by `shutdown` will be triggered at tag (`timeout`, 0). There may be many other reactions triggered at that same tag, and a shutdown reaction may produce outputs causing other reactions to be triggered, so there is no assurance that shutdown reactions are invoked last. However, if a shutdown reaction is the last reaction in a reactor, then it is assured of being the last reaction invoked _in that reactor_ at that final tag.

- **After**: If at logical time _t_ a reaction sends an output over connection using the keyword `after` with value _d_ >= 0, and _t_ + _d_ >`timeout`, then the output is dropped. No event gets scheduled. If _d_ = 0 and _t_ = `timeout`, the output is also dropped because that would have resulted in an event with tag (`timeout`, 1), which is greater than the final tag. In a **federated** execution, no message is launched into the network if _t_ + _d_ >`timeout`.

- **Physical connections**: A connection using the syntax `~>` specifies that the tag at the receiving end of the connection will be based on the physical time at which the message is received. See [[Physical Connections]] for the specification for how the tag is assigned at the receiving end. If the tag assigned at the receiving end is greater than (`timeout`, 0), then the message is lost. Hence, **messages sent near the `timeout` time are likely to be lost!**

## Starvation

If the target property `keepalive` is not specified or is set to `false` (the default), then a Lingua Franca program will exit after completing a logical tag if there are no future events scheduled. If there is a **timer** anywhere in the program, then this condition never occurs. There is always a future event scheduled (unless the `timeout` has been reached). If there is a **physical action** anywhere in the program (and there is no timer), then you will need to set `keepalive` to true to prevent the program from exiting while waiting for some external stimulus.

Starvation termination is tricky to implement for federated execution, particularly when physical connections are used. It requires developing a distributed consensus. One way to accomplish this is for each federate to send a **QUEUE_EMPTY** message to the RTI whenever its event queue is empty. The message will need to include a count of the total number of messages it has sent or received on each direct connection to another federate. When the RTI receives such a message from all federates, and the number of messages sent and received on each direct connection match, then the RTI can broadcast a shutdown message.

A decentralized version of the same consensus is more challenging but will be necessary if there is no RTI running. **FIXME**: Proposals are welcome here.

## Stop Request

If a reaction calls `request_stop`, then it is requesting that the program cease execution as soon as possible. In a non-federated execution, this cessation can occur in the next microstep. The current tag will be completed as normal. Then the tag will be advanced by one microstep, and reactions triggered by `shutdown` will be executed, along with any other reactions with triggers at that tag, with all reactions executed in precedence order.

In a federated execution, things are more complicated. In general, it is not possible to cease execution in the next microstep because this would mean that every federate has a communication channel to every other with delay equal to one microstep. This this does not create a causality loop, but it means that all federates have to advance time in lockstep, which creates a global barrier synchronization that will likely kill performance. It will also make decentralized coordination impossible because the safe-to-process (STP) threshold for all federates will explode to infinity.

For **centralized coordination**, when a reaction in a federate calls `stop`, the federate sends a **STOP_REQUEST** message to the RTI with its current timestamp _t_ as a payload. It then waits for a **STOP_GRANTED** message with a timestamp payload _s_. During this wait, it must respond to ** STOP_REQUEST** incoming messages from the RTI (and all other messages from the RTI). (It should be possible to complete the current logical time while waiting.) If _s_ > _t_, then it sets `timeout` = _s_ and continues executing, using the timeout mechanism (see above) to stop. If _s_ = _t_, then it completes the current tag as normal but schedules on shutdown phase to occur one microstep later, as in the unfederated case.

When the RTI receives a **STOP_REQUEST** message from a federate, it forwards it to all other federates and waits for a reply from all. Each reply will have a timestamp payload. The RTI chooses _s_, the largest of these timestamps, and sends a **STOP_GRANTED** message to all federates with payload _s_.

When a federate receives a **STOP_REQUEST** message, it replies with its current logical time _t_ and waits for a **STOP_GRANTED** message from the RTI, blocking all execution during the wait. When it gets the reply with payload _s_, if _s_ > _t_, then it sets `timeout` = _s_ and continues executing, using the timeout mechanism (see above) to stop. If _s_ = _t_, then it completes the current tag as normal but schedules on shutdown phase to occur one microstep later, as in the unfederated case.

## External Signal

Each federate and the RTI should catch external signals to shut down in an orderly way.

When a federate gets such an external signal (e.g. control-C), it should send a **RESIGN** message to the RTI and an **EOF** (end of file) on each socket connection to another federate. It should then close all sockets and shut down. The RTI and all other federates should continue running until some other termination condition occurs.

When the RTI gets such an external signal, it should broadcast a **STOP_REQUEST** message to all federates, wait for their replies (with a timeout in case the federate or the network has failed), choose the maximum timestamp _s_ on the replies, broadcast a **STOP_GRANTED** message to all federates with payload _s_, and wait for **LOGICAL_TIME_COMPLETE** messages as above.
