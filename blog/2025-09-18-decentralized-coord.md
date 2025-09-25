---
slug: decentralized-coordination
title: "Consistency and Availability Challenges with Decentralized Coordination"
authors: [fra-p, eal, rcakella]
tags: [lingua franca, federation, decentralized, STA]
---

The design of [distributed applications](/docs/writing-reactors/distributed-execution) in Lingua Franca requires care, particularly if the coordination of the federation is [decentralized](/docs/writing-reactors/distributed-execution#decentralized-coordination). The intent of this post is to illustrate and handle the challenges arising from designing distributed applications in Lingua Franca, focusing on a realistic automotive use case.

## Automatic emergency braking use case
![AutomaticEmergencyBrakingSystem diagram](../static/img/blog/AutomaticEmergencyBrakingSystem.svg)

Consider the above Lingua Franca implementation of an automatic emergency braking system, one of the most critical ADAS systems which modern cars are equipped with.
The controller system modeled by the `AutomaticEmergencyBraking` reactor reads data coming from two sensors, a lidar and a radar, and uses both to detect if objects or pedestrians cross the trajectory the car, thus performing _sensor fusion_. 
When one of the two sensors signals the presence of an object at a distance shorter than a configurable threshold, the controller triggers the brake to stop the car and avoid crashing into it.

The sensors are modeled with their own timer that triggers the generation of data. The clocks of all federates are automatically synchronized by the [clock synchronization algorithm](/docs/writing-reactors/distributed-execution#clock-synchronization) of the Lingua Franca runtime.
Typically, in a real use case of this kind, the clock of sensor devices cannot be controlled by Lingua Franca, but a way to work around this limitation is to resample the data collected by sensors with the timing given by a clock that the runtime can control.
The sensor reactors of our application are then modeling this resampling of sensor data that fits well with the Lingua Franca semantics for time determinism.

The lidar sensor has a sampling frequency that is twice that of the radar, and this is reflected by the timer in the corresponding reactors: the lidar timer has a period of 50ms, while that of the radar 100ms.
Their deadline is equal to their period and is enforced using the dedicated `DeadlineCheck` reactors, following the guidelines of how to [work with deadlines](/blog/deadlines).

The sensor behavior in the application is simulated in a way that each sensor constantly produces distance values above the threshold (i.e., no objects in the way), and then at a random time it sends a distance value below the threshold, indicating the presence of a close object. When the `AutomaticEmergencyBraking` reactor receives that message, it signals the `BrakingSystem` reactor to brake the car, and the whole system shuts down.

### Desired system properties
Availability is a crucial property of this application, because we want the automatic emergency braking system to brake as fast as possible when a close object is detected. Consistency is also necessary: sensor fusion happens with sensor data produced at the same logical time, so in-order data processing is critical.

### Challenges of decentralized coordination
The application is implemented as a federated program with decentralized coordination, which means that the advancement of logical time in each single federate is not subject to approval from any centralized entities, but it is done locally based on the input it receives from the other federates.

#### Consistency challenge
Consistency problems may arise when a federate receives data from two or more federates, as it is the case of the `AutomaticEmergencyBraking` reactor.
The controller expects to receive input from both sensors at times 0ms, 100ms, 200ms, etc. Let's consider as an example the case where the remote connection between the controller and the radar has a slightly larger delay than that between the controller and the lidar. The lidar input will then always arrive slightly earlier than the radar one. When the controller receives the lidar input, should it process the data immediately, or should it wait for the radar input to come? Sensor fusion requires consistency: if the controller processes the input from the lidar and then the radar data comes, the control action elaborated upon the arrival of the lidar data does not take into account both sensors, even though it should. Hence, in our use case, the `AutomaticEmergencyBraking` reactor needs to wait for both inputs before processing new data.

In general, the desired behavior with simultaneous inputs and decentralized coordination is highly dependent on the application under analysis, and Lingua Franca lets you customize it. Each federate has a parameter called [`STA` (safe-to-advance)](/docs/writing-reactors/distributed-execution#safe-to-advance-sta) that controls how long the federate should wait for inputs from other federates before processing an input it has just received.
More precisely, the `STA` is how much time a federate waits before advancing its tag to that of the just received event, when it is not known if the other input ports will receive data at the same or an earlier tag. At the expiration of the `STA`, the federate assumes that those unresolved ports will not receive any data at earlier tags, and advances its logical time to the tag of the received event.

When a reactor commits to a tag after the `STA` expires, it may happen that one of the unresolved ports receives new data at an earlier logical time.
Since the current tag is greater than the just received one, this event cannot be processed, as it would result in out-of-order handling of messages, thus violating the Lingua Franca semantics.
In such cases, a safe-to-process (`STP`) violation occurs, the received event is dropped and a [fault handler](/docs/writing-reactors/distributed-execution#safe-to-process-stp-violation-handling) is executed instead: consistency is then preserved.

In our application, we aim to avoid `STP` violations and process all incoming data for sensor fusion. The maximum consistency guarantee is given by _indefinitely waiting_ for the radar input before processing the radar, i.e., `STA = forever`, but this is viable only if the following two conditions are always satisfied:
* the communication medium between the sensors and the controller is perfectly reliable; and
* none of the three federates is subject to faults.

These conditions guarantee that all expected data will be generated, sent and correctly received by the communication parties. If any of the two does not hold, the application may potentially experience indefinite blocking.

#### Availability challenge
However, setting the `STA` to `forever` creates problems when only the lidar input is expected (50ms, 150ms, 250ms, etc): the controller cannot process that input until an input from the radar comes, because the `STA` will never expire. For example, if the single lidar input comes at time 50ms, it has to wait until time 100ms before being processed. If that input was signaling the presence of a close object, the detection would be delayed by 50ms, which may potentially mean crashing into the object. The automatic emergency braking system must be available, otherwise it might not brake in time to avoid collisions.
The ideal `STA` value for maximum availability in the time instants with only the lidar input is 0, because if a single input is expected, no wait is necessary.

Summing up, consistency for sensor fusion requires `STA = forever` when inputs from both sensors are expected, while availability calls for `STA = 0` when only the lidar input is coming. The two values are at odds, and any value in between would mean sacrificing both properties at the same time.

### Dynamic adjustment of STA
The knowledge of the timing properties of the application under analysis enables the _a priori_ determination of the time instants when both inputs are expected and those when only the lidar has new data available.
Lingua Franca allows to dynamically change the `STA` in the reaction body using the `lf_set_sta` API, that takes as input parameter the new `STA` value to set.
This capability of the language permits the automatic emergency braking federate to:
* start with the `STA` statically set to `forever`, because at time 0 (startup) both sensors produce data;
* set the `STA` to 0 after processing both inputs arrived at the same logical time, because the next data will be sent by the lidar only;
* set the `STA` back to `forever` after processing the radar input alone, because the next data will be sent by both sensors.

This dynamic solution guarantees both consistency and availability in all input cases.
The implementation of the `AutomaticEmergencyBraking` reactor is shown below:

```lf-c
reactor AutomaticEmergencyBraking(dist_thld: float = 20.0) {
  input lidar_in: float
  input radar_in: float
  output brake: int
  state n_invocs: int = 0

  reaction (lidar_in, radar_in) -> brake {=
    if (lf_is_present(lidar_in) && lidar_in->value < self->dist_thld) {
      printf("Lidar has detected close object -> signaling braking\n");
      lf_set(brake, 1);
      lf_request_stop();
    } else if (lf_is_present(radar_in) && radar_in->value < self->dist_thld) {
      printf("Radar has detected close object -> signaling braking\n");
      lf_set(brake, 1);
      lf_request_stop();
    }

    self->n_invocs++;
    if (self->n_invocs % 2) {
      lf_set_sta(0);
    } else {
      lf_set_sta(FOREVER);
    }
  =} deadline(100ms) {=
    printf("AEB deadline violated\n");
  =} STA(forever) {=
    printf("STP violation on AEB\n");
  =}
}
```

The `dist_thld` parameter is the distance threshold from detected objects below which the `AutomaticEmergencyBraking` reactor activates the brakes.
The reaction body reads the distance reported by both the lidar and the radar, and if any of these is less than the threshold, it sends a signal to the `BrakingSystem` reactor.
The `n_invocs` integer state variable counts the number of times the reaction of the `AutomaticEmergencyBraking` reactor is invoked. This variable is used to determine how many inputs the reaction will see at the next invocation and set the `STA` accordingly. Even invocation numbers mean that the next reaction invocation will happen with both sensor inputs present, so the `STA` is set to `forever`; with odd invocation numbers, the next reaction invocation will see new data from the lidar only, and the `STA` is then set to 0.