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
      <p>Our Visual Studio Code extension is available on the <
        a href="https://marketplace.visualstudio.com/items?itemName=lf-lang.vscode-lingua-franca">Visual Studio Marketplace</a
        > and <a href="https://open-vsx.org/extension/lf-lang/vscode-lingua-franca">VSX Registry</a>.
        To install this extension from the marketplace, launch VS Code Quick Open (<kbd>Ctrl</kbd> + <kbd>P</kbd>) and enter:<p><code>ext install lf-lang.vscode-lingua-franca</code></p>
      </p><p>  
        You can also run:
        <p><code>code --install-extension lf-lang.vscode-lingua-franca</code></p> in your terminal to install the extension. To use the nightly pre-release of the extension instead of the latest release, find the Lingua Franca extension in the Extensions tab and click on the "Switch to Pre-Release Version" button.
      </p>
      See <a href="/docs/handbook/code-extension">more details</a>.
    </div>

    <div className="raised main-content-block">
      <h2 id="download-epoch">Epoch IDE</h2>
      <p>To install Epoch, open your terminal (in Windows, use WSL), and run the following command:
        <p><code>curl -Ls https://install.lf-lang.org | sh -s epoch</code></p>
      </p>
      <p>If your <code>PATH</code> is configured correctly, you should be able start Epoch by running the <code>epoch</code> command in your terminal.</p>
      See <a href="/docs/handbook/epoch-ide">more details</a>.
    </div>

    <div className="raised main-content-block">
      <h2 id="download-cl">CLI Tools</h2>
      <p>To install the Lingua Franca command line tools, open your terminal (in Windows, use WSL), and run the following command:
      <p><code>curl -Ls https://install.lf-lang.org | sh -s cli</code></p>
      </p>
      See <a href="/docs/handbook/command-line-tools">more details</a>.
    </div>

    <div className="raised main-content-block">
      <h2 id="developer">Developer Setup</h2>
      <p>If you'd like to contribute to Lingua Franca and build our toolchain on your own, you can find details about the recomended developer setup <a href="/docs/handbook/developer-setup">here</a>.</p>
    </div>


  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>

/*
<QuickJump title="Learning Resources" lang={props.pageContext.lang} />
 <p>Some of code generator components are written in Kotlin, which is not supported by Eclipse.</p>
          <p>If you want a Kotlin-friendly developer environment using IntelliJ, you can follow the Developer IntelliJ Setup instructions to set it up.</p>
          <p>To build the Lingua Franca IDE (Epoch) with Kotlin-based code generators enabled (which is not possible with the Eclipse setup), please see the instructions in Running Lingua Franca IDE (Epoch) with Kotlin based Code Generators Enabled (without Eclipse Environment).</p>
 */
