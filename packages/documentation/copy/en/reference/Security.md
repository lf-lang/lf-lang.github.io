---
title: "Security"
layout: docs
permalink: /docs/handbook/security
oneline: "Federated Execution with Security"
preamble: >
---

For the `C` target at least, federated execution is able to apply security with authentication by using HMAC authentication between RTI and federates. To enable this, include the `auth` property in your target specification, as follows:

```lf-c
target C {
    auth: true
};
```