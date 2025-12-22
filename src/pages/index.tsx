import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate, { translate } from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import HomepageFeatures, {
  TwoColumns,
} from "@site/src/components/HomepageFeatures";
import { CodeContainer } from '@site/src/components/HomepageSlider';
import Logo from "@site/static/img/lf-logo.svg";

import styles from "./index.module.css";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
      {/* <CodeContainer className={styles.heroLogo} /> */}
        <Heading as="h1" className={styles.heroProjectTagline}>
        {/* <Logo className={styles.heroLogo} height="350px" width="350px" role="img" /> */}
        <img src="/img/XmasLF.png" className={styles.heroLogo} width="600px" alt="Lingua Franca logo" />
          <span
            className={styles.heroTitleTextHtml}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: translate({
                id: "homepage.hero.title",
                message:
                  "Build predictable <b>concurrent</b>, <b>time-sensitive</b>, and <b>distributed</b> systems.",
                description:
                  "Home page hero title, can contain simple html tags",
              }),
            }}
          />
          {/* #78cc2a */}
        </Heading>
        
        <div className={styles.subHero}>
            <br/>
            <Translate>
            Lingua Franca is a coordination language for efficient, deterministic,
            multi-threaded, time-sensitive, embedded, and distributed programs. The result of decades
            of research, it offers more repeatable behavior than other concurrent programming
            frameworks, including threads, pub-sub, actors, and service-oriented architectures.
            </Translate>
        </div>
        <div className={styles.indexCtas}>
          <Link className="button button--primary" to="/docs/installation">
            <Translate>Get Started</Translate>
          </Link>
          <Link className="button button--info" to="/docs/">
            <Translate>Read the Docs</Translate>
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=lf-lang&amp;repo=lingua-franca&amp;type=star&amp;count=true&amp;size=large"
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

const Intro = (): JSX.Element => (
  <TwoColumns
    alt
    col1={<CodeContainer />}
    col2={
      <div className={clsx(styles.topMarginIfCol6BecameVertical)}>
        <Heading as="h2">
          <Translate>A New Programming Paradigm</Translate>
        </Heading>
        <Translate>
          Lingua Franca is the first reactor-oriented coordination language.
          It allows you to specify reactive components and compose them.
          Lingua Franca eliminates race conditions by construction, makes it easy to specify timed behavior, and removes the need to perform manual synchronization.
        </Translate>
        <br/><br/>
        <Translate>
          Consider a game of "rock paper scissors" where two players need to reveal their choice simultaneously. In Lingua Franca, "at the same time" has a clear and precise meaning.
          This makes the implementation simple and intuitive, and guarantees it to be fair. If the Player class were to observe the other's choice before revealing its own, Lingua Franca's causality analysis would find a causality loop and tell you that the program is invalid.
        </Translate>
        <br/><br/>
        <Heading as="h2">
          <Translate>Not a New Programming Language</Translate>
        </Heading>
        <Translate>
          With Lingua Franca, you forget about thread libraries or message passing middlewares, but you continue using the languages you like. The bodies of reactive code that make up the functionality
          of reactors are written in the programming language of your choice. We currently support C, C++, Python, TypeScript, and Rust.
        </Translate>
      </div>
    }
  />
);

import WorldMap from "@site/static/img/world-map.svg";
import UniversitiesForDark from "@site/static/img/universities-fordark.svg";
import UniversitiesForLight from "@site/static/img/universities.svg";

import clsx from "clsx";

const Contributors = (): JSX.Element => (
  <TwoColumns
    col1={
      <>
        <Heading as="h2">
          <Translate>Open-source and Supported by Research</Translate>
        </Heading>
        <Translate>
          Lingua Franca was first developed at UC Berkeley where it was influenced by decades worth of research in models of computation.
        </Translate>
        <br/>
        <div className={clsx(styles.universityContainer)}>
          <UniversitiesForDark className={clsx(styles.showInDarkThemeOnly)} role="img" width="80%" height="auto" title="A world map showing where key Lingua Franca contributors reside." />
          <UniversitiesForLight className={clsx(styles.showInLightThemeOnly)} role="img" width="80%" height="auto" title="A world map showing where key Lingua Franca contributors reside." />
        </div>
        <Translate>
          Shortly after its inception, researchers from Kiel University and TU Dresden joined the team, contributing diagram synthesis and layout technology, highly-efficient runtime implementations, and various compiler improvements. Since then, we have worked with real-time systems experts from UT Dallas, embedded systems specialists from NTNU, and networking and security researchers from Hanyang University and ASU.
        </Translate>
        <br/><br/>
        <div className={clsx(styles.buttonContainer, styles.centreIfCol6BecameVertical)} data-theme="dark">
          <Link className={clsx("button", "button--info", styles.button)} to="https://github.com/lf-lang/lingua-franca">
              <Translate>Go to GitHub</Translate>
          </Link>
          <Link className={clsx("button", "button--primary", styles.button)} to="/research">
              <Translate>Latest Research</Translate>
          </Link>
        </div>
      </>
    }
    col2={<WorldMap role="img" className={clsx(styles.topMarginIfCol6BecameVertical, styles.recolourWorldMapPinInDarkTheme)} width="100%" height="auto" title="A world map showing where key Lingua Franca contributors reside." />}
  />
);

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Intuitive concurrent programming in any language"
      description="Build time-sensitive, concurrent, and distributed systems — effortlessly"
    >
      <main>
        <HeroBanner />
        <HomepageFeatures />
        <Intro />
        <Contributors />
      </main>
    </Layout>
  );
}
