---
title: "Preambles and Methods"
layout: docs
permalink: /docs/handbook/preambles-and-methods
oneline: "Defining functions and methods in Lingua Franca."
preamble: >
---

$page-showing-target$

## Preamble

Reactions may contain arbitrary target-language code, but often it is convenient for that code to invoke external libraries or to share procedure definitions. For either purpose, a reactor may include a $preamble$ section.

<div class="lf-c">

For example, the following reactor uses the common `stdlib` C library to convert a string to an integer:

```lf-c
main reactor {
    preamble {=
        #include <stdlib.h>
    =}
    timer t;
    reaction(t) {=
        char* s = "42";
        int i = atoi(s);
        printf("Converted string %s to int %d.\n", s, i);
    =}
}
```

This will print:

```
Converted string 42 to int 42.
```

By putting the `#include` in the $preamble$, the library becomes available in all reactions of this reactor. Oddly, it also becomes available in all subsequently defined reactors in the same file or in files that include this file.

You can also use the $preamble$ to define functions that are shared across reactions and reactors, as in this example:

```lf-c
main reactor {
    preamble {=
        int add_42(int i) {
            return i + 42;
        }
    =}
    timer t;
    reaction(t) {=
        printf("42 plus 42 is %d.\n", add_42(42));
    =}
}
```

Not surprisingly, this will print:

```
42 plus 42 is 84.
```

A $preamble$ can also be put outside the $reactor$ definition.
Currently, in the C target, it makes no difference whether it is put inside or outside.

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

It defines both, a public and a private preamble. The public preamble defines the type MyStruct. This type definition will be visible to all elements of the
Preamble reactor as well as to all reactors defined in files that import Preamble. The private preamble defines the function `add_42(int i)`.
This function will only be usable to reactions within the Preamble reactor.

You can think of public and private preambles as the equivalent of header files and source files in C++. In fact, the public preamble will be translated to a
header file and the private preamble to a source file. As a rule of thumb, all types that are used in port or action definitions as well as in state variables
or parameters should be defined in a public preamble. Also declarations of functions to be shared across reactors should be placed in the public preamble.
Everything else, like function definitions or types that are used only within reactions should be placed in a private preamble.

Note that preambles can also be specified on the file level. These file level preambles are visible to all reactors within the file.
An example of this can be found in [PreambleFile.lf](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/target/PreambleFile.lf).

Admittedly, the precise interactions of preambles and imports can become confusing. The preamble mechanism will likely be refined in future revisions.

Note that functions defined in the preamble cannot access members such as state variables of the reactor unless they are explicitly passed as arguments.
If access to the inner state of a reactor is required, [methods](#Methods) present a viable and easy to use alternative.

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

```bash
Converted string 42 to int 42.
42 plus 42 is 84
Your platform is Linux
```

By putting import in the $preamble$, the module becomes available in all reactions of this reactor using the `self` modifier.

**Note:** Preambles will be put in the generated Python class for the given reactor, and thus is part of the instance of the reactor. This means that anything you put in the preamble will be specific to a particular reactor instance and cannot be used to share information between different instantiations of the reactor (this is a feature, not a bug, because it helps ensure determinacy). For more information about implementation details of the Python target, see [Implementation Details](/docs/handbook/target-language-reference#python-target-implementation-details).

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
        elapsed_time = get_elapsed_logical_time()
        print(f"A time {elapsed_time} nsec after start, received: ", a.value)
    =}

    reaction(t) {=
        print("Waiting ...")
    =}
}
```

Within the $preamble$, we specify to import the `threading` Python module and define a function that will be started in a separate thread in the reaction to $startup$. The thread function named `external` blocks when `input()` is called until the user types something and hits the return or enter key. Usually, you do not want a Lingua Franca program to block waiting for input. In the above reactor, a $timer$ is used to repeatedly trigger a reaction that reminds the user that it is waiting for input.

</div>

<div class="lf-ts lf-rs warning">

FIXME: Add $preamble$ example.

</div>

## Methods

<div class="lf-c lf-py lf-ts lf-rs">

Methods are not currently implemented in the $target-language$ target.

</div>

<div class="lf-cpp">

### Using Methods

Sometimes reactors need to perform certain operations on state variables and/or parameters that are shared between reactions or that are too complex to
be implemented in a single reaction. In such cases, methods can be defined within reactors to facilitate code reuse and enable a better structuring of the
reactor's functionality. Analogous to class methods, methods in LF can access all state variables and parameters, and can be invoked from all reaction
bodies or from other methods. Consdider the [Method](https://github.com/lf-lang/lingua-franca/blob/master/test/Cpp/src/target/Method.lf) example:

```lf-cpp
main reactor {
    state foo:int(2);

    const method get_foo(): int {=
        return foo;
    =}

    method add(x:int) {=
        foo += x;
    =}

    reaction(startup){=
        std::cout << "Foo is initialized to " << get_foo() << std::endl;
        add(40);
        std::cout << "2 + 40 = " << get_foo() << std::endl;
    =}
}
```

This reactor defines two methods `get_foo` and `add`. `get_foo` is quailfied as a const method, which indicates that it has read-only access to the
state variables. This is direclty translated to a C++ const method in the code generation process. `get_foo` receives no arguments and returns an integer
(`int`) indicating the current value of the `foo` state variable. `add` returns nothing (`void`) and receives one interger argument, which it uses to
increment `foo`. Both methods are visible in all reactions of the reactor. In this example, the reactio to startup calles both methods in order ro read
and modify its state.

</div>
