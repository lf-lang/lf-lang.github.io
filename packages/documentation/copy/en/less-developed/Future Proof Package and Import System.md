---
title: "Future Proof Package/Import System"
layout: docs
permalink: /docs/handbook/proof-import
oneline: "A future proof package and import system"
preamble: >
---
This is a collection of thoughts on the design of a reliable package and import system that is ready for future applications. At this stage, this page mostly represents my personal view (Christian Menard). I will also focus on the C++ target here as this is the target I know best. The C target is not a good example for these considerations as there is a fundamental design issue with the C target. Since the code generator places all code in a single generated `.c` file and does things like `#include reactor.c` to avoid the need for Makefiles, it circumvents many of the issues that come with imports that I will outline here. It simply ignores file scopes and namespaces altogether.

# The status quo

The current import system is lean and simple. Write `import Bar.lf` in `Foo.lf` and every reactor defined in `Bar.lf` will be visible in the file scope `Foo.lf`. `Bar.lf` is looked up simply by scanning the directory `Foo.lf` is placed in. This works well for the simple programs and tests we have right now, but does not scale. I identify the following problems:

1. There is no notion of separate namespaces. Every reactor that `Bar.lf` defines becomes visible in `Foo.lf`. If both files define a Reactor `Foo`, there is a name clash and the import would be ill-formed. There should be a mechanism to distinguish the two definitions of `Foo`, such as using fully qualified names: `Foo.Foo` and `Bar.Foo`.

2. There is no concept for importing files from a directory structure. It is unclear how `Foo.lf` could import `my/lib/Bar.lf`.

3. There is no concept for packages or libraries that can be installed on the system. How could we import Reactors from a library that someone else provided?

These are the more obvious issues that we have talked about. However, there are more subtle ones that we haven't been discussed in depth (or at least not in the context of the import system design discussion). The open question is: What does importing a LF file actually mean? Obviously, an import should bring Reactors defined in another files into local scope. But what should happen with the other structures that are part of an LF file, namely target properties and preambles? That is not specified and our targets use a best practice approach. But this is far away from a good design that is scalable and future proof.

## A quick dive into the C++ code generator

Before I discuss the problems with preambles and target properties, I would like to give you a quick overview of how the C++ code generator works. Consider the following LF program consisting of two files `Foo.lf` and `Bar.lf`:

```
// Bar.lf

reactor Bar {
 reaction(startup) {=
   // do something bar like
 =}
}
```

```
// Foo.lf

import Bar.lf

reactor Foo {
 bar = new Bar();
 reaction(startup) {=
   // do something foo like
 =}
}
```

Now let us have a look on what the C++ code generator does. It will produce a file structure like this:
```
CMakeLists.txt
main.cc
Bar/
  Bar.cc
  Bar.hh
Foo/
  Foo.cc
  Foo.hh
```
We can ignore `CMakeLists.txt` and `main.cc` for our discussion here. The former specifies how the whole program can be build and the latter contains the `main()` function and some code that is required to get the application up and running. For each processed `<file>.lf` file, the code generator creates a directory `<file>`. For each reactor `<reactor>` defined in `<file>.lf`, it will create `<file>/<reactor>.cc` and `<file>/<reactor>.hh`. The header file declares a class representing the reactor like this:
```
// Bar/Bar.hh

# pragma once

#include "reactor-cpp/reactor-cpp.hh"

class Bar : public reactor::Reacor {
 private:
  // default actions
  reactor::StartupAction startup {"startup", this};
  reactor::ShutdownAction shutdown {"shutdown", this};

 public:
  /* ... */

 private:
  // reaction bodies 
  r0_body();
};
```

The corresponding `Bar/Bar.cc` will look something like this:
```
#include "Bar/Bar.hh"

/* ... */

Bar::r0_body() {
  // do something bar like
}
```

Similarly, `Foo.hh` and `Foo.cc` will be generated. However, since `Foo.lf` imports `Bar.lf` and instantiated the reactor `Bar` it must be made visible. This is done by an include directive in the generated code like so:
```
// Foo/Foo.hh
### 
# pragma once

#include "reactor-cpp/reactor-cpp.hh"
#include "Bar/Bar.hh"

class Foo : public reactor::Reacor {
 private:
  // default actions
  reactor::StartupAction startup;
  reactor::ShutdownAction shutdown;

  // reactor instances
  Bar bar;
 public:
  /* ... */

 private:
  // reaction bodies 
  r0_body();
};
```

