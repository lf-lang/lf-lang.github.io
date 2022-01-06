---
title: Running Benchmarks
layout: docs
permalink: /docs/handbook/running-benchmarks
oneline: "Running Benchmarks."
preamble: >
---
# Running Benchmarks

The LF repository contains a series of benchmarks in the `benchmark` directory. There is also a flexible benchmark runner that automates the process of running benchmarks for various settings and collecting results from those benchmarks. It is located in `benchmark/runner`.
The runner is written in python and is based on [hydra](https://hydra.cc/docs/intro), a tool for dynamically creating hierarchical configurations by composition

## Prerequisites

### Install Python dependencies

The benchmark runner is written in Python and requires a working Python3 installation. It also requires a few python packages to be installed. Namely, `hydra-core`, `cogapp` and `pandas`.

It is recommended to install the dependencies and execute the benchmark runner in a virtual environment. For instance, this can be done with `virtualenv`:
``` 
virtualenv ~/virtualenvs/lfrunner -p python3
source ~/virtualenvs/lfrunner/bin/activate
```
Then the dependencies can be installed by running:
```
pip install -r benchmark/runner/requirements.txt
```

### Compile lfc

For running LF benchmarks, the commandline compiler `lfc` needs to be built. Simply run
```
bin/build-lfc
```
in the root directory of the LF repository.

Also, the environment variable `LF_PATH` needs to be set and point to the location of the LF repository. This needs to be an absolute path.
```
export LF_PATH=/path/to/lf
``` 

### Setup Savina

Currently all of our benchmarks are ported from the [Savina actor benchmark suite](https://doi.org/10.1145/2687357.2687368). In order to compare our LF implementations with actor based implementation, the Savina benchmark suite needs to be downloaded and compiled. Note that we require a modified version of the Savina suite, that adds support for specifying the number of worker threads and that includes CAF implementations of most benchmarks.

To download and build savina, run the following commands:
```
git clone https://github.com/lf-lang/savina.git
cd savina
mvn install
```
Building Savina requires a Java 8 JDK. Depending on the local setup, `JAVA_HOME` might need to be adjusted before running `mvn` in order to point to the correct JDK.
```
export JAVA_HOME=/path/to/jdk8
```

Before invoking the benchmark runner, the environment variable `SAVINA_PATH` needs to be set and point to the location of the savina repository using an absolute path.
```
export SAVINA_PATH=/path/to/savina
``` 

#### CAF

To futher build the CAF benchmarks, CAF 0.16.5 needs to be downloaded, compiled and installed first:
```
git clone --branch "0.16.5" git@github.com:actor-framework/actor-framework.git
mkdir actor-framework/build && cd actor-framework/build
cmake -DCMAKE_INSTALL_PREFIX=<preferred/install/location> ..
make install
```

Then, from within the savina directory, the CAF benchmarks can be build:
```
cmake -DCAF_ROOT_DIR=<path/to/caf/install/location> ..
make
```

The CAF benchmarks are used in these two publications:
 * ["Reducing Message Latency and CPU Utilization in the CAF Actor Framework"](https://www.researchgate.net/publication/322519252_Reducing_Message_Latency_and_CPU_Utilization_in_the_CAF_Actor_Framework)
 * ["Improving the Performance of Actors on Multi-cores with Parallel Patterns"](https://link.springer.com/article/10.1007/s10766-020-00663-1])

## Running a benchmark

A benchmark can simply be run by specifying a benchmark and a target. For instance
```
cd benchmark/runner
./run_benchmark.py benchmark=savina_micro_pingpong target=lf-c
```
runs the Ping Pong benchmark from the Savina suite using the C-target of LF. Currently, supported targets are `lf-c`, `lf-cpp`, `akka`, and `caf` where `akka` corresponds to the Akka implementation in the original Savina suite and `caf` corresponds to a implementation using the [C++ Actor Framework](https://www.actor-framework.org/) .

The benchmarks can also be configured. The `threads` and `iterations` parameters apply to every benchmark and specify the number of worker threads as well as how many times the benchmark should be run. Most benchmarks allow additional parameters. For instance, the Ping Pong benchmark sends a configurable number of pings that be set via the `benchmark.params.messages` configuration key. Running the Akka version of the Ping Pong benchmark for 1000 messages, 1 thread and 12 iterations could be done like this:
```
./run_benchmark.py benchmark=savina_micro_pingpong target=akka threads=1 iterations=12 benchmark.params.messages=1000
```

Each benchmark run produces an output directory in the scheme `outputs/<date>/<time>/` (e.g. `outputs/2020-12-17/16-46-16/`). This directory contains a files `results.csv` which contains the measured execution time for each iteration and all the parameters used for running this particular benchmark. The csv file contains precisely one row per iteration.

## Running a series of benchmarks (multirun)

The runner also allows to automatically run a single benchmark or a series of benchmarks with a range of settings. The multirun feature is simply used by the `-m` switch. For instance:
```
./run_benchmark.py -m benchmark=savina_micro_pingpong target="glob(*)" threads=1,2,4 iterations=12 benchmark.params.messages="range(1000000,10000000,1000000)"
```
runs the Ping Pong benchmark for all targets using 1, 2 and 4 threads and for a number of messages ranging from 1M to 10M (in 1M steps).

This mechanism can also be used to run multiple benchmarks. For instance,
```
./run_benchmark.py -m benchmark="glob(*)" target="glob(*)" threads=4 iterations=12
```
runs all benchmarks for all targets using 4 threads and 12 iterations.

The results for a multirun are written to a directory in the scheme `multirun/<date>/<time>/<n>` (e.g. `multirun/2020-12-17/17-11-03/0/`) where `<n>` denotes the particular run. Each of the `<n>` subdirectories contains a `results.csv` for this particular run.

## Collecting results from multirun

A second script called `collect_results.py` provides a convenient way for collecting results from a multirun and merging them into a single CSV file. Simply running
```
./collect_results.py multirun/<date>/<time>/ out.csv
```
collects all results from the particular multirun and stores the merged data structure in out.csv. `collect_results.py` not only merges the results, but it also calculates minimum, maximum and median execution time for each individual run. The resulting CSV does not contain the measured values of individual iterations anymore and only contains a single row per run. This behavior can be disabled with the `--raw` command line flag. With the flag set, the results from all runs are merged as say are and the resulting file contains rows for all individual runs, but no minimum, maximum and median values.


## How it works

The benchmark runner itself is actually relatively simple. Most of the complexity is dealt with by [hydra](https://hydra.cc/). Hydra is a complex and convienient tool for handling configurations. These configurations can be merged from different sources and be overriden via command line arguments as you have seen above. The actual benchmark runner receives the configuration represented as nested dictionaries from hydra. It then executes the benchmarks precisely as instructed by the configutation.

The configuration is split into two big parts: the benchmark configuration and the target configuration. The benchmark configuration describes a particular benchmark instance. This is described in more detail in the [next section](#adding-new-benchmarks). The target configuration specifies how to run a benchmark for a specific target (e.g. akka, lf-c, lf-cpp). This is not intended to be changed by the user and therefore isn't explained in detail here. Essentially a benchmark run is split into 5 steps as is outlined in the following. The target configuartion precisely specifies what needs to be done in each step

1. **copy** The command used to copy relevant source files to a temporary directory.
2. **gen** The command used to generate a configured LF file. This is intended to apply a code generation tool like cog to the source code in order to make benchmarks parameterized.
3. **compile** The command used to compile the benchmark.
4. **run** The command used to generate the benchmark.
5. **parser** A parser (a python method) that is used to process the output of the benchmark run and that returns the execution times of individual benchmark runs in a list.

## Adding new benchmarks

In order to add new benchmarks, a new configuration file needs to be created in the `conf/benchmark` subdirectory. Benchmarks may be grouped by the underscore-delimited segments in their file name. For instance, the PingPong benchmark is part of the micro-benchmarks of the Savina suite, and consequently its configuration file is named in `conf/benchmark/savina_micro_pingpong.yaml`. This allows to later specify `benchmark=savina/micro/pingpong` on the command line. Below you can see the contents of `savina_micro_pingpong.yaml` which we will break down in the following.

```yaml
# @package benchmark
name: "Ping Pong"
params:
  pings: 1000000

# target specific configuration
targets:
  akka:
    jar: "${savina_path}/target/savina-0.0.1-SNAPSHOT-jar-with-dependencies.jar"
    class: "edu.rice.habanero.benchmarks.pingpong.PingPongAkkaActorBenchmark"
    run_args:
      pings: ["-n", "<value>"]
  caf:
    bin: "caf_01_pingpong"
    run_args:
      pings: ["-n", "<value>"]
  lf-cpp:
    copy_sources:
      - "${lf_path}/benchmark/Cpp/Savina/src/BenchmarkRunner.lf"
      - "${lf_path}/benchmark/Cpp/Savina/src/micro"
    lf_file: "micro/PingPong.lf"
    binary: "PingPong"
    gen_args: null
    run_args:
      pings: ["--count", "<value>"]
  lf-c:
    copy_sources:
      - "${lf_path}/benchmark/C/Savina/src/micro/PingPong.lf"
    lf_file: "PingPong.lf"
    binary: "PingPong"
    gen_args:
      pings: ["-D", "count=<value>"]
```

The first line `# @package benchmark` is hydra specific. It specifies that this configuration is part of the benchmark package. Essentially this enables the configuration to be assigned to `benchmark` on the command line.

```yaml
name: "Ping Pong"
params:
  pings: 1000000
```
This part sets the benchmark name to "Ping Pong" and declares that there is one benchmark specific parameter: `pings`. This configuration also set the default value for `pings` to 1000000. Note that the `params` dictionary may specify an arbitrary number of parameters.

The remainder of the configuration file contains target specific configurations that provide instructions on how the particular benchmark can be run for the various targets. This block
```yaml
# target specific configuration
targets:
  akka:
    jar: "${savina_path}/target/savina-0.0.1-SNAPSHOT-jar-with-dependencies.jar"
    class: "edu.rice.habanero.benchmarks.pingpong.PingPongAkkaActorBenchmark"
    run_args:
      pings: ["-n", "<value>"]
```
specifies how the benchmark is executed using Akka. The `jar` and `class` configuration keys simply instruct the benchmark runner which class in which jar to run. Note that hydra automatically resolves `${savina_path}` to the value you set in the `SAVINA_PATH` environment variable.

The `run_args` configuration key allows specification of further arguments that are added to the command to be executed when running the benchmark. It expects a dictionary, where the keys are names of parameters as specified above in the `params` configuration key, and the values are a list of arguments to be added to the executed command. In the case of the `pings` parameter, the Akka implementation of the benchmark expects the `-n` flag followed by the parameter value. Note that the special string `<value>` is automatically resolved by the runner to the actual parameter value when executing the command.

Instructions for the C++ target are specified as follows.
```yaml
  lf-cpp:
    copy_sources:
      - "${lf_path}/benchmark/Cpp/Savina/src/BenchmarkRunner.lf"
      - "${lf_path}/benchmark/Cpp/Savina/src/micro"
    lf_file: "micro/PingPong.lf"
    binary: "PingPong"
    gen_args: null
    run_args:
      pings: ["--count", "<value>"]
```
For C and C++ programs, we cannot run a precompiled program as it is the case for Akka, but we need to compile the benchmark first. The benchmark handler automatically performs the build in a temporary directory, so that it doesn't interfere with the source tree. First, it copies all files listed under `copy_sources` to the temporary directory. If the specified source  path is a directory, the whole directory is copied recursively. The `lf_file` configuration file specifies the file to be compiled with `lfc`. `binary` indicates the name of the binary file resulting from the compilation process. 

For some benchmarks, not all parameters can be applied at runtime. In such cases, the `gen_args` configuration key can be used to provide additional arguments that should be passed to cog. cog then applies the parameters to the source file (assuming that the source LF file uses cog directives to generate code according to the configuration). Similiarly `run_args` specifies any additional arguments that should be passed to the binary when running the benchmark. In the case of the C++ configuration for the Ping Pong benchmark, the number of pings is a runtime parameter and specified with `--count`. Since this particular benchmark does not have any paremeter that need to be set during generation, `gen_args` is set to `null`.

Finally, we have the C part of the target configuration.
```yaml
  lf-c:
    copy_sources:
      - "${lf_path}/benchmark/C/Savina/src/micro/PingPong.lf"
    lf_file: "PingPong.lf"
    binary: "PingPong"
    gen_args:
      pings: ["-D", "count=<value>"]
```
This is very similar to the C++ configuration. However, the C target of LF currently does not support overriding of parameter values at runtime. Therefore, all parameters need to be provided as arguments to the code generator and the benchmark needs to provide corresponding cog directives.

New benchmarks can be simply added by replicating this example and adjusting the precise configuration values and parameters to the specific benchmark.