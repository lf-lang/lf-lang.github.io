---
title: "Security"
layout: docs
permalink: /docs/handbook/security
oneline: "Secure Federated Execution"
preamble: >
---

### Warning: This part is under construction. Users should not expect federations are secure applying this property.

By default, there is no secure authentication happening when a federate joins a federation, and data exchanged by federates is not encrypted. The `auth` target property can be used to change this.

<div class="lf-cpp lf-py lf-ts lf-rs">

The $target-language$ target does not currently support the `auth` target option.

</div>

<div class="lf-c">

## Authentication

For the `C` target, federated execution is able to apply security with authentication by using HMAC authentication between RTI and federates. To enable this, include the `auth` property in your target specification, as follows:

```lf-c
target C {
    auth: true
};
```

The RTI build must include CMake options to enable simple HMAC-based authentication of federates. Add `-DAUTH=ON` option to the CMake command as shown below:

```bash
mkdir build && cd build
cmake -DAUTH=ON ../
make
sudo make install
```

If you would like to go back to non-AUTH mode, you would have to remove all contents of the `build` folder.

</div>