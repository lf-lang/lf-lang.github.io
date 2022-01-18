import * as React from "react"
import { Intl } from "../../components/Intl"
import { createIntlLink } from "../../components/IntlLink"
import { Layout } from "../../components/layout"
import { QuickJump } from "../../components/QuickJump"
import releaseInfo from "../../lib/release-info.json"


type Props = {
  pageContext: any
  b: NewableFunction
}

const Index: React.FC<Props> = (props) => {
  const Link = createIntlLink(props.pageContext.lang)

  return <Layout title="How to set up Lingua Franca" description="Use Lingua Franca" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <h1>Using Lingua Franca</h1>
      <p>To get started with Lingua Franca immediately, download Epoch (our IDE) and/or lfc (our command-line compiler) from one of the following releases:</p>
      <ul>
            <li>
              <a href="https://github.com/lf-lang/lingua-franca/releases/tag/nightly">Nightly Build</a>
            </li>
            <li>
            <a href="https://github.com/lf-lang/lingua-franca/releases/tag/v0.1.0-alpha">Version 0.1.0-alpha</a>
            </li>
      </ul>
      <p>IMPORTANT NOTE: MacOS will report that lflang.app is broken because it was not signed. To execute it, please run</p>
      <p><code>xattr -cr epoch.app</code></p>
      <p>first on the command line. Eventually, we will provide a signed download.</p>
      <p>If you plan to just use the command-line compiler, you may want a language plugin for Vim and Neovim. See the installation instructions.</p>
    </div>

    <div className="raised main-content-block">
      <h2>Working from the Git Repository</h2>
      <p>If you plan to contribute to Lingua Franca, or if you want to keep up to date as the project evolves, you will need to work from the git repository on GitHub. There are several ways to do this:</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Recommended</h3>
          <h4>Oomph setup for Eclipse:</h4> 
          <p>Follow the Developer Eclipse setup with Oomph instructions.</p>
        </div>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Clone and Build</h3>
          <p>You can Clone the Repository and build manually using gradle or maven.</p>
          <ul>
            <li>
            Gradle: <code>./gradlew assemble</code> (the build also performs tests, which takes a long time)
            </li>
            <li style={{ marginTop: "20px" }}>
            Maven: <code>mvn compile</code> (you need to install Maven first)
            </li>
          </ul>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Kotlin</h3>
          <p>Some of code generator components are written in Kotlin, which is not supported by Eclipse.</p>
          <p>If you want a Kotlin-friendly developer environment using IntelliJ, you can follow the Developer IntelliJ Setup (for Kotlin) instructions to set it up.</p> 
          <p>To build the Lingua Franca IDE (Epoch) with Kotlin-based code generators enabled (which is not possible with the Eclipse setup), please see the instructions in Running Lingua Franca IDE (Epoch) with Kotlin based Code Generators Enabled (without Eclipse Environment).</p>
         </div>
      </section>
    </div >

  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
