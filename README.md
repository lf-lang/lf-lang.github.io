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

### Versioning
Instructions for "freezing" the current docs and filing them under a version number, can be found [here](https://docusaurus.io/docs/versioning). Normally, the steps are:

```
git switch main
git pull
git checkout -b v<major>.<minor>.<patch>
yarn docusaurus docs:version <major>.<minor>.<patch>
git add versioned_docs/*
git add versioned_sidebars/*
git commit -a -m 'Docs v<major>.<minor>.<patch>'
git push --set-upstream origin v<major>.<minor>.<patch>
```

You should then merge the versioned docs back into `main`:

```
git switch main
git merge v<major>.<minor>.<patch>
```

### Adding Publications
To add a new publication, add a new entry to `src/components/Publications/copypasta.tsx` file and to the `src/components/Publications/citations.bib` file.

## Building Static Pages
To build pages that are ordinary HTML pages that can be read directly by a browser rather than served by a server, you can use any of the following commands:

```
npm run build:static:c
npm run build:static:p
npm run build:static:rs
npm run build:static:cpp
npm run build:static:ts
```
The static pages end up in a `build` directory with subdirectories `docs/next` for the nightly build version and `docs/0.*.*` for archived version docs.

