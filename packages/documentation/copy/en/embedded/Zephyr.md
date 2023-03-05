---
title: Zephyr
layout: docs
permalink: /docs/handbook/zephyr
oneline: "Developing LF Programs for Zephyr RTOS."
preamble: >
---

## Supported Operating Systems
- macOS
- Linux

## Prerequisites
- lfc v0.4.0
- nrf52 Development Kit (Optional)

# Overview
Lingua Franca's C-runtime is tightly integrated with the Zephyr RTOS. This enables developing and programming [hundreds](https://docs.zephyrproject.org/latest/boards/index.html) of resource-constrained microcontrollers. In this guide we will see how LF programs can be built, programmed and debugged both in emulation and on real hardware. When developing LF programs for Zephyr we use a `west`-centric approach. `west` is the preferred build tool for Zephyr projects. This means organizing the code-base and development-flow as expected by `west`. To interact with the Lingua Franca Compiler we provide custom `west`-extensions which invoke `lfc` before building the Zephyr application. This is contrasted by our Arduino-support which is `lfc`-centric.

# Getting started

This section consists several copied and pasted sections from the [Zephyr Getting Started Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html). Please refer to Zephyrs documentation to better understand this project and its build tool `west`.

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

Now `west` is installed within a virtual environment. **This environment has to be activated every time you want to use west with LF**

## Installing Zephyr SDK
1. Download and install Zephyr SDK to `/opt`
```
cd ~
wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.15.2/zephyr-sdk-0.15.2_linux-x86_64.tar.gz
wget -O - https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.15.2/sha256.sum | shasum --check --ignore-missing

tar xvf zephyr-sdk-0.15.2_linux-x86_64.tar.gz --directory /opt/
cd /opt/zephyr-sdk-0.15.2
./setup.sh
```

2. Install udev rules for flashing and debugging boards
```
sudo cp /opt/zephyr-sdk-0.15.2/sysroots/x86_64-pokysdk-linux/usr/share/openocd/contrib/60-openocd.rules /etc/udev/rules.d
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
1. `west`. Verify with `west boards`
2. Zephyr SDK located at `/opt/zephyr-sdk-0.15.2`
3. Zephyr RTOS pulled down to `/deps/zephyr`

You should now be able to build and emulate a simple Hello World! LF program:

```
cd application
west lf-build src/HelloWorld.lf -w "-t run"
```
`HelloWorld.lf` sets the target property `platform: "Zephyr"` and `threading: false`. This tells `lfc` to create a Zephyr-compatible CMake project. In the example above the custom `west` command `lf-build` is used to first invoke `lfc` and then `west build` on the resulting generated sources.

# Nrf52 blinky
In this example we will program a simple Blinky program onto an nrf52dk. This requires an actual nrf52 board and also the `nrfjprog` utility is installed. See the following installation guide [here](https://www.nordicsemi.com/Products/Development-tools/nrf-command-line-tools/download)

```
cd application
west lf-build src/NrfBlinky.lf -w "-b nrf52dk_nrf52832 -p always"
west flash
```
In this example we use the `-w` flag to pass additional flags to `west build`. In particular we inform `west` that we are targeting a the nrf52 with `-b nrf52dk_nrf52832`. We also tell west to clean the build directory first with `-p always`.

# Kernel configuration options
The Lingua Franca Zephyr platform depends on some specific [Zephyr Kernel configurations](https://docs.zephyrproject.org/latest/build/kconfig/index.html#).
For instance, the Counter drivers must be linked with the application to provide hi-resolution timing.
These required configurations are stored in a file called `prj_lf.conf` which is copied to the generated `src-gen` folder by `lfc`.
You can also supply your own configuration options in a file called `prj.conf` which has to be located in the same folder as `west lf-build` is invoked from.
There is such a file located in `~/application` in the template.
There is also a file called `debug.conf` which is meant for containing debug options.
Such additional configuration files can also be passed to `west lf-build` through the `--conf-overlays` options.
E.g. `west lf-build -c debug.conf`.

# The `lf-build` west command
The custom `lf-build` west command has already been used in previos sections.
It can be inspected in `scripts/lf_build.py`.
It invokes `lfc` on the provided LF source file.
It then invokes `west build` on the generated sources.
If you would like to pass forward arguments to the `west build` command do so with the `-w` flag.
E.g. `-w -b nrf52dk_nrf52832 -p always` passes information about the dev-kit and also tells `west` to clean the build folder before starting.
One of the important functions of `lf-build` is to parse a file called `CompileDefinitions.txt` generated by `lfc`.
This file contains all the compiler definitions which should be defined for the program.
`lf-build` passes all the compiler definititions to the `west build` command.

Please see `west lf-build -h` for more information and the `scripts/lf_build.py`.

# Debugging LF Zephyr programs using QEMU and GDB
In this section we will see how a LF program can be debugged while running in QEMU emulation.

1. Compile `HelloWorld.lf` for `qemu_cortex_m3`
```
cd application
west lf-build src/HelloWorld.lf -w "-b qemu_cortex_m3 -p always"
```
Note that we here, unlike the very first example, explicitly tell `lf-build` that we are targeting a `qemu_cortex_m3` platform. This is the default platform which is used unless another is specified. It is added here for clarity. 

2. Start qemu as a debug server waiting for a local connection from GDB
```
ninja -C build debugserver
```

3. Start GDB and connect to the qemu server. Load the application image and run until main.
```
$ZEPHYR_SDK/arm-zephyr-eabi/bin/arm-zephyr-eabi-gdb
(gdb) arm-zephyr-eabi/bin/arm-zephyr-eabi-gdb
(gdb) target remote localhost:1234
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
If the follwing warning is shown when invoking `west lf-build` or any other `west` command:
```
WARNING: ZEPHYR_BASE=/path/to/zephyr in the calling environment will be used,
but the zephyr.base config option in /path/to/lf-west-template is "deps/zephyr"
which implies a different ZEPHYR_BASE=/path/to/lf-west-template/deps/zephyr
To disable this warning in the future, execute 'west config --global zephyr.base-prefer env'
```

Then it means that you have multiple Zephyr repositories installed. 
We do not recommend this as `west` will link the application with the Zephyr found in the CMake package registry. 
Please refer to the Getting Started section to purge the system of old Zephyr installations.

### Wrong version of Zephyr
If, when trying to build an application with `west lf-build` the following error occurs:
```
CMake Error at CMakeLists.txt:8 (find_package):
  Could not find a configuration file for package "Zephyr" that exactly
  matches requested version "3.2.0".
```

It means your Zephyr installation is of the wrong version.
Currently LF requires the exact version v3.2.0.
This restriction might be eased in the future.
The `lf-west-template` will download this exact version automatically.
This might mean that you have other Zephyr installations.
Please remove them and the exported CMake packages.


### Threaded Lingua Franca
In lfc v0.4.0 only the unthreaded runtime is supported with Zephyr. 
Unless `threading: false` is set, there will be the following error during compilation:

```
lf-west-template/application/src-gen/HelloWorld/core/platform/lf_zephyr_support.c:352:2: error: #error "Threaded support on Zephyr is not supported"
  352 | #error "Threaded support on Zephyr is not supported"
```

Threaded Zephyr support will be added shortly.