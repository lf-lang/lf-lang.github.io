---
title: Writing Reactors
layout: docs
permalink: /docs/handbook/writing-reactors
oneline: "Writing Reactors in Lingua Franca."
preamble: >
---

## Choose a target language

<!-- doesn't work:
<select name="target" id="targetSelector" onChange="handleTargetSelection()">
<option value="C">C</option>
<option value="Cpp">C++</option>
<option value="Py">Python</option>
<option value="TS">TypeScript</option>
</select>
-->
<label for="c">
 <input type="checkbox" id="c" name="target_language" value="c" checked onclick="
    var checked = this.checked ? 'block' : 'none';
    console.log(checked);
    var code = document.getElementsByClassName('language-c');
    var text = document.getElementsByClassName('C');
    var elements = [...code, ...text];
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i]);
        elements[i].style.display = checked;
    }">C
</label>
&nbsp;
<label for="cpp">
 <input type="checkbox" id="cpp" name="target_language" value="cpp" onclick="var checked = this.checked ? 'block' : 'none';
    var code = document.getElementsByClassName('language-cpp');
    var text = document.getElementsByClassName('Cpp');
    var elements = [...code, ...text];
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i]);
        elements[i].style.display = checked;
    }">C++
</label>
</label>
&nbsp;
<label for="python">
 <input type="checkbox" id="python" name="target_language" value="python" onclick="var checked = this.checked ? 'block' : 'none';
    var code = document.getElementsByClassName('language-python');
    var text = document.getElementsByClassName('Python');
    var elements = [...code, ...text];
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i]);
        elements[i].style.display = checked;
    }">Python
</label>

## Structure of a Lingua-Franca Program

A Lingua Franca file, which has a .lf extension, contains the following:

