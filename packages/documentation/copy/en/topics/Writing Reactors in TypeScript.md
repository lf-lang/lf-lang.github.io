---
title: Writing Reactors in TypeScript
layout: docs
permalink: /docs/handbook/write-reactor-ts
oneline: "Writing Reactors in TypeScript."
preamble: >
---
In the TypeScript reactor target for Lingua Franca, reactions are written in [TypeScript](https://www.typescriptlang.org/) and the code generator generates a standalone TypeScript program that can be compiled to JavaScript and run on [Node.js](https://nodejs.org).

TypeScript reactors bring the strengths of TypeScript and Node.js to Lingua Franca programming. The TypeScript language and its associated tools enable static type checking for both reaction code and Lingua Franca elements like ports and actions. The Node.js JavaScript runtime provides an execution environment for asynchronous network applications. With Node.js comes Node Package Manager ([npm](https://www.npmjs.com/)) and its large library of supporting modules. 

In terms of raw performance on CPU intensive operations, TypeScript reactors are about two orders of magnitude slower than C reactors. But excelling at CPU intensive operations isn't really the point of Node.js (or by extension TypeScript reactors). Node.js is about achieving high throughput on network applications by efficiently handling asynchronous I/O operations. Keep this in mind when choosing the right Lingua Franca target for your application.

## Setup

First, make sure Node.js is installed on your machine. You can [download Node.js here](https://nodejs.org/en/download/). The npm package manager comes along with Node. 

After installing Node, you may optionally install the TypeScript compiler.

```
npm install -g typescript
```

TypeScript reactor projects are created with a local copy of the TypeScript compiler, but having the TypeScript compiler globally installed can be useful for [debugging type errors](#debugging-type-errors) and type checking on the command line. 


## A Minimal Example

A "hello world" reactor for the TypeScript target looks like this:

```
target TypeScript;
main reactor Minimal {
    timer t;
    reaction(t) {=
        console.log("Hello World.");
    =}
}
```

The timer triggers at the start time of the execution causing the reaction to execute. This program can be found in a file called [`Minimal.lf`](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS/Minimal.lf) in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS), where you can also find quite a few more interesting examples. If you compile this using the [`lfc` command-line compiler](downloading-and-building#Command-Line-Tools) or the [Eclipse-based IDE](downloading-and-building#Download-the-Integrated-Development-Environment), a number of files and directories will be generated. You can run the compiled JavaScript program (from `Minimal.lf`'s directory) with the command:

```
$ node Minimal/dist/Minimal.js 
```

The resulting output should look something like this:

```
Hello World.
```

Notice the compiler generates a project directory with the name of the .lf file. In this example the .lf file's name is "Minimal" but more generally, for `<LF_file_name>.lf` the command to run the program is: 

```
$ node <LF_file_name>/dist/<LF_file_name>.js
```

Refer to the [TypeScript Project Structure](#implementation-details) section to learn why the command looks like this.

## The TypeScript Target Specification

To have Lingua Franca generate TypeScript code, start your `.lf` file with the following target specification:

    target TypeScript;

A TypeScript target specification may optionally include the following parameters:

* ```fast [true|false]```: Whether to execute as fast as possible ignoring real time. This defaults to false.
* ```keepalive [true|false]```: Whether to continue executing even when there are no events on the event queue. The default is false. Usually, you will want to set this to true when you have **physical action**s.
* ```logging [ERROR|WARN|INFO|LOG|DEBUG]```: The level of diagnostic messages about execution to print to the console. A message will print if this parameter is greater than or equal to the level of the message (`ERROR` < `WARN` < `INFO` < `LOG` < `DEBUG`). Internally this is handled by the [ulog module](https://www.npmjs.com/package/ulog). 
* ```timeout <n> <units>```: The amount of logical time to run before exiting. By default, the program will run forever or until forcibly stopped, with control-C, for example.

For example, for the TypeScript target, in a source file named `Foo.lf`, you might specify:

    target TypeScript {
        fast: true,
        timeout: 10 secs,
        logging: INFO,

    };

The `fast` option given above specifies to execute the file as fast as possible, ignoring timing delays.

The `logging` option indicates diagnostic messages tagged as `ERROR`, `WARN`, and `INFO` should print to the console. Messages tagged `LOG` or `DEBUG` will not print.

The `timeout` option specifies to stop after 10 seconds of logical time have elapsed.

## Command-Line Arguments

The generated JavaScript program understands the following command-line arguments, each of which has a short form (one character) and a long form:

* `-f, --fast [true | false]`:  Specifies whether to wait for physical time to match logical time. The default is `false`. If this is `true`, then the program will execute as fast as possible, letting logical time advance faster than physical time.
* `-o, --timeout '<duration> <units>'`: Stop execution when logical time has advanced by the specified *duration*. The units can be any of nsec, usec, msec, sec, minute, hour, day, week, or the plurals of those. For the duration and units of a timeout argument to be parsed correctly as a single value, these should be specified in quotes with no leading or trailing space (eg '5 sec').
* `-k, --keepalive [true | false]`: Specifies whether to stop execution if there are no events to process. This defaults to `false`, meaning that the program will stop executing when there are no more events on the event queue. If you set this to `true`, then the program will keep executing until either the `timeout` logical time is reached or the program is externally killed. If you have `physical action`s, it usually makes sense to set this to `true`.
* `-l, --logging [ERROR | WARN | INFO | LOG | DEBUG]`: The level of logging messages from the reactor-ts runtime to to print to the console. Messages tagged with a given type (error, warn, etc.) will print if this argument is greater than or equal to the level of the message (`ERROR` < `WARN` < `INFO` < `LOG` < `DEBUG`).
* `-h, --help`: Print this usage guide. The program will not execute if this flag is present. 

If provided, a command line argument will override whatever value the corresponding target property had specified in the source .lf file. 

Command line options are parsed by the [command-line-arguments](https://github.com/75lb/command-line-args) module with [these rules](https://github.com/75lb/command-line-args/wiki/Notation-rules). For example 

```
$ node <LF_file_name>/dist/<LF_file_name>.js -f false --keepalive=true -o '4 sec' -l INFO
```

is a valid setting.

Any errors in command-line arguments result in printing the above information. The program will not execute if there is a parsing error for command-line arguments.

### Custom Command-Line Arguments
User-defined command-line arguments may be created by giving the main reactor [parameters](#using-parameters). Assigning the main reactor a parameter of type `string`, `number`, `boolean`, or `time` will add an argument with corresponding name and type to the generated program's command-line-interface. Custom arguments will also appear in the generated program's usage guide (from the `--help` option). If the generated program is executed with a value specified for a custom command-line argument, that value will override the default value for the corresponding parameter. Arguments typed `string`, `number`, and `boolean` are parsed in the expected way, but `time` arguments must be specified on the command line like the `--timeout` property as `'<duration> <units>'` (in quotes).

Note: Custom arguments may not have the same names as standard arguments like `timeout` or `keepalive`.

For example this reactor has a custom command line argument named `customArg` of type `number` and default value `2`:

```
target TypeScript;
main reactor clArg(customArg:number(2)) {
    reaction (startup) {=
        console.log(customArg);
    =}
}
```

If this reactor is compiled from the file `simpleCLArgs.lf`, executing

```
node simpleCLArgs/dist/simpleCLArgs.js
```

outputs the default value `2`. But running

```
node simpleCLArgs/dist/simpleCLArgs.js --customArg=42
```

outputs `42`. Additionally, we can view documentation for the custom command line argument with the `--help` command.

```
node simpleCLArgs/dist/simpleCLArgs.js -h
```

The program will generate the standard usage guide, but also


```
--customArg '<duration> <units>'                    Custom argument. Refer to           
                                                      <path>/simpleCLArgs.lf 
                                                      for documentation.
```

### Additional types for Custom Command-Line Arguments

Main reactor parameters that are not typed `string`, `number`, `boolean`, or `time` will not create custom command-line arguments. However, that doesn't mean it is impossible to obtain other types from the command line, just use a `string` and specify how the parsing is done yourself. See below for an example of a reactor that parses a custom command-line argument of type `string` into a state variable of type `Array<number>` using `JSON.parse` and a [user-defined type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

```
target TypeScript;
main reactor customType(arrayArg:string("")) {
    preamble {=
        function isArrayOfNumbers(x: any): x is Array<number> {
            for (let item of x) {
                if (typeof item !== "number") {
                    return false;
                }
            }
            return true;
        }
    =}
    state foo:{=Array<number>=}({=[]=});
    reaction (startup) {=
        let parsedArgument = JSON.parse(customType);
        if (isArrayOfNumbers(parsedArgument)) {
            foo = parsedArgument;
            }
        else {
            throw new Error("Custom command line argument is not an array of numbers.");
        }
        console.log(foo);
    =}
}
```

## Imports

The [import statement](Language-Specification#import-statement) can be used to share reactor definitions across several applications. Suppose for example that we modify the above `Minimal.lf` program as follows and store this in a file called `HelloWorld.lf`:

```
target TypeScript;
reactor HelloWorldInside {
    timer t;
    reaction(t) {=
        console.log("Hello World.");
    =}
}
main reactor HelloWorld {
    a = new HelloWorldInside();
}
```

This can be compiled and run, and its behavior will be identical to the version above.
But now, this can be imported into another reactor definition as follows:

```
target TypeScript;
import HelloWorld.lf;
main reactor TwoHelloWorlds {
    a = new HelloWorldInside();
    b = new HelloWorldInside();
}
```

This will create two instances of the HelloWorld reactor, and when executed, will print "Hello World" twice.

A more interesting illustration of imports can be found in the `Import.lf` test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS).

## Preamble

Reactions may contain arbitrary TypeScript code, but often it is convenient for that code to invoke node modules or to share function/type/class definitions. For these purposes, a reactor may include a **preamble** section. For example, the following reactor uses Node's built-in path module to extract the base name from a path:

```
target TypeScript;
main reactor Preamble {
    preamble {=
        import * as path from 'path';
    =}
    reaction (startup) {=
        var filename = path.basename('/Users/Refsnes/demo_path.js');
        console.log(filename);
    =}
}
```

This will print:

```
demo_path.js
```

By putting the `import` in the **preamble**, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file. It's a bit more complicated to [set up node.js modules from npm](#using-node-modules) that aren't built-in, but the reaction code to `import` them is the same as what you see here.

You can also use the preamble to define functions that are shared across reactions and reactors:

```
main reactor Preamble {
    preamble {=
        function add42( i:number) {
            return i + 42;
        }
    =}
    timer t;
    reaction(t) {=
        let s = "42";
        let radix = 10;
        let i = parseInt(s, radix);
        console.log("Converted string " + s + " to number " + i);
        console.log("42 plus 42 is " + add42(42));
    =}
}
```

Not surprisingly, this will print:

```
Converted string 42 to number 42
42 plus 42 is 84
```

### Using Node Modules

Installing Node.js modules for TypeScript reactors with `npm` is essentially the same as installing modules for an ordinary Node.js program. First, write a Lingua Franca program (`Foo.lf`) and compile it. It may not type check if if you're [importing modules in the preamble](#preamble) and you haven't installed the modules yet, but compiling your program will cause the TypeScript code generator to [produce a project](#implementation-details) for your program. There should now be a package.json file in the same directory as your .lf file. Open a terminal and navigate to that directory. You can use the standard [`npm install`](https://docs.npmjs.com/cli/install) command to install modules for your TypeScript reactors. 

The important takeaway here is with the package.json file and the compiled JavaScript in the Foo/dist/ directory, you have a standard Node.js program that executes as such. You can modify and debug it just as you would a Node.js program.

## Reactions

Recall that a reaction is defined within a reactor using the following syntax:

> **reaction**(*triggers*) *uses* -> *effects* {=<br/>
> &nbsp;&nbsp; ... target language code ... <br/>
> =}

In this section, we explain how **triggers**, **uses**, and **effects** variables work in the TypeScript target.

### Types

In Lingua Franca, reactor elements like inputs, outputs, actions, parameters, and state are typed using target language types. For the TypeScript target, [TypeScript types](https://www.typescriptlang.org/docs/handbook/basic-types.html) are generally acceptable with two notable exceptions:

* Custom types (and classes) must be defined in the [preamble](#preamble) before they may be used.
* `undefined` is not a valid type for an input, output, or action. This is because `undefined` is used to designate the absence of an input, output, or action during a reaction.

**To benefit from type checking, you should declare types for your reactor elements.** If a type isn't declared for a state variable, it is assigned the type [`unknown`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type). If a type isn't declared for an input, output, or action, it is assigned the [reactor-ts](https://github.com/lf-lang/reactor-ts) type `Present` which is defined as

```
export type Present = (number | string | boolean | symbol | object | null);
```


### Inputs and Outputs

In the body of a reaction in the TypeScript target, inputs are simply referred to by name. An input of type `t` is  available within the body of a reaction as a local variable of type `t | undefined`. To determine whether an input is present, test the value of the input against `undefined`. An `undefined` input is not present. 

**WARNING** Be sure to use the `===` or `!==` operator and not `==` or `!=` to test against `undefined`. In JavaScript/TypeScript the comparison `undefined == null` yields the value `true`. It may also be tempting to rely upon the falsy evaluation of `undefined` within an `if` statement, but this may introduce bugs. For example a reaction that tests the presence of input `x` with `if (x) { ... }` will not correctly identify potentially valid present values such as `0`, `false`, or `""`.

For example, the `Determinism.lf` test case in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/xtext/org.icyphy.linguafranca/src/test/TS) includes the following reactor:

```
reactor Destination {
    input x:number;
    input y:number;
    reaction(x, y) {=
        let sum = 0;
        if (x !== undefined) {
            sum += x;
        }
        if (y !== undefined) {
            sum += y;
        }
        console.log("Received " + sum);
        if (sum != 2) {
            console.log("FAILURE: Expected 2.");
            util.failure();
        }
    =}
}
```


The reaction refers to the inputs `x` and `y` by name and tests for their presence by testing `x` and `y` against `undefined`.  If a reaction is triggered by just one input, then normally it is not necessary to test for its presence. It will always be present. However TypeScript's type system is not smart enough to know such an input will never have type `undefined` if there's no test against `undefined` within the reaction. An explicit type annotation (for example `x = x as t;` where `t` is the type of the input) may be necessary to avoid type errors from the compiler. In the above example, there are two triggers, so the reaction has no assurance that both will be present.

Inputs declared in the **uses** part of the reaction do not trigger the reaction. Consider this modification of the above reaction:

```
reaction(x) y {=
    let sum = x as number;
    if (y !== undefined) {
        sum += y;
    }
    console.log("Received " + sum + ".");
=}
```

It is no longer necessary to test for the presence of `x` because that is the only trigger. The input `y`, however, may or may not be present at the logical time that this reaction is triggered. Hence, the code must test for its presence.

The **effects** portion of the reaction specification can include outputs and actions. Actions will be described below. Like inputs, an output of type `t` is available within the body of a reaction as a local variable of type `t | undefined`. The local variable for each output is initialized to the output's current value. Outputs are set by assigning a (non-`undefined`) value to its local variable (no changes will be made to an output if it has the value `undefined` at the end of a reaction). Whatever value an output's local variable has at the end of the reaction will be set to that output. If an output's local variable has the value `undefined` at the end of the reaction, that output will not be set and connected downstream inputs will be absent. For example, we can further modify the above example as follows:

```
output z:number;
reaction(x) y -> z {=
    let sum = x as number;
    if (y !== undefined) {
        sum += y;
    }
    z = sum;
=}
```


If an output gets set more than once at any logical time, downstream reactors will see only the *final* value that is set. Since the order in which reactions of a reactor are invoked at a logical time is deterministic, and whether inputs are present depends only on their timestamps, the final value set for an output will also be deterministic.

An output may even be set in different reactions of the same reactor at the same logical time. In this case, one reaction may wish to test whether the previously invoked reaction has set the output. It can do that using a `!== undefined` test for that output. For example, the following reactor will always produce the output 42:

```
reactor TestForPreviousOutput {
    output out:number;
    reaction(startup) -> out {=
        if (Math.random() > 0.5) {
            out = 21;
        }
    =}
    reaction(startup) -> out {=
        let previous_output = out;
        if (previous_output) {
            out = 2 * previous_output;
        } else {
            out = 42;
        }
    =}
}
```

The first reaction may or may not set the output to 21. The second reaction doubles the output if it has been previously produced and otherwise produces 42. 

### Using State Variables

A reactor may declare state variables, which become properties of each instance of the reactor. For example, the following reactor will produce the output sequence 0, 1, 2, 3, ... :

```
reactor Count {
    state count:number(0);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        count++;
        y = count;
    =}
}
```

The declaration on the second line gives the variable the name "count", declares its type to be `number`, and initializes its value to 0.  The type and initial value can be enclosed in the Typescript-code delimitters `{= ... =}` if they are not simple identifiers, but in this case, that is not necessary.

In the body of the reaction, the reactor's state variable is referenced by way of a local variable of the same name. The local variable will contain the current value of the state at the beginning of the reaction. The final value of the local variable will be used to update the state at the end of the reaction.

It may be tempting to declare state variables in the **preamble**, as follows:

```
reactor FlawedCount {
    preamble {=
        let count = 0;
    =}
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        count++;
        y = count;
    =}
}
```

This will produce a sequence of integers, but if there is more than one instance of the reactor, those instances will share the same variable count. Hence, **don't do this**! Sharing variables across instances of reactors violates a basic principle, which is that reactors communicate only by sending messages to one another. Sharing variables will make your program nondeterministic. If you have multiple instances of the above FlawedCount reactor, the outputs produced by each instance will not be predictable, and in an asynchronous implementation, will also not be repeatable.

A state variable may be a time value, declared as follows:

```
    state time_value:time(100 msec);
```
The `time_value` variable will be of type `TimeValue`, which is an object used to represent a time in the TypeScript Target. Refer to the section on [timed behavior](#timed-behavior) for more information.

A state variable can have an array or object value. For example, the following reactor computes the **moving average** of the last four inputs each time it receives an input:
```
reactor MovingAverage {
    state delay_line:{=Array<number>=}({= [0.0, 0.0, 0.0] =});
    state index:number(0);
    input x:number;
    output out:number;
    reaction(x) -> out {=
        x = x as number;
        // Calculate the output.
        let sum = x;
        for (let i = 0; i < 3; i++) {
            sum += delay_line[i];
        }
        out = sum/4.0;

        // Insert the input in the delay line.
        delay_line[index] = x;

        // Update the index for the next input.
        index++;
        if (index >= 3) {
            index = 0;
        }
    =}
}
```
The second line declares that the type of the state variable is an array of `number`s with the initial value of the array being a three-element array filled with zeros.

States whose type are objects can similarly be initialized. Declarations can take an object literal as the initial value:

```
state myLiteral:{= {foo: number, bar: string} =}({= {foo: 42, bar: "baz"} =});
```

or use `new`:

```
state mySet:{=Set<number>=}({= new Set<number>() =});
```

### Using Parameters

Reactor parameters are also referenced in the TypeScript code as local variables. The example below modifies the above `Count` reactor so that its stride is a parameter:

```
target TypeScript;
reactor Count(stride:number(1)) {
    state count:number(0);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y = count;
        count += stride;
    =}
}
reactor Display {
    input x:number;
    reaction(x) {=
        console.log("Received: " + x + ".");
    =}
}
main reactor Stride {
    c = new Count(stride = 2);
    d = new Display();
    c.y -> d.x;
}
```

The second line defines the `stride` parameter, gives its type, and gives its initial value. As with state variables, the type and initial value can be enclosed in `{= ... =}` if necessary. The parameter is referenced in the reaction  by referring to the local variable `stride`.

When the reactor is instantiated, the default parameter value can be overridden. This is done in the above example near the bottom with the line:

```
    c = new Count(stride = 2);
```

If there is more than one parameter, use a comma separated list of assignments.

Parameters in Lingua Franca are immutable. To encourage correct usage, parameter variables within a reaction are  local `const` variables. If you feel tempted to use a mutable parameter, instead try using the parameter to initialize state and modify the state variable instead. This is illustrated below by a further modification to the Stride example where it takes an initial "start" value for count as a second parameter: 

```
target TypeScript;
reactor Count(stride:number(1), start:number(5)) {
    state count:number(start);
    output y:number;
    timer t(0, 100 msec);
    reaction(t) -> y {=
        y = count;
        count += stride;
    =}
}
reactor Display {
    input x:number;
    reaction(x) {=
        console.log("Received: " + x + ".");
    =}
}
main reactor Stride {
    c = new Count(stride = 2, start = 10);
    d = new Display();
    c.y -> d.x;
}
```

Parameters can have array or object values. Here is an example that outputs the elements of an array as a sequence of individual messages:

```
reactor Source(sequence:{=Array<number>=}({= [0, 1, 2] =})) {
    output out:number;
    state count:number(0);
    logical action next;
    reaction(startup, next) -> out, next {=
        out = sequence[count];
        count++;
        if (count < sequence.length) {
            actions.next.schedule(0, null);
        }
    =}
}
```
The **logical action** named `next` and the `schedule` function are explained below in [Scheduling Delayed Reactions](#Scheduling-Delayed-Reactions), but here they are used simply to repeat the reaction until all elements of the array have been sent.

Above, the parameter default value is an array with three elements, `[0, 1, 2]`. The syntax for giving this default value is a TypeScript array literal. Since this is TypeScript syntax, not Lingua Franca syntax, the initial value needs to be surrounded with the target code delimiters, `{= ... =}`. The default value can be overridden when instantiating the reactor using a similar syntax:
```
s = new Source(sequence={= [1, 2, 3, 4] =});
```

Both default and overridden values for parameters can also be created with the `new` keyword:

```
reactor Source(sequence:{=Array<number>=}({= new Array<number>() =})) {
```

and

```
s = new Source(sequence={= new Array<number() =});
```


### Sending and Receiving Custom Types

You can define your own datatypes in TypeScript and send and receive those. Consider the following example:
```
reactor CustomType {
    preamble {=
        type custom = string | null;
    =}
    output out:custom;
    reaction(startup) -> out {=
        out = null;
    =}
}
```
The **preamble** code defines a custom union type of `string` and `null`. 

## Timed Behavior

See [Summary of Time Functions](#summary-of-time-functions) and [Utility Function Reference](#utility-function-reference) for a quick API reference.

Timers are specified exactly as in the [Lingua Franca language specification](Language-Specification#timer-declaration). When working with time in the TypeScript code body of a reaction, however, you will need to know a bit about its internal representation.

A `TimeValue` is an class defined in the TypeScript target library file `time.ts` to represent a time instant or interval. For your convenience `TimeValue` and other classes from the `time.ts` library mentioned in these instructions are automatically imported into scope of your reactions. An instant is the number of nanoseconds that have elapsed since January 1, 1970. An interval is the difference between two instants. When an LF program starts executing, logical time is (normally) set to the instant provided by the operating system. (On some embedded platforms without real-time clocks, it will be set instead to zero.)

Internally a `TimeValue` uses two numbers to represent the time. To prevent overflow (which would occur for time intervals spanning more than 0.29 years if a single JavaScript number, which has 2^53 bits of precision, were to be used), we use _two_ numbers to store a time value. The first number denotes the number of whole seconds in the interval or instant; the second number denotes the remaining number of nanoseconds in the interval or instant. The first number represents the number of seconds, the second number represents the number of nanoseconds. These fields are not accessible to the programmer, instead `TimeValue`s may be manipulated by an [API](#summary-of-time-functions) with functions for addition, subtraction, and comparison.

A reaction can examine the current logical time (which is constant during the execution of the reaction). For example, consider:

```
target TypeScript;
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let logical:TimeValue = util.getCurrentLogicalTime()
        console.log("Logical time is " + logical + ".");
    =}
}
```

When executed, you will get something like this:

```
Logical time is (1584666585 secs; 805146880 nsecs).
Logical time is (1584666586 secs; 805146880 nsecs).
Logical time is (1584666587 secs; 805146880 nsecs).
...
```

Subsequent values of logical time are printed out in their raw form, of seconds and nanoseconds. If you look closely, you will see that each number is one second larger than the previous number.

You can also obtain the *elapsed* logical time since the start of execution, rather than exact logical time:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let logical:TimeValue = util.getElapsedLogicalTime()
        console.log("Logical time is " + logical + ".");
    =}
}
```

This will produce:

```
Logical time is (0 secs; 0 nsecs).
Logical time is (1 secs; 0 nsecs).
Logical time is (2 secs; 0 nsecs).
...
```

You can get physical time, which comes from your platform's real-time clock:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let physical:TimeValue = util.getCurrentPhysicalTime()
        console.log("Physical time is " + physical + ".");
    =}
}
```

This will produce something like this:

```
Physical time is (1584666801 secs; 644171008 nsecs).
Physical time is (1584666802 secs; 642269952 nsecs).
Physical time is (1584666803 secs; 642278912 nsecs).
...
```

Notice that these numbers are increasing by *roughly* one second each time.

You can also get *elapsed* physical time from the start of execution:

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let physical:TimeValue = util.getElapsedPhysicalTime()
        console.log("Physical time is " + physical + ".");
    =}
}
```

This will produce something like: 

```
Physical time is (0 secs; 2260992 nsecs).
Physical time is (1 secs; 166912 nsecs).
Physical time is (2 secs; 136960 nsecs).
...
```

You can create a `TimeValue` yourself with the `UnitBasedTimeValue` class. `UnitBasedTimeValue` is a subclass of `TimeValue` and can be used wherever you could also use a `TimeValue` directly obtained from one of the `util` functions. A `UnitBasedTimeValue` is constructed with a whole number and a `TimeUnit`. A `TimeUnit` is an enum from the `time.ts` library with convenient labels for common time units. These are nsec, usec, msec, sec (or secs), minute (or minutes), hour (or hours), day (or days), and week (or weeks).

This reactor has an example of a UnitBasedTimeValue.

```
main reactor GetTime {
    timer t(0, 1 sec);
    reaction(t) {=
        let myTimeValue:TimeValue = new UnitBasedTimeValue(200, TimeUnit.msec);
        let logical:TimeValue = util.getCurrentLogicalTime()
        console.log("My custom time value is " + myTimeValue + ".");
    =}
```

This will produce:

```
My custom time value is 200 msec.
My custom time value is 200 msec.
My custom time value is 200 msec.
...
```

### Tags

The TypeScript target provides a utility to get the current `Tag` of a reaction. Recall that time in Lingua Franca is superdense and each `TimeValue `is paired with an integer "microstep" index to track the number of iterations at a particular `TimeValue`. A `Tag` is this combination of a TimeValue and a "microstep". The `time.ts` library provides functions for adding, subtracting, and comparing `Tag`s.

You can get the current `Tag` in your reactions. This example illustrates tags with a [Zero-Delay Action](#zero-delay-actions):

```
target TypeScript;
main reactor GetTime {
    timer t(0, 1 sec);
    logical action a;
    reaction(t) -> a {=
        let superdense:Tag = util.getCurrentTag();
        console.log("First iteration - the tag is: " + superdense + ".");
        actions.a.schedule(0, null);
    =}
    reaction(a) {=
        let superdense:Tag = util.getCurrentTag();
        let timePart:TimeValue = superdense.time;
        let microstepPart:number = superdense.microstep;
        console.log("Second iteration - the time part of the tag is:  " + timePart + ".");
        console.log("Second iteration - the microstep part of the tag is:  " + microstepPart + ".");
    =}
}
```

This will produce:

```
First iteration - the tag is: ((1584669987 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669987 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
First iteration - the tag is: ((1584669988 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669988 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
First iteration - the tag is: ((1584669989 secs; 740464896 nsecs), 0).
Second iteration - the time part of the tag is:  (1584669989 secs; 740464896 nsecs).
Second iteration - the microstep part of the tag is:  1.
...
```

The first reaction prints the "First iteration" part of the output at microstep 0. The second reaction occurs one microstep later (explained in [Scheduling Delayed Reactions](#scheduling-delayed-reactions)) and illustrates how to split a `Tag` into its constituent `TimeValue` and microstep.

### Scheduling Delayed Reactions

Each action listed as an **effect** for a reaction is available as a schedulable object in the reaction body via the `actions` object. The TypeScript target provides a special `actions` object with a property for each schedulable action. Schedulable actions (of type `t`) have the object method:

```
schedule: (extraDelay: TimeValue | 0, value?: T) => void;
```

The first argument can either be the literal 0 (shorthand for 0 seconds) or a `TimeValue`/`UnitBasedTimeValue`. The second argument is the value for the action. Consider the following reactor:

```
target TypeScript;
reactor Schedule {
    input x:number;
    logical action a;
    reaction(x) -> a {=
        actions.a.schedule(new UnitBasedTimeValue(200, TimeUnit.msec), null);
    =}
    reaction(a) {=
        let elapsedTime = util.getElapsedLogicalTime();
        console.log("Action triggered at logical time " + elapsedTime + " after start.");
    =}
}
```

When this reactor receives an input `x`, it calls `schedule()` on the action `a`, so it will be triggered at the logical time offset (200 msec) with a null value. The action `a` will be triggered at a logical time 200 milliseconds after the arrival of input `x`. This will trigger the second reaction, which will use the `util.getElapsedLogicalTime()` function to determine how much logical time has elapsed since the start of execution. The third argument to the `schedule()` function is a **value**, data that can be carried by the action, which is explained below. In the above example, there is no value.

### Zero-Delay Actions

If the specified delay in a `schedule()` call is zero, then the action `a` will be triggered one **microstep** later in **superdense time** (see [Superdense Time](language-specification#superdense-time)). Hence, if the input `x` arrives at metric logical time *t*, and you call `schedule()` as follows:

```
actions.a.schedule(0);
```

then when a reaction to `a` is triggered, the input `x` will be absent (it was present at the *previous* microstep). The reaction to `x` and the reaction to `a` occur at the same metric time *t*, but separated by one microstep, so these two reactions are *not* logically simultaneous. These reactions execute with different [Tags](#tags).

## Actions With Values

If an action is declared with a data type, then it can carry a **value**, a data value that becomes available to any reaction triggered by the action. The most common use of this is to implement a logical delay, where a value provided at an input is produced on an output with a larger logical timestamp. To accomplish that, it is much easier to use the **after** keyword on a connection between reactors. Nevertheless, in this section, we explain how to directly use actions with value. In fact, the **after** keyword is implemented as described below.

If you are familiar with other targets (like C) you may notice it is much easier to schedule actions with values in TypeScript because of TypeScript/JavaScript's garbage collected memory management. The following example implements a logical delay using an action with a value. 

```
reactor Delay(delay:time(100 msec)) {
    input x:number;
    output out:number;
    logical action a:number;
    reaction(x) -> a {=
        actions.a.schedule(delay, x as number);
    =}
    reaction(a) -> out {=
        if (a !== null){
            out = a as number
        }
    =}
}
```

The action `a` is specified with a type `number`. The first reaction declares `a` as its effect. This declaration makes it possible for the reaction to schedule a future triggering of `a`. It's necessary to explicitly annotate the type of `x` as a number in the schedule function because TypeScript doesn't know the only trigger of a reaction must be present in that reaction.

The second reaction declares that it is triggered by `a` and has effect `out`. When a reaction triggers or uses an action the value of that action is made available within the reaction as a local variable with the name of the action. This variable will take on the value of the action and it will have the value `undefined` if that action is absent because it was not scheduled for this reaction.

The local variable cannot be used directly to schedule an action. As described above, an action `a` can only be scheduled in a reaction when it is 1) declared as an effect and 2) referenced through a property of the `actions` object.  The reason for this implementation is that `actions.a` refers to the **action**, not its value, and it is possible to use both the action and the value in the same reaction. For example, the following reaction will produce a counting sequence after it is triggered the first time:

```
reaction(a) -> out, a {=
    if (a !== null) {
        a = a as number;
        out = a;
        let newValue = a++;
        actions.a.schedule(delay, newValue);
    }
=}
```

## Stopping Execution

A reaction may request that the execution stop by calling the function `util.requestShutdown()` which takes no arguments. Execution will not stop immediately when this function is called; all events with the current tag will finish processing and execution will continue for one more microstep to give shutdown triggers a chance to execute. After this additional step, execution will terminate.

## Implementation Details

When a TypeScript reactor is compiled, the generated code is placed inside a project directory. This is because there are two steps of compilation. First, the Lingua Franca compiler generates a TypeScript project from the TypeScript reactor code. Second, the Lingua Franca compiler runs a TypeScript compiler on the generated TypeScript project to produce executable JavaScript. This is illustrated below:

```
Lingua Franca (.lf) ==> TypeScript (.ts) ==> JavaScript (.js)
``` 

Assuming the directory containing our Lingua Franca file `Foo.lf` is named `TS`, the compiler will generate the following:

1. TS/package.json
2. TS/node_modules
3. TS/Foo/tsconfig.json
4. TS/Foo/babel.config.js
5. TS/Foo/src/
6. TS/Foo/dist/

Items 1, 3, and 4 are configuration files for the generated project. Item 2 is a node_modules directory with contents specified by item 1. Item 5 is the directory for generated TypeScript code. Item 6 is the directory for compiled JavaScript code. In addition to the generated code for your Lingua Franca program, items 5 and 6 include libraries from the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule.

The Lingua Franca compiler automatically invokes other programs as it compiles a Lingua Franca (.lf) file to a Node.js executable JavaScript (.js) file. The files package.json, babel.config.js, and tsconfig.json are used to configure the behavior of those other programs. Whenever you compile a .lf file for the first time, the Lingua Franca compiler will copy default versions of these configuration files into the new project so the other programs can run. **The Lingua Franca compiler will only copy a default configuration file into a project if that file is not already present in the generated project.** This means you, the reactor programmer, may safely modify these configuration files to control the finer points of compilation. Beware, other generated files in the project's src and dist directories may be overwritten by the compiler.

### package.json

Node.js uses a [package.json](https://nodejs.org/en/knowledge/getting-started/npm/what-is-the-file-package-json/) file to describe metadata relevant to a Node project. This includes a list of project dependencies (i.e. modules) used by the project. When the Lingua Franca compiler copies a default package.json file into a Lingua Franca project that doesn't already have a package.json, the compiler runs the command `npm install` to create a node_modules directory. The default package.json only lists dependencies for the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule. [Follow these instructions](#using-node-modules) to modify package.json if you want to use other Node modules in your reactors.

### tsconfig.json

After generating a TypeScript program from a .lf file, the Lingua Franca compiler uses the TypeScript compiler `tsc` to run a type check. The behavior of `tsc` is configured by the [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file. You probably won't need to modify tsconfig.json, but you can if you know what you're doing.

### babel.config.js

If the `tsc` type check was successful, the Lingua Franca compiler uses `babel` to compile the generated TypeScript code into JavaScript. (This [blog post](https://iamturns.com/typescript-babel/) articulates the advantages of using `babel` over `tsc` to generate JavaScript.) There are many different flavors of JavaScript and the [babel.config.js](https://babeljs.io/docs/en/configuration) file specifies exactly what `babel` should generate. This is the file to edit if you want the Lingua Franca compiler to produce a different version of JavaScript as its final output.


## Debugging Type Errors

Let's take the [minimal reactor example](#a-minimal-example), and intentionally break it by adding a type error into the reaction.

```
target TypeScript;
main reactor ReactionTypeError {
    timer t;
    reaction(t) {=
        let foo:number = "THIS IS NOT A NUMBER";
        console.log("Hello World.");
    =}
}
```

This reactor will not compile, and should you attempt to compile it you will get an output from the compiler which looks something like this:

```
--- Standard output from command:
src/ReactionTypeError.ts(23,25): error TS2322: Type '"THIS IS NOT A NUMBER"' is not assignable to type 'number'.

--- End of standard output.
```

In particular the output

```
src/ReactionTypeError.ts(23,25): error TS2322: Type '"THIS IS NOT A NUMBER"' is not assignable to type 'number'.
```

identifies the problem: surprisingly, the string `"THIS IS NOT A NUMBER"` is not a number. However the line information `(23,25)` is a little confusing because it points to the location of the type error **in the generated** .ts file `ReactionTypeError/src/ReactionTypeError.ts` not in the original .lf file `ReactionTypeError.lf`. The .ts files produced by the TypeScript code generator are quite readable if you are familiar with the [reactor-ts](https://github.com/lf-lang/reactor-ts) submodule, but even if you aren't familiar it is not too difficult to track down the problem. Just open `ReactionTypeError/src/ReactionTypeError.ts` in your favorite text editor (we recommend [Visual Studio](https://code.visualstudio.com/docs/languages/typescript) for its excellent TypeScript integration) and look at line 23.


```
14        this.addReaction(
15            new Triggers(this.t),
16            new Args(this.t),
17            function (this, __t: Readable<Tag>) {
18                // =============== START react prologue
19                const util = this.util;
20                let t = __t.get();
21                // =============== END react prologue
22                try {
23                    let foo:number = "THIS IS NOT A NUMBER";
24                    console.log("Hello World.");
25                } finally {
26                    // =============== START react epilogue
27                    
28                    // =============== END react epilogue
29                }
30            }
31        );
```

There (inside the try block) we can find the problematic reaction code. _Reaction code is copied verbatim into generated .ts files_.

It can be a bit harder to interpret type errors outside of reaction code, but most type error messages are still relatively clear. For example if you attempt to connect a reactor output to an incompatibly typed input like:

```
target TypeScript;
main reactor ConnectionError {
    s = new Sender();
    r = new Receiver();
    s.foo -> r.bar;
}
reactor Sender {
    output foo:number;
}
reactor Receiver {
    input bar:string;
}
```

you should get an error like

```
--- Standard output from command:
src/InputTypeError.ts(36,23): error TS2345: Argument of type 'OutPort<number>' is not assignable to parameter of type 'Port<string>'.
  Types of property 'value' are incompatible.
    Type 'number | undefined' is not assignable to type 'string | undefined'.
      Type 'number' is not assignable to type 'string | undefined'.

--- End of standard output.
```

The key message being `Argument of type 'OutPort<number>' is not assignable to parameter of type 'Port<string>'`.

One last tip: if you attempt to reference a port, action, timer etc. named `foo` that isn't declared in the triggers, uses, or effects declaration of the reaction, you will get the error `Cannot find name 'foo'` in the reaction body.

## Utility Function Reference

These utility functions may be called within a TypeScript reaction:

`util.requestShutdown(): void` Ends execution after one microstep. See [Stopping Execution](#stopping-execution).

`util.getCurrentTag(): Tag` Gets the current (logical) tag. See [Tags](#tags).

`util.getCurrentLogicalTime(): TimeValue` Gets the current logical TimeValue. See [Time](#timed-behavior).

`util.getCurrentPhysicalTime(): TimeValue` Gets the current physical TimeValue. See [Time](#timed-behavior).

`util.getElapsedLogicalTime(): TimeValue` Gets the elapsed logical TimeValue from execution start. See [Time](#timed-behavior).

`util.getElapsedPhysicalTime(): TimeValue` Gets the elapsed physical TimeValue from execution start. See [Time](#timed-behavior).

`util.success(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default success callback. FIXME: Currently doesn't do anything in Lingua Franca.
 
`util.failure(): void` Invokes the [reactor-ts](https://github.com/lf-lang/reactor-ts) App's default failure callback. Throws an error.

## Summary of Time Functions

See [Time](#timed-behavior). These time functions are defined in the [time.ts](https://github.com/lf-lang/reactor-ts/blob/master/src/core/time.ts) library of [reactor-ts](https://github.com/lf-lang/reactor-ts).

`UnitBasedTimeValue(value: number, unit:TimeUnit)` Constructor for `UnitBasedTimeValue`, a programmer-friendly subclass of TimeValue. Use a number and a `TimeUnit` enum.

```
enum TimeUnit {
    nsec,
    usec,
    msec,
    sec,
    secs,
    minute,
    minutes,
    hour,
    hours,
    day,
    days,
    week,
    weeks
}
```

`TimeValue.add(other: TimeValue): TimeValue` Adds `this` to `other`.

`TimeValue.subtract(other: TimeValue): TimeValue` Subtracts `other` from `this`. A negative result is an error.

`TimeValue.difference(other: TimeValue): TimeValue` Obtain absolute value of `other` minus `this`.

`TimeValue.isEqualTo(other: TimeValue): boolean` Returns true if `this` and `other` represents the same TimeValue. Otherwise false.

`TimeValue.isZero(): boolean` Returns true if `this` represents a 0 TimeValue.

`TimeValue.isEarlierThan(other: TimeValue): boolean` Returns true if `this` < `other`. Otherwise false.

`Tag.isSmallerThan(other: Tag): boolean` Returns true if `this` < `other`. Otherwise false.

`Tag.isSimultaneousWith(other: Tag): boolean` Returns true if `this` and `other` represents the same Tag. Otherwise false.

`Tag.getLaterTag(delay: TimeValue): Tag` Returns a tag with the time part of this TimeValue incremented by delay.

`Tag.getMicroStepLater(): Tag` Returns a tag with the microstep part of this TimeValue incremented by 1.

`getTimeDifference(other: Tag): TimeValue` Returns a TimeValue  that represents the absolute (i.e., positive) time difference between `this` and `other`.

## Building Reactor-ts Documentation

FIXME: Host these docs somewhere.

To build and view proper documentation for `time.ts` (and other reactor-ts libraries), install [typedoc](https://typedoc.org/) and run

```
typedoc --out docs src
```

from the root of the [reactor-ts](https://github.com/lf-lang/reactor-ts). You probably already have the reactor-ts submodule at 

```
lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/
```

You should see an output like.

```
Using TypeScript 3.8.3 from /usr/local/lib/node_modules/typescript/lib
Rendering [========================================] 100%

Documentation generated at /Users/<username>/git/lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/docs
```

Open that path in a browser with `/index.html` appended to the end like

```
/Users/<username>/git/lingua-franca/xtext/org.icyphy.linguafranca/src/lib/TS/reactor-ts/docs/index.html
```

to navigate the docs.