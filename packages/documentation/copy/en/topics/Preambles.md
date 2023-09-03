---
title: "Preambles"
layout: docs
permalink: /docs/handbook/preambles
oneline: "Defining preambles in Lingua Franca."
preamble: >
---

$page-showing-target$

## Preamble

Reactions may contain arbitrary target-language code, but often it is convenient for that code to invoke external libraries or to share procedure definitions. For either purpose, a reactor may include a $preamble$ section.

<div class="lf-c">

For example, the following reactor uses the `math` C library for its trigonometric functions:

```lf-c
main reactor {
  preamble {=
    #include <math.h>
  =}
  reaction(startup) {=
    printf("The cosine of 1 is %f.\n", cos(1));
  =}
}
```

This will print:

```
The cosine of 1 is 0.540302.
```

By putting the `#include` in the $preamble$, the library becomes available in all reactions of this reactor.
If you wish to have the library available in all reactors in the same file, you can provide the $preamble$ outside the reactor, as shown here:

```lf-c
preamble {=
  #include <math.h>
=}
reactor Cos {
  reaction(startup) {=
    printf("The cosine of 1 is %f.\n", cos(1));
  =}
}
reactor Sin {
  reaction(startup) {=
    printf("The sine of 1 is %f.\n", sin(1));
  =}
}
main reactor {
  c = new Cos()
  s = new Sin()
}
```

You can also use the $preamble$ to define functions that are shared across reactions within a reactor, as in this example:

```lf-c
main reactor {
  preamble {=
    int add_42(int i) {
      return i + 42;
    }
  =}
  reaction(startup) {=
    printf("42 plus 42 is %d.\n", add_42(42));
  =}
  reaction(startup) {=
    printf("42 plus 1 is %d.\n", add_42(1));
  =}
}
```

Not surprisingly, this will print:

```
42 plus 42 is 84.
42 plus 1 is 43.
```

(The order in which these are printed is arbitrary because the reactions can execute in parallel.)

To share a function across _reactors_, however, is a bit trickers.
A $preamble$ that is put outside the $reactor$ definition can only contain
_declarations_ not _definitions_ of functions or variables.
The following code, for example will **fail to compile**:

```lf-c
preamble {=
  int add_42(int i) {
    return i + 42;
  }
=}
reactor Add_42 {
  reaction(startup) {=
    printf("42 plus 42 is %d.\n", add_42(42));
  =}
}
reactor Add_1 {
  reaction(startup) {=
    printf("42 plus 1 is %d.\n", add_42(1));
  =}
}
main reactor {
  a = new Add_42()
  b = new Add_1()
}
```

The compiler will issue a **duplicate symbol** error because the function definition gets repeated in the separate C files generated for the two reactor classes, `Add_42` and `Add_1`. When the compiled C code gets linked, the linker will find two definitions for the function `add_42`.

To correct this compile error, the file-level preamble should contain only a _declaration_, not a _definition_, as here:

```lf-c
preamble {=
  int add_42(int i);
=}
reactor Add_42 {
  reaction(startup) {=
    printf("42 plus 42 is %d.\n", add_42(42));
  =}
}
reactor Add_1 {
  reaction(startup) {=
    printf("42 plus 1 is %d.\n", add_42(1));
  =}
}
main reactor {
  preamble {=
    int add_42(int i) {
      return i + 42;
    }
  =}
  a = new Add_42()
  b = new Add_1()
}
```

The function _definition_ here is put into the main reactor, but it can be put in any reactor defined in the file.

Most header files contain only declarations, and hence can be safely included
using `#include` in a file-level $preamble$. If you wish to use a header file that includes both declarations and definitions, then you will need to include it within each reactor that uses it.

If you wish to share _variables_ across reactors, similar constraints apply.
Note that sharing variables across reactors is **strongly discouraged** because it can undermine the determinacy of Lingua Franca, and you may have to implement mutual-exclusion locks to access such variables. But it is occassionaly justfiable, as in the following example:

```lf-c
preamble {=
  extern const char shared_string[];
=}
reactor A {
  reaction(startup) {=
    printf("Reactor A says %s.\n", shared_string);
  =}
}
reactor B {
  reaction(startup) {=
    printf("Reactor B says %s.\n", shared_string);
  =}
}
main reactor {
  preamble {=
    const char shared_string[] = "Hello";
  =}
  a = new A()
  b = new B()
}
```

