---
title: Setup for Python
layout: docs
permalink: /docs/handbook/setup-for-python
oneline: "Set up the Python target in Lingua Franca."
preamble: >
---

## About the Python Target

In the Python reactor target for Lingua Franca, reactions are written in Python. The user-written reactors are then generated into a Python 3 script that can be executed on several platforms. The Python target has been tested on Linux, MacOS, and Windows. To facilitate efficient and fast execution of Python code, the generated program relies on a C extension to facilitate Lingua Franca APIs such as `set` and `schedule`. To learn more about the structure of the generated Python program, see [Implementation Details](#implementation-details).

Python reactors can bring the vast library of scientific modules that exist for Python into a Lingua Franca program. Moreover, since the Python reactor target is based on a fast and efficient C runtime library, Lingua Franca programs can execute much faster than native equivalent Python programs in many cases. Finally, interoperability with C reactors is planned for the future.

**NOTE:** In comparison to the C reactor target, the Python target can be up to an order of magnitude slower. However, depending on the type of application and the implementation optimizations in Python, you can achieve an on-par performance to the C target in many applications.

## Set Up the Python Target

First, install Python 3 on your machine. See [downloading Python](https://wiki.python.org/moin/BeginnersGuide/Download).

**NOTE:** The Python target requires a C implementation of Python (nicknamed CPython). This is what you will get if you use the above link, or with most of the alternative Python installations such as Anaconda. See [this](https://www.python.org/download/alternatives/) for more details.

The Python reactor target relies on `pip` and `setuptools` to be able to compile and install a [Python C extension](https://docs.python.org/3/extending/extending.html) for each LF program. To install `pip3`, you can follow instructions [here](https://pip.pypa.io/en/stable/installation/).
`setuptools` can be installed using `pip3`:

```bash
pip3 install setuptools
```

**NOTE:** A [Python C extension](https://docs.python.org/3/extending/extending.html) is currently generated for each Lingua Franca program. To ensure cross-compatibility across multiple platforms, this extension is installed in the user space once code generation is finished (see [Implementation Details](#implementation-details)). This extension module will have the name LinguaFranca[your_LF_program_name]. There is a handy script [here](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/uninstallAllLinguaFrancaTestPackages.sh) that can uninstall all extension modules that are installed automatically by Lingua Franca tools (such as `lfc`).
