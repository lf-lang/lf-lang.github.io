---
title: "Distributed Execution"
layout: docs
permalink: /docs/handbook/distributed-execution
oneline: "Distributed Execution (preliminary)"
preamble: >
---
```diff
! The information in this page is outdated, and will be updated soon.
```

**NOTE:** This describes a highly preliminary capability to map pieces of a Lingua Franca program to different machines. This capability is very much under development. This capability has been tested on MacOS and Linux, but not yet on Windows. Volunteer to do that and update these instructions?

A Lingua Franca program can be separated into separate programs called **federates** that communicate with one another. The federates will execute in separate processes and even on separate machines. They can be distributed across networks and can even be written in different target languages.

There is always one federate named **RTI**, for **runtime infrastructure** that coordinates startup and shutdown and may, if the implementation is centralized, mediate communication. The RTI needs to be compiled and installed separately on the system before any federation can execute. The instruction on how to do so can be found [here](https://github.com/lf-lang/lingua-franca/blob/master/org.lflang/src/lib/core/federated/RTI/README.md).

Other than the RTI, if there are *n* federates, then the code generator will generate *n* separate programs with names of the form *Name_Federate*, where *Name* is the name of the top-level Lingua Franca file (without the .lf extension) and *Federate* is the name of the federate reactor. The code generator also produces a shell script that lauches all the federates and the RTI and a second shell script that distributes the generated code for the federates (not the RTI) to the specified machines and compiles the code on that machine.

## Minimal Example

A minimal federated execution is specified by using the **federated** keyword instead of **main**  for the main federate. An example is given in [example/C/Federated/HelloWorld/HelloWorld.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorld.lf), which looks like this:
```
target C;
reactor MessageGenerator { ... }
reactor PrintMessage { ... }

federated reactor DistributedHelloWorld {
    source = new MessageGenerator();
    print = new PrintMessage();
    source.message -> print.message;
}
```
The **federated** keyword tells the code generator that the program is to be split into several distinct programs, one for each top level reactor. When you run the code generator on [example/C/Federated/HelloWorld/HelloWorld.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorld.lf), the following three programs will appear in the `bin` directory:

* HelloWorld
* HelloWorld_source
* HelloWorld_print

The root name, *HelloWorld*, is the name of the .lf file from which these are generated. The suffixes "_source" and "_print" come from the names of the top-level instances. There will always be one federate for each top-level reactor instance. 

To run the program, you can simply run `bin/HelloWorld`, which is a `bash` script that launches the other three programs. Alternatively, you can manually execute the RTI and the federate programs by starting them on the command line in any order.

In addition, one more `bash` shell scripts may be generated:

* HelloWorld_distribute.sh

This script is generated if any of the two federates, or the RTI are specified to be run on a remote machine (see below for how to do that). This script will copy the source files for the relevant program (but not the RTI) to the remote machine and compile them there. The RTI needs to be separately installed on the remote machine.

## Coordinated Start

When the above programs execute, each federate registers with the RTI. When all expected federates have registered, the RTI broadcasts to the federates the logical time at which they should start execution. Hence, all federates start at the same logical time.

The starting logical time is determined as follows. When each federate starts executing, it sends its current physical time (drawn from its real-time clock) to the RTI. When the RTI has heard from all the federates, it chooses the largest of these physical times, adds a fixed offset (currently one second), and broadcasts the resulting time to each federate.

When a federate receives the starting time from the RTI, if it is running in realtime mode (the default), then it will wait until its local physical clock matches or exceeds that starting time.  Thus, to the extent that the machines have [synchronized clocks](#clock-synchronization), the federates will all start executing at roughly the same physical time, a physical time close to the starting logical time.

## Coordinated Shutdown

Coordinating the shutdown of a distributed program is discussed in [[Termination]].

## Communication Between Federates

When one federate sends data to another, by default, the timestamp at the receiver will match the timestamp at the sender. You can also specify a logical delay on the communication using the **after** keyword. For example, if we had instead specified

```
	source.out -> print.in after 200 msec;
```
then the timestamp at the receiving end will be incremented by 200 msec compared to the timestamp at the sender (see [example/C/Federated/HelloWorld/HelloWorldAfter.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorldAfter.lf)).

The preservation of timestamps across federates implies some constraints (see [physical connections](#physical-connections) below for a way to avoid these constraints). How these constraints are managed depends on whether you choose **centralized** or **decentralized** coordination.

## Centralized Coordination

In the **centralized** mode of coordination (the default), the RTI regulates the advancement of time in each of the federates in order to ensure that the logical time semantics of Lingua Franca is respected. If the `print` federate has an event with timestamp *t* that it wants to react to (it is the earliest event in its event queue or it is a **physical action** that just triggered), then it needs to get the OK from the RTI to advance its logical time to *t*. The RTI grants this time advance only when it can assure that `print` has received all messages that it will ever receive with timestamps *t* or less.

First, note that, by default, logical time on each federate never advances ahead of physical time, as reported by its local physical clock. Consider the consequences for the above connection. Suppose the timestamp of the message sent by `source` is *t*. This message cannot be sent before the local clock at `source` reaches *t* and also cannot be sent before the RTI grants to `source` a time advance to *t*. Since `source` has no federates upstream of it, the RTI will always grant it such a time advance.

Suppose that the communication latency is *L*. That is, it takes *L* time units (in physical time) for a message to traverse the network.  Then the `print` federate will not see the message from `source` before physical time *t* + *L*, where this physical time is measured by the physical clock on `source`'s host. If that clock differs from the clock on `print`'s host by *E*, then `print` will see the message at physical time *t* + *E* + *L*, as measured by its own clock. Let the value of the **after** specification (200 msec above) be *a*. Then the timestamp of the received message is *t* + *a*.  The relationship between logical and physical times at the receiving end (the `print` federate), therefore, will depend on the relationship between *a* and *E* + *L*.  If, for example, *E* + *L* > *a*, then federate `print` will lag behind physical time by at least *E* + *L* - *a*.

Assume the RTI has granted a time advance to *t* to federate `source`. Hence, `source` is able to send a message with timestamp *t*. The RTI now cannot grant any time advance to `print` that is greater than or equal to *t* + *a* until the message has been delivered to `print`. In centralized coordination, all messages flow through the RTI, so the RTI will deliver the time advance grant (**TAG**) to `print` only after it has delivered the message.

If *a* > *E* + *L*, then the existence of this communication does not cause `print`'s logical time to lag behind physical time. This means that if a **physical action** appears at `print`, the RTI will be able to immediately grant a time advance to `print` to the timestamp of that physical action. However, if *a* < *E* + *L*, then the RTI will delay granting a time advance to `print` by at least *E* + *L* - *a*. Hence, *E* + *L* - *a* represents an additional latency in the processing of physical actions! This latency could present a problem for meeting deadlines. For this reason, if there are physical actions or deadlines at a federate that receives network messages, it is desirable to set **after** on the connection to that federate to be larger than any expected *E* + *L*. This way, there is no additional latency to processing physical actions at this federate and no additional risk of missing deadlines. 

If, in addition, the physical clocks on the hosts are allowed to drift with respect to one another, then *E* can grow without bound, and hence the lag between logical time and physical time in processing events can grow without bound. This is mitigated either by hosts that themselves realize some clock synchronization algorithm, such as [NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol) or [PTP](https://en.wikipedia.org/wiki/Precision_Time_Protocol), or by utilizing Lingua Franca's own built in [clock synchronization](#clock-synchronization). If the federates lack physical actions and deadlines, however, then unsynchronized clocks present no problem if you are using centralized coordination.

With centralized coordination, all messages (except those on [physical connections](#physical-connections)) go through the RTI. This can create a bottleneck and a single point of failure. To avoid this bottleneck, you can use decentralized coordination.

## Decentralized Coordination

The default coordination between mechanisms is **centralized**, equivalent to specifying the target property:
```
   coordination: centralized
```
Centralized coordination works as described above, where the advancement of time at each federate is regulated by the RTI. In order for the RTI to be able to safely grant a time advance to a federate, it is also necessary for all messages to that federate to go through the RTI. The RTI, therefore, can easily become a bottleneck.

An alternative is **decentralized** coordination, which uses a technique called [PTIDES](https://ptolemy.berkeley.edu/publications/papers/07/RTAS/):
```
   coordination: decentralized
```
This technique has also been implemented in Google Spanner, a globally distributed database system. In decentralized coordination, each federate has a **safe-to-process** (**STP**) offset. In decentralized coordination, when one federate communicates with another, it does so directly through a dedicated socket without going through the RTI. Moreover, it does not consult the RTI to advance logical time. Instead, it can advance its logical time to *t* when its physical clock matches or exceeds *t* + STP. 

By default, the STP is zero. This will work fine under the assumption that **every** logical connection between federates has a sufficiently large `after` clause. That is, the value of the logical delay must exceed the sum of the [clock synchronization](#clock-synchronization) error *E*, the network latency bound *L*, and the time lag on the sender *D* (the physical time at which it sends the message minus the timestamp of the message). The sender's time lag *D* can be enforced by using a **deadline**. See for example [example/C/Federated/HelloWorld/HelloWorldDecentralized.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorldDecentralized.lf).

Of course, this assumption can be violated in practice. Analogous to a deadline violation, Lingua Franca provides a mechanism for handling such a violation that is called a `tardy` handlers as done in [example/C/Federated/HelloWorld/HelloWorldDecentralized.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorldDecentralized.lf).(example/C/Federated/HelloWorld/HelloWorldDecentralized.lf). The pattern is:

```
reaction(in) {=
    // User code
=} tardy {=
    // Error handling code
=}
```
If the timestamp at which this reaction is to be invoked (the value returned by `get_current_tag`) cannot match the timestamp of an incoming message `in` (because the current tag has already advanced beyond the intended tag of `in`), then the `tardy` handler will be invoked instead of the normal reaction.  Within the body of the tardy handler, the code can access the intended tag of `in` using `in->intended_tag`, which has two fields, a timestamp `in->intended_tag.time` and a microstep `in->intended_tag.microstep`.  The code can then ascertain the severity of the error and act accordingly. If no tardy handler is provided at any reaction triggered by an input from another federate, then the normal reaction will be invoked at the earliest feasible logical time greater than or equal to the intended logical time of the message.

One option available to the code is to increase the STP. This can be done simply by equipping a federate with a parameter of type **time** named `STP`.  See for example [example/C/Federated/HelloWorld/HelloWorldDecentralizedSTP.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorldDecentralizedSTP.lf). This can be done as follows:
```
import PrintMessageWithDetector from "HelloWorldDecentralized.lf"
reactor PrintMessageWithSTP(STP:time(10 msec)) extends PrintMessageWithDetector {}
```
Notice that the only override in `PrintMessageWithSTP` is the addition of an `STP` parameter.

The LF API provides two functions that can be used to dynamically adjust the STP:
```
interval_t get_stp_offset(); 
void set_stp_offset(interval_t offset);
```
Using these functions, however, is a pretty advanced operation.

**FIXME:** The discussion of cycles in the remainder of this section needs to be revisited with pointers to newer examples.

Now suppose that if there are cycles in the communication between federates. For example, in addition to the above connection, suppose we also have a connection going in the opposite direction:

```
	print.out -> count.in after 100 msec;
```
Now we potentially have a very big problem. The physical clock at `print` has to lag behind physical time by at least *E* + *L* - 200 msec, and the physical clock at `count` has to lag behind physical time by at least *E* + *L* - 100 msec. The latter of these means that `count` cannot send a message with timestamp *t* until its local clock exceeds *t* + *E* + *L* - 100 msec. If *E* + *L* - 100 msec > 0, then this additional lag increases the required lag at `print`, which will need to lag behind physical time now by *E* + *L* - 100 msec + *E* + *L* - 200 msec. If this number is positive, then the lag required at `count` will have to be again increased, which will then cause this number to again increase, and so on until the required lag is infinite at both federates.  Thus, a cycle between two federates is **infeasible** if 2*E* + 2*L* - *a*<sub>1</sub> - *a*<sub>2</sub> > 0, where  *a*<sub>1</sub> and *a*<sub>2</sub> are the **after** values of the two connections.  More generally, the sum of *E* + *L* - *a*<sub>i</sub> over all connections *i* in a cycle must be less than or equal to zero. Otherwise, decentralized coordination will fail and finite STP will lead to tardy messages.  Centralized coordination can be used instead if the program really must be this way.

The bottom line is that if there are cycles in your federation and/or you have physical actions in federates that receive network messages, it is wise to specify **after** to be larger than the sum of the greatest expect clock synchronization error *E* and the greatest expected network latency *L*.

## Physical Connections

Coordinating the execution of the federates so that timestamps are preserved is tricky. If your application does not require the deterministic execution that results from preserving the timestamps, then you can alternatively specify a **physical connection** as follows (see [example/C/Federated/HelloWorld/HelloWorldPhysical.lf](https://github.com/lf-lang/lingua-franca/blob/master/example/C/Federated/HelloWorld/HelloWorldPhysical.lf):

```
source.out ~> print.in;
```

The tilde specifies that the timestamp of the sender should be discarded. A new timestamp will be assigned at the receiving end based on the local physical clock, much like a **physical action**. To distinguish it from a physical connection, the normal connection is called a **logical connection**.

There are a number of subtleties with physical connections. One is that if you specify an `after` clause, for example like this:
```
count.out ~> print.in after 10 msec;
```
then what does this mean?  At the receiving end, the timestamp assigned to the incoming event will be the current physical time plus 10 msec.

## Prerequisites for Distributed Execution

In the above example, all of the generated programs expect to run on localhost. This is the default. With these defaults, every federate has to run on the same machine as the RTI because localhost is not a host that is visible from other machines on the network. In order to run federates or the RTI on remote machines, you can specify a domain name or IP address for the RTI and/or federates.

In order for a federated execution to work, there is some setup required on the machines to be used.  First, each machine must be running on `ssh` server.  On a Linux machine, this is typically done with a command like this:
```
    sudo systemctl <start|enable> ssh.service
```
Enable means to always start the service at startup, whereas start means to just start it this once. On MacOS, open System Preferences from the Apple menu and click on the "Sharing" preference panel. Select the checkbox  next to "Remote Login" to enable it. **FIXME**: Windows?

It will also be much more convenient if the launcher does not have to enter passwords to gain access to the remote machine.  This can be accomplished by installing your public key (typically found in `~/.ssh/id_rsa.pub`) in `~/.ssh/authorized_keys` on the remote host. 

Second, the RTI must be installed on the remote machine. Instructions about installation of RTI can be found [here](https://github.com/lf-lang/lingua-franca/blob/master/org.lflang/src/lib/core/federated/RTI/README.md).

## Specifying RTI Hosts

You can specify a domain name on which the RTI should run as follows:
```
federated reactor DistributedCount at www.example.com {
    ...
}
```
You can alternatively specify an IP address (either IPv4 or IPv6):
```
federated reactor DistributedCount at 10.0.0.198 { ... }
```
By default, the RTI starts a socket server on port 15045, if that port is available, and increments the port number by 1 until it finds an available port. The number of increments is limited by a target-specific number. In the C target, in rti.h, STARTING_PORT defines the number 15045 and PORT_RANGE_LIMIT limits the range of ports attempted (currently 1024).

You can also specify a port for the RTI to use as follows:

```
federated reactor DistributedCount at 10.0.0.198:8080 { ... }
```

If you specify a specific port, then it will use that port if it is available and fail otherwise. The above changes this to port 8080.

You can also specify a user name on the remote machine for cases where the username will not match whoever launches the federation:
```
federated reactor DistributedCount at user@10.0.0.198:8080 { ... }
```
The general form of the host designation is
```
federated reactor DistributedCount at user@host:port/path { ... }
```
where `user@`, `:port`, and `/path` are all optional. The `path` specifies the directory on the remote machine (relative to the home directory of the user) where the generated code will be put. The `host` should be an IPv4 address (e.g. `93.184.216.34`), IPv6 address (e.g. `2606:2800:220:1:248:1893:25c8:1946`), or a domain name (e.g. `www.example.com`). It can also be `localhost` or `0.0.0.0`. The host can be remote as long as it is accessible from the machine where the programs will be started. 

If `user@` is not given, then it is assumed that the username on the remote host is the same as on the machine that launches the programs.  If `:port` is not given, then it defaults to port 15045. If `/path` is not given, then `~user/LinguaFrancaRemote` will be the root directory on the remote machine.

**FIXME**: Not implemented yet: If the IP address or hostname does not match the local machine on which code generation is being done, ...

A `Federation_distribute.sh` shell script will be generated. This script will distribute the generated code for the RTI to the remote machine at the specified directory.

## Specifying Federate Hosts

A federate may be mapped to a particular remote machine using a syntax like this:

```
    count = new Count() at user@host:port/path;
```

The `port` is ignored in **centralized** mode because all communication is routed through the RTI, but in **decentralized** mode it will specify the port on which a socket server listens for incomming connections from other federates.

If any federate (or the RTI) has such a remote designator, then a `Federation_distribute.sh` shell script will be generated. This script will distribute the generated code for the RTI to the remote machine at the specified directory.

Note that if the machine uses DHCP to obtain its address, then the generated code may not work in the future since the address of the machine may change in the future.

Address 0.0.0.0: In the above example, `localhost` is used. This is the default if no address is specified. Using `localhost` specifies that the generated programs should establish connections only with processes running on the local machine. This is ideal for testing. If you use `0.0.0.0`, then you are also specifying that the local machine (the one performing the code generation) will be the host, but now the process(es) running on this local machine can establish connections with processes on remote machines. The code generator will determine the IP address of the local machine, and any other hosts that need to communicate with reactors on the local host will use the current IP address of that local host at the time of code generation.

## Clock Synchronization

Both centralized and decentralized coordination have some reliance on clock synchronization. First, the RTI determines the start time of all federates, and the actually physical start time will differ by the extent that their physical clocks differ. This is particularly problematic if clocks differ by hours or more, which is certainly possible. If the hosts on which you are running run a clock synchronization algorithm, such as [NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol) or [PTP](https://en.wikipedia.org/wiki/Precision_Time_Protocol), then you may not need to be concerned about this at all. Windows, Mac, and most versions of Linux, by default, run NTP, which synchronizes their clocks to some remote host. NTP is not particularly precise, however, so clock synchronization error can be hundreds of milliseconds or larger.  PTP protocols are much more precise, so if your hosts derive their physical clocks from a PTP implementation, then you probably don't need to do anything further. Unfortunately, as of this writing, even though almost all networking hardware provides support for PTP, few operating systems utilize it. We expect this to change when people have finally understood the value of precise clock synchronization.

If your host is not running any clock synchronization, or if it is running only NTP and your application needs tighter latencies, then Lingua Franca's own built-in clock synchronization may provide better precision, depending on your network conditions. Like NTP, it realizes a software-only protocol, which are much less precise than hardware-supported protocols such as PTP, but if your hosts are on the same local area network, then network conditions may be such that the performance of LF clock synchronization will be much better than NTP. If your network is equipped with PTP, you will want to disable the clock synchronization in Lingua Franca by specifying in your target properties the following:
```
    clock-sync: off
```

When a federation is mapped onto multiple machines, then, by default, any federate mapped to a machine that is not the one running the RTI will attempt during startup to synchronize its clock with the one on the machine running the RTI.  The determination of whether the federate is running on the same machine is determined by comparing the string that comes after the `at` clause between the federate and the RTI. If they differ at all, then they will be treated as if the federate is running on a different machine even if it is actually running on the same machine. This default behavior can be obtained by either specifying nothing in the target properties or saying:
```
    clock-sync: initial
```
This results in clock synchronization being done during startup only. To account for the possibility of your clocks drifting during execution of the program, you can alternatively specify:
```
    clock-sync: on
```
With this specification, in addition to synchronization during startup, synchronization will be redone periodically during program execution.

### Clock Synchronization Options

A number of options can be specified using the `clock-sync-options` target parameter. For example:
```
    clock-sync-options: {local-federates-on: true, test-offset: 200 msec}
```
The supported options are:
* `local-federates-on`: Should be `true` or `false`. By default, if a federate is mapped to the same host as the RTI (using the `at` keyword), then clock synchronization is turned off.  This assumes that the federate will be using the same clock as the RTI, so there is no point in performing clock synchronization. However, sometimes it is useful to force clock synchronization to be run even in this case, for example to test the performance of clock synchronization. To force clock synchronization on in this case, set this option to `true`.

* `test-offset`: The value should be a time value with units, e.g. `200 msec`. This will establish an artificial fixed offset for each federate's clock of one plus the federate ID times the time value given. For example, with the value `200 msec`, a fixed offset of 200 milliseconds will be set on the clock for federate 0, 400 msec on the clock of federate 1, etc.

* `period`: A time value (with units) that specifies how often runtime clock synchronization will be performed if it is turned on. The default is `5 msec`.

* `attenuation`: A positive integer specifying a divisor applied to the estimated clock error during runtime clock synchronization when adjusting the clock offset. The default is `10`. Making this number bigger reduces each adjustment to the clock. Making the number equal to `1` means that each round of clock synchronization fully applies its estimated clock synchronization error.

* `trials`: The number of rounds of message exchange with the RTI in each clock synchronization round. This defaults to `10`.

## Future Work

The RTI can also play the role of **auth**, an authentication and authorization server that ensures that only the generated programs can establish connections with each other and that their communication is encrypted, as explained in the [Security](#Security) section below.

Currently, the threads option is same on all federates. We need a mechanism to customize this parameter by federate.

## Security

In addition to generating a program for each host, the code generator could generate configuration files for a program called **auth** designed to run on the first host that is preconfigured to provide authentication and authorization to each of the other generated programs together with encryption keys that are used for communicating between them. The auth program should be started first since non of the other generate programs will be able to authenticate without it.

The auth program, written by Hokeun Kim, comes from https://github.com/iotauth/iotauth and provides "locally centralized, globally distributed" authentication and authorization. Papers describing this work can be found here: [[IoTDI '17](https://dl.acm.org/citation.cfm?id=3054980)], [[FiCloud '16](http://ieeexplore.ieee.org/document/7575852/)] [[IT Professional '17'](https://ieeexplore.ieee.org/document/8057722/)].

## Protobufs

Communication between hosts can only be accomplished on channels where the message types are either language primitives or [Protobufs](Protobufs). All other datatypes will be reject at code generation time.