Notice the use of the `extern` keyword in C, which is required because the _definition_ of the `shared_string` variable will be in a separate (code-generated) C file, the one for `main`, not the ones for `A` and `B`.

One subtlety is that if you define symbols that you will use in $input$, $output$, or $state$ declarations, then the symbols _must_ be defined in a file-level $preamble$.
Specifically, the following code will **fail to compile**:

```lf-c
main reactor {
  preamble {=
    typedef int foo;
  =}
  state x:foo = 0
  reaction(startup) {=
    lf_print("State is %d", self->x);
  =}
}
```

The compiler will issue an **unknown type name** error. To correct this, just move the declaration to a file-level $preamble$:

```lf-c
preamble {=
  typedef int foo;
=}
main reactor {
  state x:foo = 0
  reaction(startup) {=
    lf_print("State is %d", self->x);
  =}
}
```

</div>

<div class="lf-cpp">

For example, the following reactor uses the `charconv` header from the c++ standard library to convert a string to an integer:

```lf-cpp
target Cpp;

main reactor {
  private preamble {=
    #include <charconv>
    #include <string>
  =}

  timer t;
  reaction(t) {=
    std::string raw = "42";
    std::size_t number;

    auto result = std::from_chars(raw.data(), raw.data() + raw.size(), number);
    if (result.ec == std::errc::invalid_argument) {
      std::cerr << "Could not convert.";
    } else {
      std::cout << "Converted string: " << raw << " to integer: " << number << std::endl;
    }
  =}
}
```

This will print:

```
[INFO]  Starting the execution
Converted string: 42 to integer: 42
[INFO]  Terminating the execution
```

By putting the #include in the preamble, the library becomes available in all reactions of this reactor. Note the private qualifier before the preamble keyword.
This ensures that the preamble is only visible to the reactions defined in this reactor and not to any other reactors. In contrast,
the public qualifier ensures that the preamble is also visible to other reactors in files that import the reactor defining the public preamble.

```lf-cpp
reactor Preamble {
  public preamble {=
    struct MyStruct {
      int foo;
      std::string bar;
    };
  =}

  private preamble {=
    auto add_42(int i) noexcept -> int {
      return i + 42;
    }
  =}

  logical action a:MyStruct;

  reaction(startup) {=
    a.schedule({add_42(42), "baz"});
  =}

  reaction(a) {=
    auto value = *a.get();
    std::cout << "Received " << value.foo << " and '" << value.bar << "'\n";
  =}
}
```

It defines both a public and a private preamble. The public preamble defines the type MyStruct. This type definition will be visible to all elements of the
Preamble reactor as well as to all reactors defined in files that import Preamble. The private preamble defines the function `add_42(int i)`.
This function will only be usable to reactions within the Preamble reactor.

You can think of public and private preambles as the equivalent of header files and source files in C++. In fact, the public preamble will be translated to a
header file and the private preamble to a source file. As a rule of thumb, all types that are used in port or action definitions as well as in state variables
or parameters should be defined in a public preamble. Also, declarations of functions to be shared across reactors should be placed in the public preamble.
Everything else, like function definitions or types that are used only within reactions, should be placed in a private preamble.

Note that preambles can also be specified on the file level. These file level preambles are visible to all reactors within the file.
An example of this can be found in [PreambleFile.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/target/PreambleFile.lf).

Admittedly, the precise interactions of preambles and imports can become confusing. The preamble mechanism will likely be refined in future revisions.

