import clsx from "clsx";

import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./organization.module.css";

const CheckIcon = () => (
  <svg className={styles.principleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InfrastructureIcon = () => (
  <svg className={styles.teamIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
    <circle cx="14" cy="6" r="1" fill="currentColor" />
    <circle cx="18" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
    <circle cx="10" cy="18" r="1" fill="currentColor" />
    <circle cx="14" cy="18" r="1" fill="currentColor" />
    <circle cx="18" cy="18" r="1" fill="currentColor" />
  </svg>
);

const OutreachIcon = () => (
  <svg className={styles.teamIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function OrganizationAndRoles(): JSX.Element {
  return (
    <Layout
      title="Organization and Roles"
      description="How the Lingua Franca community is organized and how work gets done"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            Organization and Roles
          </Heading>
          <p className={styles.heroSubtitle}>
            How the Lingua Franca community and its open-source ecosystem (OSE) are organized and
            how work gets done.
          </p>
        </div>
      </div>

      <div className="container padding-vert--lg">
        {/* Project Structure */}
        <section className="section">
          <Heading
            as="h2"
            id="project-structure"
            className={clsx("margin-bottom--lg", "text--center", styles.projectStructureTitle)}
          >
            Project Structure
          </Heading>
          <p className={clsx("text--center", "margin-bottom--lg", styles.projectStructureIntro)} style={{ maxWidth: "680px", marginLeft: "auto", marginRight: "auto" }}>
            The LF OSE has two core teams that collaborate closely with project
            leads:
          </p>
          <div className="row" style={{ justifyContent: "center", gap: "28px" }}>
            <div className="col col--5">
              <div className={styles.teamHighlightCard}>
                <InfrastructureIcon />
                <div className={styles.teamHighlightName}>
                  Infrastructure &amp; Platform Team
                </div>
                <p className={styles.teamHighlightDesc}>
                  Technical foundation, security, and platform expansion
                </p>
              </div>
            </div>
            <div className="col col--5">
              <div className={styles.teamHighlightCard}>
                <OutreachIcon />
                <div className={styles.teamHighlightName}>
                  Outreach and Onboarding Team
                </div>
                <p className={styles.teamHighlightDesc}>
                  Ecosystem growth, documentation, and community support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure & Platform Team */}
        <section className="section sectionAlt">
          <div className="container">
            <Heading as="h2" id="infrastructure-platform-team" className="margin-bottom--lg">
              Infrastructure &amp; Platform Team
            </Heading>

            <div className={`card ${styles.teamCard}`}>
              <div className="card__body">
                <Heading as="h3" className="margin-bottom--sm">
                  What This Team Does
                </Heading>
                <p>This team maintains the technical foundation of Lingua Franca:</p>
                <ul>
                  <li>CI/CD systems</li>
                  <li>Compilation and testing infrastructure</li>
                  <li>Repository security</li>
                  <li>Code quality standards</li>
                  <li>Platform support and expansion</li>
                  <li>Virtual and simulated hardware environments</li>
                </ul>
                <p>
                  In short, this team keeps LF stable, secure, and evolving
                  responsibly.
                </p>
              </div>
            </div>

            <div className={`card ${styles.teamCard}`}>
              <div className="card__body">
                <Heading as="h3" className="margin-bottom--sm">
                  Code Review Philosophy
                </Heading>
                <p>We value thoughtful and careful reviews. Reviews should:</p>
                <ul>
                  <li>Check for correctness</li>
                  <li>Identify potential security issues</li>
                  <li>Ensure architectural consistency</li>
                  <li>Protect long-term maintainability</li>
                  <li>Confirm documentation and testing</li>
                </ul>
                <div className={styles.reviewQuote}>
                  Reviews should be thorough enough that merging a pull request
                  does not make anyone nervous.
                </div>
                <p>
                  Trusted members have merge access and exercise careful
                  technical judgment.
                </p>
              </div>
            </div>

            <div className={`card ${styles.teamCard}`}>
              <div className="card__body">
                <Heading as="h3" className="margin-bottom--sm">
                  Platforms and Hardware
                </Heading>
                <p>
                  The team supports and expands LF across heterogeneous
                  platforms:
                </p>
                <ul>
                  <li>Automotive · Robotics · IoT</li>
                  <li>Industrial CPS · Power and energy · Social infrastructure</li>
                </ul>
                <p>
                  We balance expansion with maintainability. Virtual hardware
                  environments support reproducible testing, education, and
                  research.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outreach and Onboarding Team */}
        <section className="section">
          <div className="container">
            <Heading as="h2" id="outreach-onboarding-team" className="margin-bottom--lg">
              Outreach and Onboarding Team
            </Heading>

            <div className={`card ${styles.teamCard}`}>
              <div className="card__body">
                <Heading as="h3" className="margin-bottom--sm">
                  What This Team Does
                </Heading>
                <p>This team helps grow and support the LF ecosystem:</p>
                <ul>
                  <li>Onboarding new contributors</li>
                  <li>Maintaining documentation</li>
                  <li>Developing tutorials</li>
                  <li>Supporting educators</li>
                  <li>Engaging with industry and research users</li>
                </ul>
                <p>
                  They work closely with the Infrastructure &amp; Platform Team
                  to keep docs and tutorials aligned with the project.
                </p>
              </div>
            </div>

            <div className={`card ${styles.teamCard}`}>
              <div className="card__body">
                <Heading as="h3" className="margin-bottom--sm">
                  Community Support
                </Heading>
                <ul>
                  <li>Organizes tutorials and Q&amp;A sessions</li>
                  <li>Supports students and first-time contributors</li>
                  <li>Engages stakeholders across academia, industry, and public sectors</li>
                  <li>Helps organize bootcamps and educational activities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Working Together */}
        <section className="section sectionAlt">
          <div className="container">
            <Heading as="h2" id="working-together" className="margin-bottom--md">
              Working Together
            </Heading>
            <div className={styles.sectionCard}>
              <ul>
                <li>Technical decisions are discussed openly.</li>
                <li>Significant changes are reviewed carefully.</li>
                <li>Teams coordinate when changes affect both infrastructure and users.</li>
                <li>Project leads help resolve disagreements when needed.</li>
              </ul>
              <p className="margin-bottom--none">
                We aim for consensus and transparency rather than formal process.
              </p>
            </div>
          </div>
        </section>

        {/* Code of Conduct & Licensing - Two columns */}
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col col--6">
                <Heading as="h2" id="code-of-conduct" className="margin-bottom--md">
                  Code of Conduct
                </Heading>
                <div className={styles.sectionCard}>
                  <p>We maintain a respectful and inclusive community.</p>
                  <p className="margin-bottom--none">
                    Guidelines apply to contributors, forums, Zulip, workshops,
                    and events — following best practices from established
                    open-source communities.
                  </p>
                </div>
              </div>
              <div className="col col--6">
                <Heading as="h2" id="licensing" className="margin-bottom--md">
                  Licensing
                </Heading>
                <div className={styles.sectionCard}>
                  <p>BSD-2, BSD-3, MIT, GPL, ISC.
                    Most core components use BSD for broad adoption, including commercial use.
                    Contributions follow each repository&apos;s license.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guiding Principles */}
        <section className="section sectionAlt">
          <div className="container">
            <Heading as="h2" id="guiding-principles" className="margin-bottom--md text--center">
              Guiding Principles
            </Heading>
            <div className={styles.guidingPrinciples}>
              <div className={styles.principleItem}>
                <CheckIcon />
                <span>Keep the bar high for technical quality.</span>
              </div>
              <div className={styles.principleItem}>
                <CheckIcon />
                <span>Keep the process lightweight.</span>
              </div>
              <div className={styles.principleItem}>
                <CheckIcon />
                <span>Favor transparency over formality.</span>
              </div>
              <div className={styles.principleItem}>
                <CheckIcon />
                <span>Support research-to-production translation.</span>
              </div>
              <div className={styles.principleItem}>
                <CheckIcon />
                <span>Build a sustainable, welcoming ecosystem.</span>
              </div>
            </div>
          </div>
        </section>

        <p className={styles.footerNote}>
          This document will evolve as the project grows.
        </p>
      </div>
    </Layout>
  );
}
