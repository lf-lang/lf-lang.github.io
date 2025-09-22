---
slug: decentralized-coordination
title: "Timing Challenges with Decentralized Coordination"
authors: [fra-p, eal, rcakella]
tags: [lingua franca, federation, decentralized]
---

[Distributed applications](/docs/writing-reactors/distributed-execution) may create trouble to meet timing constraints expressed as [deadlines](/docs/writing-reactors/deadlines), especially if the coordination of the federation is [decentralized](/docs/writing-reactors/distributed-execution#decentralized-coordination).


Consider the above Lingua Franca implementation of an automatic emergency braking system, one of the most critical ADAS systems which modern cars are equipped with.
The controller system reads data coming from two sensors, a lidar and a radar, and uses both to detect if objects or pedestrian cross the path of the car, thus performing sensor fusion. 
When either of the two signals the presence of a close object, the controller triggers the brake to stop the car and avoid crashing into it.

The lidar sensor has a higher sampling frequency, while the radar is slower.
Their deadline is equal to their period and is enforced using dedicated deadline checking reactors, following the guidelines to [work with deadlines](/blog/deadlines).
Meeting deadlines is crucial in this application, as we want to make sure that each single sensor data is processed by the automatic emergency braking system before new inputs from the same sensor arrive.

The application is implemented as a federated program with decentralized coordination, which means that the advancement of logical time in each single federate is not subject to approval from any centralized entities, but it is done locally based on the input it receives from the other federates.
Consistency problems may arise when a federate receives data from two or more federates, as it is the case of the automatic emergency braking reactor.
As an example, the controller expects to receive input from both sensors at times 0ms, 100ms, 200ms, etc. Let's consider the case where the remote connection between the controller and the radar has a slightly larger delay than that between the controller and the lidar. Hence, the lidar input will arrive slightly earlier than the radar one. When the controller receives the lidar input, what should it do? Should it process the data immediately, or should it wait for the radar input to come?

The desired behavior with simultaneous inputs is highly dependent on the application under analysis, and Lingua Franca lets you customize it. Each federate has a parameter called [STA (safe-to-advance)](http://localhost:3000/docs/writing-reactors/distributed-execution#safe-to-advance-sta) that controls how long the federate should wait for inputs from other federates before processing an input it has just received.

The maximum possible consistency guarantee is given by indefinitely waiting for the radar input before processing the radar, but this is viable only if the following three conditions are always satisfied: (i) the communication medium between the sensors and the controller is perfectly reliable; (ii) none of the three federates is subject to faults; and (iii) the network latency is never greater that 50ms, that is, the smallest period of the two sensors.
(i) and (ii) guarantee that all expected data will be generated, sent and correctly received by the communication parties. (iii) is necessary to meet sensor deadlines: if the controller receives input from the lidar and indefinitely waits for the radar, it the latter does not arrive within 50ms, the lidar data cannot be processed and its deadline is violated.

lidar data only case

-example description
-a little bit on decentralized coordination/maxwait
-deadline issues
-maxwait challenges
-dynamic maxwait for both consistency and availability (=timing)
-maybe highlight that deadlines here are not only affected by the workload on the single processor, but also on the distributed communication
-maybe a little bit of what happens when out-of-order msg.s are received?