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
requires structuring the code base and development flow as expected by `west`. To interact
with the Lingua Franca Compiler we provide custom `west`-extensions which invoke
`lfc` before building the Zephyr application. This in contrast to our
Arduino-support, which is `lfc`-centric.

## Prerequisites
- Linux or macOS development system
- nrf52 Development Kit (optional)

# Getting started

This section consists in part of borrowed sections from the [Zephyr Getting
Started
Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html).
Please refer to the official Zephyr documentation for more background and
specifics regarding the use of `west`.

## Pull the lf-west-template
```
git clone https://github.com/lf-lang/lf-west-template lf-west && cd lf-west
```

## Install `west`

1. Setup and activate a virtual environment
```
python3 -m venv .venv
source .venv/bin/activate
```

2. Install `west`
```
pip3 install west
```

Now `west` is installed within a virtual environment. **This environment has to
be activated every time you want to use west with LF**

## Installing Zephyr SDK
1. Download and install Zephyr SDK to `/opt`
```
cd ~
wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.1/zephyr-sdk-0.16.1_linux-x86_64.tar.xz
wget -O - https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.1/sha256.sum | shasum --check --ignore-missing

tar xvf zephyr-sdk-0.16.1_linux-x86_64.tar.xz --directory /opt/
cd /opt/zephyr-sdk-0.16.1
./setup.sh
```

2. Install udev rules for flashing and debugging boards
```
sudo cp /opt/zephyr-sdk-0.16.1/sysroots/x86_64-pokysdk-linux/usr/share/openocd/contrib/60-openocd.rules /etc/udev/rules.d
sudo udevadm control --reload
```

## Download the Zephyr RTOS
1. Remove old Zephyr installations from your system.
```
echo $ZEPHYR_BASE
```
should be empty.

```
ls ~/.cmake/packages
```
should not contain `Zephyr` or `ZephyrUnittest`. If they do, delete them. They will be replaced later when we do `west zephyr-export`.

2. Download the Zephyr RTOS to the template repository. This step will take some time
```
west update
```

3. Export CMake packages for Zephyr
```
west zephyr-export
```

4. Install Python dependencies
```
pip install -r deps/zephyr/scripts/requirements.txt
```

# Hello World!
Now you should have the following installed:
1. `west`; Verify with `west boards`
2. Zephyr SDK located at `/opt/zephyr-sdk-0.16.1`
3. Zephyr RTOS pulled down to `/deps/zephyr`

You should now be able to build and emulate a simple Hello World! LF program:

```
cd application
lfc src/HelloWorld.lf -n
west build src-gen/HelloWorld -t run
```
`HelloWorld.lf` has the target properties `platform: "Zephyr"` and `threading: false`. This tells `lfc` to create a Zephyr-compatible CMake project. Then we use `west` to build the
generated CMake project and to start an emulation.

To enable **west-centric** development we have added a custom west command, `west lfc`. 
It is a wrapper around the original lfc but also copies the files `prj.conf` and `Kconfig`
into to generated project. It can also invoke `west build` directly. The above example
can be compiled and emulated with the following command:
```
west lfc src/HelloWorld.lf --build "-t run"
```

The string within the quotation marks after `--build` is passed on to `west build`.

# Nrf52 blinky
In this example we will program a simple Blinky program onto an nrf52dk. This
requires an actual nrf52 board and also the `nrfjprog` utility is installed. See
the following installation guide
[here](https://www.nordicsemi.com/Products/Development-tools/nrf-command-line-tools/download).

```
cd application
west lfc src/NrfBlinky.lf --build "-p always -b nrf52dk_nrf52832"
west flash
```
In this example we use the `-p always` to tell west to do a clean build and `-b nrf52dk_nrf52832` to target the nrf52dk. These parameters are west-specific so
refer to west documentation for more info. `west flash` is used to interact with
`nrfjprog` and flash the application into the dev-board.

# Zephyr configuration options
The Lingua Franca Zephyr platform depends on some specific [Zephyr Kernel configurations](https://docs.zephyrproject.org/latest/build/kconfig/index.html#).
For instance, the Counter drivers must be linked with the application to provide
hi-resolution timing. These required configurations are stored in a file called
`prj_lf.conf` which is copied to the generated `src-gen` folder by `lfc`. You
can also supply your own configuration options in a file called `prj.conf` which
has to be located in the same folder as `west lfc` is invoked from.
There is such a file located in `~/application` in the template. There is also
a `Kconfig` file. Both are copied into the `src-gen` folder when invoking
`west lfc`.

# The `west lfc` command
The custom `lfc` west command has already been used in previous sections.
It can be inspected in `scripts/lf_build.py`.
It invokes `lfc` on the provided LF source file. It also copies `prj.conf` and `Kconfig`
into the src-gen directory before it, optionally, calls `west build` on the
resulting project.

Please see `west lfc --help` for more information and the `scripts/lf_build.py`.

# Debugging LF Zephyr programs using QEMU and GDB
In this section we will see how a LF program can be debugged while running in QEMU emulation.

1. Compile `HelloWorld.lf` for `qemu_cortex_m3`
```
cd application
west lfc src/HelloWorld.lf --build "-b qemu_cortex_m3 -p always"
```
Note that we here, unlike the very first example, explicitly tell `lfc` that we are targeting a `qemu_cortex_m3` platform. This is the default platform which is used unless another is specified. It is added here for clarity. 

2. In one terminal, start qemu as a debug server waiting for a local connection from `gdb`
```
ninja -C build debugserver
```

3. In another terminal start `gdb` and connect to the qemu server. Load the application image and run until main.
```
$ZEPHYR_SDK/arm-zephyr-eabi/bin/arm-zephyr-eabi-gdb
(gdb) arm-zephyr-eabi/bin/arm-zephyr-eabi-gdb
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
The QEMU emulation is not cycle-accurate and implements optimizations such that if the system goes to sleep, like when the last active thread in the program calls `k_sleep()`, then the emulator fast-forwards time.
This does not affect the QEMU-emulation of the *unthreaded* runtime since it implements sleeping between events using *busy-waits*. 
However, the *threaded* runtime sleeps between events using a call to `k_cond_timedwait` which has the side-effect that QEMU fast-forwards time. 
This causes the emulation of threaded programs to appear as if the `fast` target property was set to `true`. 

## Troubleshooting

### Multiple Zephyr installations
If the following warning is shown when invoking `west lfc` or any other `west` command:
```
WARNING: ZEPHYR_BASE=/path/to/zephyr in the calling environment will be used,
but the zephyr.base config option in /path/to/lf-west-template is "deps/zephyr"
which implies a different ZEPHYR_BASE=/path/to/lf-west-template/deps/zephyr
To disable this warning in the future, execute 'west config --global zephyr.base-prefer env'
```

Then it means that you have multiple Zephyr repositories installed. 
We do not recommend this as `west` will link the application with the Zephyr found in the CMake package registry. 
Please refer to the Getting Started section to purge the system of old Zephyr installations.
