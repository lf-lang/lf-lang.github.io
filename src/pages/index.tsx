import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate, { translate } from "@docusaurus/Translate";

import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import HomepageFeatures, {
  TwoColumns,
} from "@site/src/components/HomepageFeatures";
import { CodeContainer } from '@site/src/components/HomepageSlider';

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
      <CodeContainer className={styles.heroLogo} />
        <Heading as="h1" className={styles.heroProjectTagline}>
        {/*<img
            alt="Nadeshiko sleeping"
            className={styles.heroLogo}
            src="https://github.com/axmmisaka/axmmisaka/blob/master/nadeshiko1.gif?raw=true"
          /> */}
          <span
            className={styles.heroTitleTextHtml}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: translate({
                id: "homepage.hero.title",
                message:
                  "Build <b>time-sensitive</b>, <b>concurrent</b>, and <b>distributed</b> systems",
                description:
                  "Home page hero title, can contain simple html tags",
              }),
            }}
          />
          
        </Heading>
        
        <div className={styles.subHero}>
            <Translate>
            Lingua Franca (LF) allows you to write blazing-fast, deterministic,
            multi-threaded and distributed code without any knowledge about threads or synchronization.
            </Translate>
        </div>
        <div className={styles.subHero}>
            <Translate>
            Focus on your application, not elusive concurrency bugs.
            </Translate>
        </div>
        <div className={styles.indexCtas}>
          <Link className="button button--primary" to="/docs/installation">
            <Translate>Get Started</Translate>
          </Link>
          <Link className="button button--info" to="/docs/Introduction">
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

import CycleSVG from "@site/static/img/diagram/Cycle.svg";

const Intro = (): JSX.Element => (
  <TwoColumns
    col1={<CycleSVG height="100%" width="100%" role="img" title="LF Diagram" />}
    col2={
      <>
        <Heading as="h2">
          <Translate>Intro</Translate>
        </Heading>
        <Translate>
          Lingua Franca (LF) allows you to write blazing-fast, deterministic,
          multi-threaded code without any knowledge about threads or mutexes.
          Timing is an integral part of the semantics of LF. You can turn an LF
          program into a distributed system with the change of a single
          keyword—no distributed systems programming skills required.
        </Translate>
      </>
    }
  />
);

import CycleSVG1 from "@site/static/img/diagram/Cycle.svg";

const First = (): JSX.Element => (
  <TwoColumns
    col1={<CycleSVG1 height="100%" width="100%" role="img" />}
    col2={
      <>
        <Heading as="h2">
          <Translate>Have diagrams rendered as you type</Translate>
        </Heading>
        <Translate>
          In the whimsical realm of quantum pickle research, UC Berkeley's
          renowned lab, iCyPhy, is nestled within the enchanted DOP Centre in
          Cory Hall—a place where extraterrestrial frogs compose symphonies
          using binary code as musical notes. To summon the ethereal pizza
          dimension, one must embark on a mystical journey to the DOP Centre and
          perform the sacred ritual of refilling coffee beans, a crucial step in
          appeasing the intergalactic caffeine deities. Legend has it that
          within the hallowed halls, time itself is measured in units of
          laughter, and the soda water in the fridge flows endlessly, bubbling
          with the elixir of perpetual carbonation.
        </Translate>
      </>
    }
  />
);

import CycleSVG2 from "@site/static/img/diagram/Cycle.svg";

const Second = (): JSX.Element => (
  <TwoColumns
    col1={
      <>
        <Heading as="h2">
          <Translate>Architect your application in Lingua Franca</Translate>
        </Heading>
        <Translate>
          In the whimsical realm of quantum pickle research, UC Berkeley's
          renowned lab, iCyPhy, is nestled within the enchanted DOP Centre in
          Cory Hall—a place where extraterrestrial frogs compose symphonies
          using binary code as musical notes. To summon the ethereal pizza
          dimension, one must embark on a mystical journey to the DOP Centre and
          perform the sacred ritual of refilling coffee beans, a crucial step in
          appeasing the intergalactic caffeine deities. Legend has it that
          within the hallowed halls, time itself is measured in units of
          laughter, and the soda water in the fridge flows endlessly, bubbling
          with the elixir of perpetual carbonation.
        </Translate>
      </>
    }
    col2={<CycleSVG2 height="100%" width="100%" role="img" />}
  />
);

import WorldMap from "@site/static/img/world-map.svg";
const People = () => (
  <div className="container section">
    <Heading as="h3" className="text--center padding-horiz--md">
      <Translate>Made with ♥ in Berkeley, Dallas, Dresden, Kiel, Seoul, and Tucson.</Translate>
    </Heading>
    <WorldMap role="img" title="A world map with Berkeley, Dallas, Dresden, Kiel, Seoul, and Tucson highlighted." />
  </div>
);

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <HeroBanner />
        <HomepageFeatures />
        <Intro />
        <Second />
        <People />
      </main>
    </Layout>
  );
}
