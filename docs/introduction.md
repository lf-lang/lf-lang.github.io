---
title: Introduction
description: Introduction to Lingua Franca.
slug: /
---

Lingua Franca (LF) is a polyglot coordination language built to enrich mainstream target programming languages (currently C, C++, Python, TypeScript, and Rust) with deterministic reactive concurrency and the ability to specify timed behavior. LF is supported by a runtime system that is capable of concurrent and distributed execution of reactive programs that are deployable on the Cloud, the Edge, and even on bare-iron embedded platforms.

As you build your programs, the tools automatically generate interactive diagrams that show the components of your program. For example:

import RegressionTestSVG from "./assets/images/diagrams/MainReactor.svg"

<RegressionTestSVG title="Lingua Franca diagram: RegressionTest" role="img" width="700" />

A Lingua Franca program specifies the interactions between concurrent components called reactors. There are three reactors above. Each reactor contains one or more reactions, which specify code (in C, C++, Python, Rust, or TypeScript) to execute when triggered by events. Events come from timers (periodic and aperiodic), input ports, or from the environment.

If the application has exploitable parallelism, then it executes transparently on multiple cores or multiple machines without compromising determinacy. The above program shows a simple pipeline chain, where reactions A1, B1, and the reactions in C all can execute in parallel. The logical delays of 100 ms on connections between ports enable such parallel execution. In ReactorC, reactions C1 and C2 do not execute in parallel because they (potentially) share state variables. The deterministic semantics of LF ensures that for the above program, reaction C1 will always process the previous result of B1 (not the one being computed in parallel), which is triggered by the 200ms-old result from A1. Only after reaction C1 completes, reaction C2 will process the 200ms-old result from A1. Hence, despite the parallel execution, and even if this program is distributed across networked hosts, the computation is deterministic and repeatable.

The `lfc` code generator synthesizes one or more programs in the target language, which are then compiled using standard tool chains. A distributed (federated) application translates into multiple programs and scripts to launch those programs on distributed machines. The communication fabric connecting components is synthesized as part of the programs.


## Reactor-Oriented Programming
Reactors are stateful components with event-triggered routines that may read inputs, write outputs, manipulate the reactor's state and schedule future events. 
Reactors are similar to actors, software components that send each other messages, but unlike classical actors, messages are timestamped, and concurrent composition of reactors is deterministic by default. When nondeterministic interactions are tolerable or desired, they must be explicitly coded.

LF itself is a polyglot composition language, not a complete programming language. LF describes the interfaces and composition of reactors. See our [publications and presentations](/research) on reactors and Lingua Franca.

The reactor-oriented programming paradigm is informally described via the following principles:

1. _Components_ — Reactors can have input ports, actions, and timers, all of which are triggers. Actions are used to schedule irregular (non-periodic) events, whereas timers specify periodic events. Reactors can also have output ports, local state, parameters, and an ordered list of reactions.
2. _Composition_ — A reactor may contain other reactors and manage their connections. The connections define the flow of messages, and two reactors can be connected if they are contained by the same reactor or one is directly contained in the other (i.e., connections span at most one level of hierarchy). An output port may be connected to multiple input ports, but an input port can only be connected to a single output port.
3. _Events_ — Every event has a tag (a form of timestamp), and every reactor reacts to events in tag order. When a reactor reacts to more than one event with the same tag, the reaction order is deterministic, so the results are predictable. Each port, timer, and action can have at most one event at any tag. An event may carry a value that will be passed as an argument to triggered reactions.
4. _Reactions_ — A reaction is a procedure in a target language that is invoked in response to a trigger event, and only in response to a trigger event. A reaction can read input ports, even those that do not trigger it, and can produce outputs, but it must declare all inputs that it may read and output ports to which it may write. All inputs that it reads and outputs that it produces bear the same tag as its triggering event. I.e., the reaction itself is logically instantaneous, so any output events it produces are logically simultaneous with the triggering event (the two events bear the same timestamp).
5. _Flow of Time_ — Successive invocations of any single reaction occur at strictly increasing tags. Any messages that are not read by a reaction triggered at the tag of the message are lost.
6. _Mutual Exclusion_ — The execution of any two reactions _of the same reactor_ are mutually exclusive (atomic with respect to one another). Moreover, any two reactions that are invoked at the same tag are invoked in the order specified by the reactor definition. This avoids race conditions between reactions accessing the reactor state variables.
7. _Determinism_ — A Lingua Franca program is deterministic unless the programmer explicit uses nondeterministic constructs. Given the same input data, a composition of reactors has exactly one correct behavior. This makes Lingua Franca programs _testable_.
8. _Concurrency_ — Dependencies between reactions are explicitly declared in a Lingua Franca program, and reactions that are not dependent on one another can be executed in parallel on a multi-core machine. For targets supporting federated execution (currently C, Python, and TypeScript), execution can be distributed across networks.
9. _Feedback_ - Messages can flow in feedback cycles. The compiler automatically identifies causality loops that may be introduced by the programmer. A causality loop makes it impossible for the compiler to determine an order of reaction invocation at a tag that preserves determinism.

## Getting Started
To get started with Lingua Franca, [set up a development environment](./installation.md) and learn how to write [a first reactor](./writing-reactors/a-first-reactor.mdx). There are also a number of potentially useful [videos](./videos.mdx) available.
