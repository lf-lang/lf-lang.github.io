---
title: "Security"
layout: docs
permalink: /docs/handbook/security
oneline: "Federated Execution with Security"
preamble: >
---

The current implementation of federated execution lacks authentication of federates from joining the federation. Also communication security is not implemented to prevent adversarial federates sending malicious messages (e.g.. bad tags or bad sensor readings) to the RTI or other federates.

<div class="lf-cpp lf-py lf-ts lf-rs">

The $target-language$ target does not currently support the `auth` target option.

</div>

<div class="lf-c">

## Authentication

For the `C` target at least, federated execution is able to apply security with authentication by using HMAC authentication between RTI and federates. To enable this, include the `auth` property in your target specification, as follows:

```lf-c
target C {
    auth: true
};
```

The RTI bui0ld must include cmake options to enable simple HMAC-based authentication of federates. Add `-DAUTH=ON` option to the cmake command as shown below:

```bash
mkdir build && cd build
cmake -DAUTH=ON ../
make
sudo make install
```

If you would like to go back to non-AUTH mode, you would have to remove all contents of the `build` folder.

## Future Work

In the future, we will be able to use full-fledged authentication, for example, using different keys for each federate or using public-key cryptography for authentication. Also, we can try to apply different encryption and message authentication algorithms for each federate in the same federation, to support a federation with federates running on heterogeneous platforms where some of platforms have limited resources or capabilities.

### Communication Security

Communication security is to ensure confidentiality, integrity and message authenticity of the network messages between RTI and federates as well as among federates.




</div>