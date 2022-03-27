---
title: "Methods"
layout: docs
permalink: /docs/handbook/methods
oneline: "Methods in Lingua Franca."
preamble: >
---

## Method Declaration

A method declaration has one of the forms:

> **method** _name_();  
> **method** _name_():_type_;  
> **method** _name_(_arg1_name_:arg1*type, \_arg2_name*:arg2*type, ...);
> **method** \_name*(_arg1_name_:arg1*type, \_arg2_name*:arg2*type, ...):\_type*;

The first form defines a method with no arguments and no return value. The second form defines a method with the return type _type_ but no arguments. The third form defines a method with arguments given by their name and type, but without a return value. Finally, the fourth form is similar to the third, but adds a return type.

The **method** keywork can optionally be prefixed with the **const** qualifier, which indicates that the method is "read-only". This is relvant for some target languages such as C++.

See the [C++ documentation](https://github.com/lf-lang/lingua-franca/wiki/Writing-Reactors-in-Cpp#using-methods) for a usage example.
