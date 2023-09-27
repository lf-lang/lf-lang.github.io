---
title: "Reactions"
layout: docs
permalink: /docs/handbook/reactions
oneline: "Reactions in Lingua Franca."
preamble: >
---


## Reaction Declaration

A reaction declaration has the following form:

```lf
  reaction [<name>] (<triggers>) [<uses>] [-> <effects>] [{= ... body ...=}]
```

Each reaction declares its triggers, uses, and effects.
Triggers are event sources such as timers, actions, ports, or special triggers like $startup$, $shutdown$, and $reset$.
If any of the declared triggers is present at a given tag, the runtime scheduler automatically invokes the reaction.
Uses are additional reactor elements like actions or ports that the reaction may read from but that do not trigger the reaction.
Finally, effects are all actions or ports that may be scheduled or set by the reaction.

Reactions may optionally be named. The name is cosmetic and may serve as additional documentation. Note that reactions cannot be called like functions, even if they are named.

The reaction's behavior is defined by its body, which should be given in the target programming language. Note that the reaction body may only read from actions and ports that it has declared as triggers or uses, and it may only write to actions and ports that is has declared as an effect. The target code generators implement a scoping mechanism, such that only variables that are declared in the reaction signature are accessible in the reaction body.

In some targets, the reaction body may be omitted and the body can be defined natively in the target language in an external file. See TODO... for details.

## Reaction Order

A reactor may have multiple reactions, and more than one reaction may be enabled at any given tag. In Lingua Franca semantics, if two or more reactions of the same reactor are **simultaneously enabled**, then they will be invoked sequentially in the order in which they are declared. More strongly, the reactions of a reactor are **mutually exclusive** and are invoked in tag order primarily and declaration order secondarily. Consider the following example:

$start(Alignment)$

```lf-c
target C {
  timeout: 3 secs
}
main reactor Alignment {
  state s: int = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self->s += 1;
  =}
  reaction(t2) {=
    self->s -= 2;
  =}
  reaction(t4) {=
    printf("s = %d\n", self->s);
  =}
}
```

```lf-cpp
target Cpp {
  timeout: 3 s
}
main reactor Alignment {
  state s: int(0)
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  timer t4(400 ms, 400 ms)
  reaction(t1) {=
    s += 1;
  =}
  reaction(t2) {=
    s -= 2;
  =}
  reaction(t4) {=
    std::cout << "s = " << std::to_string(s) << std::endl;
  =}
}
```

```lf-py
target Python {
  timeout: 3 secs
}
main reactor Alignment {
  state s = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self.s += 1
  =}
  reaction(t2) {=
    self.s -= 2
  =}
  reaction(t4) {=
    print(f"s = {self.s}")
  =}
}
```

```lf-ts
target TypeScript {
  timeout: 3 s
}
main reactor Alignment {
  state s: number = 0
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  timer t4(400 ms, 400 ms)
  reaction(t1) {=
    s += 1
  =}
  reaction(t2) {=
    s -= 2
  =}
  reaction(t4) {=
    console.log(`s = ${s}`)
  =}
}
```

```lf-rs
target Rust {
  timeout: 3 secs
}
main reactor Alignment {
  state s: u32 = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  timer t4(400 msec, 400 msec)
  reaction(t1) {=
    self.s += 1;
  =}
  reaction(t2) {=
    self.s -= 2;
  =}
  reaction(t4) {=
    println!("s = {}", self.s);
  =}
}
```

$end(Alignment)$

Every 100 ms, this increments the state variable `s` by 1, every 200 ms, it decrements `s` by 2, and every 400 ms, it prints the value of `s`. When these reactions align, they are invoked in declaration order, and, as a result, the printed value of `s` is always 0.

## Overwriting Outputs

Just as the reactions of the `Alignment` reactor overwrite the state variable `s`, logically simultaneous reactions can overwrite outputs. Consider the following example:

$start(Overwriting)$

```lf-c
target C
reactor Overwriting {
  output y: int
  state s: int = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self->s += 1;
    lf_set(y, self->s);
  =}
  reaction(t2) -> y {=
    self->s -= 2;
    lf_set(y, self->s);
  =}
}
```

```lf-cpp
target Cpp
reactor Overwriting {
  output y: int
  state s: int(0)
  timer t1(100 ms, 100 ms)
  timer t2(200 ms, 200 ms)
  reaction(t1) -> y {=
    s += 1;
    y.set(s);
  =}
  reaction(t2) -> y {=
    s -= 2;
    y.set(s);
  =}
}
```

```lf-py
target Python
reactor Overwriting {
  output y
  state s = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self.s += 1
    y.set(self.s)
  =}
  reaction(t2) -> y {=
    self.s -= 2
    y.set(self.s)
  =}
}
```

```lf-ts
target TypeScript
reactor Overwriting {
  output y: number
  state s: number = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    s += 1
    y = s
  =}
  reaction(t2) -> y {=
    s -= 2
    y = s
  =}
}
```

