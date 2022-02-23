---
title: About the Cpp Target
layout: docs
permalink: /docs/handbook/about-the-cpp-target
oneline: "About the C++ target in Lingua Franca."
preamble: >
---

## About the Cpp Target

In the C++ reactor target for Lingua Franca, reactions are written in C++ and the code generator generates a standalone C++ program that can be compiled and run on all major platforms. Our continous integration ensures compatibility with Windows, MacOS and Linux.
The C++ target solely depends on a working C++ build system including a recent C++ compiler (supporting C++17) and [CMake](https://cmake.org/) (>= 3.5). It relies on the [reactor-cpp](https://github.com/tud-ccc/reactor-cpp) runtime, which is automatically fetched and compiled in the background by the Lingua Franca compiler.

Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe.

## Setup for the Cpp Target

The following tools are required in order to compile the generated C++ source code:

- A recent C++ compiler supporting C++17
- A recent version of cmake (At least 3.5)
