---
title: "Writing Reactors in Rust (WIP)"
layout: docs
permalink: /docs/handbook/write-reactor-rust
oneline: "Writing Reactors in Rust  (preliminary)"
preamble: >
---

> :warning: **Important:** The Rust target is not functional yet. This is early WIP documentation to let you try it out if you're curious

In the Rust reactor target for Lingua Franca, reactions are written in Rust and the code generator generates a standalone Rust program that can be compiled and run on platforms supported by rustc. The program depends on a runtime library distributed as the crate [reactor_rt](https://github.com/lf-lang/reactor-rust), and depends on the Rust standard library.

Documentation for the runtime API is available here: https://lf-lang.github.io/reactor-rust/

<!-- Note that C++ is not a safe language. There are many ways that a programmer can circumvent the semantics of Lingua Franca and introduce nondeterminism and illegal memory accesses. For example, it is easy for a programmer to mistakenly send a message that is a pointer to data on the stack. The destination reactors will very likely read invalid data. It is also easy to create memory leaks, where memory is allocated and never freed. Note, however, that the C++ reactor library is designed to prevent common errors and to encourage a safe modern C++ style. Here, we introduce the specifics of writing Reactor programs in C++ and present some guidelines for a style that will be safe. -->

## Setup

In order to compile the generated Rust source code, you need a recent version of [Cargo](https://doc.rust-lang.org/cargo/), the Rust package manager. See [How to Install Rust and Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) if you don't have them on your system.

You can use a development version of the runtime library by setting the LFC option `--external-runtime-path` to the root directory of the runtime library crate sources. If this variable is mentioned, LFC will ask Cargo to fetch the runtime library from there.

## A Minimal Example

A "hello world" reactor for the Rust target looks like this:

```rust
target Rust;

main reactor Minimal {
    reaction(startup) {=
        println!("Hello, reactors!");
    =}
}
```

The `startup` action is a special [action](https://github.com/lf-lang/lingua-franca/wiki/Language-Specification#Action-Declaration) that triggers at the start of the program execution causing the [reaction](https://github.com/lf-lang/lingua-franca/wiki/Language-Specification#Reaction-Declaration) to execute. This program can be found in a file called [Minimal.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Rust/src/Minimal.lf) in the [test directory](https://github.com/lf-lang/lingua-franca/tree/master/test/Rust), where you can also find quite a few more interesting examples. If you compile this using the [`lfc` command-line compiler](downloading-and-building#Command-Line-Tools) or the [Eclipse-based IDE](downloading-and-building#Download-the-Integrated-Development-Environment), then generated source files will be put into a subdirectory called `src-gen/Minimal`. In addition, an executable binary will be compiled using Cargo. The resulting executable will be called `minimal` (note and be put in a subdirectory called `bin`. If you are in the Rust test directory, you can execute it in a shell as follows:

```
 bin/minimal
```

The resulting output should look something like this:

```
[INFO]  Starting the execution
Hello World!
[INFO]  Terminating the execution
```

## The Rust Target Specification

To have Lingua Franca generate Rust code, start your .lf file with the following target specification:

```rust
target Rust;
```

LF-Rust generates a Cargo project per compiled main reactor. This specification assumes in some places that the user is somewhat familiar with how Cargo works.
If you're not, here's a primer:

- a Rust project (and its library artifact) are called a _crate_.
- Cargo is the Rust package manager and build tool. LF/Rust uses Cargo to build the generated project.
- Rust has extensive support for conditional compilation. Cargo _features_ are commonly used to enable or disable the compilation of parts of a crate. A feature may also pull in additional dependencies. Cargo features only influence the compilation process; if you don't mention the correct feature flags at compilation time, those features cannot be made available at runtime. The Rust reactor runtime crate uses Cargo features to conditionally enable some features, eg, command-line argument parsing.

### Target properties summary

Target properties may be mentioned like so:

```rust
target Rust {
    // enables single-file project layout
    single-file-project: false,
    // timeout for the execution. The program will shutdown at most after the specified duration.
    timeout: 3 sec,

    cargo-features: ["cli"]
}
```

The full list of supported target properties:

- `build-type: [Debug | Release | RelWithDebInfo | RelMinSize]` - profile to use for the cargo build command. This property uses the CMake names: `Debug` corresponds to Cargo's `dev` profile, and `Release` is self-explanatory. The other two profiles are mapped to custom Cargo profiles, and are special cases of `Release`.
- `cargo-features: <string array>` - list of features of the generated crate. Supported are:
  - "cli" - enable [command-line argument parsing](#cli)
- `cargo-dependencies: { ... }` - list of dependencies to include in the generated Cargo.toml file. The value of this parameter is a map of package name to _dependency-spec_ (see [Specifying dependencies](#specifying-dependencies)).
- `export-dependency-graph: [true|false]` - dump the dependency graph to a file in DOT format before starting the execution. If a [CLI](#cli) is generated, the target property is ignored, and the user should instead use the `--export-graph` flag of the generated program.
- `rust-include: <string array>` - includes a set of Rust modules in the generated project. See [Linking support files](#linking-support-files).
- `single-file-project: [true|false]` - enables [single-file project layout](#single-file-layout)
- `timeout: <time value>` - timeout for the execution. The program will shutdown the specified amount of (logical) time after the start of its execution.
- `keepalive: [true|false]` - supported for compatiblity with standard parameters but is ignored in the Rust target. The runtime framework is smart enough to stay put when some threads may push asynchronous events, and only shutdown when we know the event queue will remain empty forever.

Note that the `logging` target property is ignored by the Rust target, as the levels used are incompatible with the Rust standard levels. See [Logging levels](#logging-levels).

### The executable

The executable name is the name of the main reactor _transformed to snake_case_: `main reactor RustProgram` will generate `rust_program`.

#### CLI

The generated executable may feature a command-line interface (CLI), if it uses the `cargo-features: ["cli"]` target property. When that feature is enabled:

- some target properties become settable at runtime:
  - `--timeout <time value>`: override the default timeout mentioned as a target property. The syntax for times is just like the LF one (eg `1msec`, `"2 seconds"`).
  - `--threads <number>`: override the default thread count mentioned as a target property. This option is **ignored** unless the runtime crate has been built with the feature `parallel-runtime`.
  - `--export-graph`: export the dependency graph (corresponds to `export-dependency-graph` target property). This is a flag, ie, absent means false, present means true. This means the value of the target property is ignored and not used as default.
  - `--log-level`: corresponds to the `logging` target property, but note that the levels have different meanings, and the target property is ignored. See [Logging levels](#logging-levels).
- parameters of the main reactor are translated to CLI parameters.
  - Each LF parameter named `param` corresponds to a CLI parameter named `--main-param`. Underscores in the LF parameter name are replaced by hyphens.
  - The type of each parameters must implement the trait [`FromStr`](https://doc.rust-lang.org/std/str/trait.FromStr.html).

When the `cli` feature is disabled, the parameters of the main reactor will each assume their default value.

#### Logging levels

The executable reacts to the environment variable `RUST_LOG`, which sets the logging level of the application. Possible values are
`off`, `error`, `warn`, `info`, `debug`, `trace`

Error and warning logs are on by default. Enabling a level enables all greater levels (ie, `RUST_LOG=info` also enables `warn` and `error`, but not `trace` or `debug`).

Logging can also be turned on with the `--log-level` CLI option, if the application features a [CLI](#cli).

Note that the `logging` target property is ignored, as its levels do not match the Rust standard levels we use (those of the [`log` crate](https://docs.rs/log/)).

Note that when building with a release profile (i.e., target property `build-type` is not `Debug`), all log statements with level `debug` and `trace` are removed from the executable, and cannot be turned on at runtime. A warning is produced by the executable if you try to use these levels explicitly.

### File layout

The Rust code generator generates a Cargo project with a classical layout:

```
├── Cargo.lock
├── Cargo.toml
├── src
│   ├── main.rs
│   └── reactors
│       ├── mod.rs
|       ├── ...
|
└── target
    ├── ...
```

The module structure is as follows:

- the crate has a module `reactors`
- each LF reactor has its own submodule of `reactors`. For instance, `Minimal.lf` will generate `minimal.rs`. The name is transformed to snake_case.

This means that to refer to the contents of another reactor module, e.g. that of `Other.lf`, you have to write `super::other::Foo`. This is relevant to access `preamble` items.

#### Single-file layout

The Rust target supports an alternative file layout, where all reactors are generated into the `main.rs` file, making the project fit in a single file (excluding `Cargo.toml`). _The module structure is unchanged:_ the file still contains a `mod reactors { ... }` within which each reactor has its `mod foo { ... }`. You can thus change the layout without having to update any LF code.

Set the target property `single-file-project: true` to use this layout.

Note: this alternative layout is provided for the purposes of making self-contained benchmark files. Generating actual runnable benchmarks from an LF file may be explored in the future.

### Specifying dependencies

The Rust code generator leverages Cargo to allow LF programs to profit from Rust's large package ecosystem. The code generator may also link support files written in pure Rust into the generated crate. Target properties are used to achieve all this.

#### Adding cargo dependencies

The `cargo-dependencies` target property may be used to specify dependencies on crates coming from `crates.io`. Here's an example:

```ruby
target Rust {
   cargo-dependencies: {
      termcolor: "0.8"
   }
};
```

The value of the _cargo-dependencies_ property is a map of crate identifiers to a _dependency-spec_. An informal example follows:

```js
cargo-dependencies: {
   // Name-of-the-crate: "version"
   rand: "0.8",
   // Equivalent to using an explicit map:
   rand: {
     version: "0.8"
   },
   // The map allows specifying more details
   rand: {
     // A path to a local unpublished crate.
     // Note 'path' is mutually exclusive with 'git'.
     path: "/home/me/Git/local-rand-clone"
   },
   rand: {
     // A URL to a git repo
     git: "https://github.com/me/rand",
     // Specify an explicit Git revision number
     rev: "abcdef1234"
   },
   rand: {
     version: "0.8",
     // you can specify cargo features
     features: ["some-cargo-feature",]
   }
}
```

When a _dependency-spec_ is specified as an object, its key-value pairs correspond directly to those of a [Cargo dependency specification](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#specifying-dependencies-from-git-repositories). For instance for the following dependency spec:

```js
   rand: {
     version: "0.8",
     // you can specify cargo features
     features: ["some-cargo-feature",]
   }
```

we add the following to the generated `Cargo.toml`:

```toml
[dependencies.rand]
version = "0.8"
features = ["some-cargo-feature"]
```

Not all keys are necessarily supported though, eg the `registry` key is not supported (yet).

#### Configuring the runtime

The runtime crate can be configured just like other crates, using the `cargo-dependencies` target property, eg:

```js
cargo-dependencies: {
   reactor_rt: {
     features: ["parallel-runtime"]
   }
}
```

The dependency is always included, with defaults picked by LFC. The location information (_path_/_git_/_version_ key) is optional.
See [reactor_rt](https://lf-lang.github.io/reactor-rust/reactor_rt/index.html) for the supported features.

#### Linking support files

You can link-in additional rust modules using the `rust-include` target property:

```ruby
target Rust {
  rust-include: ["foo.rs"]
};
```

The property is a list of paths (relative to the directory containing the `.lf` file). Each path should either point to a Rust file (`.rs`), or a directory that contains a `mod.rs` file. Each of those will be copied to the `src` directory of the generated Cargo project, and linked in to the `main.rs` file.

To refer to the included module, you can use e.g. `crate::foo` if your module is named `foo`.

### Generation scheme

Each reactor generates its own `struct` which contains state variables. For instance,

<table>
<thead>
<tr>
<th>LF</th>
<th>Generated Rust</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```rust
reactor SomeReactor {
  state field: u32(0)
}
```

</td>

<td>

```rust
struct SomeReactor {
  field: u32
}
```

</td>

</tr>
</tbody>
</table>

In the following we refer to that struct as the _state struct_.

#### Reactions

Reactions are each generated in a separate method of the reactor struct. Reaction names are unspecified and may be mangled to prevent explicit calling. The parameters of that method are

- `&mut self`: the state struct described above,
- `ctx: &mut ReactionCtx`: the context object for the reaction execution,
- For each dependency, a parameter is generated.
  - If the dependency is a component of this reactor, the name of the parameter is just the name of the component
  - If the dependency is a port of a child reactor, the name of the parameter is `<name of the child instance>__<name of the port>`, e.g. `child__out` for `child.out`.
  - The type of the parameter depends on the kind of dependency and of component:
  <table>
  <thead>
  <tr>
  <th>Component</th>
  <th>Use/trigger dependency</th>
  <th>Effect dependency</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td>

Port of type `T`

</td>
<td>

`&ReadablePort<T>`

</td>

<td>

`WritablePort<T>`

</td>

</tr>

<tr>
<td>

Logical action of type `T`

</td>
<td>

`&LogicalAction<T>`

</td>

<td>

`&mut LogicalAction<T>`

</td>

</tr>

<tr>
<td>

Physical action of type `T`

</td>
<td>

`&PhysicalActionRef<T>`

</td>

<td>

`&mut PhysicalActionRef<T>`

</td>
</tr>

<tr>
<td>Timer</td>
<td>

`&Timer`

</td>

<td>

n/a

</td>
</tr>

<tr>
<td>

Port bank of type `T`

</td>
<td>

`&ReadablePortBank<T>`

</td>

<td>

`WritablePortBank<T>`

</td>

</tr>

</tbody>
</table>

Undeclared dependencies, and dependencies on timers and `startup` or `shutdown`, do not generate a parameter.

The [`ReactionCtx`](https://lf-lang.github.io/reactor-rust/reactor_rt/struct.ReactionCtx.html) object is a mediator to manipulate all those dependency objects. It has methods to set ports, schedule actions, retrieve the current logical time, etc.

For instance:

```rust
reactor Source {
    output out: i32;
    reaction(startup) -> out {=
        ctx.set(out, 76600)
    =}
}
```

In this example, the context object `ctx` is used to set a port to a value. The port is in scope as `out`.

> :warning: TODO when the runtime crate is public link to the docs, they should be the most exhaustive documentation.

#### Actions

Within a reaction, actions may be scheduled using the [`schedule`](https://lf-lang.github.io/reactor-rust/reactor_rt/struct.ReactionCtx.html#method.schedule) function:

```rust
// schedule without additional delay
ctx.schedule(act, Asap);
// schedule with an additional delay
ctx.schedule(act, after!(20 ms));
// that's shorthand for
ctx.schedule(act, After(Duration.of_millis(20)));
```

Actions may carry values if they mention a data type, for instance:

```rust
logical action act: u32;
```

Within a reaction, you can schedule that action with a value like so

```rust
ctx.schedule_with_v(act, Asap, 30);
```

you can get the value from another reaction like so:

```rust
if let Some(value) = ctx.get_action(act) {
  // a value is present at this tag
} else {
  // value was not specified
}
```

If an action does not mention a data type, the type is defaulted to `()`.

#### Time

> :warning: todo