## The problem with preambles

The problems with preamble in the context of imports were already discussed in a [related issue](https://github.com/pulls), but I would like to summarize the problem here. While the examples above worked nicely even with imports, things get messy as soon as we introduce a preamble. Let's try this:

```
// Bar.lf

reactor Bar {
 preamble {=
   struct bar_t {
     int x;
     std::string y;
   };

   bar_t bar_func {
     return bar_t(42, "hello")
   }
 =}
 output out:bar_t;
 reaction(startup) -> out {=
   out.set(bar_fuc());
 =}
}
```

```
// Foo.lf

import Bar.lf

reactor Foo 
 bar = new Bar();
 reaction(bar.out) {=
   auto& value = bar.out.get();
   std::cout << "Received {" << value->x << ", " << value->y << "}\n";
 =}
}
```
This would be expected to print `Received {32, hello}`. However, before we can even compile this program, we need to talk about what should happen with the preamble during code generation and how the import affects it. So where should the preamble go? The first thing that comes to mind, is to embed it in the header file `Bar.hh` something like this:

```
// Bar/Bar.hh

# pragma once

#include "reactor-cpp/reactor-cpp.hh"

// preamble
struct bar_t {
  int x;
  std::string y;
};

bar_t bar_func {
  return bar_t(42, "hello")
}

class Bar : public reactor::Reacor {
 /* ... */
};
```

If we embed the preamble like this and compile the program ,then the compiler is actually happy and processes all `*.cc` files without any complaints. **But**, there is a huge problem while linking the binary. The linker sees multiple definitions of `bar_func` and has no idea which one to use. Why is that? Well, the definition of `bar_func` is contained in a header file. This should never be done in C/C++! Since includes translate to a plain-text replacement by the preprocessor, `Bar.cc` will contain the full definition of `bar_func`. As `Foo.cc` imports `Foo.hh` which imports `Bar.hh`, also Foo.cc will contain the full definition. And since `main.cc` also has to include `Foo.hh`, `main.cc` will also contain the full definition of `bar_func`. So we have multiple definitions of the same function and the linker rightfully reports this as an error.

So what should we do? We could place the preamble in `Bar.cc` instead. This ensures that only `Bar.cc` sees the definition of `bar_func`. But then the compiler complains. Neither `Bar.hh` nor `Foo.hh` see type declaration of `bar_t`. Note that there is a dependency of `Foo.lf` on the preamble in `Bar.lf`. The import system should somehow take care of this dependency! Also note that this has not appeared as a problem in C as the code generator places everything in the same compilation unit. `Foo` will see the preamble of `Bar` as long as `Foo` is generated before `Bar`.

But how to solve it for C++ where the code is split in multiple compilation units (which really should be happening in C as well)? What we do at the moment is annotating the preamble with `private` and `public` keywords. This helps to split the preamble up and decide what to place in the header and what to place in the source file. For instance:
```
// Bar.lf

reactor Bar {
 public preamble {=
   struct bar_t {
     int x;
     std::string y;
   };
 =}
 private preamble {=
   bar_t bar_func {
     return bar_t(42, "hello")
   }
 =}
 output out:bar_t;
 reaction(startup) -> out {=
   out.set(bar_fuc());
 =}
}
```
This makes the type `bar_t` visible as part of the public interface of `Bar`. Both the code generated for `Bar` and the code generated for `Foo` will see the definition of `bar_t`. This is realized by placing the public preamble in `Bar.hh` The function `bar_func` is part of `Bar`'s private interface. It is only visible with the reactor definition of `Bar` and is not propagated by an import. This is realized by simply placing the private preamble in `Bar.cc`. This makes the compiler finally happy and when get an executable program private and public preambles provide a mechanism to define what is propagated on an import and what is not. I think this is an important distinction even in languages other than C/C++ that do not have this weird separation of source and header file.

I am sorry for this lengthy diversion into things that happened in the past where we actually want to talk about how things should work in the future. However, understanding this issue is important and when talking about other solutions we should not forget that it exists.

## The problem with target properties

It is also not well-defined what should happen with target properties when importing a `.lf` file. Apparently the common practice is simply ignoring the existence of other target declarations and only considering the target declaration of the `.lf` that contains the main reactor. I think this works reasonably well for our small programs. But it will cause problems when either programs become larger or we introduce new target properties where it is unclear what piece of code they reference. Let us have a look at the [existing target properties for C++](https://github.com/lf-lang/lingua-franca/wiki/Writing-Reactors-in-Cpp#the-c-target-specification). How should those different properites be handled on an import? Which scope do they actually apply to? We haven't really talked about this.

`fast`, `keepalive`, `threads` and `timeout` are easy. They apply to the main reactor. Since we do not import main reactors from other files, it is clear that we really want to use the properties defined in the main compilation unit. So our current strategy works in this case. Although there are still some subtelties. For instance, if a library file defines `keepalive=true` and `fast=false` because it uses physical actions, should any file importing this library file be allowed to override these properties. Probably not, because it doesn't make sense if physical actions are involved. But a careless user of the library might not be aware of that. So maybe it isn't that clear after all.

`build-type`, `cmake-include`, `compile`, `logging` and `no-runtime-validation` influence how the application is build. They are used for generating the `CMakeLists.txt` file. So their is quite clear: they apply to the whole compilation of the given application. Again it is a simple solution to only consider the target properties of the file containing the main reactor since this can be considered the file that 'drives' the compilation. But what if an imported `.lf` relies on an external library and uses the `cmake-include` property to tell cmake to look this library up, make the library header files visible and link our generated code to that library (fortunately this can be done with 2 lines in cmake). Should this target property really be ignored by our import? Probably not, because it will lead to compile errors if the authot of the main `.lf` file does not configure `cmake-include` properly. So there should be some kind of merging mechanism for `cmake-include`. Should this be done for the other properties as well? I am not sure and I actually don't know how the merging would work.

So this raises a lot of questions that we currently have no answer to. I believe we need to find answers for these questions in order to create a well working import and package system. This gets only more complicated when we add more properties such as the proposed `files` directive. We should really consider what properties actually apply to and if they influence the way imports work.

### The work in progress

To be continued... I want to describe here what is happening on the `new_import` and the (potential) problems this brings.

### Possible solutions

To be continued... I would like to show a few possible soltions that have come to mind and that we discussed already.

## Concrete proposal
With the risk of overlooking some of the issues discussed above, I'd like to outline a concrete proposal. To me, at least, it is easier to reason about these issues in a context with a few more constraints. Hopefully, this can serve as a starting point that we can tweak/adjust as needed. Note: this proposal borrows from the previous proposal written by Soroush. Based on my experience with Xtext, I have confidence that what is described below is feasible to implement.

### Import/export
1. One LF file can contain multiple reactor definitions.
2. There can be at most one main reactor per file.
3. Any reactor class defined outside of the current file has to be imported explicitly.
4. The visibility of a reactor class can be limited using a modifier in the class definition.
 - _Should the default visibility be public or private? I have no strong preference either way._
5. An `import` statement **must** specify which reactor classes to import. This is necessary because if we populate a global scope using the `uriImport` mechanism, the local scope provider needs to know which definition to link to if there happen to exist multiple among the set of included files. We could _potentially_ relax this constraint and only report the situation where we know for a fact that there is ambiguity and needs to be resolved by making the imports explicit. We could also deprecate the use of unqualified imports (the original syntax), therefore allow it but warn that it might not work as expected.
6. An LF file in an `import` statement is specified by a path relative to the directory of the file in which the `import` statement occurs or relative to a series of directories in a wider search path.
 - _Eclipse uses `.project` files to identify the root of a project; we can look for that._
 - _We can look for our own kind of manifest files as well. These can list additional locations to search. This is compatible with the idea of developing a package system. I personally like this approach better than using an environment variable._
7. I personally find fully qualified names excess generality and have never felt compelled to use them in Java. IMO, they lead to code that's difficult to read and a pain to format. To keep things simple, I suggest we don't support them. Instead, we should provide a mechanism for renaming imported reactor classes to avoid naming conflicts.
8. _Open question: do we want scope modifiers for imports? It seems that extra import statements could be used to increase visibility, so it might not be needed._

### Syntax
```
Import := 'import' <ID> <Rename>? (',' <ID> <Rename>?)* 'from' <PATH>

Rename := 'as' <ID>
```

_Note: This syntax could be extended to support packages in addition to paths. But it doesn't make much sense to have this until we have a package manager and package registry._

_Current state of the discussion: one unifying syntax vs. different syntax for references to files and packages._

## Preambles
A preamble allows for the inclusion of verbatim target code that may be necessary for reactors to function. Currently, there are two scopes in which preambles can appear: (1) file scope and (2) reactor class scope. Moreover, there exist visibility modifiers to label preambles `private` or `public`. A `public` preamble is intended to contain code that is necessary for the use of a reactor that is in scope. A `private` preamble is intended to contain code that is necessary for the implementation of a reactor that is in scope. Only the Cpp code generator can currently effectively separate these LF scope levels. It achieves this by putting each reactor class definition in its own file. LF file scope preambles are currently not supported by the C target, but this appears to be unintentional and would be easy to fix. Reactor class scope preambles are supported by the C target, but there is no isolation of scope; the preamble of one reactor is visible to the one defined after it. To fix this, I see two options: (1) follow the same approach as `CppGenerator` and output separate files, which also means that a Makefile has to be generated in order to compile the result, or (2) leverage block scope within a single file, but this will become complicated and make the generated C code even less humanly readable.

_We could put aside the problem of name clashes due to the absence of scope isolation in generated C code and fix this later. For the time being, the problem can be circumvented using `.h` files._

## Target Properties
1. Each file declares a target.
2. All code in all reactors in the same file must agree with the specified target.
3. Additional target properties may be specified.
4. Target properties are not inherited through imports.
5. Any property that needs to be inherited through an import (such as the requirement to link against the pthread library) must be specified as a build dependency instead.

## Build Dependencies
1. It must be possible to specify build dependencies, such as `files`, `sources`, and `protobufs`.
2. We could either allow these definitions to go directly in the `.lf` file, or we could decide to specify them in a package description (i.e., separate file). We could potentially allow both.
3. Build dependencies are inherited through imports (or from package descriptions), and they are never shadowed, always _joined_.


# Unique Reactor Names

The new import system as described above ensures that reactor names within a single `.lf` file are unique. In case reactors with the same name are imported from different `.lf` files, the renaming mechanism needs to be used in order to resolve the name conflict. The same applies if the given `.lf` file defines some reactors and tries to import other reactors with the same name. For instance, consider the LF file in Example 1 below. In the scope of this file, three reactor declarations are visible: `Foo`, `Bar` and `Baz`, although the actual reactors have the same name `Foo`.

## Examples

Throughout this section, I will be using two LF example programs. Since the markdown syntax does not provide a simple way to label and refer to code listings, I figure its easiest to place them here in a central place and refer to them later by the heading

### Example 1
```
\\ Foo.lf
import Foo as Bar from "Bar.lf"
import Foo as Baz from "Baz.lf"

reactor Foo {
  \\ ...
}
```

### Example 2

```
\\ Baz.lf
reactor Foo {
  \\ ...
}
```
```
\\ Bar.lf
import Foo from "Baz.lf"

reactor Foo {
  foo = new Foo()
  \\ ...
}
```
```
\\ Foo.lf
import Bar from "Bar.lf"
main reactor Foo {
  bar = new Bar()
  \\ ...
}
```

## Unique Reactor Names in Target Code

While the mechanism above effectively ensures uniqueness in a single LF file, this uniqueness is surprisingly hard to ensure in generated target code. C has an obvious problem here as it places all generated code in a single file. While the name conflict in the above code can be solved by generating code for three reactors named `Bar`, `Baz` and `Foo`, it breaks as soon as another file of the same LF program uses `import Foo from "Bar.lf"`. Then there would be two definitions of the reactor `Foo` that cannot be resolved.

Now you would probably expect that splitting the generated code into multiple files solves the issue, but unfortunately this is not true. If anything, it makes the problem more subtle. The C++ code generated from Example 1  would likely look something like this:
```
// Foo.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Bar.hh"
#include "Baz.hh"

// do the renaming
using Bar = Foo;
using Baz = Foo;

class Foo : public reactor::Reactor {
};
```
This will cause a compile error as there are multiple definitions of `Foo`. While renaming is possible in C++ with the `using` keyword (`typedef` works as well), the thing being renamed needs to be already visible in the scope. So there are multiple definitions of `Foo` as all the files `Bar.hh`, `Baz.hh` and `Foo.hh` define this class. We need a mechanism to distinguish the different definitions of `Foo`.

There is even another issue that stems from the fact that the semantics of imports in LF are different from the include semantics of C++. Consider the code in Example 2, which is valid LF code. Although `Bar.lf` imports `Foo` and `Foo.lf` imports from `Bar.lf`, the definition of `Foo` in `Baz.lf` is not visible in `Foo.lf`. This 'hiding', however, does not easily propagate to the generated code. In C, there will be an error because both definitions of `Foo` are placed in the same file. In C++, the different definitions of `Foo` are placed in different files, but there will still be an error. The generated C++ code would look something like this:
```
\\ Baz.hh
#include <reactor-cpp/reactor-cpp.hh>

class Foo : public reactor::Reactor {
  // ...
};
```
```
\\ Bar.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Baz.hh"

class Bar : public reactor::Reactor {
  Foo foo;
  // ...
};
```
```
\\ Foo.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Bar.hh"

class Foo : public reactor::Reactor {
  Bar bar;
  // ...
};
```
This will produce an error due to multiple definitions of `Foo` being visible in `Foo.hh`. The problem is that any include in `Bar.hh` becomes also visible in `Foo.hh`. So there is a name clash due to the way the C++ compiler processes included and that is hard to work around.


## Possible Solutions

In conclusion from the above section, I can say that translating the file based scoping of reactor names that we have in LF to generated target code is not trivial. Any sensible solution will need to establish a mechanism to ensure that any two distinct reactors in LF are also distinct in target code.

### Namespaces

We could introduce some form of a namespace mechanism that allows us to derive fully-qualified names of reactors. This is the preferred solution for me (Christian). Note that by 'namespace' I mean any logical organization of reactors in named groups and not the precise concept of C++ namespaces. In other languages those logical groups are also referred to as modules or packages. Also note that it is only important to be able to assign a fully-qualified name to a reactor, it does not necessarily require that we refer to reactors by their fully-qualified name in LF code.

#### File based namespaces

In my view, the easiest way to introduce namespaces in LF would be to leverage file system structure. Everything contained in `Foo.lf` would automatically be in the namespace `Foo`. So the FQN of a reactor `Foo` defined in `Foo.lf` would be `Foo.Foo` (or `Foo::Foo`, or some other delimiter). This would solve the name clashes in both of our examples. For Example 1, the generated code could look like this:
```
// Foo.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Bar.hh"
#include "Baz.hh"
namespace Foo {

// do the renaming
using Bar = Bar::Foo;
using Baz = Baz::Foo;

class Foo : public reactor::Reactor {
};
}
```

For Example 2, the generated code could look like this:
```
\\ Baz.hh
#include <reactor-cpp/reactor-cpp.hh>

namespace Baz {
class Foo : public reactor::Reactor {
  // ...
};
}
```
```
\\ Bar.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Baz.hh"

namespace Bar {
using Foo = Baz::Foo; // bring Foo in scope

class Bar : public reactor::Reactor {
  Foo foo;
  // ...
};
}
```
```
\\ Foo.hh
#include <reactor-cpp/reactor-cpp.hh>

#include "Bar.hh"

namespace Foo {
using Bar = Bar::Bar; // bring Bar in scope

class Foo : public reactor::Reactor {
  Bar bar;
  // ...
};
}
```

While this appears to be a promising solution, it is not sufficient to only consider the name of an `*.lf` file to derive the namespace
There could be two files `Foo.lf` in different directories that both define the reactor `Foo`. Thus, we also need to consider the directory structure and introduce hierarchical namespaces. Consider this directory tree:
```
foo/
  bar/
    foo.lf  # defines reactor Foo
  baz/
    foo.lf  # defines reactor Foo
```
In this example, the two `Foo` reactors would have the fully qualified names `foo.bar.foo.Foo` and `foo.baz.foo.Foo`.
In order for this concept to work, we need the notion of a top-level namespace or directory. Naturally, this would be the package. Therefore, this namespace approach would also require a simple mechanism to define a package. For now this could be rudimentary. Simply placing an empty `lf.yaml` in the `foo/` directory in the above example would be sufficient. In addition to the notion of packages, we would also need a simple mechanism to find packages. However, since packages are something we want to have anyway, it would not hurt to start and implement a rudimentary system now.

This proposal is a bit at odds with the file based import mechanism described above. While it is clear what the namespace of an `*.lf` file relative to a package directory is, it is unclear what the namespace of an arbitrary file outside a package is. Marten suggested to resolve this by using a default namespace or the global namespace whenever a *lf that is not part of a package is imported and to make the user responsible for avoiding any conflicts.

We would also need to restrict the naming of files and directories and ban the usage of the namespace deliminator (`.` or `::` or some other) in file and directory names. In my opinion this is not much of a problem and common practice for many languages. If we decide to use this namespace mechanism, it would probably be better to drop the file based imports and switch to imports by FQN (e.g. `import Foo from foo.bar.foo`)

#### A Namespace Directive

As an alternative to the file based namespace mechanism described above, we could also introduce a namespace directive in the LF syntax or as part of the target properties. This would effectively allow the user to specify the namespace that any reactor defined in a file should be part of. This solution would allow to augment the file based import system that we have with a namespace mechanism. It is important to note, however, that this entirely shifts the responsibility for ensuring uniqueness within a namespace to the user. When we derive namespaces from the file path as described above, we can be sure that the resulting namespace only contains unique reactors because we ensure that any LF file only contains unique reactors. If we allow the user to specify the namespace, however, there could easily be two files with the same namespace directive that both define the reactor `Foo`. This approach might also cause problems for target langauages where the namespaces relate tp conrete file paths such as in Rust, Python or Java.

### Name Mangling

There are other mechanisms to derive unique names apart from namespaces. One that is widely used by compilers is name mangling which replaces or decorates the original name. For instance, we could simply add a number to the name of generated reactors (`Foo1`, `Foo2`, ...) to distinguish multiple LF reactor definitions named `Foo`. What seperates our approach from traditional compiler though, is that we are not in control of the full build process and only generate source code to be processed by another compiler. Therefore, any renaming we do when compiling LF code to target code needs to be done with care as it could easily introduce new problems because we are not aware of all the identifiers defined in a target language. For instance if our LF program uses a library that defines the class `Foo3`, adding a third definition of the reactor Foo to the prorgram would lead to an unexpected error that is also hard to debug.

Soroush also proposed to use a hashing mechanism (for instance a hash of the file name) to decorate reactor names. This would be less likely
to clash with any names defined in some library. However, we would need to make sure that any mechansim we use for generating unique decorated names follows strict rulses and generates reproducable names. This reproducibility is crucial for several reasons. 

1. Since even a complex name mangling mechanism has still the chance to produce name clashes with identifiers defined outside of the LF program, those clashes should not occur randomly. There should be either an error or no error on each compilation run. Nondeterministic builds are no fun to deal with.

2. In case of any errors, it is crucial to be able to reproduce and compare builds across machines and platforms. A platform dependent name mangling algorithm (for instance one that hashes file paths) would make it unecessary hard to reproduce and debug compile errors.

3. Somewhere in the future, we might want to be able to compile packages as libraries. Recompilation of the library should never change its API. Moreover, the name mangling algorithm should be robust in the sense that small changes in LF code do not lead to changed identifiers
in the library API.

All in all, I think it is hard to define an algorith that generates reproducible and stable names, but maybe someone else has a good idea of how this could be achieved. 

Another obvious disadvantage of the name mangling approach would be that the generated code is less readable. Also any external target code that might want to reference reactors in a library compiled from LF code, would need to know and use the mangled name.

## Unique Reactor Names in our Tools

In our last meeting (Tue 2020-08-04), I said that there are other places where we care about unique names: our tools such as the diagram view or the trace generator that I implemented for C++ and that we cannot ensure that names are unique at the moment. However, while thinking about it a bit more I realized that this is not much of an issue. Ambiguous names of reactor types are not a big problem for the diagram view. Since clicking on the nodes jumps directly to the reactor definition, the ambiguity in the names can easily be resolved.

For the tracing, I realized that it is not the name of the reactor type that matters, but the name of the instance. These are unique fully-qualified names already. For instance `main.foo.bar.r0`, denotes the reaction with priority 0, of a reactor instance called `bar` that is contained by the reactor instance `foo`, which is in turn contained by the main reactor.

## Summary

All in all, I think leveraging the file strucuture for determining the fully qualified names of reactors is the most promising solution.
1. It works without any changes in our syntax. Only the code generators need to be updated to support the namespacing.
2. In contrast to name mangling, it allows generation of readable code and also gives the programmer full control of how generated reactors are named.
3. It fits naturally to languages that also support leveraging the file structure to create namespaces (e.g. python or rust).