- One [**target** specification](target-specification).
- Zero or more [**import** statements](#import-statement).
- One or more [**reactor**](#reactor-block) blocks, which contain [**reaction** declarations](#reaction-declaration).

If one of the reactors in the file is designated `main` or `federated`, then the file defines an executable application. Otherwise, it defines one or more library reactors that can be imported into other LF files. For example, an LF file might be structured like this:

```
target <C, Cpp, Python, TypeScript, Rust, or CCpp>;
main reactor {
    a = new A();
    b = new B();
    a.y -> b.x;
}
reactor A {
    output y;
    ...
}
reactor B {
    input x;
    ...
}
```

This example specifies and instantiates two reactors, one of which sends messages to the other.

<div class="C">

## About the C Target

When you specify the C target for Lingua Franca, the code generator generates one or more standalone C programs that can be compiled and run on several platforms. It has been tested on MacOS, Linux, Windows, and at least one bare-iron embedded platforms. The single-threaded version is the most portable, requiring only a handful of common C libraries (see [Included Libraries](#included-libraries) below). The multithreaded version requires a small subset of the Posix thread library (`pthreads`) and transparently executes in parallel on a multicore machine while preserving the deterministic semantics of Lingua Franca.

Note that C is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Here, we provide some guidelines for a style for writing reactors that will be safe.

**NOTE:** If you intend to use C++ code or import C++ libraries in the C target, then you should specify instead the [CCpp target](#the-ccpp-target), which automatically uses a C++ compiler by default. Alternatively, you can use the Cpp target and write all the code in C++.

## Setup for the C Target

**FIXME**

</div>

<div class="Cpp">

## About the Cpp Target

In the C++ reactor target for Lingua Franca, reactions are written in C++ and the code generator generates a standalone C++ program that can be compiled and run on all major platforms. Our continous integration ensures compatibility with Windows, MacOS and Linux.
The C++ target solely depends on a working C++ build system including a recent C++ compiler (supporting C++17) and [CMake](https://cmake.org/) (>= 3.5). It relies on the [reactor-cpp](https://github.com/tud-ccc/reactor-cpp) runtime, which is automatically fetched and compiled in the background by the Lingua Franca compiler.

Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe.

## Setup for the Cpp Target

The following tools are required in order to compile the generated C++ source code:

- A recent C++ compiler supporting C++17
- A recent version of cmake (At least 3.5)

</div>

<div class="Python">

## About the Python Target

In the Python reactor target for Lingua Franca, reactions are written in Python. The user-written reactors are then generated into a Python 3 script that can be executed on several platforms. The Python target has been tested on Linux, MacOS, and Windows. To facilitate efficient and fast execution of Python code, the generated program relies on a C extension to facilitate Lingua Franca APIs such as `set` and `schedule`. To learn more about the structure of the generated Python program, see [Implementation Details](#implementation-details).

Python reactors can bring the vast library of scientific modules that exist for Python into a Lingua Franca program. Moreover, since the Python reactor target is based on a fast and efficient C runtime library, Lingua Franca programs can execute much faster than native equivalent Python programs in many cases. Finally, interoperability with C reactors is planned for the future.

**NOTE:** In comparison to the C reactor target, the Python target can be up to an order of magnitude slower. However, depending on the type of application and the implementation optimizations in Python, you can achieve an on-par performance to the C target in many applications.

## Setup for the Python Target

First, install Python 3 on your machine. See [downloading Python](https://wiki.python.org/moin/BeginnersGuide/Download).

**NOTE:** The Python target requires a C implementation of Python (nicknamed CPython). This is what you will get if you use the above link, or with most of the alternative Python installations such as Anaconda. See [this](https://www.python.org/download/alternatives/) for more details.

The Python reactor target relies on `pip` and `setuptools` to be able to compile and install a [Python C extension](https://docs.python.org/3/extending/extending.html) for each LF program. To install `pip3`, you can follow instructions [here](https://pip.pypa.io/en/stable/installation/).
`setuptools` can be installed using `pip3`:

```bash
pip3 install setuptools
```

**NOTE:** A [Python C extension](https://docs.python.org/3/extending/extending.html) is currently generated for each Lingua Franca program. To ensure cross-compatibility across multiple platforms, this extension is installed in the user space once code generation is finished (see [Implementation Details](#implementation-details)). This extension module will have the name LinguaFranca[your_LF_program_name]. There is a handy script [here](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/uninstallAllLinguaFrancaTestPackages.sh) that can uninstall all extension modules that are installed automatically by Lingua Franca tools (such as `lfc`).

</div>

## Minimal Example

A minimal but complete Lingua Franca file with one reactor is this:

```C
target C;
main reactor HelloWorld {
    reaction(startup) {=
        printf("Hello World.\n");
    =}
}
```

```Cpp
target Cpp;
main reactor HelloWorld {
    reaction(startup) {=
        cout << "Hello World.\n";
    =}
}
```

```python
target Python;
main reactor Minimal {
    reaction(startup) {=
        print("Hello World.")
    =}
}
```

**FIXME:**
See the [C target documentation](Writing-Reactors-in-C#a-minimal-example) for details about this example.

## Target Specification

Every Lingua Franca program begins with a [[target specification]] that specifies the language in which reactions are written. This is also the language of the program(s) generated by the Lingua Franca compiler.

## Import Statement

An import statement has the form:

> **import** { _reactor1_, _reactor2_ **as** _alias2_, [...] } **from** "_path_";

where _path_ specifies another Lingua Franca file relative to the location of the current file.

## Reactor Block

A **reactor** is a software component that reacts to input events, timer events, and internal events. It has private state variables that are not visible to any other reactor. Its reactions can consist of altering its own state, sending messages to other reactors, or affecting the environment through some kind of actuation or side effect.

The general structure of a reactor block is as follows:

> **reactor** _name_ (_[parameters](#parameter-declaration)_) {<br/> > &nbsp;&nbsp;_[state declarations](#state-declaration)_<br/> > &nbsp;&nbsp;_[method declarations](#method-declaration)_<br/> > &nbsp;&nbsp;_[input declarations](#input-declaration)_<br/> > &nbsp;&nbsp;_[output declarations](#output-declaration)_<br/> > &nbsp;&nbsp;_[timer declarations](#timer-declaration)_<br/> > &nbsp;&nbsp;_[action declarations](#action-declaration)_<br/> > &nbsp;&nbsp;_[reaction declarations](#reaction-declaration)_<br/> > &nbsp;&nbsp;_[contained reactors](#contained-reactors)_<br/> > &nbsp;&nbsp; ... <br/>
> }

Parameter, inputs, outputs, timers, actions, and contained reactors all have names, and the names are required to be distinct from one another.

If the **reactor** keyword is preceded by **main**, then this reactor will be instantiated and run by the generated code. If an imported LF file contains a main reactor, that reactor is ignored. Only reactors that not designated `main` are imported. This makes it easy to create a library of reusable reactors that each come with a test case or demonstration in the form of a main reactor.

### Parameter Declaration

A reactor class definition can define parameters as follows:

> **reactor** _ClassName_(_paramName1_:_type_(_expr_), _paramName2_:_type_(_expr_)) {<br/> > &nbsp;&nbsp; ... <br/>
> }

Each parameter may have a _type annotation_, written `:type`, and must have a _default value_, written `(expr)`.

The type annotation specifies a type in the target language, which is necessary for some target languages. For instance in C you might write

```
reactor Foo(size: int(100)) {
    ...
}
```

<details>
<summary>Introduction to basic LF types and expressions... click to expand</summary>

One useful type predefined by LF is the `time` type, which represents time durations. Values of this type may be written with _time expressions_, like `100 msec` or `1 second` (see [Basic expressions](#basic-expressions) for a reference).

For instance, you can write the following in any target language:

```
reactor Foo(period: time(100 msec)) {
    ...
}
```

Container types may also be written eg `int[]`, which is translated to a target-specific array or list type. The acceptable expressions for these types vary across targets (see [Complex expressions](#complex-expressions)), for instance in C, you can initialize an array parameter as follows:

```
reactor Foo(my_array:int[](1, 2, 3)) {
   ...
}
```

If the type or expression uses syntax that Lingua Franca does not support, you can use `{= ... =}` delimiters to enclose them and escape them. For instance to have a 2-dimensional array as a parameter in C:

```
reactor Foo(param:{= int[][] =}({= { {1}, {2} } =})) {
    ...
}
```

Both `int[][]` and ` {% raw %}{{1}, {2}} {% endraw %}` are C fragments here, not LF.

</details>

Other forms for types and expressions are described in [LF types](#appendix-lf-types) and [LF expressions](#appendix-lf-expressions).

How parameters may be used in the body of a reaction depends on the target. For example, in the [C target](writing-reactors-in-c#using-parameters), a `self` struct is provided that contains the parameter values. The following example illustrates this:

```
target C;
reactor Gain(scale:int(2)) {
    input x:int;
    output y:int;
    reaction(x) -> y {=
        SET(y, x->value * self->scale);
    =}
}
```

This reactor, given any input event `x` will produce an output `y` with value equal to the input scaled by the `scale` parameter. The default value of the `scale` parameter is 2, but this can be changed when the `Gain` reactor is [instantiated](#contained-reactors). The `SET()` is the mechanism provided by the [C target](Writing-Reactors-in-C#reaction-body) for setting the value of outputs. The parameter `scale` and input `x` are just referenced in the C code as shown above.

### State Declaration

A state declaration has one of the forms:

> **state** _name_:_type_(_initial_value_);  
> **state** _name_(_parameter_);

In the first form, the [type annotation](#appendix-lf-types) is only required in some targets. The initial value may be any [expression](#appendix-lf-expressions), including a special [initializer forms](#initializer-pseudo-expressions).

In the second form, the state variable inherits its type from the specified _parameter_, which also provides the initial value for the state variable.

How state variables may be used in the body of a reaction depends on the target. For example, in the [C target](writing-reactors-in-c#using-state-variables), a `self` struct is provided that contains the state values. The following example illustrates this:

```
reactor Count {
	output c:int;
	timer t(0, 1 sec);
	state i:int(0);
	reaction(t) -> c {=
		(self->i)++;
		SET(c, self->i);
	=}
}
```

### Method Declaration

A method declaration has one of the forms:

> **method** _name_();  
> **method** _name_():_type_;  
> **method** _name_(_arg1_name_:arg1*type, \_arg2_name*:arg2*type, ...);
> **method** \_name*(_arg1_name_:arg1*type, \_arg2_name*:arg2*type, ...):\_type*;

The first form defines a method with no arguments and no return value. The second form defines a method with the return type _type_ but no arguments. The third form defines a method with arguments given by their name and type, but without a return value. Finally, the fourth form is similar to the third, but adds a return type.

The **method** keywork can optionally be prefixed with the **const** qualifier, which indicates that the method is "read-only". This is relvant for some target languages such as C++.

See the [C++ documentation](https://github.com/lf-lang/lingua-franca/wiki/Writing-Reactors-in-Cpp#using-methods) for a usage example.

### Input Declaration

An input declaration has the form:

> **input** _name_:_type_;

The `Gain` reactor given above provides an example. The _type_ is just like parameter types.

An input may have the modifier **mutable**, as follows:

> **mutable input** _name_:_type_

This is a directive to the code generator indicating that reactions that read this input will also modify the value of the input. Without this modifier, inputs are **immutable**; modifying them is disallowed. The precise mechanism for making use of mutable inputs is target-language specific. See, for example, the [C language target](writing-reactors-in-c#Sending-and-Receiving-Arrays-and-Structs).

An input port may have more than one **channel**. See [multiports documentation](Multiports-and-Banks-of-Reactors#multiports).

### Output Declaration

An output declaration has the form:

> **output** _name_:_type_;

The `Gain` reactor given above provides an example. The _type_ is just like parameter types.

An output port may have more than one **channel**. See [multiports documentation](Multiports-and-Banks-of-Reactors#multiports).

### Timer Declaration

A timer, like an input and an action, causes reactions to be invoked. Unlike an action, it is triggered automatically by the scheduler. This declaration is used when you want to invoke reactions once at specific times or periodically. A timer declaration has the form:

> **timer** _name_(_offset_, _period_);

For example,

```
timer foo(10 msec, 100 msec);
```

This specifies a timer named `foo` that will first trigger 10 milliseconds after the start of execution and then repeatedly trigger at intervals of 100 ms. The units are optional, and if they are not included, then the number will be interpreted in a target-dependent way. The units supported are the same as in [parameter declarations](#parameter-declaration) described above.

The times specified are logical times. Specifically, if two timers have the same _offset_ and _period_, then they are logically simultaneous. No observer will be able to see that one timer has triggered and the other has not. Even though these are logical times, the runtime system will make an effort to align those times to physical times. Such alignment can never be perfect, and its accuracy will depend on the execution platform.

Both arguments are optional, with both having default value zero. An _offset_ of zero or greater specifies the minimum time delay between the time at the start of execution and when the action is triggered. The _period_ is zero or greater, where a value of zero specifies that the reactions should be triggered exactly once,
whereas a value greater than zero specifies that they should be triggered repeatedly with the period given.

To cause a reaction to be invoked at the start of execution, a special **startup** trigger is provided:

```
reactor Foo {
    reaction(startup) {=
        ... perform initialization ...
    =}
}
```

The **startup** trigger is equivalent to a timer with no _offset_ or _period_.

### Action Declaration

An **action**, like an input, can cause reactions to be invoked. Whereas inputs are provided by other reactors, actions are scheduled by this reactor itself, either in response to some observed external event or as a delayed response to some input event. The action can be scheduled by a reactor by invoking a [**schedule** function](#scheduling-future-reactions) in a reaction or in an asynchronous callback function.

An action declaration is either physical or logical:

> **physical action** _name_(_min_delay_, _min_spacing_, _policy_):_type_;<br> > **logical action** _name_(_min_delay_, _min_spacing_, _policy_):_type_;<br>

The _min_delay_, _min_spacing_, and _policy_ are all optional. If only one argument is given in parentheses, then it is interpreted as an _min_delay_, if two are given, then they are interpreted as _min_delay_ and _min_spacing_, etc. The _min_delay_ and _min_spacing_ have to be a time value. The _policy_ argument is a string that can be one of the following: `'defer'` (default), `'drop'`, or `'replace'`.

An action will trigger at a logical time that depends on the arguments given to the schedule function, the _min_delay_, _min_spacing_, and _policy_ arguments above, and whether the action is physical or logical.

If the **logical** keyword is given, then the tag assigned to the event resulting from a call to [**schedule** function](#scheduling-future-reactions) is computed as follows. First, let _t_ be the _current logical time_. For a logical action, the `schedule` function must be invoked from within a reaction (synchronously), so _t_ is just the logical time of that reaction.

The (preliminary) tag of the action is then just _t_ plus _min_delay_ plus the _offset_ argument to [**schedule** function](#scheduling-future-reactions).

If the **physical** keyword is given, then the physical clock on the local platform is used as the timestamp assigned to the action. Moreover, for a physical action, unlike a logical action, the `schedule` function can be invoked from outside of any reaction (asynchronously), e.g. from an interrupt service routine or callback function.

If a _min_spacing_ has been declared, then a minimum distance between the tags of two subsequently scheduled events on the same action is enforced. If the preliminary tag is closer to the tag of the previously scheduled event (if there is one), then _policy_ determines how the given constraints is enforced.

- `'drop'`: the new event is dropped and `schedule` returns without having modified the event queue.
- `'replace'`: the payload of the new event is assigned to the preceding event if it is still pending in the event queue; no new event is added to the event queue in this case. If the preceding event has already been pulled from the event queue, the default `'defer'` policy is applied.
- `'defer'`: the event is added to the event queue with a tag that is equal to earliest time that satisfies the minimal spacing requirement. Assuming the tag of the preceding event is _t_prev_, then the tag of the new event simply becomes _t_prev_ + _min_spacing_.

Note that while the `'defer'` policy is conservative in the sense that it does not discard events, it could potentially cause an unbounded growth of the event queue.

In all cases, the logical time of a new event will always be strictly greater than the logical time at which it is scheduled by at least one microstep (see the [Time](#Time) section).

The default _min_delay_ is zero. The default _min_spacing_ is undefined (meaning that no minimum spacing constraint is enforced). If a `min_spacing` is defined, it has to be strictly greater than zero, and greater than or equal to the time precision of the target (for the C target, it is one nanosecond).

The _min_delay_ parameter in the **action** declaration is static (set at compile time), while the _offset_ parameter given to the schedule function may be dynamically set at runtime. Hence, for static analysis and scheduling, the **action**'s' _min_delay_ parameter can be assumed to be a _minimum delay_ for analysis purposes.

#### Discussion

Logical actions are used to schedule events at a future logical time relative to the current logical time. Physical time is ignored. They must be scheduled within reactions, and the timestamp of the scheduled event will be relative to the current logical time of the reaction that schedules them. It is an error to schedule a logical action asynchronously, outside of the context of a reaction. Asynchronous actions are required to be **physical**.

Physical actions are typically used to assign timestamps to externally triggered events, such as the arrival of a network message or the acquisition of sensor data, where the time at which these external events occurs is of interest. There are (at least) three interesting use cases:

1. An asynchronous event, such as a callback function or interrupt service routine (ISR), is invoked at a physical time _t_ and schedules an action with timestamp _T_=_t_. To get this behavior, just set the physical action to have _min_delay_ = 0 and call the schedule function with _offset_ = 0. The _min_spacing_ can be useful here to prevent these external events from overwhelming the software system.
2. A periodic task that is occasionally modified by a sporadic sensor. In this case, you can set _min_delay_ = _period_ and call schedule with _offset_ = 0. The resulting timestamp of the sporadic sensor event will always align with the periodic events. This is similar to periodic polling, but without the overhead of polling the sensor when nothing interesting is happening.
3. You can impose a minimum physical time delay between an event's occurrence, such as a push of a button, and system response by adjusting the _offset_.

### Actions With Values

If an action is declared with a _type_, then it can carry a **value**, a data value passed to the **schedule** function. This value will be available to any reaction that is triggered by the action. The specific mechanism, however, is target-language dependent. See the [C target](Writing-reactors-in-C#actions-with-values) for an example.

## Reaction Declaration

A reaction is defined within a reactor using the following syntax:

> **reaction**(_triggers_) _uses_ -> _effects_ {=<br/> > &nbsp;&nbsp; ... target language code ... <br/>
> =}

The _uses_ and _effects_ fields are optional. A simple example appears in the "hello world" example given above:

```
    reaction(t) {=
        printf("Hello World.\n");
    =}
```

In this example, `t` is a **trigger** (a timer named `t`). When that timer fires, the reaction will be invoked. Triggers can be [timers](#timer-declaration), [inputs](#input-declaration), [outputs](#output-declaration) of contained reactors, or [actions](#action-declaration). A comma-separated list of triggers can be given, in which case any of the specified triggers can trigger the reaction. If, at any logical time instant, more than one of the triggers fires, the reaction will nevertheless be invoked only once.

The _uses_ field specifies [inputs](#input-declaration) that the reaction observes but that do not trigger the reaction. This field can also be a comma-separated list of inputs. Since the input does not trigger the reaction, the body of the reaction will normally need to test for presence of the input before using it. How to do this is target specific. See [how this is done in the C target](Writing-Reactors-in-C#Inputs-and-Outputs).

The _effects_ field, occurring after the right arrow, declares which [outputs](#output-declaration) and [actions](#action-declaration) the target code _may_ produce or schedule. The _effects_ field may also specify [inputs](#input-declaration) of contained reactors, provided that those inputs do not have any other sources of data. These declarations make it _possible_ for the reaction to send outputs or enable future actions, but they do not _require_ that the reaction code do that.

### Target Code

The body of the reaction is code in the target language surrounded by `{=` and `=}`. This code is not parsed by the Lingua Franca compiler. It is used verbatim in the program that is generated.

The target provides language-dependent mechanisms for referring to inputs, outputs, and actions in the target code. These mechanisms can be different in each target language, but all target languages provide the same basic set of mechanisms. These mechanisms include:

- Obtaining the current logical time (logical time does not advance during the execution of a reaction, so the execution of a reaction is logically instantaneous).
- Determining whether inputs are present at the current logical time and reading their value if they are. If a reaction is triggered by exactly one input, then that input will always be present. But if there are multiple triggers, or if the input is specified in the _uses_ field, then the input may not be present when the reaction is invoked.
- Setting output values. Reactions in a reactor may set an output value more than once at any instant of logical time, but only the last of the values set will be sent on the output port.
- Scheduling future actions.

In the [C target](Writing-Reactors-in-C#Reaction-Body), for example, the following reactor will add two inputs if they are present at the time of a reaction:

```
reactor Add {
    input in1:int;
    input in2:int;
    output out:int;
    reaction(in1, in2) -> out {=
        int result = 0;
        if (in1->is_present) result += in1->value;
        if (in2->is_present) result += in2->value;
        SET(out, result);
    =}
}
```

See the [C target](Writing-Reactors-in-C#Reaction-Body) for an example of how these things are specified in C.

**NOTE:** if a reaction fails to test for the presence of an input and reads its value anyway, then the result it will get is undefined and may be target dependent. In the C target, as of this writing, the value read will be the most recently seen input value, or, if no input event has occurred at an earlier logical time, then zero or NULL, depending on the datatype of the input. In the TS target, the value will be **undefined**, a legitimate value in TypeScript.

### Scheduling Future Reactions

Each target language provides some mechanism for scheduling future reactions. Typically, this takes the form of a `schedule` function that takes as an argument an [action](#Action-Declaration), a time interval, and (perhaps optionally), a payload. For example, in the [C target](Writing-Reactors-in-C#Reaction-Body), in the following program, each reaction to the timer `t` schedules another reaction to occur 100 msec later:

```
target C;
main reactor Schedule {
    timer t(0, 1 sec);
    logical action a;
    reaction(t) -> a {=
        schedule(a, MSEC(100));
    =}
    reaction(a) {=
        printf("Nanoseconds since start: %lld.\n", get_elapsed_logical_time());
    =}
}
```

When executed, this will produce the following output:

```
Start execution at time Sun Aug 11 04:11:57 2019
plus 919310000 nanoseconds.
Nanoseconds since start: 100000000.
Nanoseconds since start: 1100000000.
Nanoseconds since start: 2100000000.
...
```

This action has no datatype and carries no value, but, as explained below, an action can carry a value.

### Asynchronous Callbacks

In targets that support multitasking, the `schedule` function, which schedules future reactions, may be safely invoked on a **physical action** in code that is not part of a reaction. For example, in the multithreaded version of the [C target](Writing-Reactors-in-C#Reaction-Body), `schedule` may be invoked in an interrupt service routine. The reaction(s) that are scheduled are guaranteed to occur at a time that is strictly larger than the current logical time of any reactions that are being interrupted.

### Superdense Time

Lingua Franca uses a concept known as **superdense time**, where two time values that appear to be the same are not logically simultaneous. At every logical time value, for example midnight on January 1, 1970, there exist a logical sequence of **microsteps** that are not simultaneous. The [Microsteps](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Microsteps.lf) example illustrates this:

```
target C;
reactor Destination {
    input x:int;
    input y:int;
    reaction(x, y) {=
        printf("Time since start: %lld.\n", get_elapsed_logical_time());
        if (x->is_present) {
            printf("  x is present.\n");
        }
        if (y->is_present) {
            printf("  y is present.\n");
        }
    =}
}
main reactor Microsteps {
    timer start;
    logical action repeat;
    d = new Destination();
    reaction(start) -> d.x, repeat {=
        SET(d.x, 1);
        schedule(repeat, 0);
    =}
    reaction(repeat) -> d.y {=
        SET(d.y, 1);
    =}
}
```

The `Destination` reactor has two inputs, `x` and `y`, and it simply reports at each logical time where either is present what is the logical time and which is present. The `Microsteps` reactor initializes things with a reaction to the one-time timer event `start` by sending data to the `x` input of `Destination`. It then schedules a `repeat` action.

Note that time delay in the call to `schedule` is zero. However, any reaction scheduled by `schedule` is required to occur **strictly later** than current logical time. In Lingua Franca, this is handled by scheduling the `repeat` reaction to occur one **microstep** later. The output printed, therefore, will look like this:

```
Time since start: 0.
  x is present.
Time since start: 0.
  y is present.
```

Note that the numerical time reported by `get_elapsed_logical_time()` has not advanced in the second reaction, but the fact that `x` is not present in the second reaction proves that the first reaction and the second are not logically simultaneous. The second occurs one microstep later.

Note that it is possible to write code that will prevent logical time from advancing except by microsteps. For example, we could replace the reaction to `repeat` in `Main` with this one:

```
    reaction(repeat) -> d.y, repeat {=
        SET(d.y, 1);
        schedule(repeat, 0);
    =}
```

This would create what is known as a **stuttering Zeno** condition, where logical time cannot advance. The output will be an unbounded sequence like this:

```
Time since start: 0.
  x is present.
Time since start: 0.
  y is present.
Time since start: 0.
  y is present.
Time since start: 0.
  y is present.
...
```

### Startup and Shutdown Reactions

Two special triggers are supported, **startup** and **shutdown**. A reaction that specifies the **startup** trigger will be invoked at the start of execution of the model. The following two syntaxes have exactly the same effect:

```
    reaction(startup) {= ... =}
```

and

```
    timer t;
    reaction(t) {= ... =}
```

In other words, **startup** is a timer that triggers once at the first logical time of execution. As with any other reaction, the reaction can also be triggered by inputs and can produce outputs or schedule actions.

The **shutdown** trigger is slightly different. A shutdown reaction is specified as follows:

```
   reaction(shutdown) {= ... =}
```

This reaction will be invoked when the program terminates normally (there are no more events, some reaction has called a `request_stop()` utility provided in the target language, or the execution was specified to last a finite logical time). The reaction will be invoked at a logical time one microstep _later_ than the last logical time of the execution. In other words, the presence of this reaction means that the program will execute one extra logical time cycle beyond what it would have otherwise, and that logical time is one microstep later than what would have otherwise been the last logical time.

If the reaction produces outputs, then downstream reactors will also be invoked at that later logical time. If the reaction schedules future reactions, those will be ignored. After the completion of this final logical time cycle, one microstep later than the normal termination, the program will exit.

## Contained Reactors

Reactors can contain instances of other reactors defined in the same file or in an imported file. Assuming the above [Count reactor](#state-declaration) is stored in a file [Count.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/lib/Count.lf), then [CountTest](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/CountTest.lf) is an example that imports and instantiates it to test the reactor:

```
target C;
import Count.lf;
reactor Test {
    input c:int;
    state i:int(0);
    reaction(c) {=
        printf("Received %d.\n", c->value);
        (self->i)++;
        if (c->value != self->i) {
            printf("ERROR: Expected %d but got %d\n.", self->i, c->value);
            exit(1);
        }
    =}
    reaction(shutdown) {=
        if (self->i != 4) {
            printf("ERROR: Test should have reacted 4 times, but reacted %d times.\n", self->i);
            exit(2);
        }
    =}
}

main reactor CountTest {
    count = new Count();
    test = new Test();
    count.out -> test.c;
}
```

An instance is created with the syntax:

> _instance_name_ = **new** _class_name_(_parameters_);

A bank with several instances can be created in one such statement, as explained in the [banks of reactors documentation](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The _parameters_ argument has the form:

> _parameter1_name_ = _parameter1_value_, _parameter2_name_ = _parameter2_value_, ...

Connections between ports are specified with the syntax:

> _output_port_ -> _input_port_

where the ports are either _instance_name.port_name_ or just _port_name_, where the latter form denotes a port belonging to the reactor that contains the instances.

### Physical Connections

A subtle and rarely used variant is a **physical connection**, denoted `~>`. In such a connection, the logical time at the recipient is derived from the local physical clock rather than being equal to the logical time at the sender. The physical time will always exceed the logical time of the sender, so this type of connection incurs a nondeterministic positive logical time delay. Physical connections are useful sometimes in [[Distributed-Execution]] in situations where the nondeterministic logical delay is tolerable. Such connections are more efficient because timestamps need not be transmitted and messages do not need to flow through through a centralized coordinator (if a centralized coordinator is being used).

### Connections with Delays

Connections may include a **logical delay** using the **after** keyword, as follows:

> _output_port_ -> _input_port_ **after** 10 **msec**

This means that the logical time of the message delivered to the _input_port_ will be 10 milliseconds larger than the logical time of the reaction that wrote to _output_port_. If the time value is greater than zero, then the event will appear at microstep 0. If it is equal to zero, then it will appear at the current microstep plus one.

When there are multiports or banks of reactors, several channels can be connected with a single connection statement. See [Multiports and Banks of Reactors](Multiports-and-Banks-of-Reactors#banks-of-reactors).

The following example defines a reactor that adds a counting sequence to its input. It uses the above Count and Add reactors (see [Hierarchy2](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Hierarchy2.lf)):

```
import Count.lf;
import Add.lf;
reactor AddCount {
    input in:int;
    output out:int;
    count = new Count();
    add = new Add();
    in -> add.in1;
    count.out -> add.in2;
    add.out -> out;
}
```

A reactor that contains other reactors may, within a reaction, send data to the contained reactor. The following example illustrates this (see [SendingInside](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/SendingInside.lf)):

```
target C;
reactor Printer {
	input x:int;
	reaction(x) {=
		printf("Inside reactor received: %d\n", x->value);
	=}
}
main reactor SendingInside {
	p = new Printer();
	reaction(startup) -> p.x {=
		SET(p.x, 1);
	=}
}
```

Running this will print:

```
Inside reactor received: 1
```

## Deadlines

Lingua Franca includes a notion of a **deadline**, which is a relation between logical time and physical time. Specifically, a program may specify that the invocation of a reaction must occur within some physical-time interval of the logical timestamp of the message. If a reaction is invoked at logical time 12 noon, for example, and the reaction has a deadline of one hour, then the reaction is required to be invoked before the physical-time clock of the execution platform reaches 1 PM. If the deadline is violated, then the specified deadline handler is invoked instead of the reaction. For example (see [Deadline](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/Deadline.lf)):

```
reactor Deadline() {
    input x:int;
    output d:int; // Produced if the deadline is violated.
    reaction(x) -> d {=
        printf("Normal reaction.\n");
    =} deadline(10 msec) {=
        printf("Deadline violation detected.\n");
        SET(d, x->value);
    =}
```

This reactor specifies a deadline of 10 milliseconds (this can be a parameter of the reactor). If the reaction to `x` is triggered later in physical time than 10 msec past the timestamp of `x`, then the second body of code is executed instead of the first. That second body of code has access to anything the first body of code has access to, including the input `x` and the output `d`. The output can be used to notify the rest of the system that a deadline violation occurred.

The amount of the deadline, of course, can be given by a parameter.

A sometimes useful pattern is when a container reactor reacts to deadline violations in a contained reactor. The [DeadlineHandledAbove](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/DeadlineHandledAbove.lf) example illustrates this:

```
target C;
reactor Deadline() {
    input x:int;
    output deadline_violation:bool;
    reaction(x) -> deadline_violation {=
        ... normal code to execute ...
    =} deadline(100 msec) {=
        printf("Deadline violation detected.\n");
        SET(deadline_violation, true);
    =}
}
main reactor DeadlineHandledAbove {
    d = new Deadline();
    ...
    reaction(d.deadline_violation) {=
        ... handle the deadline violation ...
    =}
}
```

## Comments

Lingua Franca files can have C/C++/Java-style comments and/or Python-style comments. All of the following are valid comments:

```
    // Single-line C-style comment.
    /*
       Multi-line C-style comment.
     */
    # Single-line Python-style comment.
    '''
       Multi-line Python-style comment.
    '''
```

## Appendix: LF types

Type annotations may be written in many places in LF, including [parameter declarations](#Parameter-declaration), [state variable declarations](#State-declaration), [input](#Input-declaration) and [output declarations](#Output-declaration). In some targets, they are required, because the target language requires them too.

Assigning meaning to type annotations is entirely offloaded to the target compiler, as LF does not feature a type system (yet?). However, LF's syntax for types supports a few idioms that have target-specific meaning. Types may have the following forms:

- the **time** type is reserved by LF, its values represent time durations. The **time** type accepts _time expressions_ for values, eg `100 msec`, or `0` (see [Basic expressions](#basic-expressions) for a reference).
- identifiers are valid types (eg `int`, `size_t`), and may be followed by type arguments (eg `vector<int>`).
- the syntactic forms `type[]` and `type[integer]` correspond to target-specific array types. The second form is available only in languages which support fixed-size array types (eg in C++, `std::array<5>`).
- the syntactic form `{= some type =}` allows writing an arbitrary type as target code. This is useful in target languages which have complex type grammar (eg in TypeScript, `{= int | null =}`).

Also note that to use strings conveniently in the C target, the "type" `string` is an alias for `{=char*=}`.

(Types ending with a `*` are treated specially by the C target. See [Sending and Receiving Arrays and Structs](Writing-Reactors-in-C#sending-and-receiving-arrays-and-structs) in the C target documentation.)

## Appendix: LF expressions

A subset of LF syntax is used to write _expressions_, which represent target language values. Expressions are used in [state variable](#State-declaration) initializers, default values for [parameters](#Parameter-declarations), and [parameter assignments](#Contained-reactors).

Expressions in LF support only simple forms, that are intended to be common across languages. Their precise meaning (eg the target language types they are compatible with) is target-specific and not specified here.

### Basic expressions

The most basic expression forms, which are supported by all target languages, are the following:

- Literals:
  - Numeric literals, eg `1`, `-120`, `1.5`. Note that the sign, if any, is part of the literal and must not be separated by whitespace.
  - String literals, eg `"abcd"`. String literals always use double-quotes, even in languages which support other forms (like Python).
  - Character literals. eg `'a'`. Single-quoted literals must be exactly one character long --even in Python.
  - Boolean literals: `true`, `false`, `True`, `False`. The latter two are there for Python.
- Parameter references, which are simple identifiers (eg `foo`). Any identifier in expression position must refer to a parameter of the enclosing reactor.
- Time values, eg `1 msec` or `10 seconds`. The syntax of time values is `integer time_unit`, where `time_unit` is one of the following

  - **nsec**: nanoseconds
  - **usec**: microseconds
  - **msec**: milliseconds
  - **sec** or **second**: seconds
  - **minute**: 60 seconds
  - **hour**: 60 minutes
  - **day**: 24 hours
  - **week**: 7 days

  Each of these units also support a pluralized version (eg `nsecs`, `minutes`, `days`), which means the same thing.

  The time value `0` may have no unit. Except in this specific case, the unit is always required.

  Time values are compatible with the `time` type.

- Escaped target-language expression, eg `{= foo() =}`. This syntax is used to write any expression which does not fall into one of the other forms described here. The contents are not parsed and are used verbatim in the generated file.

  The variables in scope are target-specific.

### Complex expressions

Some targets may make use of a few other syntactic forms for expressions. These syntactic forms may be acribed a different meaning by different targets, to keep the source language close in meaning to the target language.

We describe here these syntactic forms and what meaning they have in each target.

- Bracket-list syntax, eg `[1, 2, 3]`. This syntax is used to create a list in Python. It is not supported by any other target at the moment.
  ```python
  state x([1,2,3])
  ```

#### Initializer pseudo-expressions

Some "expression" forms are only acceptable as the initializer of a state variable or parameter, but not in other places (like inside a list expression). These are

- Tuple syntax, eg `(1, 2, 3)`. This syntax is used:

  - in the Python target, to create a tuple value. Tuples are different from lists in that they are immutable.
  - in C++, to pass arguments to a constructor:

    ```cpp
    state x: int[](1,2);
    ```

    In that example, the initializer expression is translated to `new std::vector(1,2)`. See also [C++ target documentation](https://github.com/lf-lang/lingua-franca/wiki/Writing-Reactors-in-Cpp#using-state-variables).

  - in C and all other targets, to create a target-specific array value. In the Python target, this is accomplished by the bracket-list syntax `[1,2,3]` instead. Note that to create a zero- or one-element array, fat braces are usually required. For instance in C:

  ```c
    state x: int[](1,2,3); // creates an int array, basically `int x[] = {1,2,3};`
    state x: int[](1);     // `int x[] = 1;` - type error!
    state x: int[]({= {1} =})  // one element array: `int x[] = {1};`
  ```

- Brace-list syntax, eg `{1, 2, 3}`. This syntax is at the moment only supported by the C++ target. It's used to initialize a vector with the initializer list syntax instead of a constructor call.
