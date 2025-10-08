---
slug: decentralized-consistency
title: "Decentralized Consistency"
authors: [fra-p, eal, rcakella]
tags: [lingua franca, federation, decentralized, consistency, STA]
---

The design of [distributed applications](/docs/writing-reactors/distributed-execution) in Lingua Franca requires care, particularly if the coordination of the federation is [decentralized](/docs/writing-reactors/distributed-execution#decentralized-coordination). The intent of this post is to illustrate and handle the challenges arising from designing distributed applications in Lingua Franca, with the help of two realistic use cases.

## Indefinite wait for inputs: the aircraft door use case
Aircraft doors on passenger flights are currently managed manually by flight attendants.
Before the take-off, the flight attendants _arm_ the door: if the door is opened in this state, an evacuation slide is automatically inflated and deployed for emergency landing.
When the aircraft lands in normal and safe conditions, before opening the door, the flight attendants _disarm_ it to avoid the deployment of the evacuation slide.
Flight attendants, however, are allowed to disarm the door _only_ when they see from the porthole the ramp that will allow the passengers to disembark the aircraft.

![AircraftDoor diagram](../static/img/blog/AircraftDoor.svg)

Consider the above Lingua Franca program that implements a simplified system to remotely open the aircraft door that is in the _armed_ state.
The door implements two independent remote services, door _disarming_ and door _opening_, encoded by two different reactions in the `Door` reactor.
We imagine that the pilot interacting with the cockpit issues the command to open the door that triggers the door opening service.
We would also like to automate the disarming of the door using a camera. When the camera determines that the ramp is attached to the aircraft, it triggers the disarming service of the door.
There are different ways to design and refactor the above system, for example, by removing the direct connection between the `Cockpit` and `Door` reactors. Our design choice is meant to highlight that door _disarming_ and _opening_ are two different and independent remote services triggered by two different commands issued by two different system actors. Therefore, each actor has an independent connection to the door to request its service.

The purpose of the system is to open the door in reaction to the command from the cockpit only in normal conditions, that is, when the ramp is present and the door is not armed. The door, upon receiving the command from the cockpit, should wait for clearance from the camera before opening.

This is an example of an application that cannot safely proceed its processing without assurance on its inputs. In fact, if the door processes immediately the command from the cockpit, and the door is still _armed_ because the input from the camera has not come yet, the evacuation slide will be deployed as if it was an emergency landing. The door, then, has to wait for both inputs before invoking the _opening_ service.

### In-order message processing
The order in which messages are processed is crucial in this application. When the _disarm_ and _open_ commands arrive together, the _disarm_ service needs to be invoked before opening the door, otherwise the escape slide will be deployed and that is not the desired behavior.
Lingua Franca guarantees determinism in the execution order of reactions with simultaneous inputs, and the order is given by the the order of declaration of the reactions inside the reactor. It is then sufficient to declare the `disarm` reaction _before_ the `open` one. The diagram confirms the execution order by labeling the `disarm` reaction with 1 and the `open` reaction with 2.

The more challenging situation is when the inputs do not arrive together, and this is discussed in the following section.

### Consistency with decentralized coordination
The application is implemented as a federated program with decentralized coordination, which means that the advancement of logical time in each single federate is not subject to approval from any centralized entities, but it is done locally based on the input it receives from the other federates.

Let us consider the case when the `Door` reactor receives the _open_ command from the `Cockpit` reactor, but not yet the _disarm_ command from the `Camera` reactor. As previously observed, the `Door` cannot proceed to open the door, because it needs to wait for the `Camera` to send the _disarm_ command.
But how long should it wait?

Lingua Franca allows you to customize the waiting time. Each federate has a parameter called [`maxwait`](/docs/writing-reactors/distributed-execution#safe-to-advance-sta) that controls how long the federate should wait for inputs from other federates before processing an input it has just received.
More precisely, the `maxwait` is how much time a federate waits before advancing its tag to that of the just received event, when it is not known if the other input ports will receive data with the same or an earlier tag. At the expiration of the `maxwait`, the federate assumes that those unresolved ports will not receive any data with earlier tags, and advances its logical time to the tag of the received event.

In our example, we want the door to _indefinitely wait_ for both _disarm_ and _open_ commands to arrive before processing any of them. In Lingua Franca, this is obtained by setting `maxwait = forever`, and it means that the `Door` reactor cannot safely proceed without assurance about the inputs.

The implementation of the `Door` reactor and its instantiation are shown below:

```lf-c
reactor Door {
  input open: bool
  input disarm: bool
  state isDisarmed: bool = false
  state isOpen: bool = false

  reaction(disarm) {=
    if (!self->isDisarmed) {
      self->isDisarmed = true;
      printf("Door disarmed\n");
    }
  =} maxwait {=
    printf("STP violation\n");
  =}

  reaction(open) {=
    if (self->isDisarmed) {
      printf("Door open - normal mode\n");
    } else {
      // This should never happen
      printf("Door open - !emergency mode!\n");
    }
  =} maxwait {=
    printf("STP violation\n");
  =}
}

federated reactor {
  c = new Cockpit()
  v = new Camera()
  
  @maxwait(forever)
  d = new Door()

  c.open -> d.open
  c.open -> v.check_ramp
  v.ramp_present -> d.disarm
}
```
The reaction triggered by the `open` command prints on the standard output whether the door was _disarmed_ or not at the time of opening. We do not expect emergency openings with `maxwait` set to `forever`.

The `maxwait` parameter is specified at instantiation time within the main reactor. Right before creating the instance of the `Door` reactor for which we want to set the parameter, we use the `@maxwait` annotation that takes as input the new `maxwait` value. The reactions of the `Door` reactor that are triggered by remote inputs are associated with a [fault handler](/docs/writing-reactors/distributed-execution#safe-to-process-stp-violation-handling) that is invoked in the case of timing inconsistencies during input processing. This event will be thoroughly discussed in another blog post.

## Multirate inputs: the automatic emergency braking use case
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
Availability is a crucial property of this application, because we want the automatic emergency braking system to brake as fast as possible when a close object is detected. Consistency is also necessary, as sensor fusion happens with sensor data produced at the same logical time. Even if this is not implemented in our simplified example, sensor fusion in a more general scenario helps rule out false positives, i.e., cases in which one of the sensors erroneously detects a close object that would induce an unnecessary and dangerous braking. False positives are caused by the weaknesses of the specific sensor. For example, rainy or foggy weather reduce the accuracy of lidar sensors. The key concept is to gather data produced at the same logical time by all sensors and combine them to have a more accurate estimate of possible collisions. Consistency and in-order data processing are then required.

#### Consistency challenge
The application is once agin implemented as a federated program with decentralized coordination.
Consistency problems may arise when a federate receives data from two or more federates, as it is the case of the `AutomaticEmergencyBraking` reactor.
The controller expects to receive input from both sensors at times 0ms, 100ms, 200ms, etc. Let's consider as an example the case where the remote connection between the controller and the radar has a slightly larger delay than that between the controller and the lidar. The lidar input will then always arrive slightly earlier than the radar one. When the controller receives the lidar input, should it process the data immediately, or should it wait for the radar input to come? Sensor fusion requires consistency: if the controller processes the input from the lidar and then the radar data comes, the control action elaborated upon the arrival of the lidar data does not take into account both sensors, even though it should. Hence, in our use case, the `AutomaticEmergencyBraking` reactor needs to wait for both inputs before processing new data.

In our application, we aim to process all incoming data with the same logical time to realize sensor fusion. Hence, we set `maxwait = forever` to _indefinitely wait_ for the radar input before processing the radar.

#### Availability challenge
However, setting `maxwait` to `forever` creates problems when only the lidar input is expected (50ms, 150ms, 250ms, etc): the controller cannot process that input until an input from the radar comes, because `maxwait` will never expire. For example, if the single lidar input comes at time 50ms, it has to wait until time 100ms before being processed. If that input was signaling the presence of a close object, the detection would be delayed by 50ms, which may potentially mean crashing into the object. The automatic emergency braking system must be available, otherwise it might not brake in time to avoid collisions.
The ideal `maxwait` value for maximum availability in the time instants with only the lidar input is 0, because if a single input is expected, no wait is necessary.

Summing up, consistency for sensor fusion requires `maxwait = forever` when inputs from both sensors are expected, while availability calls for `maxwait = 0` when only the lidar input is coming. The two values are at odds, and any value in between would mean sacrificing both properties at the same time.

### Dynamic adjustment of `maxwait`
The knowledge of the timing properties of the application under analysis enables the _a priori_ determination of the time instants when both inputs are expected and those when only the lidar has new data available.
Lingua Franca allows to dynamically change the `maxwait` in the reaction body using the `lf_set_maxwait` API, that takes as input parameter the new `maxwait` value to set.
This capability of the language permits the automatic emergency braking federate to:
* start with `maxwait` statically set to `forever`, because at time 0 (startup) both sensors produce data;
* set `maxwait` to 0 after processing both inputs with the same logical time, because the next data will be sent by the lidar only;
* set `maxwait` back to `forever` after processing the radar input alone, because the next data will be sent by both sensors.

This dynamic solution guarantees both consistency and availability in all input cases.
The implementation and the instantiation of the `AutomaticEmergencyBraking` reactor are shown below:

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
      lf_set_maxwait(0);
    } else {
      lf_set_maxwait(FOREVER);
    }
  =} deadline(100ms) {=
    printf("AEB deadline violated\n");
  =} maxwait {=
    printf("STP violation on AEB\n");
  =}

  federated reactor {
    lidar = new Lidar()
    radar = new Radar()
    
    @maxwait(forever)
    aeb = new AutomaticEmergencyBraking()
    
    brake = new BrakingSystem()

    lidar.lidar_data -> aeb.lidar_in
    radar.radar_data -> aeb.radar_in
    aeb.brake -> brake.signal
  }
}
```

The `dist_thld` parameter is the distance threshold from detected objects below which the `AutomaticEmergencyBraking` reactor activates the brakes.
The reaction body reads the distance reported by both the lidar and the radar, and if any of these is less than the threshold, it sends a signal to the `BrakingSystem` reactor.
The `n_invocs` integer state variable counts the number of times the reaction of the `AutomaticEmergencyBraking` reactor is invoked. This variable is used to determine how many inputs the reaction will see at the next invocation and set the `maxwait` accordingly. Even invocation numbers mean that the next reaction invocation will happen with both sensor inputs present, so `maxwait` is set to `forever`; with odd invocation numbers, the next reaction invocation will see new data from the lidar only, and `maxwait` is then set to 0.