---
title: "Security"
layout: docs
permalink: /docs/handbook/security
oneline: "Federated Execution with Security"
preamble: >
---

The current implementation of federated execution lacks authentication of federates from joining the federation. Also communication security is not implemented to prevent adversarial federates sending malicious messages (e.g.. bad tags or bad sensor readings) to the RTI or other federates.

For the `C` target at least, federated execution is able to apply security with authentication by using HMAC authentication between RTI and federates. To enable this, include the `auth` property in your target specification, as follows:

```lf-c
target C {
    auth: true
};
```