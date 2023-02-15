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
- West
- Zephyr SDK

# Overview


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