---
title: Installation
---

# Installation

The Lingua Franca toolchain requires Java 17 ([download from Oracle](https://www.oracle.com/java/technologies/downloads/)). Each target language may have additional requirements (see the [Target Language Details](<./reference/target-language-details.mdx#requirements>) page and select your target language).

You can use Lingua Franca:

- [in Visual Studio Code, using our extension](#visual-studio-code)
- [using the command line](#cli-tools)

You can also spin up one of our pre-configured Cloud-based dev environments:

[![Gitpod Link](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/new#https://github.com/lf-lang/playground-lingua-franca/tree/main)

[![GH Codespace](https://github.com/codespaces/badge.svg)](<https://github.com/codespaces/new?hide_repo_select=true&repo=477928779&ref=main&skip_quickstart=true&devcontainer_path=.devcontainer%2Fnightly%2Fdevcontainer.json>)

Have a look at the [Lingua Franca playground](https://github.com/lf-lang/playground-lingua-franca) for more details.

## Visual Studio Code

Our Visual Studio Code extension can be installed via the Marketplace or built from source, as detailed below. See the [handbook](./tools/code-extension.mdx) for usage instructions.

### Marketplace

The Lingua Franca extension is available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=lf-lang.vscode-lingua-franca) and the [VSX Registry](https://open-vsx.org/extension/lf-lang/vscode-lingua-franca). To install the extension, open VS Code, launch Quick Open (<kbd>Ctrl</kbd> + <kbd>P</kbd>) and enter:

```
ext install lf-lang.vscode-lingua-franca
```

Alternatively, you can run the following command in your terminal:

```
code --install-extension lf-lang.vscode-lingua-franca
```

To use the nightly pre-release of the extension instead of the latest release, find the Lingua Franca extension in the Extensions tab and click on the "Switch to Pre-Release Version" button.

### From Source

Please refer to the [Lingua Franca VS Code GitHub repository](https://github.com/lf-lang/vscode-lingua-franca) for build instructions.


## CLI Tools

There are multiple options available for installing the Lingua Franca compiler and other command line tools, as listed below. See the [handbook](./tools/command-line-tools.mdx) for usage instructions.

### Install Script

Run the following command in your terminal to install the latest release (on Windows, use WSL):

```
curl -Ls https://install.lf-lang.org | bash -s cli
```

You can also install the nightly pre-release:

```
curl -Ls https://install.lf-lang.org | bash -s cli nightly
```

You can use the `--prefix=<path>` argument to change the default install location.

### AUR

There are binary packages available in the Arch user repository, which you can install using your favorite AUR helper. For instance, with `yay`:

```
yay -S lf-cli-bin
```

or for the nightly pre-release:

```
yay -S lf-cli-nightly-bin
```

### Nix and NixOS

The Lingua Franca compiler is packaged in [nixpkgs](https://github.com/NixOS/nixpkgs/blob/nixos-23.11/pkgs/development/compilers/lingua-franca/default.nix#L28) and is available via the binary cache.

Run
```
 nix shell nixpkgs#lingua-franca
```
to temporarily install `lfc` in your current shell environment.

### Manual Download

Regular and nightly release builds of the command line tools can be downloaded from the [Lingua Franca release page](https://github.com/lf-lang/lingua-franca/releases). Download the archive that matches your OS and architecture, and extract the contents.

### From Source

If you would like to build from source or contribute to Lingua Franca, you can find further instructions in the [developer section](./developer/downloading-and-building.mdx).


## Lingo

Lingo is the package manager and build tool of the Lingua Franca ecosystem. It is currently under 
development and is not yet fully stabilized. The latest information can be found in the 
[Lingo Github Repository](https://github.com/lf-lang/lingo).

Assuming that `~/.cargo/bin` is on your `$PATH`, you can install `lingo` using the following command:


```
    cargo install lingua-franca
```
