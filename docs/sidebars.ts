import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  handbookSidebar: [
    {
      "type": "doc",
      "id": "introduction"
    },
    {
      "type": "doc",
      "id": "installation"
    },
    {
      "type": "doc",
      "id": "tutorial-videos"
    },
    {
      "type": "category",
      "label": "Writing Reactors",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "writing-reactors/a-first-reactor"
        },
        {
          "type": "doc",
          "id": "writing-reactors/inputs-and-outputs"
        },
        {
          "type": "doc",
          "id": "writing-reactors/parameters-and-state-variables"
        },
        {
          "type": "doc",
          "id": "writing-reactors/time-and-timers"
        },
        {
          "type": "doc",
          "id": "writing-reactors/composing-reactors"
        },
        {
          "type": "doc",
          "id": "writing-reactors/reactions"
        },
        {
          "type": "doc",
          "id": "writing-reactors/reaction-declarations"
        },
        {
          "type": "doc",
          "id": "writing-reactors/methods"
        },
        {
          "type": "doc",
          "id": "writing-reactors/causality-loops"
        },
        {
          "type": "doc",
          "id": "writing-reactors/extending-reactors"
        },
        {
          "type": "doc",
          "id": "writing-reactors/actions"
        },
        {
          "type": "doc",
          "id": "writing-reactors/superdense-time"
        },
        {
          "type": "doc",
          "id": "writing-reactors/modal-models"
        },
        {
          "type": "doc",
          "id": "writing-reactors/deadlines"
        },

        {
          "type": "doc",
          "id": "writing-reactors/multiports-and-banks"
        },
        {
          "type": "doc",
          "id": "writing-reactors/generics"
        },

        {
          "type": "doc",
          "id": "writing-reactors/preambles"
        },
        {
          "type": "doc",
          "id": "writing-reactors/distributed-execution"
        },
        {
          "type": "doc",
          "id": "writing-reactors/termination"
        },
      ]
    },
    {
      "type": "category",
      "label": "Tools",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "tools/code-extension"
        },
        {
          "type": "doc",
          "id": "tools/epoch-ide"
        },
        {
          "type": "doc",
          "id": "tools/command-line-tools"
        },
        {
          "type": "doc",
          "id": "tools/troubleshooting"
        }
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "reference/expressions"
        },
        {
          "type": "doc",
          "id": "reference/target-language-details"
        },
        {
          "type": "doc",
          "id": "reference/target-declaration"
        },
        {
          "type": "doc",
          "id": "reference/tracing"
        },
        {
          "type": "doc",
          "id": "reference/containerized-execution"
        },
        {
          "type": "doc",
          "id": "reference/security"
        },
      ]
    },
    {
      "type": "category",
      "label": "Embedded Platforms",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "embedded/arduino"
        },
        {
          "type": "doc",
          "id": "embedded/zephyr"
        }
      ]
    },
    {
      "type": "category",
      "label": "Developer",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "developer/contributing"
        },
        {
          "type": "doc",
          "id": "developer/developer-eclipse-setup-with-oomph"
        },
        {
          "type": "doc",
          "id": "developer/developer-intellij-setup"
        },
        {
          "type": "doc",
          "id": "developer/downloading-and-building"
        },
        {
          "type": "doc",
          "id": "developer/regression-tests"
        },
        {
          "type": "doc",
          "id": "developer/running-benchmarks"
        },
        {
          "type": "doc",
          "id": "developer/website-development"
        }
      ]
    }
  ]
};

export default sidebars;
