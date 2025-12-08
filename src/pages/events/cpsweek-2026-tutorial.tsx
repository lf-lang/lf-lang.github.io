import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";

interface ScheduleItem {
  session: string;
  duration: string;
  description?: string;
  leads?: string;
}

const scheduleItems: ScheduleItem[] = [
  {
    session: "Introductory Presentations",
    duration: "45 minutes",
    description:
      "Introduction to CPS concurrency challenges and motivation for Lingua Franca. Explanation of the reactor-oriented programming model and key language concepts (reactors, ports, timers, logical time). Real-world scenarios in automotive and avionic systems where deterministic coordination is vital.",
    leads: "Organizers",
  },
  {
    session: "Live Demos",
    duration: "45 minutes",
    description:
      "CPS-focused example applications built with LF, including distributed (federated) execution, physics simulation integration, and embodied AI agents using robotic platforms. Autonomous vehicle/platoon coordination simulation using the CARLA simulator integration.",
    leads: "Organizers",
  },
  {
    session: "Break",
    duration: "10 minutes",
  },
  {
    session: "Hands-on Programming Sessions",
    duration: "100 minutes",
    description:
      "Interactive coding sessions with progressively challenging exercises using CPS-themed examples. Build a smart traffic light controller, implement distributed sensing applications, and explore the LF Playground. Choose between C or Python for reactor logic implementation.",
    leads: "Organizers & Teaching Assistants",
  },
  {
    session: "Break",
    duration: "10 minutes",
  },
  {
    session: "Wrap-Up and Q&A",
    duration: "30 minutes",
    description:
      "Summary of key takeaways, discussion of advanced LF capabilities (federated distributed execution, modal models), project roadmap, and community involvement opportunities.",
    leads: "Organizers",
  },
];

interface Organizer {
  name: string;
  affiliation: string;
  email: string;
  website: string;
  bio: string;
}

const organizers: Organizer[] = [
  {
    name: "Hokeun Kim",
    affiliation: "Arizona State University, USA",
    email: "hokeun@asu.edu",
    website: "https://hokeun.github.io/",
    bio: "Assistant professor of Computer Science and Engineering in the School of Computing and Augmented Intelligence (SCAI) at Arizona State University. Ph.D. in EECS from UC Berkeley (2017) with a focus on distributed cyber-physical systems and IoT security. Research interests include cyber-physical systems, distributed systems, real-time systems, computer security, and computer architecture. Recipient of ACM/IEEE Best Paper Award at CPSWeek, IEEE Micro Top Picks Honorable Mention, and 1st Place in ESSC at ESWEEK.",
  },
  {
    name: "Chadlia Jerad",
    affiliation: "University of Manouba, Tunisia",
    email: "chadlia.jerad@ensi-uma.tn",
    website: "https://chadliajerad.github.io/",
    bio: "Associate professor at the National School of Computer Science (ENSI), University of Manouba, Tunisia. Fulbright Visiting Scholar at EECS, UC Berkeley in 2016-2017 (Accessors project) and 2022-2023 (Lingua Franca project). Recognized by DAAD Tunisia as 'Portrait of the Month' in 2018. Research interests include embedded and cyber-physical systems, distributed and real-time systems, computer architecture, and formal verification.",
  },
  {
    name: "Edward A. Lee",
    affiliation: "University of California, Berkeley, USA",
    email: "eal@berkeley.edu",
    website: "https://ptolemy.berkeley.edu/~eal/",
    bio: "Professor of the Graduate School and Distinguished Professor Emeritus in EECS at UC Berkeley. Author of seven books and hundreds of papers. Director of iCyPhy, the Berkeley Industrial Cyber-Physical Systems Research Center. Fellow of the IEEE, NSF Presidential Young Investigator. Awards include the 2016 IEEE TCRTS Outstanding Technical Achievement and Leadership Award, 2019 IEEE TCCPS Technical Achievement Award, 2022 EDAA Achievement Award, 2022 ACM SIGBED Technical Achievement Award, and Honorary Doctorate from the Technical University of Vienna (2022).",
  },
];

