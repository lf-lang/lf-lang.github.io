---
title: Arduino
layout: docs
permalink: /docs/handbook/arduino
oneline: "Developing LF Programs on Arduino."
preamble: >
---

## Supported Operating Systems
- macOS
- Linux

## Prerequisites
- [Arduino CLI](https://arduino.github.io/arduino-cli/) for the supported OS you are running on.

# Overview

Lingua Franca relies on Arduino-CLI as a means of compiling Arduino programs using the C target. LFC Generated Code will serve as the .ino sketch required by the CLI to compile the Arduino program. Arduino-CLI uses recursive compilation inside a src folder containing files from reactor-c. Once compilation is completed, you can upload the sketch by providing an Fully Qualified Board Name (FQBN) and the port on which to flash your program.

# Writing an Arduino Supported LF Program

- The most basic Arduino program (Blink) can be defined in LF like so:

```lf
 target C { 
    platform: "Arduino"
 };

 main reactor Blink {
    timer t1(0, 1 sec);
    timer t2(500 msec, 1 sec);
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

- The platform property can be overloaded like so for finer grained control of the following attributes: board, port, baud-rate, and flash.

```lf
 target C { 
    platform: {
        name: "Arduino",
        board: "arduino-avr-uno",
        port: "/dev/ttyd2",
        baud-rate: 115200,
        flash: true
    }
 };

 main reactor Blink {
    timer t1(0, 1 sec);
    timer t2(500 msec, 1 sec);
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

# Platform Options

## Board

For compilation, arduino-cli requires users to provide an FQBN to compile the program. 

To see the FQBN of the arduino board you have plugged in, run the following command:

`arduino-cli board list`

To see the list of all FQBN's installed on your device (all FQBNs supported by the libraries you have installed), run the following command:

`arduino-cli board listall`

To install certain board flavors, you may run the following command:

`arduino-cli core install arduino:[BOARD_FAMILY]`

The common board families include `avr`, `megaAVR`, `sam`, `samd`, and `mbed`.

If a board is provided, LFC will automatically compile the program for you in the generated sources directory. From here, you can either enable flash + provide a port to automatically upload your sketch or run the following command in the generated sources directory:

`arduino-cli upload -p PORT -b FQBN .`

If a board is not provided, LFC will default to the no-compile option. To compile from here, run the following command in the generated sources directory (replace FQBN with your board):

- Unthreaded Programs (most arduino flavors)
`arduino-cli compile -b [FQBN] --build-property compiler.c.extra_flags=\"-DLF_UNTHREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10\" --build-property compiler.cpp.extra_flags=\"-DLF_UNTHREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10\"`

- Threaded Programs (arduino:mbed boards) 
`arduino-cli compile -b [FQBN] --build-property compiler.c.extra_flags=\"-DLF_THREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10\" --build-property compiler.cpp.extra_flags=\"-DLF_THREADED -DPLATFORM_ARDUINO -DINITIAL_EVENT_QUEUE_SIZE=10 -DINITIAL_REACT_QUEUE_SIZE=10\"`

Use the upload command above once compiled to flash your program.

## Port

Arduino's can be flashed along a USB port which is generated when you plug your Arduino board into your computer (i.e. /dev/ttyd2). To get the port of your arduino device, run the following command:

`arduino-cli board list`

If you provide a port alongside both the board FQBN and the flash option set to true, LFC will both compile and attempt to upload your sketch to your arduino board. 

If flash is disabled or no port is provided, automatic upload will be disabled. To upload in this case, run the following command:

`arduino-cli upload -p PORT -b FQBN .`

## Flash

When a port and board FQBN are provided to the LF program and flash is set to true, LFC will automatically attempt to upload your compiled sketch by calling arduino-cli. 

## Baud Rate

By default, LF-Arduino programs will be initialized with a Serial stream set to 9600 baud. This parameter is tunable by adjusting the baud-rate parameter in platform options.

# LF vs Arduino IDE

*No setup and loop functions required*

By default, Arduino programs require users to define `setup()` and `loop()` void functions to compile, but Lingua Franca takes care of these necessary steps. 

Developers are encouraged to define all `setup()` code within `reaction(startup)` that gets initiated when an LF program starts up, and define their own loops through repeated timers or cyclic reactions.

Developers are easily able to use standard Arduino libraries within their LF files. 
