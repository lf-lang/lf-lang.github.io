import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import react, { useEffect, useState } from 'react';
import styles from './index.module.css';
import Translate, { translate } from '@docusaurus/Translate';

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
        <Heading as="h1" className={styles.heroProjectTagline}>
          <img
            alt="Nadeshiko sleeping"
            className={styles.heroLogo}
            src="https://github.com/axmmisaka/axmmisaka/blob/master/nadeshiko1.gif?raw=true"
          />
          <span
            className={styles.heroTitleTextHtml}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: translate({
                id: 'homepage.hero.title',
                message:
                'Build <b>concurrent</b> and <b>distributed</b> software in a <b>simple</b>, <b>modular</b> way',
                // 'Build <b>concurrent</b>, <b>time-sensitive</b>, and <b>distributed</b> software with ease',
                description:
                  'Home page hero title, can contain simple html tags',
              }),
            }}
          />
        </Heading>
        Lingua Franca allows you to write powerful concurrent software without any expertise in programming with threads. You can turn a Lingua Franca program into a distributed system with the change of a single keyword—no distributed systems programming skills required.
        <div className={styles.indexCtas}>
          <Link className="button button--primary" to="/installation">
            <Translate>Get Started</Translate>
          </Link>
          <Link className="button button--info" to="/docs">
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

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [version, setVersion] = useState<string>('Latest version');

  useEffect(() => {
    const fetchAndUpdateVersionNumber = async () => {
      const version = (
        await (
          await fetch(
            'https://api.github.com/repos/lf-lang/lingua-franca/releases/latest'
          )
        ).json()
      )['tag_name'];
      setVersion(version != null ? `${version}` : 'latest version');
    };

    fetchAndUpdateVersionNumber().catch((reason) => {
      console.log(reason);
    });
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" style={{ fontWeight: 'normal' }}>
            Lingua Franca is a polyglot coordination language for **reactive**,
            **concurrent**, and **time-sensitive** applications.
        </Heading>
        <p style={{ textAlign: 'left' }}>
          Lingua Franca (LF) is a polyglot coordination language built to bring
          deterministic reactive concurrency and time to mainstream target
          programming languages (currently C, C++, Python, TypeScript, and
          Rust). LF is supported by a runtime system that is capable of
          concurrent and distributed execution of reactive programs that are
          deployable on the Cloud, the Edge, and even on bare-iron embedded
          platforms.
          <br />
          <br />A Lingua Franca program specifies the interactions between
          components called reactors. The logic of each reactor is written in
          plain target code. A code generator synthesizes one or more programs
          in the target language, which are then compiled using standard tool
          chains. If the application has exploitable parallelism, then it
          executes transparently on multiple cores without compromising
          determinacy. A distributed application translates into multiple
          programs and scripts to launch those programs on distributed machines.
          The communication fabric connecting components is synthesized as part
          of the programs.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Download Lingua Franca {version}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <HeroBanner />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
