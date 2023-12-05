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
      "id": "Introduction"
    },
    {
      "type": "doc",
      "id": "installation"
    },
    {
      "type": "doc",
      "id": "Tutorial Videos"
    },
    {
      "type": "category",
      "label": "Writing Reactors",
      "collapsible": true,
      "collapsed": true,
      "items": [
        {
          "type": "doc",
          "id": "writing-reactors/A First Reactor"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Inputs and Outputs"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Parameters and State Variables"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Time and Timers"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Composing Reactors"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Reactions"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Reaction Declarations"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Methods"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Causality Loops"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Extending Reactors"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Actions"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Superdense Time"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Modal Models"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Deadlines"
        },

        {
          "type": "doc",
          "id": "writing-reactors/Multiports and Banks"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Generics"
        },

        {
          "type": "doc",
          "id": "writing-reactors/Preambles"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Distributed Execution"
        },
        {
          "type": "doc",
          "id": "writing-reactors/Termination"
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
          "id": "tools/Code Extension"
        },
        {
          "type": "doc",
          "id": "tools/Epoch IDE"
        },
        {
          "type": "doc",
          "id": "tools/Command Line Tools"
        },
        {
          "type": "doc",
          "id": "tools/Troubleshooting"
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
          "id": "reference/Expressions"
        },
        {
          "type": "doc",
          "id": "reference/Target Language Details"
        },
        {
          "type": "doc",
          "id": "reference/Target Declaration"
        },
        {
          "type": "doc",
          "id": "reference/Tracing"
        },
        {
          "type": "doc",
          "id": "reference/Containerized Execution"
        },
        {
          "type": "doc",
          "id": "reference/Security"
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
          "id": "embedded/Arduino"
        },
        {
          "type": "doc",
          "id": "embedded/Zephyr"
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
          "id": "developer/Contributing"
        },
        {
          "type": "doc",
          "id": "developer/Developer Eclipse Setup with Oomph"
        },
        {
          "type": "doc",
          "id": "developer/Developer IntelliJ Setup"
        },
        {
          "type": "doc",
          "id": "developer/Downloading and Building"
        },
        {
          "type": "doc",
          "id": "developer/Regression Tests"
        },
        {
          "type": "doc",
          "id": "developer/Running Benchmarks"
        },
        {
          "type": "doc",
          "id": "developer/Website Development"
        }
      ]
    }
  ]
};

export default sidebars;
