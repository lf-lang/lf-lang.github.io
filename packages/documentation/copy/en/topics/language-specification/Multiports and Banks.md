---
title: Multiports and Banks
layout: docs
permalink: /docs/handbook/multiports-banks
oneline: "Multiports and Banks of Reactors."
preamble: >
---
This page describes Lingua Franca language constructs support more scalable programs by providing a compact syntax for ports that can send or receive over multiple channels (called **multiports**) and multiple instances of a reactor class (called a **bank of reactors**). The examples given below include syntax of the C target for accessing the ports. Other targets use different syntax with target code, within the delimiters `{= ... =}`, but use the same syntax outside those delimiters.

# Multiports

To declare an input or output port to be a **multiport**, use the following syntax:

> **input**[*width*] *name*:*type*;
> **output**[*width*] *name*:*type*;

where *width* is a positive integer. This can be given either as an integer literal or a parameter name. For targets that allow dynamic parametrization at runtime (like the C++ target), width can also be given by target code enclosed in `{=...=}`.

For example, (see [MultiportToMultiport](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/multiport/MultiportToMultiport.lf)):

```
target C;
reactor Source {
    output[4] out:int;
    reaction(startup) -> out {=
        for(int i = 0; i < out_width; i++) {
            SET(out[i], i);
        }
    =}
}
reactor Destination {
    input[4] in:int;
    reaction(in) {=
        int sum = 0;
        for (int i = 0; i < in_width; i++) {
            if (in[i]->is_present) sum += in[i]->value;
        }
        printf("Sum of received: %d.\n", sum);
    =}
}
main reactor MultiportToMultiport { 
    a = new Source();
    b = new Destination();
    a.out -> b.in;
}
```

The `Source` reactor has a four-way multiport output and the `Destination` reactor has a four-way multiport input. These channels are connected all at once on one line, the second line from the last. Running this program produces:

```
Sum of received: 6.
```

**NOTE**: In `Destination`, the reaction is triggered by `in`, not by some individual channel of the multiport input. Hence, it is important when using multiport inputs to test for presence of the input on each channel, as done above with the syntax `if (in[i]->is_present) ...`. An event on any one of the channels is sufficient to trigger the reaction.

## Sending and Receiving Via a Multiport

The source reactor specifies `out` as an effect of its reaction using the syntax `-> out`. This brings into scope of the reaction body a way to access the width of the port and a way to write to each channel of the port. It is also possible to test whether a previous reaction has set an output value and to read what that value is. The exact syntax for this depends on the target language. In the C target, the width is accessed with the variable `out_width`, and `out[i]` references the output channel to write to using the `SET` macro, as shown above. In addition, `out[i]->is_present` and `out[i]->value` are defined. For example, if we modify the above reaction as follows:

```
reactor Source {
    output[4] out:int;
    reaction(startup) -> out {=
        for(int i = 0; i < out_width; i++) {
            printf("Before SET, out[%d]->is_present has value %d\n", i, out[i]->is_present);
            SET(out[i], i);
            printf("AFTER set, out[%d]->is_present has value %d\n", i, out[i]->is_present);
            printf("AFTER set, out[%d]->value has value %d\n", i, out[i]->value);
        }
    =}
}
```

then we get the output:

```
​```
Before SET, out[0]->is_present has value 0
AFTER set, out[0]->is_present has value 1
AFTER set, out[0]->value has value 0
Before SET, out[1]->is_present has value 0
AFTER set, out[1]->is_present has value 1
AFTER set, out[1]->value has value 1
Before SET, out[2]->is_present has value 0
AFTER set, out[2]->is_present has value 1
AFTER set, out[2]->value has value 2
Before SET, out[3]->is_present has value 0
AFTER set, out[3]->is_present has value 1
AFTER set, out[3]->value has value 3
Sum of received: 6.
```

If you access `out[i]->value` before any value has been set, the result is undefined.

## Parameterized Widths
The width of a port may be given by a parameter. For example, the above `Source` reactor can be rewritten
```
reactor Source(width:int(4)) {
    output[width] out:int;
    reaction(startup) -> out {=
        for(int i = 0; i < out_width; i++) {
            SET(out[i], i);
        }
    =}
}
```

In some targets such as the C++ target, parameters to the main reactor can be overwritten at the command line interface, allowing for dynamically scalable applications.

## Connecting Reactors with Different Widths
Assume that the `Source` and `Destination` reactors above both use a parameter `width` to specify the width of their ports. Then the following connection is valid  (see [MultiportToMultiport2](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/multiport/MultiportToMultiport2.lf))
```
main reactor MultiportToMultiport2 {
    a1 = new Source(width = 3);
    a2 = new Source(width = 2);
    b = new Destination(width = 5);
    a1.out, a2.out -> b.in;
}
```
The first three ports of `b` will received input from `a1`, and the last two ports will receive input from `a2`.  Parallel composition can appear on either side of a connection. For example:
```
    a1.out, a2.out -> b1.out, b2.out, b3.out;
