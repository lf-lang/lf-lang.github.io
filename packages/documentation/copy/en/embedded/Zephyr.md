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
- West
- Zephyr SDK
- nrf52 Development Kit (Optional)

# Overview
Lingua Franca's C-runtime is tightly integrated with the Zephyr RTOS. This enables developing and programming hundreds of resource-constrained platforms like microcontrollers. In this guide we will see how LF programs can be build, programmed and debugged both in emulation and on real hardware. There are two ways of developing LF Zephyr programs, the preferred West-centric way and the  lfc-centric way. This guide will mainly describe the West-centric approach. 

# Getting started

## Pull the lf-west-template
```
git clone https://github.com/lf-lang/lf-west-template lf-west && cd lf-west
```

## Install West
This section consists of copied and pasted sections from the [Zephyr Getting Started Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html).

1. Setup and activate virtual environment
```
python3 -m venv .venv
source .venv/bin/activate
```

2. Install west
```
pip3 install west
```

Now west is installed within a virtual environment. **This environment has to be activated every time you want to use west with LF**

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

6. Install udev rules for flashing and debugging boards
```
sudo cp /opt/zephyr-sdk-0.15.2/sysroots/x86_64-pokysdk-linux/usr/share/openocd/contrib/60-openocd.rules /etc/udev/rules.d
sudo udevadm control --reload
```

## Download the Zephyr RTOS
1. Download the Zephyr RTOS to the template repository. This step will take some time
```
west update
west zephyr-export
```

2. Install Python dependencies
```
pip install -r deps/zephyr/scripts/requirements.txt
```

# Hello World!
Now you should have the following installed:
1. West
2. Zephyr SDK
3. Zephyr RTOS pulled down to `/deps/zephyr`

You should now be able to build and emulate a simple Hello World! LF program:

```
cd application
west lf-build src/HelloWorld.lf -w "-t run"
```

# Nrf52 blinky
This requires that the `nrfjprog` utility is installed. See installation guide [here](https://www.nordicsemi.com/Products/Development-tools/nrf-command-line-tools/download)

```
cd application
west lf-build src/NrfBlinky.lf -w "-b nrf52dk_nrf52832 -p always"
west flash
```
# Kernel configuration options
The Lingua Franca Zephyr platform depends on some specific Kernel configurations. These are 


# The `lf-build` west command
The custom `lf-build` west command can be inspected in `scripts/lf_build.py`. It
invokes `lfc` on the provided LF source file. It then invokes `west build` on
the generated sources. If you would like to pass forward arguments to the `west build` command do so with the `-w` flag. E.g. `-w -b nrf52dk_nrf52832 -p always` passes information about the dev-kit and also tells `west` to clean the build folder before starting.




See `west lf-build -h` for more information.


# Debugging LF Zephyr programs using QEMU and GDB
In this section we will see how we can debug a LF program running in QEMU emulation.

1. Compile `HelloWorld.lf` for `qemu_cortex_m3`
```
cd application
west lf-build src/HelloWorld.lf -w "-b qemu_cortex_m3"
```

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

From here you can step through the LF program. To get a more visual 

## Timing in QEMU emulations
The QEMU emulation implements optimizations such that if the system goes to sleep, like when the last wake thread in the program calls `k_sleep()`, then the emulator fast-forwards time. This does not affect the QEMU-emulation of the *unthreaded* runtime since it implements sleeping between events using *busy-waits*. However, the *threaded* runtimms sleeps between events using a call to `k_cond_timedwait` which has the side-effect that QEMU fast-forwards time. This causes the emulation of threaded programs to appear as if the `fast` target property was set to `true`. 


## Troubleshooting

### Multiple Zephyr installations