export default function CPSWeek2026Tutorial() {
  return (
    <Layout
      title="LF Tutorial at CPS-IoT Week 2026"
      description="Tutorial on Lingua Franca: An Open-Source Coordination Language for Deterministic Integration of Cyber-Physical Systems at CPS-IoT Week 2026"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={clsx(styles.eventBadge, styles.upcoming)}>
            Upcoming Tutorial
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Lingua Franca:
          </Heading>
          <p className={styles.heroSubtitle}>
            An Open-Source Coordination Language for Deterministic Integration
            of Cyber-Physical Systems
          </p>
          <div className={styles.eventMeta}>
            <span>📅 May 11-14, 2026</span>
            <span>📍 Saint Malo, France</span>
            <span>
              🎯 Co-located with{" "}
              <Link
                href="https://cps-iot-week2026.inria.fr/"
                className={styles.heroLink}
              >
                CPS-IoT Week 2026
              </Link>
            </span>
          </div>
          <p style={{ marginTop: "16px", opacity: 0.9, fontSize: "1rem" }}>
            Half-day hands-on tutorial (~4 hours)
          </p>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2">Abstract</Heading>
              <p>
                This half-day, hands-on, interactive tutorial introduces{" "}
                <Link href="/docs/">Lingua Franca (LF)</Link>, an open-source
                coordination language designed for building deterministic,
                concurrent, and time-sensitive cyber-physical systems.
                Participants will explore LF's core concepts through a technical
                overview, CPS-focused demonstrations, and hands-on programming
                sessions using C and Python as well as the LF coordination
                language.
              </p>
              <p>
                This tutorial emphasizes how LF enables deterministic
                concurrency, simplifies integration, and enhances reliability
                across CPS and IoT domains. The tutorial is intended for
                researchers, engineers, and graduate students with programming
                experience interested in robust CPS design.
              </p>

              <div className={styles.infoBox}>
                <Heading as="h3">🎯 Target Audience</Heading>
                <p>
                  CPS-IoT Week participants including academic researchers,
                  industry engineers, and graduate students working on CPS/IoT.
                  No prior experience with LF is required—basic proficiency in C
                  and/or Python is recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                💡 Motivation & Relevance
              </Heading>
              <p>
                Cyber-physical systems (CPS) and IoT applications often involve
                multiple concurrent components interacting under real-time
                constraints. Ensuring deterministic behavior and coordinated
                timing across these components is a notorious challenge with
                conventional programming approaches (threads, pub/sub, actor
                frameworks, etc.).
              </p>
              <p>
                Lingua Franca is a polyglot coordination language designed to
                address this challenge by offering a framework for building
                concurrent, time-sensitive systems that behave deterministically
                and predictably. An LF program defines interactions between
                reactive components called <em>reactors</em> and emphasizes
                deterministic coordination with explicit handling of timing.
              </p>
              <p>
                By using LF, CPS developers can coordinate sensing, computation,
                and actuation across devices with guarantees of logical timing
                order and thread-safe determinism that are difficult to achieve
                with traditional methods.
              </p>

              <div className="card margin-top--lg">
                <div className="card__body">
                  <Heading as="h4">Key Benefits</Heading>
                  <ul className="margin-bottom--none">
                    <li>
                      <strong>Deterministic Concurrency:</strong> Race-free
                      execution on multiple cores or devices without special
                      synchronization code
                    </li>
                    <li>
                      <strong>Explicit Timing Semantics:</strong> Specify and
                      maintain precise temporal behavior without ad-hoc timing
                      code
                    </li>
                    <li>
                      <strong>Polyglot Support:</strong> Reactor logic can be
                      written in C, Python, C++, Rust, or TypeScript
                    </li>
                    <li>
                      <strong>Distributed Execution:</strong> Built-in support
                      for federated execution across networked devices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📋 Tutorial Schedule
              </Heading>
              <p className="text--center margin-bottom--lg">
                Total duration: ~4 hours (half-day tutorial including breaks)
              </p>

              {scheduleItems.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx("card", "margin-bottom--md")}
                  style={
                    item.session === "Break"
                      ? { opacity: 0.7, backgroundColor: "var(--ifm-color-emphasis-100)" }
                      : {}
                  }
                >
                  <div className="card__header">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Heading as="h4" className="margin-bottom--none">
                        {item.session}
                      </Heading>
                      <span
                        className="badge badge--secondary"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {item.duration}
                      </span>
                    </div>
                  </div>
                  {item.description && (
                    <div className="card__body">
                      <p className="margin-bottom--none">{item.description}</p>
                      {item.leads && (
                        <p
                          className="margin-top--sm margin-bottom--none"
                          style={{ fontSize: "0.9rem", opacity: 0.8 }}
                        >
                          <em>Led by: {item.leads}</em>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                🎓 What You'll Learn
              </Heading>
              <div className="row">
                <div className="col col--6">
                  <div className="card" style={{ height: "100%" }}>
                    <div className="card__header">
                      <Heading as="h4">Concepts</Heading>
                    </div>
                    <div className="card__body">
                      <ul className="margin-bottom--none">
                        <li>Reactor-oriented programming model</li>
                        <li>Reactors, ports, and connections</li>
                        <li>Timers and logical time</li>
                        <li>Deterministic concurrency</li>
                        <li>Federated (distributed) execution</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="card" style={{ height: "100%" }}>
                    <div className="card__header">
                      <Heading as="h4">Hands-on Skills</Heading>
                    </div>
                    <div className="card__body">
                      <ul className="margin-bottom--none">
                        <li>Writing LF programs with C or Python</li>
                        <li>Building CPS applications (e.g., traffic controller)</li>
                        <li>Implementing distributed sensing</li>
                        <li>Using VS Code with LF extension</li>
                        <li>Working with the LF Playground</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Requirements Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                💻 Technical Requirements & Setup
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    Participants should bring a laptop for the hands-on
                    sessions. Lingua Franca's toolchain supports{" "}
                    <strong>Linux</strong>, <strong>macOS</strong>, and{" "}
                    <strong>Windows</strong> (via WSL).
                  </p>

                  <Heading as="h4">Setup Options</Heading>
                  <ul>
                    <li>
                      <strong>Pre-configured VM:</strong> We will provide an
                      Ubuntu virtual machine image with all required tools
                      installed (LF compiler, VS Code with LF extension, Java,
                      C compiler, etc.)
                    </li>
                    <li>
                      <strong>Native Installation:</strong> One-line install
                      script or VS Code extension installation
                    </li>
                    <li>
                      <strong>Cloud-based:</strong> GitHub Codespaces or Gitpod
                      for the{" "}
                      <Link href="https://github.com/lf-lang/playground-lingua-franca">
                        LF Playground
                      </Link>{" "}
                      as a browser-based backup environment
                    </li>
                  </ul>

                  <Heading as="h4">Dependencies</Heading>
                  <ul className="margin-bottom--none">
                    <li>Java 17+ JDK</li>
                    <li>C/C++ compiler (gcc or clang)</li>
                    <li>CMake</li>
                    <li>Python (for Python target)</li>
                  </ul>
                </div>
              </div>
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
              {organizers.map((organizer, idx) => (
                <div key={idx} className={clsx("card", "margin-bottom--md")}>
                  <div className="card__header">
                    <Heading as="h3" className="margin-bottom--none">
                      <Link href={organizer.website}>{organizer.name}</Link>
                    </Heading>
                    <p
                      className="margin-bottom--none margin-top--sm"
                      style={{ opacity: 0.8 }}
                    >
                      {organizer.affiliation}
                    </p>
                  </div>
                  <div className="card__body">
                    <p className="margin-bottom--sm">{organizer.bio}</p>
                    <p className="margin-bottom--none" style={{ fontSize: "0.9rem" }}>
                      📧{" "}
                      <Link href={`mailto:${organizer.email}`}>
                        {organizer.email}
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📚 Materials & Follow-Up
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    A dedicated tutorial webpage will be available at least one
                    month before CPS-IoT Week with the schedule, setup
                    instructions, and links to example code and prerequisites.
                    All slide decks, code, and exercise instructions will be
                    hosted there.
                  </p>
                  <p>
                    Subject to conference policy, we plan to record the tutorial
                    (at minimum the demo and coding walkthroughs) and publish
                    the recordings together with the slides and code after the
                    event.
                  </p>

                  <Heading as="h4">Community Support</Heading>
                  <p className="margin-bottom--none">
                    Join the Lingua Franca{" "}
                    <Link href="https://lf-lang.zulipchat.com/">
                      Zulip community
                    </Link>{" "}
                    (50+ active members, 200+ total) for Q&A before and after
                    the tutorial. This connects you with an active open-source
                    community spanning multiple institutions for continued
                    learning and support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* References Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📖 References
              </Heading>
              <div className="card">
                <div className="card__body">
                  <ol className="margin-bottom--none">
                    <li className="margin-bottom--sm">
                      Lingua Franca Organization.{" "}
                      <Link href="https://lf-lang.org">
                        Lingua Franca: Build predictable concurrent,
                        time-sensitive, and distributed systems
                      </Link>
                      .
                    </li>
                    <li className="margin-bottom--sm">
                      Lingua Franca Organization.{" "}
                      <Link href="https://github.com/lf-lang/playground-lingua-franca">
                        Lingua Franca Playground: Try Lingua Franca now
                      </Link>
                      .
                    </li>
                    <li>
                      Marten Lohstroh, Christian Menzel, Soroush Bateni, and
                      Edward A. Lee.{" "}
                      <em>
                        Toward a Lingua Franca for Deterministic Concurrent
                        Systems
                      </em>
                      . ACM Transactions on Embedded Computing Systems (TECS)
                      20, 4 (May 2021), Article 36.{" "}
                      <Link href="https://doi.org/10.1145/3448128">
                        doi:10.1145/3448128
                      </Link>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section">
        <div className="container text--center">
          <Heading as="h2">Related Resources</Heading>
          <p>
            Get started with Lingua Franca and learn more about the conference.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className="button button--primary button--lg"
              href="https://cps-iot-week2026.inria.fr/"
            >
              CPS-IoT Week 2026
            </Link>
            <Link className="button button--secondary button--lg" href="/docs/">
              Lingua Franca Docs
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="/docs/installation"
            >
              Installation Guide
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/lf-lang/playground-lingua-franca"
            >
              LF Playground
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

