---
title: "Website Development"
layout: docs
permalink: /docs/handbook/website-development
oneline: "Development of the Lingua Franca website."
preamble: >
---

## Getting Started

First, for simple changes to the website, such as fixing typos, the easiest way is to scroll to the bottom of the page, follow the link at the bottom to send a pull request, edit the resulting page, and issue a pull request.

For more elaborate changes, including adding new pages, you will need to clone the [GitHub repository](https://github.com/lf-lang/website-lingua-franca). You can then set up your local clone to provide a local copy of the website at http://localhost:8000 by following the instructions in the [README file](https://github.com/lf-lang/website-lingua-franca/blob/main/README.md). This way, you can test your changes before issuing a pull request.

## Editing the Handbook

The handbook is the most updated part of the website and it includes quite a bit of infrastructure to support writing pages that describe features in any or all of the target languages. The root of the handbook pages in the `packages/documentation` part of the repo. That directory has a useful [README file](https://github.com/lf-lang/website-lingua-franca/blob/main/packages/documentation/README.md) that describes the structure and provides instructions for inserting code examples in any target language and target-specific text within a body of target-independent text.
