import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";

export default function ReCPS2026() {
  return (
    <Layout
      title="ReCPS Workshop at DATE 2026"
      description="Reactive CPS (ReCPS): Workshop on Reactive Cyber-Physical Systems: Design, Simulation, and Coordination at DATE 2026"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={clsx(styles.eventBadge, styles.upcoming)}>
            Upcoming Event
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Reactive CPS (ReCPS)
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
              <Link
                href="https://www.date-conference.com/"
                className={styles.heroLink}
              >
                DATE 2026
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2">About the Workshop</Heading>
              <p>
                The Reactive CPS (ReCPS) Workshop at{" "}
                <Link href="https://www.date-conference.com/">DATE 2026</Link>{" "}
                is a new workshop dedicated to the modeling, design, simulation,
                analysis, and verification of reactive cyber-physical systems
                (CPS). ReCPS emphasizes reactive CPS architectures that
                continuously interact with their environment in real time,
                leveraging methodologies and tools such as the reactor model of
                computation and the{" "}
                <Link href="/docs/">Lingua Franca</Link> coordination language.
              </p>

              <Heading as="h3" className="margin-top--lg">
                Tentative Workshop Program
              </Heading>
              <p>The workshop program will feature:</p>
              <ul>
                <li>
                  <strong>Keynote talk by Prof. Edward A. Lee, UC Berkeley</strong>
                </li>
                <li>
                  <strong>Presentations of technical papers</strong>
                </li>
                <li>
                  <strong>Demo sessions</strong>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>

      {/* Organizers Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                👥 Organizers
              </Heading>
              <div className="card">
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

      {/* Call for Papers Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📣 Call for Papers
              </Heading>
              <p>
                As we advance towards a hyper-connected future defined by smart
                sensors and devices operating together as complex
                systems-of-systems, the massive adoption of Artificial
                Intelligence combined with the inherent unpredictability of
                distributed interactions presents a fundamental challenge to
                system reliability.
              </p>
              <p>
                In such a scenario, Reactive Cyber-Physical Systems (ReCPS) are
                crucial for next-generation intelligent and autonomous systems,
                continuously interacting with their environment in real time. By
                leveraging methodologies and tools such as the reactor model of
                computation and the Lingua Franca coordination language, these
                emerging frameworks provide deterministic and composable
                concurrency for CPS design. This enables the design of more
                predictable and reliable system behavior than conventional CPS
                design approaches.
              </p>
              <p>
                This workshop focuses on foundational methods and emerging
                trends in design, simulation, and coordination of these reactive
                systems. These approaches promise enhanced predictability and
                reliability compared to conventional CPS design.
              </p>
              <p>
                We invite original research contributions and demonstrations on
                topics related to Reactive Cyber-Physical Systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📋 Topics of Interest
              </Heading>
              <p>Scope and topics to be considered include (but are not limited to):</p>
              <div className="card">
                <div className="card__body">
                  <div className="row">
                    <div className="col col--6">
                      <ul>
                        <li>Cyber-physical production systems (CPPS)</li>
                        <li>Safety-critical CPS</li>
                        <li>Distributed CPS</li>
                        <li>Real-time scheduling and coordination</li>
                        <li>Simulation of CPS</li>
                        <li>Digital twins</li>
                      </ul>
                    </div>
                    <div className="col col--6">
                      <ul>
                        <li>Verification and testing of CPS</li>
                        <li>Predictability and determinism of CPS</li>
                        <li>Integration and deployment of CPS</li>
                        <li>AI/ML-driven autonomous CPS</li>
                        <li>Modeling & simulation of human-in-the-loop CPS</li>
                        <li>CPS-human interaction via LLMs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Dates Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📅 Important Dates
              </Heading>
              <div className="card">
                <div className="card__body">
                  <ul className={styles.datesList}>
                    <li>
                      <strong>February 16, 2026 (AoE):</strong> Research papers
                      and demo abstracts submission deadline
                    </li>
                    <li>
                      <strong>March 2, 2026:</strong> Notification of acceptance
                    </li>
                    <li>
                      <strong>April 20-22, 2026:</strong> Workshop at DATE 2026,
                      Verona, Italy
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📝 Submission Guidelines
              </Heading>
              <p>We invite the following types of contributions:</p>

              <div className={clsx("card", "margin-bottom--md")}>
                <div className="card__header">
                  <Heading as="h4">Research Papers</Heading>
                </div>
                <div className="card__body">
                  <p>
                    Original research contributions on topics related to
                    reactive cyber-physical systems design, simulation,
                    verification, and deployment.
                  </p>
                  <ul className="margin-bottom--none">
                    <li>
                      <strong>Page limit:</strong> 4 pages (including references)
                    </li>
                    <li>
                      <strong>Format:</strong> IEEE conference format
                    </li>
                  </ul>
                </div>
              </div>

              <div className={clsx("card", "margin-bottom--md")}>
                <div className="card__header">
                  <Heading as="h4">Demo Abstracts</Heading>
                </div>
                <div className="card__body">
                  <p>
                    Short abstracts describing working prototypes, tools, or
                    demonstrations related to reactive CPS and the Lingua Franca
                    ecosystem.
                  </p>
                  <ul className="margin-bottom--none">
                    <li>
                      <strong>Page limit:</strong> 2 pages (including references)
                    </li>
                    <li>
                      <strong>Format:</strong> IEEE conference format
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card">
                <div className="card__header">
                  <Heading as="h4">Review Process</Heading>
                </div>
                <div className="card__body">
                  <p>
                    Single blind review (no need to anonymize submissions) by a
                    program committee with acceptance decisions.
                  </p>
                  <p className="margin-bottom--none">
                    <strong>Submission system:</strong>{" "}
                    <Link href="https://easychair.org/conferences?conf=recps2026">
                      EasyChair
                    </Link>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Publication Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📄 Publication
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p className="margin-bottom--none">
                    Accepted manuscripts will be distributed to the workshop
                    attendees, but will not be officially published, so that the
                    authors can use the materials for their publication later.
                  </p>
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
