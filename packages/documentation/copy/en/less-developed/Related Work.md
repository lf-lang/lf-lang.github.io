---
title: "Related Work"
layout: docs
permalink: /docs/handbook/related-work
oneline: "Related Work"
preamble: >
---
Lingua Franca is focused more on using the best ideas than on being innovative.
Here, we list most closely related work first, then other work with which it may be useful to contrast.

## Software Frameworks

* [Rubus](https://link.springer.com/article/10.1007%2Fs10270-020-00795-5).

* [Akka framework](https://www.sciencedirect.com/science/article/abs/pii/S0167739X20330739) for distributed Fog computing.

* [Accessors](http://accessors.org), from Berkeley, a JavaScript-based framework for IoT: This framework is the most direct inspiration for Lingua Franca. The idea behind accessors is to componentize IoT resources by encapsulating them in actors. As such, their interactions can be coordinated under a discrete event semantics [paper](http://www.icyphy.org/pubs/75.html).

* [Rebecca](https://rebeca-lang.org).

* The [Kiel Integrated Environment for Layout Eclipse Rich Client](https://www.rtsys.informatik.uni-kiel.de/en/research/kieler/welcome-to-the-kieler-project) (**KIELER**) is a graphical environment for programming using [SCCharts](https://rtsys.informatik.uni-kiel.de/confluence/display/KIELER/SCCharts) (see the [2014 PLDI paper](https://doi.org/10.1145/2594291.2594310)).

* **[RTMAPS](https://intempora.com/products/rtmaps#about-rtmaps)**: From Intempora. It has a graphical syntax in a UI and advertises "data is acquired asynchronously and each data sample is captured along with its time stamp at its own pace." You can build your own blocks in C++ or Python. It does, however, look like its not deterministic.

### Usage of the Term Reactor

* **[reactors.io](http://reactors.io/)**: This project, from EPFL, originally used the term "reactive isolates" in a [2015 paper](https://dl.acm.org/citation.cfm?doid=2814228.2814245). In 2016, Prokopec changed the name "reactive isolates" to "reactors" (see [2018 paper](http://doi.org/10.1007/978-3-030-00302-9_5)). They claim their reactors are "actors done right," but they remain nondeterministic. See a [video overview](https://www.youtube.com/watch?v=7lulYWWD4Qo).

* [Racket implementation of ReactiveML](https://docs.racket-lang.org/reactor/index.html)

* **FIXME** https://projectreactor.io/ based on http://www.reactive-streams.org/

### Other Pointers

* **[Reactive Manifesto](https://www.reactivemanifesto.org/)**: Version 2.0, Published in 2014, this position paper defines Reactive Systems as those that are Responsive, Resilient, Elastic and Message Driven.


## Academic Projects

* [I/O Automata](https://en.wikipedia.org/wiki/Input%2Foutput_automaton), from MIT, is a formalism that could be used to model the semantics of Lingua Franca. Timed I/O Automata FIXME: link extend I/O Automata with temporal semantics. They share with LF the notion of reactions to input messages and internal events that change the state of an actor and produce outputs. The behavior of a component is given as a state machine.

* **FIXME** Hewitt actors.

* **SyncCharts**: By Charles André. See the [1996 technical report](http://www-sop.inria.fr/members/Charles.Andre/CA%20Publis/SYNCCHARTS/overview.html).

* **ReactiveML**: [Website](http://reactiveml.org)

## Contrasting Work

* [CAPH](http://caph.univ-bpclermont.fr/CAPH/CAPH.html) (a recursive acronym for CAPH Ain't plain HDL), a hardware description language from CNRS, is a fine-grained dataflow language for compiling into FPGAs. The language has no temporal semantics, and although it has a notion of firing rules, it is not clear which of the many variants of dataflow is realized nor whether the MoC is deterministic. The [paper](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6972018) does not cite any of the prior work on dataflow MoCs.

* [Robot Operating System (ROS)](https://en.wikipedia.org/wiki/Robot_Operating_System), an open-source project originally from [Willow Garage](https://en.wikipedia.org/wiki/Willow_Garage): ROS provides a publish-and-subscribe server for interaction between components. Version 1 has no timing properties at all. Version 2 has some timing properties such as priorities, but it makes no effort to be deterministic.

* [RADLER framework](https://sri-csl.github.io/radler/) from SRI, which is based on a publish-and-subscribe architecture similar to ROS. It introduces some timing constructs such as periodic execution and scheduling constraints, but it makes no effort to be deterministic.