import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";

export default function ReCPS2026() {
  return (
    <Layout
      title="ReCPS Workshop at DATE 2026"
      description="Workshop on Reactive Cyber-Physical Systems: Design, Simulation, and Coordination at DATE 2026"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={clsx(styles.eventBadge, styles.upcoming)}>
            Upcoming Event
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            ReCPS Workshop
          </Heading>
          <p className={styles.heroSubtitle}>
            Workshop on Reactive Cyber-Physical Systems: Design, Simulation, and
            Coordination
          </p>
          <div className={styles.eventMeta}>
            <span>📅 April 20-22, 2026</span>
            <span>📍 Verona, Italy</span>
            <span>
              🎯 Co-located with{" "}
              <Link href="https://www.date-conference.com/" className={styles.heroLink}>
                DATE 2026
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2">About the Workshop</Heading>
              <p>
                The ReCPS (Reactive Cyber-Physical Systems) Workshop brings
                together researchers and practitioners working on the design,
                simulation, and coordination of reactive cyber-physical systems.
              </p>
              <p>
                This workshop is co-located with the{" "}
                <Link href="https://www.date-conference.com/">
                  Design, Automation and Test in Europe (DATE) Conference 2026
                </Link>
                , one of the premier conferences in electronic system design and
                test.
              </p>

              <div className={styles.infoBox}>
                <Heading as="h3">📢 More Information Coming Soon</Heading>
                <p>
                  The workshop has been accepted to DATE 2026. Detailed
                  information about the program, call for papers, submission
                  deadlines, and registration will be posted here as it becomes
                  available.
                </p>
                <p>
                  In the meantime, feel free to join our{" "}
                  <Link href="https://lf-lang.zulipchat.com/">
                    Zulip community
                  </Link>{" "}
                  for updates and discussions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call for Papers & Important Dates */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div className={clsx("card", "margin-bottom--lg")}>
                <div className="card__header">
                  <Heading as="h3">📝 Call for Papers</Heading>
                </div>
                <div className="card__body">
                  <p>
                    We invite submissions of research papers and demo abstracts
                    on topics related to reactive cyber-physical systems,
                    including but not limited to design methodologies,
                    simulation techniques, and coordination frameworks.
                  </p>
                  <p>More details on submission guidelines coming soon.</p>
                </div>
              </div>

              <div className={clsx("card", "margin-bottom--lg")}>
                <div className="card__header">
                  <Heading as="h3">📅 Important Dates</Heading>
                </div>
                <div className="card__body">
                  <ul className={styles.datesList}>
                    <li>
                      <strong>February 16, 2026:</strong> Research papers and
                      demo abstracts submission deadline
                    </li>
                    <li>
                      <strong>March 2, 2026:</strong> Notification of acceptance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card">
                <div className="card__header">
                  <Heading as="h3">👥 Organizers</Heading>
                </div>
                <div className="card__body">
                  <ul className={styles.organizersList}>
                    <li>
                      <strong>General Chair:</strong> Hokeun Kim (Arizona State
                      University, United States)
                    </li>
                    <li>
                      <strong>Program Chair:</strong> Sebastiano Gaiardelli
                      (University of Verona, Italy)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="section">
        <div className="container text--center">
          <Heading as="h2">Related Resources</Heading>
          <p>Learn more about reactive programming and Lingua Franca.</p>
          <div className={styles.ctaButtons}>
            <Link
              className="button button--primary button--lg"
              href="https://www.date-conference.com/"
            >
              DATE 2026 Conference
            </Link>
            <Link className="button button--secondary button--lg" href="/docs/">
              Lingua Franca Docs
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="/research"
            >
              Research Publications
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

