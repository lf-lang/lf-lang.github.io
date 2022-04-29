---
title: "Import System"
layout: docs
permalink: /docs/handbook/import-system
oneline: "Import System (preliminary)"
preamble: >
---
_The following topics are meant as collections of design ideas, with the purpose of refining them into concrete design proposals._

# Current Implementation of Imports

The import functionality in Lingua Franca is limited to:

    import HelloWorld.lf

This can be useful if the `.lf` file is located in the same directory as the file containing the main reactor.

However, several shortcomings exist in this current system which we shall discuss next.

## Duplicate Reactor Names
Reactors with the same name can cause issues. For example:

```
import CatsAndPuppies.lf // Contains a Puppy reactor
import MeanPuppies.lf   // Contains another Puppy reactor
```

There is no way for the LF program to distinguish between the two `Puppy` reactors.

**Note.** With a relatively trivial extension to the current LF import mechanism, it is possible to detect duplicates, but there is no way to circumvent them in the current LF program (i.e., the original names might have to be changed).

## Selective Importing
Selective importing is not possible. For example, using
    
```
import CatsAndPuppies.lf
```
 
will import all the reactors contained in the `.lf` file. It would be desirable to selectively import a subset of reactors in another `.lf` file.

## Qualified Paths
Currently, there is no elegant way of importing modules that are not in the same directory.

## Renaming
All the reactors imported will have the name originally given to them by the original programmer. It might make sense to rename them for the current LF program.

## Packages
With the current import solution that only uses files, implementing packages in Lingua Franca is not feasible.


# Proposed Solution
With inspirations from Python, we propose the following import mechanism:

```
"import" LF_Trunc_File/module ("," LF_Trunc_File/module)* 
              | "from" LFTruncFile/module "import" reactor ["as" name]
                ("," reactor ["as" name] )*
              | "from" LF_Trunc_File/module "import" "*" 
```

Before discussing some examples, let's discuss `LF_Trunc_File/module`. First and foremost, `LF_Truc_File` stands for Lingua Franca Truncated File, which is a `name.lf` file with the `.lf` removed. Therefore, the legacy support for import can be carried over as:

```
import HelloWorld
```

Second, the `module` would introduce the notion of packages to Lingua Franca. The content of a module can be located in any path. To enable this facility, modules provide a Lingua Franca Meta file (LFM) that introduces the package name, and the absolute or relative paths of all the LF files that are included in that package. For example:

```
// CatsAndPuppies.LFM
package CatsAndPuppies // Optional. The file name would be interpreted as the package name.
import /home/user/linguafranca/pets/Cats.lf // Absolute paths
import pets/Puppies.lf // Relative paths
```

For a package to be accessible, the `LFM` file needs to be discoverable. For example, it can be automatically added to the current directory or "installed" in a known Lingua Franca path (e.g., `/usr/local/LF/packages` or `/home/user/linguafranca/packages`).

With that in mind, let's discuss some examples on how this might work next.
The content of the `HelloWorld.lf` example is as follows:

```
target C; 
reactor SayHello {
    timer t;
    reaction(t) {=
        printf("Hello World.\n");
    =}
}
main reactor HelloWorldTest {
    a = new HelloWorld();
}
```

Let us create a `Greetings.lf` program based on HelloWorld.
```
target C; 
import HelloWorld

main reactor Greetings {
    a = new SayHello();
}
```

To generate code for `Greetings.lf`, Lingua Franca first searches for a `HelloWorld.lf` file in the same directory as `Greetings.lf`. If not found, it will look for a `HelloWorld.LFM` in the known paths. If none is found, an error is raised.

Now we can demonstrate selective import. For example:
```
target C; 
from HelloWorld import SayHello

main reactor Greetings {
    a = new SayHello();
}
```

Finally, renaming can be done by using the `as` predicate:
```
target C; 
from HelloWorld import SayHello as SayGreetings

main reactor Greetings {
    a = new SayHeGreetings();
}
```