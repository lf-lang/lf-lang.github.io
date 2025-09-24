---
slug: decentralized-coordination
title: "Consistency and Availability Challenges with Decentralized Coordination"
authors: [fra-p, eal, rcakella]
tags: [lingua franca, federation, decentralized]
---

The design of [distributed applications](/docs/writing-reactors/distributed-execution) in Lingua Franca requires care, particularly if the coordination of the federation is [decentralized](/docs/writing-reactors/distributed-execution#decentralized-coordination).

Consider the above Lingua Franca implementation of an automatic emergency braking system, one of the most critical ADAS systems which modern cars are equipped with.
The controller system reads data coming from two sensors, a lidar and a radar, and uses both to detect if objects or pedestrians cross the path of the car, thus performing sensor fusion. 
When either of the two signals the presence of a close object, the controller triggers the brake to stop the car and avoid crashing into it.

The lidar sensor has a higher sampling frequency, while the radar is slower, and this is reflected by the timer in the corresponding reactors.
Their deadline is equal to their period and is enforced using dedicated deadline checking reactors, following the guidelines of how to [work with deadlines](/blog/deadlines).
Availability is a crucial property of this application, because we want the automatic emergency braking system to brake as fast as possible when a close object is detected. Consistency is also necessary: sensor fusion happens with sensor data produced at the same logical time, so in-order data processing is critical.

The application is implemented as a federated program with decentralized coordination, which means that the advancement of logical time in each single federate is not subject to approval from any centralized entities, but it is done locally based on the input it receives from the other federates.
Consistency problems may arise when a federate receives data from two or more federates, as it is the case of the automatic emergency braking reactor.
As an example, the controller expects to receive input from both sensors at times 0ms, 100ms, 200ms, etc. Let's consider the case where the remote connection between the controller and the radar has a slightly larger delay than that between the controller and the lidar. The lidar input will arrive slightly earlier than the radar one. When the controller receives the lidar input, should it process the data immediately, or should it wait for the radar input to come? Sensor fusion requires consistency: if the controller processes the input from the lidar and then the radar data comes, the elaborated control action did not take into account both sensors even though it should have.

The desired behavior with simultaneous inputs is highly dependent on the application under analysis, and Lingua Franca lets you customize it. Each federate has a parameter called [STA (safe-to-advance)](/docs/writing-reactors/distributed-execution#safe-to-advance-sta) that controls how long the federate should wait for inputs from other federates before processing an input it has just received.
More precisely, the STA is how much time a federate waits before advancing its tag to that of the just received event, when it is not known if the other input ports will receive data at the same or an earlier tag. At the expiration of the STA, the federate assumes that those unresolved ports will not receive data at earlier tags, and advances its logical time to the tag of the received event.

The maximum consistency guarantee is given by indefinitely waiting for the radar input before processing the radar, i.e., STA = forever, but this is viable only if the following two conditions are always satisfied:
* the communication medium between the sensors and the controller is perfectly reliable; and
* none of the three federates is subject to faults.

These conditions guarantee that all expected data will be generated, sent and correctly received by the communication parties.

However, setting the STA to forever creates problems when only the lidar input is expected (50ms, 150ms, 250ms, etc): the controller cannot process that input until an input from the radar comes, because the STA will never expire. For example, if the single lidar input comes at 50ms, it has to wait until time 100ms before being processed. If that input was signaling the presence of a close object, the detection would be delayed by 50ms, which may potentially mean crashing into the object. The automatic emergency braking system must be available, otherwise it might not brake in time to avoid collisions.
The ideal STA value for maximum availability in the time instants with only the lidar input is 0, because if a single input is expected, no wait is necessary.

Summing up, consistency for sensor fusion requires STA=forever when inputs from both sensors are expected, while availability calls for STA=0 when only the lidar input is coming. The two values are at odds, and any value in between would mean sacrificing both properties at the same time.

The knowledge of the timing properties of the application under analysis enables the a priori determination of the time instants when both inputs are expected and those when only the lidar has new data available.
Lingua Franca allows to dynamically change the STA in the reaction body using the lf_set_maxwait API, that takes as input parameter the new STA value to set.
This capability of the language permits the automatic emergency braking federate to:
* start with the STA statically set to forever, because at time 0 (startup) both sensors produce data;
* set the STA to 0 after processing both inputs arrived at the same logical time, because the next data will be sent by the lidar only;
* set the STA back to forever after processing the radar input alone, because the next data will be sent by both sensors.

This dynamic solution guarantees both consistency and availability in all input cases.

Knowing the LF decentralized coordination:
- consistency = in-order processing of events even with multiple events
- availability = the system is responsive even with a single input

Oh, maybe mention that the clock of the two sensors is synced because we're resampling the data

I might also say that forever does not work when one of the sensors is delayed too much or when the medium fails for too much time, in which cases a finite STA is better (like a period or something) (this is gonna be the topic of a new blog post)

-maybe a little bit of what happens when out-of-order msg.s are received? (not sure this is really needed though)