---
title: FlexPRET
description: Developing LF Programs for FlexPRET.
---
# Overview

FlexPRET is a precision-timed (PRET) machine designed for mixed-criticality 
systems. As of 2024, PRET machines are an open field of research. Refer to its
[github page](https://github.com/pretis/flexpret) for more in-depth information.
FlexPRET either needs to be emulated or run on a Field-Programmable Gate Array 
(FPGA). In this guide we will show you how to pair FlexPRET with Lingua Franca,
leaving you with precise software execution.

As a developer, you should be aware of a significant difference between FlexPRET's
notion of threads versus other platforms. FlexPRET uses fined-grained *hardware* 
threads, as opposed to the usual (software) threads. This means that if multiple 
threads are running, they can swap every clock cycle. In addition, hardware
threads are designed to be isolated, meaning the execution time of one thread
will not affect the execution time of another, as opposed to concurrent software
threads. Since the threads are implemented in hardware, FlexPRET can only have
a maximum of eight.

# Prerequisites

- cmake
- sbt to build FlexPRET

# Getting started

## Development environment setup

1. We start out by setting up a development environment. Clone the 
`lf-flexpret-template` from Github:
```
TODO: Github link with --recurse-submodules
```
2. Source the `env.bash` or `env.fish` to set up necessary environment variables. You will need to do this every time, so it could be a good idea to add this to your `~/.bashrc`.
```
source env.bash
```
```
source env.fish
```

## FlexPRET build

3. Now we will build the FlexPRET emulator. Step into the FlexPRET directory and build the default configuration with `cmake`.
```
cd flexpret
cmake -B build && cd build && make
```

4. You should now install the FlexPRET build to the FlexPRET software development kit (SDK). This provides the SDK with the necessary knowledge of FlexPRET's hardware configuration, such as the amount of data memory available.
```
make install
```

5. Next, step into the SDK and compile it. This step is strictly speaking not necessary, but it is good to know the system works as expected.
```
cd ../sdk
cmake -B build && cd build && make && ctest
```

## Lingua Franca on FlexPRET

6. Step back to the top-level directory and compile a sample LF application.
```
lfc src/Test.lf
```

7. Run the compiled program on the FlexPRET emulator.
```
fp-emu +ispm=src-gen/Test/build/Test.mem
```

8. Verify that you see the expected output
```
TODO: Add expected output
```

## Building FlexPRET with another configuration

TODO: URL
Refer to the [FlexPRET docs](./flexpret/README.md#Configuration) for more information on how to run a non-default and custom FlexPRET configuration.

# FlexPRET on FPGA

TODO: Write

# FlexPRET specific features


TODO: Describe and create example program
1. fp_int_on_expire()
2. interrupt temporal isolation


