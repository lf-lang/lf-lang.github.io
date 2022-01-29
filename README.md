# The Lingua Franca website

## Getting Started

This repo uses [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) with node 16, and [watchman](https://facebook.github.io/watchman/docs/install.html). 

(Windows users can install [watchman via chocolatey](https://chocolatey.org/packages/watchman)) 

For switching to Node Version 16, consult this [repo](https://github.com/nvm-sh/nvm) for Linux and Mac and this [repo](https://github.com/coreybutler/nvm-windows) for Windows.

With set up done on each of your local machines, clone this repo and run the following commands.

```sh
yarn install
code .

# Then:
yarn bootstrap

# Now you can start up the website
yarn start
```

Working on this repo is done by running `yarn start` - this starts up the website on port `8000` and creates a
builder worker for every package in the repo, so if you make a change outside of the site it will compile and lint etc.

Some useful knowledge you need to know:

- All packages have: `yarn build` and `yarn test`
- All packages use [debug](https://www.npmjs.com/package/debug) - which means you can do `env DEBUG="*" yarn test` to get verbose logs

Working on this repo is done by running `yarn start` -- this starts up the website on port `8000` and creates a
builder worker for every package in the repo, so if you make a change outside of the site it will compile.

## Deployment

Deployment is TBD

## Docs

If you want to know _in-depth_ how the framework behind this website was _originally_ architected, see [this YouTube video](https://www.youtube.com/watch?v=HOvivt6B7hE).

# Website Packages

## lingua-franca

The main website for Lingua Franca, a Gatsby website which is statically deployed. You can run it via:

```sh
yarn start
```

To optimize even more, the env var `NO_TRANSLATIONS` as truthy will make the website only load pages for English.

## Documentation

## Handbook

TODO: Add some guidance on how to edit the handbookm how to create new pages, etc.

### Epub

An epub file is automatically generated from the handbook files and is published [here](https://www.lf-lang.github.io/assets/lingua-franca-handbook.epub).

# Contributing

### TODO

# Legal Notices

### TODO

