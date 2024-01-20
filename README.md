# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Deployment
When your changes are ready to be reviewed, push the changes to your fork or to a feature branch and then open a pull request on GitHub. After review, when your changes get merged, they will get deployed to [https://lf-lang.org/](https://lf-lang.org/) using GitHub Actions.

In our [deployment workflow](https://github.com/lf-lang/lf-lang.github.io/blob/main/.github/workflows/deploy.yml), we simply run:
```
$ yarn build
```
This generates static content in the `build` directory, which gets served using GitHub's static contents hosting service, GitHub Pages.