```lf-rs
target Rust
reactor Overwriting {
  output y: u32
  state s: u32 = 0
  timer t1(100 msec, 100 msec)
  timer t2(200 msec, 200 msec)
  reaction(t1) -> y {=
    self.s += 1;
    ctx.set(y, self.s);
  =}
  reaction(t2) -> y {=
    self.s -= 2;
    ctx.set(y, self.s);
  =}
}
```

$end(Overwriting)$

Here, the reaction to `t1` will set the output to 1 or 2, but every time it sets it to 2, the second reaction (to `t2`) will overwrite the output with the value 0. As a consequence, the outputs will be 1, 0, 1, 0, ... deterministically.

## Reacting to Outputs of Contained Reactors

A reaction may be triggered by the an input to the reactor, but also by an output of a contained reactor, as illustrated in the following example:

$start(Contained)$

```lf-c
target C
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if (s.y->value != 0 && s.y->value != 1) {
      lf_print_error_and_exit("Outputs should only be 0 or 1!");
    }
  =}
}
```

```lf-cpp
target Cpp
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    auto is_correct = [](auto value){
      return value == 0 || value == 1;
    };
    if (s.y.is_present() && !is_correct(*s.y.get())) {
      std::cout << "Output shoudl only be 0 or 1!" << std::endl;
    }
  =}
}
```

```lf-py
target Python
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if s.y.value != 0 and s.y.value != 1:
      sys.stderr.write("ERROR: Outputs should only be 0 or 1!\n")
      exit(1)
  =}
}
```

```lf-ts
target TypeScript
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    if (s.y != 0 && s.y != 1) {
      util.requestErrorStop("Outputs should only be 0 or 1!")
    }
  =}
}
```

```lf-rs
target Rust
import Overwriting from "Overwriting.lf"
main reactor {
  s = new Overwriting()
  reaction(s.y) {=
    let value = ctx.get(s__y).unwrap();
    if value != 0 && value != 1 {
      eprintln!("Output schould only be 0 or 1!");
      ctx.request_stop(Asap);
    }
  =}
}
```

$end(Contained)$

<img alt="Lingua Franca diagram" src="../../../../../img/diagrams/Contained.svg" width="300"/>

This instantiates the above `Overwriting` reactor and monitors its outputs.

## Triggering Contained Reactors

A reaction can set the input of a contained reactor, thereby triggering its reactions, as illustrated in the following example:

$start(Triggering)$

```lf-c
target C
reactor Inside {
  input x: int
  reaction(x) {=
    printf("Received %d\n", x->value);=
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    lf_set(i.x, 42);
  =}
}
```

```lf-cpp
target Cpp
reactor Inside {
  input x: int
  reaction(x) {=
    std::cout << "Received " << std::to_string(*x.get()) << std::endl;
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x.set(42);
  =}
}
```

```lf-py
target Python
reactor Inside {
  input x
  reaction(x) {=
    print(f"Received {x.value}")
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x.set(42);
  =}
}
```

```lf-ts
target TypeScript
reactor Inside {
  input x: number
  reaction(x) {=
    console.log("Received ${x}");
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    i.x = 42
  =}
}
```

```lf-rs
target Rust
reactor Inside {
  input x: u32
  reaction(x) {=
    println!("Received {}", ctx.get(x).unwrap());
  =}
}
main reactor {
  i = new Inside()
  reaction(startup) -> i.x {=
    ctx.set(i__x, 42);
  =}
}
```

$end(Triggering)$

The reaction to $startup$ declares the input port of the inside reactor as an effect and then sets it with value 42.
This will cause the inside reactor's reaction to execute and print `Received 42`.

## Startup, Shutdown, and Reset Reactions

Reactions may be triggered by the special events $startup$, $shutdown$, or $reset$.
For example,

```lf
  reaction(startup) {=
    // ... Do something
  =}
```

A reaction to $startup$ is triggered at the very first tag when the program begins (or, if within a mode of a [modal reactor](/docs/handbook/modal-models), when the mode is first entered).
This reaction will be logically simultaneous with reactions to [timers](/docs/handbook/time-and-timers) that have a zero offset.
As usual, for logically simultaneous reactions declared within the same reactor, the order in which they are invoked will be governed by the order in which they are declared.

A reaction to $shutdown$ is invoked at program termination.
See the [Termination](/docs/handbook/termination) section for details.

<div class="lf-cpp lf-ts lf-rs">

Reactions to the $reset$ event are not supported in $target-language$ because [modal reactors](/docs/handbook/modal-models) are not supported.

</div>

<div class="lf-c lf-py">

A reaction to the $reset$ event is invoked if the reaction or reactor is within a mode of a [modal reactor](/docs/handbook/modal-models) and the mode is entered via a reset transition.
For details, see the [Modal Reactors](/docs/handbook/modal-models) section.

</div>

