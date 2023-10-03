import * as React from "react"
import { Intl } from "../../components/Intl"
import { Layout } from "../../components/layout"

type Props = {
  pageContext: any
  b: NewableFunction
}

const Index: React.FC<Props> = (props) => {

  return <Layout title="How to set up Lingua Franca" description="Use Lingua Franca" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <h1>Download and Install Lingua Franca</h1>
      <p>
        The Lingua Franca toolchain requires Java 17 (<a href="https://www.oracle.com/java/technologies/downloads/">download from Oracle</a>).
        Each target language may have additional requirements (see the <a href="/docs/handbook/target-language-details#requirements">Target Language Details</a> page and select your target language).
      </p>
      <p>
      You can use Lingua Franca:
        <ul>
          <li><a href="#vscode">in Visual Studio Code, using our extension</a></li>
          <li><a href="#download-epoch">using Epoch, an Eclipse-based IDE</a></li>
          <li><a href="#download-cl">using the command line</a></li>
        </ul>
        You can also spin up one of our pre-configured Cloud-based dev environments:<br/>
        <table>
            <tr>
            <td>
            <a href="https://gitpod.io/new#https://github.com/lf-lang/playground-lingua-franca/tree/main"><img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in GitPod"/></a>
            </td>
            <td>
                &nbsp;&nbsp;
            </td>
            <td>
            <a href="https://github.com/codespaces/new?hide_repo_select=true&repo=477928779&ref=main&skip_quickstart=true&devcontainer_path=.devcontainer%2Fnightly%2Fdevcontainer.json"><img src="https://github.com/codespaces/badge.svg" alt="Open in GitHub Codespaces"/></a><br/>
            </td>
            </tr>
        </table>
        Have a look at <a href="https://github.com/lf-lang/playground-lingua-franca">the Lingua Franca playground</a> for more details. 
      </p>
    </div>
    <div className="raised main-content-block">
    <h2 id="vscode">Visual Studio Code</h2>
      <p>Our Visual Studio Code extension can be installed via the Marketplace or built from source, as detailed below.
         See the <a href="/docs/handbook/code-extension">handbook</a> for usage instructions.
      </p>
      <div style={{borderTop: "1px lightgray solid"}}>
        <h3>Marketplace</h3>
        <p>The Lingua Franca extension is available on the <a href="https://marketplace.visualstudio.com/items?itemName=lf-lang.vscode-lingua-franca">Visual Studio Marketplace</a> and the <a href="https://open-vsx.org/extension/lf-lang/vscode-lingua-franca">VSX Registry</a>. To install the extension, open VS Code, launch Quick Open (<kbd>Ctrl</kbd> + <kbd>P</kbd>) and enter:
          <p><code>ext install lf-lang.vscode-lingua-franca</code></p>
        </p><p>
          Alternatively, you can run the following command in your terminal:
          <p><code>code --install-extension lf-lang.vscode-lingua-franca</code></p>
        </p><p>To use the nightly pre-release of the extension instead of the latest release, find the Lingua Franca extension in the Extensions tab and click on the "Switch to Pre-Release Version" button.</p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>From Source</h3>
          <p>Please refer to the <a href="https://github.com/lf-lang/vscode-lingua-franca">Lingua Franca VS Code GitHub repository</a> for build instructions.</p>
      </div>
    </div>

    <div className="raised main-content-block">
        <h2 id="download-epoch">Epoch IDE</h2>
        <p>There are multiple options available for installing Epoch as listed below. See the <a href="docs/handbook/epoch-ide">handbook</a> for usage instructions.</p>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>Install Script</h3>
          <p>Run the following command in your terminal to install the latest release (on Windows, use WSL):
              <p><code>curl -Ls https://install.lf-lang.org | sudo sh -s epoch</code></p>
          </p>
          <p>You can also install the nightly pre-release:
              <p><code>curl -Ls https://install.lf-lang.org | sudo sh -s epoch nightly</code></p>
          </p>
          <p>You can use the <code>--prefix=&lt;path&gt;</code> argument to change the default install location.</p>
          <p>You may not need the <code>sudo</code> part if you have permission to write to the install location.</p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>AUR</h3>
          <p>There are binary packages available in the Arch user repository, which you can install using your favorite AUR helper. For instance, with <code>yay</code>:
              <p><code>yay -S epoch-bin</code></p>
          or for the nightly pre-release:
              <p><code>yay -S epoch-nightly-bin</code></p>
          </p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>Manual Download</h3>
          <p>Regular and nightly release builds of Epoch can be downloaded from the <a href="https://github.com/lf-lang/epoch/releases">Epoch release page</a>. Download the archive that matches your OS and architecture, and extract the contents.</p>
          <p>MacOS requires extra steps before being able to execute the app:
              <p><code>xattr -cr Epoch.app</code></p>
              To install, drag the Epoch.app file to your Applications folder. You can then invoke the app as follows:
              <p><code>open -a Epoch.app</code></p>
          </p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>From Source</h3>
          <p>Please refer to the <a href="https://github.com/lf-lang/epoch">Epoch GitHub repository</a> for build instructions.</p>
      </div>
    </div>

    <div className="raised main-content-block">
      <h2 id="download-cl">CLI Tools</h2>
      <p>There are multiple options available for installing the Lingua Franca compiler and other command line tools, as listed below. See the <a href="docs/handbook/command-line-tools">handbook</a> for usage instructions.</p>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>Install Script</h3>
          <p>Run the following command in your terminal to install the latest release (on Windows, use WSL):
              <p><code>curl -Ls https://install.lf-lang.org | sh -s cli</code></p>
          </p>
          <p>You can also install the nightly pre-release:
              <p><code>curl -Ls https://install.lf-lang.org | sh -s cli nightly</code></p>
          </p>
          <p>You can use the <code>--prefix=&lt;path&gt;</code> argument to change the default install location.</p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>AUR</h3>
    <p>There are binary packages available in the Arch user repository, which you can install using your favorite AUR helper. For instance, with <code>yay</code>:
              <p><code>yay -S lf-cli-bin</code></p>
          or for the nightly pre-release:
              <p><code>yay -S lf-cli-nightly-bin</code></p>
          </p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>Manual Download</h3>
          <p>Regular and nightly release builds of the command line tools can be downloaded from the <a href="https://github.com/lf-lang/lingua-franca/releases">Lingua Franca release page</a>. Download the archive that matches your OS and architecture, and extract the contents.</p>
      </div>
      <div style={{borderTop: "1px lightgray solid"}}>
          <h3>From Source</h3>
          <p>Please refer to the <a href="https://github.com/lf-lang/lingua-franca">Lingua Franca GitHub repository</a> for build instructions.</p>
          <p>If you'd like to contribute to Lingua Franca, you can find details about the recommended developer setup <a href="/docs/handbook/developer-setup">here</a>.</p>
      </div>
    </div>

  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
