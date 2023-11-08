---
title: "Containerized Execution"
layout: docs
permalink: /docs/handbook/containerized-execution
oneline: "Containerized Execution using Docker"
preamble: >
---

For the `C` target at least, the Lingua Franca code generator is able to generate a Dockerfile when it generates the C source files. To enable this, include the `docker` property in your target specification, as follows:

```lf-c
target C {
    docker: true
};
```

The generated Docker file has the same name as the LF file except that the extension is `.Dockerfile` and will be put in the `src-gen` directory. You can also specify options. Currently, only the base image (`FROM`) can be customized, but this will be extended to allow further customization is the future. To customize the Docker file, instead of just `true` above, which gives default options, specify the options as in the following example:

```lf-c
target C {
    docker: {FROM: "alpine:latest"}
};
```

This specifies that the base image is the latest version of `alpine`, a very small Linux. In fact, `alpine:latest` is the default value for this option, so you only need to specify this option if you need something other than `alpine:latest`.

How to use this depends on whether your application is federated. You will need to [install Docker](https://docs.docker.com/get-docker/) if you haven't already in order to use this.

## Unfederated Execution
Suppose your LF source file is `src/Foo.lf`. When you run `lfc` or use the IDE to generate code, a file called `Dockerfile` and a file called `docker-compose.yml` will appear in the `src_gen/Foo` directory, see [Structure of an LF project](/docs/handbook/a-first-reactor#structure-of-an-lf-project) for more info.

### Using docker compose up
After running `lfc`, change to the directory that contains the generated sources. Then, use `docker compose up --build` to automatically build the Docker image and run the container. Once the container finishes execution, use `docker compose down` in the same directory where `docker-compose.yml` is located to remove the container.

### Using docker build and docker run
You can also build the image and run the container in separate steps. Again, make sure that you have changed directory to the location of the `Dockerfile`. Then issue the command:

```sh
   docker build -t foo .
```

This will create a Docker image with tag `foo`. The tag is required to be all lower-case letters. By convention, we advise using the LF source file name, converted to lower case.

You can then use this tag to run the image in a container:

```sh
   docker run -t --rm foo
```

The `-t` option creates a pseudo terminal, which is necessary for you to see any output produced by your program to `stdout`. If your program also reads from `stdin`, then you will need to give the `-i` option as well, or combine the two as `it`.

The `--rm` option is important. This removes the container upon completion of the run. If you omit this option, the container will continue to exist even after your program has terminated. You can alternatively remove the container after the run using `docker rm`.

If you wish for your program to run in the background, give a `-d` option as well (for "detached"). In this case, you will not see any output from your run.

The above run command can include any supported command-line arguments to the LF program. For example, to specify a logical timeout, you can do this:

```sh
    docker run -t --rm foo --timeout 20 sec
```

## Federated Execution
Suppose your LF source file is `src/Fed.lf`. When you run `lfc` or use the IDE to generate code, a file called `Dockerfile` is created for each federate alongside its sources. Just like in the unfederated case, a single `docker-compose.yml` will appear in the `src_gen/Fed` directory, see [Structure of an LF project](/docs/handbook/a-first-reactor#structure-of-an-lf-project) for more info.

### Using docker compose up
Change directory to where the `docker-compose.yml` is located, and simply run:
```sh
    docker compose up --build 
```
This will build images for all the federates (and the RTI, which is pulled from [Docker Hub](https://hub.docker.com/r/lflang/rti)), and run them on jointly on a shared network.

### Using docker build and docker run
You can also build the images and run the containers in separate steps, for each container individually. 

To build a particular federate that we assume is called `foo`, change directory to `src-gen/Fed/federate__foo` (there should be a `Dockerfile` in this directory). Then issue the command:

```sh
   docker build -t foo .
```

Assuming there is one more federate in the program that is called `bar`, change directory to `src-gen/Fed/federate__bar` and run:

```sh
   docker build -t bar .
```

To pull the RTI from DockerHub, run this command:
```sh
   docker pull lflang/rti:rti
```
Now, create a named network on which to run your federation. For example, to create a network named `lf`, do this:

```sh
    docker network create lf
```

You can then launch the RTI on this network (do this in a separate terminal):

```sh
     docker run -t --rm --name rti --network lf lflang/rti:rti -n 2 -i 1234
```

Here, the `-n 2` indicates that the total number of federates is two and `-i 1234` assigns an identifier for the federation.

The federates `foo` and `bar`, the images of which have already been built, can be started using the following commands:
```sh
docker run -t --rm --network lf foo
docker run -t --rm --network lf bar
```
