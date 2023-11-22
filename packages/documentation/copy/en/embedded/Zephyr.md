---
title: Zephyr
layout: docs
permalink: /docs/handbook/zephyr
oneline: "Developing LF Programs for Zephyr RTOS."
preamble: >
---
# Overview
Lingua Franca's C-runtime supports the Zephyr RTOS. This enables developing and
programming [hundreds](https://docs.zephyrproject.org/latest/boards/index.html)
of resource-constrained microcontrollers. In this guide we will see how LF
programs can be built, programmed and debugged both in emulation and on real
hardware. When developing LF programs for Zephyr we use a `west`-centric
approach. Using `west`, which is the preferred build tool for Zephyr projects,
requires structuring the code base and development flow as expected by `west`.
We use a [T3 Forest
Topology](https://docs.zephyrproject.org/latest/develop/west/workspaces.html#west-t3)
for our workspace. This means that we create a workspace where multiple
different LF Zephyr projects can be hosted together with a single copy of the
Zephyr RTOS sources.

## Prerequisites
- Linux or macOS development system. (The guide is written for Linux)
- nrf52 Development Kit (optional)

# Getting started
The first step is to set up a proper Zephyr development environment. Follow the
steps in the **Install dependencies** and **Install Zephyr SDK** sections of the
official [Zephyr Getting Started
Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html).
Do not perform the steps under **Get Zephyr and install Python
dependencies**. These steps will be performed inside the LF Zephyr workspace we
are going to create next.

## Setting up the LF Zephyr workspace

1. Clone the template repository into a workspace directory of Zephyr projects
```
git clone https://github.com/lf-lang/lf-west-template lf-zephyr-workspace && cd lf-zephyr-workspace
```

2. Setup and activate a virtual environment
```
python3 -m venv .venv
source .venv/bin/activate
```

3. Install `west`
```
pip3 install west
```

Now `west` is installed within a virtual environment. **This environment has to
be activated every time you want to use west with LF**

4. Get the Zephyr source code
```
west update
```

5. Export CMake packages for Zephyr
```
west zephyr-export
```

6. Install Python dependencies
```
pip install -r deps/zephyr/scripts/requirements.txt
```

## Workspace organization
Now you should have the following installed:
-`west`; Verify with `west boards`
- Zephyr SDK located at `/opt/zephyr-sdk-VERSION`
- Zephyr RTOS pulled down to `deps/zephyr`
- A few example applications under `apps/`

This workspace is meant to house all of your different LF Zephyr apps, as long
as they are using the same version of Zephyr. Each app has to contain the
following:
```
<app>
├── app.overlay
├── prj.conf
├── Kconfig
└── src
    └── MyApplication.lf
```

Our custom west-extension will invoke `lfc` and create a `src-gen` directory
structured as a [Zephyr
application](https://docs.zephyrproject.org/latest/develop/application/index.html).
This generated project can then be built, emulated or flashed by `west`.



## Hello World!

You should now be able to build and emulate a simple "Hello World" LF program:

```
cd apps/HelloWorld
lfc src/HelloWorld.lf -n
west build src-gen/HelloWorld -t run
```
`HelloWorld.lf` has the target properties `platform: "Zephyr"` and `threading:
false`. This tells `lfc` to create a Zephyr-compatible CMake project. Then we
use `west` to build the generated CMake project and to start an emulation.

To enable **west-centric** development we have added a custom west command,
`west lfc`. It is a wrapper around the original lfc but also copies the files
`prj.conf` and `Kconfig` into to generated project. It can also invoke `west
build` directly. The above example can be compiled and emulated with the
following command:
```
west lfc src/HelloWorld.lf --build "-t run"
```

The string within the quotation marks after `--build` is passed on to `west
build`.

## Nrf52 blinky
In this example we will program a simple Blinky program onto an nrf52dk. This
requires an actual nrf52 board and also the `nrfjprog` utility is installed. See
the following installation guide
[here](https://www.nordicsemi.com/Products/Development-tools/nrf-command-line-tools/download).

```
cd apps/NrfBlinky
west lfc src/NrfBlinky.lf --build "-p always -b nrf52dk_nrf52832"
west flash
```
In this example we use the `-p always` to tell west to do a clean build and `-b
nrf52dk_nrf52832` to target the nrf52dk. These parameters are west-specific so
refer to west documentation for more info. `west flash` is used to interact with
`nrfjprog` and flash the application into the dev-board.

## Bare-bones Zephyr app
We also have a simple example of a bare-bones Zephyr app. This requires a
physical board. 

```
cd apps/HelloZephyr
west build -b nrf52dk_nrf52832 -p always
west flash
```

# Zephyr configuration options
The Lingua Franca Zephyr platform depends on some specific [Zephyr Kernel
configurations](https://docs.zephyrproject.org/latest/build/kconfig/index.html#).
For instance, the Counter drivers must be linked with the application to provide
hi-resolution timing. These required configurations are stored in a file called
`prj_lf.conf` which `lfc` generates into the `src-gen` folder. You can provide
your own configurations through the following three files that `west lfc`
expects to find at the root of each app:
1. `prj.conf`, see [Seeting symbols in configuration files](https://docs.zephyrproject.org/latest/build/kconfig/setting.html#setting-symbols-in-configuration-files) 
2. `Kconfig`, see [Configuration system (Kconfig)](https://docs.zephyrproject.org/latest/build/kconfig/index.html)
3. `app.overlay`, see [Devicetree](https://docs.zephyrproject.org/latest/build/dts/index.html#devicetree)


# The `west lfc` command
The custom `lfc` west command has already been used in previous sections. It can
be inspected in `scripts/lf_build.py`. It invokes `lfc` on the provided LF
source file. It also copies `app.overlay`,`prj.conf` and `Kconfig` into the
src-gen directory before it, optionally, calls `west build` on the resulting
project.

Please see `west lfc --help` for more information and the `scripts/lf_build.py`.

# LFC-centric development
In this guide we have shown how LF Zephyr apps can be developed in a
`west`-centric manner. It is also possible to target Zephyr in a `lfc`-centric
approach. When you give `lfc` a LF program with the `platform` target property
set to `Zephyr`, it will generate a Zephyr project that can be built with
`west`. For this to work, the environment variable `ZEPHYR_BASE` must be set to
point to the Zephyr RTOS sources. To demonstrate this, create a simple example
program:
```
cat >> LfcCentricZephyr.lf << 'END'
target C {
    platform: "Zephyr"
}
main reactor{
    reaction(startup) {=
        lf_print("Hello World!");
    =}
}
END
```

If `west` is installed in a virtual environment, activate it, and set up the
environment. Assuming that the template is located at `/home/lf-zephyr-workspace`

```
source /home/lf-zephyr-workspace/.venv/bin/activate
export ZEPHYR_BASE=/home/lf-zephyr-workspace/deps/zephyr
lfc LfcCentricZephyr.lf
```

This will create a Zephyr project at `src-gen/LfcCentricZephyr` and invoke
the Zephyr toolchain to compile it. Since we have not specified any board,
the default, which is `qemu_cortex_m3`, is used. We can run an emulation of
the program with:
```
cd src-gen/LfcCentricZephyr
west build -t run
```

# Debugging LF Zephyr programs using QEMU and GDB
In this section we will see how a LF program can be debugged while running in
QEMU emulation.

1. Compile `HelloWorld.lf` for `qemu_cortex_m3`
```
cd apps/HelloWorld
west lfc src/HelloWorld.lf --build "-b qemu_cortex_m3 -p always"
```
Note that we here, unlike the very first example, explicitly tell `lfc` that we
are targeting a `qemu_cortex_m3` platform. This is the default platform which is
used unless another is specified. It is added here for clarity. 

2. In one terminal, start qemu as a debug server waiting for a local connection
   from `gdb`
```
ninja -C build debugserver
```

3. In another terminal start `gdb` and connect to the qemu server. Load the
   application image and run until main.
```
/ZEPHYR_SDK_INSTALL_DIR/arm-zephyr-eabi/bin/arm-zephyr-eabi-gdb
(gdb) target remote localhost:1234
(gdb) file build/zephyr/zephyr.elf
(gdb) b main
(gdb) c
```

From here you can step through the LF program. To get a more visual interface you can try:
```
(gdb) tui enable
```

## Timing in QEMU emulations
The QEMU emulation is not cycle-accurate and implements optimizations such that
if the system goes to sleep, like when the last active thread in the program
calls `k_sleep()`, then the emulator fast-forwards time. This does not affect
the QEMU-emulation of the *unthreaded* runtime since it implements sleeping
between events using *busy-waits*. However, the *threaded* runtime sleeps
between events using a call to `k_cond_timedwait` which has the side-effect that
QEMU fast-forwards time. This causes the emulation of threaded programs to
appear as if the `fast` target property was set to `true`. 

## Troubleshooting

### Multiple Zephyr installations
If the following warning is shown when invoking `west lfc` or any other `west`
command:
```
WARNING: ZEPHYR_BASE=/path/to/zephyr in the calling environment will be used,
but the zephyr.base config option in /path/to/lf-west-template is "deps/zephyr"
which implies a different ZEPHYR_BASE=/path/to/lf-west-template/deps/zephyr
To disable this warning in the future, execute 'west config --global zephyr.base-prefer env'
```

Then it means that you have multiple Zephyr repositories installed. We do not
recommend this as `west` will link the application with the Zephyr found in the
CMake package registry. Please refer to the Getting Started section to purge the
system of old Zephyr installations.