Note that functions defined in the preamble cannot access members such as state variables of the reactor unless they are explicitly passed as arguments.
If access to the inner state of a reactor is required, [methods](/docs/handbook/reactions-and-methods#method-declaration) present a viable and easy to use alternative.

</div>

<div class="lf-py">

For example, the following reactor uses the `platform` module to print the platform information and a defined method to add 42 to an integer:

```lf-py
main reactor Preamble {
	preamble {=
		import platform
		def add_42(self, i):
			return i + 42
	=}
	timer t;
	reaction(t) {=
		s = "42"
		i = int(s)
		print("Converted string {:s} to int {:d}.".format(s, i))
		print("42 plus 42 is ", self.add_42(42))
		print("Your platform is ", self.platform.system())
	=}
}
```

On a Linux machine, this will print:

```
Converted string 42 to int 42.
42 plus 42 is 84
Your platform is Linux
```

By putting import in the $preamble$, the module becomes available in all reactions of this reactor using the `self` modifier.

**Note:** Preambles will be put in the generated Python class for the given reactor, and thus is part of the instance of the reactor. This means that anything you put in the preamble will be specific to a particular reactor instance and cannot be used to share information between different instantiations of the reactor (this is a feature, not a bug, because it helps ensure determinacy). For more information about implementation details of the Python target, see [Implementation Details](/docs/handbook/target-language-details#python-target-implementation-details).

Alternatively, you can define a $preamble$ outside any reactor definition. Such a $preamble$ can be used for functions such as import or to define a global function. The following example shows importing the [hello](https://github.com/lf-lang/lingua-franca/blob/master/test/Python/src/include/hello.py) module:

```lf-py
target Python {
  files: include/hello.py
};
preamble {=
  import hello
=}
```

Notice the usage of the `files` target property to move the `hello.py` module located in the `include` folder of the test directory into the working directory (located in `src-gen/NAME`).

For another example, the following program uses the built-in Python `input()` function to get typed input from the user:

```lf-py
target Python
main reactor {
  preamble {=
    import threading
    def external(self, a):
      while (True):
        from_user = input() # Blocking
        a.schedule(0, from_user)
  =}
  state thread
  physical action a
  timer t(2 secs, 2 secs)

  reaction(startup) -> a {=
    self.thread = self.threading.Thread(target=self.external, args=(a,))
    self.thread.start()
    print("Type something.")
  =}

  reaction(a) {=
    elapsed_time = lf.time.logical_elapsed()
    print(f"A time {elapsed_time} nsec after start, received: ", a.value)
  =}

  reaction(t) {=
    print("Waiting ...")
  =}
}
```

Within the $preamble$, we specify to import the `threading` Python module and define a function that will be started in a separate thread in the reaction to $startup$. The thread function named `external` blocks when `input()` is called until the user types something and hits the return or enter key. Usually, you do not want a Lingua Franca program to block waiting for input. In the above reactor, a $timer$ is used to repeatedly trigger a reaction that reminds the user that it is waiting for input.

</div>

<div class="lf-ts">

For example, the following reactor uses Node's built-in path module to extract the base name from a path:

```lf-ts
target TypeScript;
main reactor Preamble {
  preamble {=
    import * as path from 'path';
  =}
  reaction (startup) {=
    var filename = path.basename('/Users/Refsnes/demo_path.js');
    console.log(filename);
  =}
}
```

This will print:

```
demo_path.js
```

By putting the `import` in the **preamble**, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file. It's a bit more complicated to [set up Node.js modules from npm](#using-node-modules) that aren't built-in, but the reaction code to `import` them is the same as what you see here.

You can also use the preamble to define functions that are shared across reactions and reactors:

```lf-ts
main reactor Preamble {
  preamble {=
    function add42( i:number) {
      return i + 42;
    }
  =}
  timer t;
  reaction(t) {=
    let s = "42";
    let radix = 10;
    let i = parseInt(s, radix);
    console.log("Converted string " + s + " to number " + i);
    console.log("42 plus 42 is " + add42(42));
  =}
}
```

Not surprisingly, this will print:

```
Converted string 42 to number 42
42 plus 42 is 84
```

### Using Node Modules

Installing Node.js modules for TypeScript reactors with `npm` is essentially the same as installing modules for an ordinary Node.js program. First, write a Lingua Franca program (`Foo.lf`) and compile it. It may not type check if if you're [importing modules in the preamble](#preamble) and you haven't installed the modules yet, but compiling your program will cause the TypeScript code generator to [produce a project](#typescript-target-implementation-details) for your program. There should now be a package.json file in the same directory as your .lf file. Open a terminal and navigate to that directory. You can use the standard [`npm install`](https://docs.npmjs.com/cli/install) command to install modules for your TypeScript reactors.

The important takeaway here is with the package.json file and the compiled JavaScript in the Foo/dist/ directory, you have a standard Node.js program that executes as such. You can modify and debug it just as you would a Node.js program.

</div>

<div class="lf-rs warning">

FIXME: Add $preamble$ example.

</div>