```
If the total width on the left does not match the total width on the right, then a warning is issued. If the left side is wider than the right, then output data will be discarded. If the right side is wider than the left, then inputs channels will be absent.

Any given port can appear only once on the right side of the `->` connection operator, so all connections to a multiport destination must be made in one single connection statement.

# Banks of Reactors

Using a similar notation, it is possible to create a bank of reactors. For example, we can create a bank of four instances of `Source` and four instances of `Destination` and connect them as follows (see [MultiportToBankMultiport](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/multiport/MultiportToBankMultiport.lf)):

```
main reactor BankToBankMultiport { 
	a = new[4] Source();
	b = new[4] Destination();
	a.out -> b.in;
}
```

If the `Source` and `Destination` reactors have multiport inputs and outputs, as in the examples above, then a warning will be issued if the total width on the left does not match the total width on the right. For example, the following is balanced:

```
main reactor BankToBankMultiport { 
	a = new[3] Source(width = 4);
	b = new[4] Destination(width = 3);
	a.out -> b.in;
}
```

There will be three instances of `Source`, each with an output of width four, and four instances of `Destination`, each with an input of width 3, for a total of 12 connections.

To distinguish the instances in a bank of reactors, the reactor can define a parameter called **bank_index** with any type that can be assigned a non-negative integer value (in C, for example, `int`, `size_t`, or `uint32_t` will all work). If such a parameter is defined for the reactor, then when the reactor is instanced in a bank, each instance will be assigned a number between 0 and *n*-1, where *n* is the number of reactor instances in the bank. For example, the following source reactor increments the output it produces by the value of `bank_index` on each reaction to the timer (see [BankToBank](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/multiport/BankToBank.lf)):

```
reactor Source(
    bank_index:int(0)
) {
	timer t(0, 200 msec);
	output out:int;
	state s:int(0);
	reaction(t) -> out {=
        SET(out, self->s);
   	    self->s += self->bank_index;
	=}
}
```

The width of a bank may also be given by a parameter, as in
```
main reactor BankToBankMultiport(
    source_bank_width:int(3),
    destination_bank_width:int(4)
) { 
	a = new[source_bank_width] Source(width = 4);
	b = new[destination_bank_width] Destination(width = 3);
	a.out -> b.in;
}
```

## Combining Banks and Multiports

Banks of reactors may be combined with multiports  (see [MultiportToBank](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/multiport/MultiportToBank.lf)):

```
reactor Source {
    output[3] out:int;
    reaction(startup) -> out {=
        for(int i = 0; i < out_width; i++) {
            SET(out[i], i);
        }
    =}
}
reactor Destination(
    bank_index:int(0)
) {
    input in:int;
    reaction(in) {=
        printf("Destination %d received %d.\n", self->bank_index, in->value);
    =}
}

