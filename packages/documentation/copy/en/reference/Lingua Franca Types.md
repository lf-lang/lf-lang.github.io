---
title: "Lingua Franca Types"
layout: docs
permalink: /docs/handbook/lingua-franca-types
oneline: "Types in Lingua Franca."
preamble: >
---

Type annotations may be written in many places in LF, including [parameter declarations](#Parameter-declaration), [state variable declarations](#State-declaration), [input](#Input-declaration) and [output declarations](#Output-declaration). In some targets, they are required, because the target language requires them too.

Assigning meaning to type annotations is entirely offloaded to the target compiler, as LF does not feature a type system (yet?). However, LF's syntax for types supports a few idioms that have target-specific meaning. Types may have the following forms:

- the **time** type is reserved by LF, its values represent time durations. The **time** type accepts _time expressions_ for values, eg `100 msec`, or `0` (see [Basic expressions](#basic-expressions) for a reference).
- identifiers are valid types (eg `int`, `size_t`), and may be followed by type arguments (eg `vector<int>`).
- the syntactic forms `type[]` and `type[integer]` correspond to target-specific array types. The second form is available only in languages which support fixed-size array types (eg in C++, `std::array<5>`).
- the syntactic form `{= some type =}` allows writing an arbitrary type as target code. This is useful in target languages which have complex type grammar (eg in TypeScript, `{= int | null =}`).

Also note that to use strings conveniently in the C target, the "type" `string` is an alias for `{=char*=}`.

(Types ending with a `*` are treated specially by the C target. See [Sending and Receiving Arrays and Structs](Writing-Reactors-in-C#sending-and-receiving-arrays-and-structs) in the C target documentation.)
