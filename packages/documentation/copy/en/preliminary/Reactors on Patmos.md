---
title: "Reactors on Patmos"
layout: docs
permalink: /docs/handbook/reactors-on-patmos
oneline: "Reactors on Patmos (preliminary)"
preamble: >
---

## Reactors on Patmos

Reactors can be executed on [Patmos](https://github.com/t-crest/patmos), a bare-metal execution platform
that is optimized for time-predictable execution. Well written C programs can be analyzed for their
worst-case execution time (WCET).

### Compiling and Running Reactors

Patmos can run in an FPGA, but there are also two
simulators available:

1. `pasim` a software ISA simulator that is written in C++.
2. `patemu` a cycle-accurate hardware emulator generated from the hardware description.

To execute reactions on Patmos, the [Patmos toolchain](https://github.com/t-crest/patmos) needs
to be installed. The web page contains a quick start, detailed information including how to
perform WCET analysis is available in the
[Patmos Reference Handbook](http://patmos.compute.dtu.dk/patmos_handbook.pdf).

To execute the "hello world" reactor on Patmos use the LF compiler to generate the C code.
Compile the reactor with the Patmos compiler (in `src-gen`):

    patmos-clang Minimal.c -o Minimal.elf

The reactor can be executed on the SW simulator with:

    pasim Minimal.elf

As Patmos is a bare metal runtime that has no notion of calendar time, its start time
is considered the epoch and the following output will be observed:

```
Start execution at time Thu Jan  1 00:00:00 1970
plus 640000 nanoseconds.
Hello World.
Elapsed logical time (in nsec): 0
Elapsed physical time (in nsec): 3970000
```

The reactor can also be executed on the hardware emulator of Patmos:

    patemu Minimal.elf

This execution is considerably slower than the SW simulator, as the concrete hardware
of Patmos is simulated cycle-accurate.

### Worst-Case Execution Time Analysis

Following example is a code fragment from
[Wcet.lf](https://github.com/lf-lang/lingua-franca/blob/master/xtext/org.icyphy.linguafranca/src/test/C/src/Wcet.lf).

```lf-c
reactor Work {
    input in1: int;
    input in2: int;
    output out:int;
    reaction(in1, in2) -> out {=
    	int ret;
    	if (in1 > 10) {
    		ret = in2 * in1;
    	} else {
    		ret = in2 + in1;
    	}
        SET(out, ret);
    =}
}
```

We want to perform WCET analysis of the single reaction of the Work reactor.
This reaction, depending on the input data, will either perform a multiplication,
which is more expensive in Patmos, or an addition. The WCET analysis shall consider
the multiplication path as the worst-case path. To generate the information for
WCET analysis by the compiler we have to compile the application as follows:

    patmos-clang -O2 -mserialize=wcet.pml Wcet.c

We investigate the C source code `Wcet.c` and find that the reaction we
are interested is named `reaction_function1`. Therefore, we invoke WCET analysis
as follows:

    platin wcet -i wcet.pml -b a.out -e reaction_function1 --report

This results in following report:

```
...
[platin] INFO: Finished run WCET analysis (platin)          in 62 ms
[platin] INFO: best WCET bound: 242 cycles
---
- analysis-entry: reaction_function1
  source: platin
  cycles: 242
...
```

The analysis gives the WCET of 242 clock cycles for the reaction,
which includes clock cycles for data cache misses.
Further details on the WCET analysis
tool `platin` and e.g., how to annotate loop bounds can be found in the
[Patmos Reference Handbook](http://patmos.compute.dtu.dk/patmos_handbook.pdf).

Note, that the WCET analysis of a reaction does only include the code of the
reaction function, not the cache miss cost of calling the function from
the scheduler or the cache miss cost when returning to the scheduler.