main reactor MultiportToBank { 
    a = new Source();
    b = new[3] Destination();
    a.out -> b.in;
}
```

The three outputs from the `Source` instance `a` will be sent, respectively, to each of three instances of `Destination`, `b[0]`, `b[1]`, and `b[2]`.

The reactors in a bank may themselves have multiports. In all cases, the number of ports on the left of a connection must match the number on the right, unless the ones on the left are iterated, as explained next.

# Broadcast Connections

Occasionally, you will want to have fewer ports on the left of a connection and have their outputs used repeatedly to broadcast to the ports on the right. In the [ThreadedThreaded](https://github.com/lf-lang/lingua-franca/blob/master/test/C/src/concurrent/ThreadedThreaded.lf) example, the outputs from an ordinary port are broadcast to the inputs of all instances of a bank of reactors:

```
reactor Source {
	output out:int;
	reaction(startup) -> out {=
		SET(out, 42);
	=}
}
reactor Destination {
	input in:int;
	reaction(in) {=
		...
	=}
}
main reactor ThreadedThreaded(width:int(4)) {
	a = new Source();
	d = new[width] Destination();
	(a.out)+ -> d.in;
}
```

The syntax `(a.out)+` means "repeat the output port `a.out` one or more times as needed to supply all the input ports of `d.in`."  The content inside the parentheses can be a comma-separated list of ports, the ports inside can be ordinary ports or multiports, and the reactors inside can be ordinary reactors or banks of reactors. In all cases, the number of ports inside the parentheses on the left must divide the number of ports on the right.

# Interleaved Connections

Sometimes, we don't want to broadcast messages to all reactors, but need more fine-grained control as to which reactor within a bank receives a message. If we have separate source and destination reactors, this can be done by combining multiports and banks as was shown in [Combining Banks and Multiports](#Combining-Banks-and-Multiports). Setting a value on the index N of the output multiport, will result in a message to the Nth reactor instance within the destianation bank. However, this pattern gets slightly more complicated, if we want to exchange addressable messages between instances of the same bank. This pattern is shown in the [FullyConnected_01_Addressable](https://github.com/lf-lang/lingua-franca/blob/master/example/C/src/Patterns/FullyConnected_01_Addressable.lf) example, which is simplified below:
```
reactor Node(
    num_nodes: size_t(4),
    bank_index: int(0)
) {
    input[num_nodes] in: int;
    output[num_nodes] out: int;
    
    reaction (startup) -> out {=
     	SET(out[1], 42);
    =}
    
    reaction (in) {=
        ...
    =}
}

main reactor(num_nodes: size_t(4)) {
    nodes = new[num_nodes] Node(num_nodes=num_nodes);
    nodes.out -> interleaved(nodes.in);
}
```
In the above program, four instance of `Node` are created, and, at startup, each instance sends 42 to its second (index 1) output channel.  The result is that the second bank member (`bank_index` 1) will receive the number 42 on each input channel of its multiport input. The 0-th channel will receive from `bank_index` 0, the 1-th channel from `bank_index` 1, etc.  In effect, the choice of output channel specifies the destination reactor in the bank, and the input channel specifies the source reactor.

This style of connection is accomplished using the new keyword **interleaved** in the connection. Normally, a port reference such as `nodes.out` where `nodes` is a bank and `out` is a multiport, would list all the individual ports by first iterating over the banks and then the ports. If we consider the tuple (b,p) to denote the index b within the bank and the index p within the multiport, then the following list is created: (0,0), (0,1), (0,2), (0,3), (1,0), (1,1), (1,2), (1,3), (2,0), (2,1), (2,2), (2,3), (3,0), (3,1), (3,2), (3,3). However, if we use `interleaved(nodes.out)` instead, the connection logic will iterate over the ports first and then the banks, creating the following list: (0,0), (1,0), (2,0), (3,0), (0,1), (1,1), (2,1), (3,1), (0,2), (1,2), (2,2), (3,2), (0,3), (1,3), (2,3), (3,3). By combining a normal port reference with a interleaved reference, we can construct a fully connected network. The figure below visualizes this pattern and shows a desugared version constructed without banks or multiports:

![Addressable](https://user-images.githubusercontent.com/6460123/127457209-1ce3339e-53c1-4ac8-a379-5a8fbb5940d3.png)

If we would use a normal connection instead `nodes.out -> nodes.in;`, then the following pattern would be created:

![Naive](https://user-images.githubusercontent.com/6460123/127457454-8e15d222-c9da-4a5b-8182-32f86546baa0.png)

Effectively, this connects each reactor instance to itself, which isn't very useful.