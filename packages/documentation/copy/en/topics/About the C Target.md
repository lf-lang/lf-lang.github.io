---
title: About the C Target
layout: docs
permalink: /docs/handbook/about-the-c-target
oneline: "About the C target in Lingua Franca."
preamble: >
---

## About the C Target

When you specify the C target for Lingua Franca, the code generator generates one or more standalone C programs that can be compiled and run on several platforms. It has been tested on MacOS, Linux, Windows, and at least one bare-iron embedded platforms. The single-threaded version is the most portable, requiring only a handful of common C libraries (see [Included Libraries](#included-libraries) below). The multithreaded version requires a small subset of the Posix thread library (`pthreads`) and transparently executes in parallel on a multicore machine while preserving the deterministic semantics of Lingua Franca.

Note that C is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Here, we provide some guidelines for a style for writing reactors that will be safe.

**NOTE:** If you intend to use C++ code or import C++ libraries in the C target, then you should specify instead the [CCpp target](#the-ccpp-target), which automatically uses a C++ compiler by default. Alternatively, you can use the Cpp target and write all the code in C++.

## Setup for the C Target

**FIXME**
