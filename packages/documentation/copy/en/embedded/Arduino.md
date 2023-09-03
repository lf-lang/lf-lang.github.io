---
title: Arduino
layout: docs
permalink: /docs/handbook/arduino
oneline: "Developing LF Programs on Arduino."
preamble: >
---

# Overview

To run Lingua Franca on an Arduino-compatible microcontroller, you can use the
`C` target with the `platform` target property set to `arduino`. The Lingua
Franca compiler will then not output ordinary C code in a CMake project, but
generate a `.ino` sketch that can be compiled and deployed using `arduino-cli`.
To flash the compiled sketch onto a board, you need specify a Fully Qualified
Board Name (FQBN) as well as the port to which your board is connected. On this
page, we explain exactly how to do this.

## Prerequisites

- You need a development system that runs on macOS or Linux (there is currently no Windows support).
- [Arduino CLI](https://arduino.github.io/arduino-cli/) must be installed on your development system. Confirm that your installation works by running:

```
arduino-cli version
```

# Writing a simple Arduino Program

The most basic Arduino program (Blink) can be defined in LF like so:

```lf
target C {
  platform: "Arduino"
}

main reactor Blink {
  timer t1(0, 1 sec)
  timer t2(500 msec, 1 sec)
  reaction(startup) {=
    pinMode(LED_BUILTIN, OUTPUT);
  =}

  reaction (t1) {=
    digitalWrite(LED_BUILTIN, HIGH);
  =}

  reaction (t2) {=
    digitalWrite(LED_BUILTIN, LOW);
  =}
}
```

The key difference between writing ordinary Arduino code and writing LF code is
that there is no `setup()` and `loop()` function. In LF, execution is
event-driven, with reactive code being triggered by events, such as the
expiration of a timer. Those pieces of reactive code, specified as reactions,
can invoke Arduino library functions, just like one would do in the definition
of an Arduino `loop()`. For any setup that might be needed at the beginning of
execution, a reaction triggered by the built-in `startup` trigger can be used.

## Platform Options

The `platform` property can also be used so specify more details. Along with `name: "arduino"`,
you can specify which `board`, `port`, and `baud-rate` you are using. If you want the program
to be flashed onto the board automatically after compilation, specify `flash: true`.
Here a target declaration that specifies all of these options:

```lf
target C {
  platform: {
    name: "arduino",
    board: "arduino:avr:uno",
    port: "/dev/ttyd2",
    baud-rate: 115200,
    flash: true
  }
}
```

The `board` is necessary for [building](#building) and the `port` is necessary for [flashing](#flashing).

### Baud rate of the serial port

All Arduino boards have at least one serial port (also known as a UART or
USART), and some have several. By default, Lingua Franca will assume a default
baud rate of 9600. This parameter is tunable by adjusting the `baud-rate`
parameter in platform options.

# Building

In order to have `arduino-cli` compile the generated sketch file, a `board` must
be specified. If no `board` is set, `lfc` will run in `no-compile` mode, meaning
it will not invoke the target compiler. Whether specified as a target property
or given directly to `arduino-cli`, you need an FQBN. You can find the FQBN of
the board that you have plugged in using the following command:

`arduino-cli board list`

To see the list of all FQBN's installed on your device (all FQBNs supported by the libraries you have installed), run the following command:

`arduino-cli board listall`

You likely need to install support for your board first, which you can do using the following command:

`arduino-cli core install arduino:[BOARD_FAMILY]`

The common board families include `avr`, `megaAVR`, `sam`, `samd`, and `mbed`.

If you specify your FQBN under `board` in the `platform` target property, `lfc` will automatically invoke `arduino-cli` on the generated sketch. To invoke `arduino-cli` manually

- for unthreaded programs (most arduino flavors), run:
  `arduino-cli compile -b [FQBN] --build-property compiler.c.extra_flags="-DLF_UNTHREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10" --build-property compiler.cpp.extra_flags="-DLF_UNTHREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10"`

- for threaded programs (`arduino:mbed` boards), run:
  `arduino-cli compile -b [FQBN] --build-property compiler.c.extra_flags="-DLF_THREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10" --build-property compiler.cpp.extra_flags="-DLF_THREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10"`

# Flashing

Arduino's can be flashed via USB. To find the port oto which your device is connected, run the following command:

`arduino-cli board list`

You can either use `arduino-cli` to flash the code onto your device after the sketch file has been built, or you can set `flash:true` and provide a `port` in your Lingua Franca file. To flash manually using `arduino-cli`, enter the subdirectory of `src-gen` in which the generated sketch file is located and run:

`arduino-cli upload -p PORT -b FQBN .`
