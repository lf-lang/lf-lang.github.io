import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";

interface ScheduleItem {
  session: string;
  duration: string;
  time: string;
  description?: React.ReactNode;
  leads?: string;
}

const scheduleItems: ScheduleItem[] = [
  {
    session: "Introduction to Lingua Franca",
    duration: "15 minutes",
    time: "2:00 PM – 2:15 PM",
    description:
      "Introduction to the challenges of building time-sensitive systems and motivation for Lingua Franca. Overview of the reactor-oriented programming model and key language concepts (reactors, ports, timers, logical time, deterministic concurrency).",
    leads: "Instructor",
  },
  {
    session: "Setup and Hello World",
    duration: "10 minutes",
    time: "2:15 PM – 2:25 PM",
    description:
      "Verify your Lingua Franca toolchain with the readiness checklist, choose your language path (C or Python), and compile and run your first reactor program.",
    leads: "Instructor & Teaching Assistant",
  },
  {
    session: "Hands-on Labs",
    duration: "90 minutes",
    time: "2:25 PM – 3:55 PM",
    description: (
      <>
        Work through the eight short labs of the{" "}
        <Link href="https://github.com/lf-lang/lf-tutorial-fdl26">
          tutorial repository
        </Link>
        , each built around a small program you compile, run, and extend. The
        labs progress from reactors, ports, and timers, through logical time,
        determinism, physical actions, and modal reactors, to deadlines and
        federated execution.
      </>
    ),
    leads: "Instructor & Teaching Assistant",
  },
  {
    session: "Wrap-Up and Q&A",
    duration: "5 minutes",
    time: "3:55 PM – 4:00 PM",
    description:
      "Summary of key takeaways, pointers to advanced LF capabilities, project roadmap, and community involvement opportunities.",
    leads: "Instructor",
  },
];

interface Lab {
  number: number;
  theme: string;
  concepts: string;
}

const labs: Lab[] = [
  {
    number: 1,
    theme: "Ready, set, react",
    concepts: "Toolchain, reactors, timers, reactions, diagrams",
  },
  {
    number: 2,
    theme: "Building a reactor pipeline",
    concepts: "Ports, connections, parameters, state",
  },
  {
    number: 3,
    theme: "Tags, delays, and lag",
    concepts: "Logical vs. physical time, microsteps, actions",
  },
  {
    number: 4,
    theme: "Predictable ordering",
    concepts: "Determinism, reaction order, causality loops",
  },
  {
    number: 5,
    theme: "Reacting to the outside world",
    concepts: "Physical actions, threads, preambles",
  },
  {
    number: 6,
    theme: "Changing behavior with modes",
    concepts: "Modal reactors, reset and history transitions",
  },
  {
    number: 7,
    theme: "Useful work under a time budget",
    concepts: "Deadlines, handlers, anytime computation",
  },
  {
    number: 8,
    theme: "One model, multiple processes",
    concepts: "Federated execution, the RTI",
  },
];

interface Instructor {
  name: string;
  affiliation: string;
  email: string;
  website: string;
  bio: string;
  image: string;
}

const instructors: Instructor[] = [
  {
    name: "Hokeun Kim",
    affiliation: "Arizona State University, USA",
    email: "hokeun@asu.edu",
    website: "https://hokeun.github.io/",
    image: "/img/events/fdl-2026-tutorial/hokeun-kim.jpg",
    bio: "Assistant professor of Computer Science and Engineering in the School of Computing and Augmented Intelligence (SCAI) at Arizona State University. Ph.D. in EECS from UC Berkeley (2017) with a focus on distributed cyber-physical systems and IoT security. Research interests include cyber-physical systems, distributed systems, real-time systems, computer security, and computer architecture. Recipient of ACM/IEEE Best Paper Award at CPSWeek, IEEE Micro Top Picks Honorable Mention, and 1st Place in ESSC at ESWEEK.",
  },
];

interface TeachingAssistant {
  name: string;
  role: string;
  affiliation: string;
  email: string;
  website: string;
  image: string;
}

const teachingAssistants: TeachingAssistant[] = [
  {
    name: "Byeonggil Jun",
    role: "Ph.D. Student",
    affiliation: "Arizona State University, USA",
    email: "byeonggil@asu.edu",
    website: "https://byeonggiljun.github.io/",
    image: "/img/events/fdl-2026-tutorial/byeonggil-jun.jpg",
  },
];

export default function FDL2026Tutorial() {
  return (
    <Layout
      title="LF Tutorial at FDL 2026 Summer School"
      description="Tutorial on Modeling and Programming Time-Sensitive Systems Using Lingua Franca Coordination Language at the FDL 2026 Summer School"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={clsx(styles.eventBadge, styles.upcoming)}>
            Upcoming Tutorial
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Lingua Franca Tutorial
          </Heading>
          <p className={styles.heroSubtitle}>
            Modeling and Programming Time-Sensitive Systems Using Lingua Franca
            Coordination Language
          </p>
          <div className={styles.eventMeta}>
            <span>📅 September 8, 2026</span>
            <span>📍 Rome, Italy</span>
            <span>
              🎯 Part of the{" "}
              <Link
                href="https://www.fdl-conference.com/phdschool.html"
                className={styles.heroLink}
              >
                FDL 2026 Summer School
              </Link>
            </span>
          </div>
          <p className={styles.heroSubtitle} style={{ marginTop: "20px" }}>
            Hands-on tutorial (2:00 – 4:00 PM CEST, 2 hours)
          </p>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--10 col--offset-1">
              <Heading as="h2" className="text--center margin-bottom--md">
                🚀 Tutorial Quick Links
              </Heading>
              <p className="text--center margin-bottom--lg">
                Start here to set up your environment and get the hands-on lab
                materials.
              </p>
              <div className={clsx("row", styles.quickLinksGrid)}>
                <div className="col col--6 margin-bottom--md">
                  <div className={clsx("card", styles.quickLinkCard)}>
                    <div className="card__body">
                      <span className={styles.quickLinkIcon}>⚙️</span>
                      <Heading as="h3">Install LF</Heading>
                      <p>
                        Set up the Lingua Franca toolchain, VS Code extension,
                        and CLI (this tutorial uses LF v0.13.0).
                      </p>
                      <Link
                        className="button button--primary button--sm"
                        href="https://www.lf-lang.org/docs/installation/"
                      >
                        Installation Instructions
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col col--6 margin-bottom--md">
                  <div className={clsx("card", styles.quickLinkCard)}>
                    <div className="card__body">
                      <span className={styles.quickLinkIcon}>💻</span>
                      <Heading as="h3">Hands-on Labs</Heading>
                      <p>
                        Create your own copy of the tutorial template repository
                        with eight short labs in C and Python.
                      </p>
                      <Link
                        className="button button--primary button--sm"
                        href="https://github.com/lf-lang/lf-tutorial-fdl26"
                      >
                        Open GitHub Labs
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col col--6">
                  <div className={clsx("card", styles.quickLinkCard)}>
                    <div className="card__body">
                      <span className={styles.quickLinkIcon}>📦</span>
                      <Heading as="h3">Ready-to-run VMs</Heading>
                      <p>
                        Download preconfigured VirtualBox and UTM images for
                        Windows and Mac users.
                      </p>
                      <Link
                        className="button button--primary button--sm"
                        href="https://drive.google.com/drive/folders/14Qfywqq8xSTUQFRDE0yKCZQH_-MEAPYa?usp=sharing"
                      >
                        Download Virtual Machines
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2">Abstract</Heading>
              <p>
                This hands-on, interactive tutorial introduces{" "}
                <Link href="/docs/">Lingua Franca (LF)</Link>, a polyglot
                coordination language for building deterministic, time-sensitive
                systems. You write ordinary C or Python code inside{" "}
                <em>reactors</em>, and LF coordinates when that code runs,
                locally or across multiple processes, with a well-defined model
                of time. It is held during the{" "}
                <Link
                  href="https://www.fdl-conference.com/phdschool.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FDL 2026 Summer School
                </Link>{" "}
                in Rome, Italy, part of the Forum on Specification &amp; Design
                Languages (FDL) 2026.
              </p>
              <p>
                The tutorial is built around eight short labs, each centered on
                a small program that you compile, run, and extend. Every lab
                exists in both C and Python, teaching the same LF concepts with
                the same exercises—pick the language you are more comfortable
                with and stay on that path. The tutorial is intended for
                researchers, engineers, and graduate students with programming
                experience interested in the design of time-sensitive systems
                with deterministic concurrency.
              </p>

              <div className={styles.infoBox}>
                <Heading as="h3">🎯 Target Audience</Heading>
                <p>
                  FDL 2026 Summer School participants including Ph.D. students,
                  academic researchers, and industry engineers. No prior
                  experience with LF is required—basic proficiency in C and/or
                  Python is recommended.
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
                💡 Motivation &amp; Relevance
              </Heading>
              <p>
                Time-sensitive systems, such as cyber-physical systems and
                embedded control software, often involve multiple concurrent
                components interacting under real-time constraints. Ensuring
                deterministic behavior and coordinated timing across these
                components is a notorious challenge with conventional
                programming approaches (threads, pub/sub, actor frameworks,
                etc.).
              </p>
              <p>
                Lingua Franca is a polyglot coordination language designed to
                address this challenge by offering a framework for building
                concurrent, time-sensitive systems that behave deterministically
                and predictably. An LF program defines interactions between
                reactive components called <em>reactors</em> and emphasizes
                deterministic coordination with explicit handling of timing.
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
                Schedule: September 8, 2026, 2:00 PM – 4:00 PM (2 hours)
              </p>

              {scheduleItems.map((item, idx) => (
                <div key={idx} className={clsx("card", "margin-bottom--md")}>
                  <div className="card__header">
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div>
                        <Heading as="h4" className="margin-bottom--xs">
                          {item.session}
                        </Heading>
                        <span style={{ fontSize: "0.95rem", opacity: 0.85 }}>
                          {item.time}
                        </span>
                      </div>
                      <span
                        className="badge badge--secondary"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {item.duration}
                      </span>
                    </div>
                  </div>
                  {(item.description || item.leads) && (
                    <div className="card__body">
                      {item.description && (
                        <p
                          className={
                            item.leads
                              ? "margin-bottom--sm"
                              : "margin-bottom--none"
                          }
                        >
                          {item.description}
                        </p>
                      )}
                      {item.leads && (
                        <p
                          className="margin-bottom--none"
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

      {/* The Eight Labs Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                🧪 The Eight Labs
              </Heading>
              <p>
                Each lab is built around a small program you compile, run, and
                extend. The links in the{" "}
                <Link href="https://github.com/lf-lang/lf-tutorial-fdl26">
                  tutorial repository
                </Link>{" "}
                point at both the C and Python versions of every lab. Total
                guided time is about 80-100 minutes, leaving room in a two-hour
                session for setup and questions.
              </p>
              <div style={{ overflowX: "auto", display: "flex", justifyContent: "center" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Lab</th>
                      <th>Theme</th>
                      <th>Main concepts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((lab) => (
                      <tr key={lab.number}>
                        <td>{lab.number}</td>
                        <td>{lab.theme}</td>
                        <td>{lab.concepts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="section">
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
                        <li>Reactors, ports, connections, and state</li>
                        <li>Tags, logical time, and physical time</li>
                        <li>Deterministic reaction ordering and causality</li>
                        <li>Modal reactors, deadlines, and federations</li>
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
                        <li>Writing, compiling, and running LF programs with C or Python</li>
                        <li>Bringing external events into a program with physical actions</li>
                        <li>Enforcing timing requirements with deadlines</li>
                        <li>Turning a multi-reactor program into a federation</li>
                        <li>Using VS Code with the LF extension and diagrams</li>
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
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                💻 Technical Requirements &amp; Setup
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    Participants should bring a laptop for the hands-on
                    sessions. Lingua Franca's toolchain supports{" "}
                    <strong>Linux</strong>, <strong>macOS</strong>, and{" "}
                    <strong>Windows</strong> (via WSL). This tutorial uses{" "}
                    <strong>Lingua Franca v0.13.0</strong>.
                  </p>

                  <div className={clsx(styles.infoBox, "margin-bottom--md")}>
                    <Heading as="h3">Installation guide</Heading>
                    <p className="margin-bottom--sm">
                      Step-by-step setup for the toolchain, VS Code extension,
                      and CLI is in the{" "}
                      <Link href="https://www.lf-lang.org/docs/installation/">
                        Lingua Franca installation documentation
                      </Link>{" "}
                      and in the{" "}
                      <Link href="https://github.com/lf-lang/lf-tutorial-fdl26#setup">
                        tutorial repository's setup section
                      </Link>
                      .
                    </p>
                    <p className="margin-bottom--xs">
                      <strong>Highlights:</strong>
                    </p>
                    <ul className="margin-bottom--none">
                      <li>
                        <strong>Java 17 or higher</strong> is required for the
                        compiler and tooling.
                      </li>
                      <li>
                        <strong>Windows:</strong> use <strong>WSL</strong> with
                        Ubuntu and install all LF components inside Linux (not
                        MSYS/Git Bash).
                      </li>
                      <li>
                        <strong>VS Code:</strong> install the Lingua Franca
                        extension from the Marketplace (
                        <code>lf-lang.vscode-lingua-franca</code>).
                      </li>
                      <li>
                        <strong>CLI:</strong> one-line install with{" "}
                        <code>
                          curl -Ls https://install.lf-lang.org | bash -s cli
                        </code>
                        .
                      </li>
                    </ul>
                  </div>

                  <Heading as="h4">Setup Options</Heading>
                  <ul>
                    <li>
                      <strong>Native Installation (recommended):</strong>{" "}
                      One-line install script or VS Code extension installation,
                      following the installation guide above.
                    </li>
                    <li>
                      <strong>Pre-configured VMs:</strong>{" "}
                      <Link href="https://drive.google.com/drive/folders/14Qfywqq8xSTUQFRDE0yKCZQH_-MEAPYa?usp=sharing">
                        Download the tutorial virtual machines
                      </Link>{" "}
                      with LF v0.13.0, VS Code, the LF extension, and both
                      target toolchains preinstalled. We provide one VirtualBox
                      VM for Windows users on Intel/AMD platforms and one UTM VM
                      for macOS users on ARM architecture.
                    </li>
                  </ul>

                  <Heading as="h4">Dependencies</Heading>
                  <ul className="margin-bottom--none">
                    <li>Java 17+ JDK</li>
                    <li>
                      C path: a C compiler (<code>clang</code> or{" "}
                      <code>gcc</code>) and CMake
                    </li>
                    <li>
                      Python path: Python 3.10 or newer, plus a C compiler and
                      CMake
                    </li>
                    <li>VS Code with the Lingua Franca extension</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hands-on Programming Materials */}
      <div id="hands-on-programming-materials" className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                Hands-on Programming Materials
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    The hands-on session follows the eight labs in the{" "}
                    <Link href="https://github.com/lf-lang/lf-tutorial-fdl26">
                      lf-tutorial-fdl26
                    </Link>{" "}
                    template repository on GitHub. Before the tutorial, create
                    your own private copy from the template (
                    <strong>Use this template</strong> &gt;{" "}
                    <strong>Create a new repository</strong>), clone it, and
                    open the folder in VS Code. The same labs exist in both C
                    and Python.
                  </p>
                  <div className={styles.videoEmbedActions}>
                    <Link
                      className="button button--primary button--lg"
                      href="https://github.com/lf-lang/lf-tutorial-fdl26"
                    >
                      View on GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructors Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                👥 Instructor
              </Heading>
              {instructors.map((instructor, idx) => (
                <div key={idx} className={clsx("card", "margin-bottom--lg")}>
                  <div className="card__body">
                    <div className="row">
                      <div className="col col--3">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            aspectRatio: "1",
                          }}
                        />
                      </div>
                      <div className="col col--9">
                        <Heading as="h3" className="margin-bottom--none">
                          <Link href={instructor.website}>{instructor.name}</Link>
                        </Heading>
                        <p
                          className="margin-bottom--sm margin-top--xs"
                          style={{ opacity: 0.8, fontStyle: "italic" }}
                        >
                          {instructor.affiliation}
                        </p>
                        <p
                          className="margin-bottom--sm"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {instructor.bio}
                        </p>
                        <p
                          className="margin-bottom--none"
                          style={{ fontSize: "0.9rem" }}
                        >
                          📧{" "}
                          <Link href={`mailto:${instructor.email}`}>
                            {instructor.email}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Assistants Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                🧑‍🏫 Teaching Assistant
              </Heading>
              {teachingAssistants.map((ta, idx) => (
                <div key={idx} className={clsx("card", "margin-bottom--lg")}>
                  <div className="card__body">
                    <div className="row">
                      <div className="col col--3">
                        <img
                          src={ta.image}
                          alt={ta.name}
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            aspectRatio: "1",
                          }}
                        />
                      </div>
                      <div className="col col--9">
                        <Heading as="h3" className="margin-bottom--none">
                          <Link href={ta.website}>{ta.name}</Link>
                        </Heading>
                        <p
                          className="margin-bottom--xs margin-top--xs"
                          style={{ fontWeight: 600 }}
                        >
                          {ta.role}
                        </p>
                        <p
                          className="margin-bottom--sm margin-top--xs"
                          style={{ opacity: 0.8, fontStyle: "italic" }}
                        >
                          {ta.affiliation}
                        </p>
                        <p
                          className="margin-bottom--none"
                          style={{ fontSize: "0.9rem" }}
                        >
                          📧{" "}
                          <Link href={`mailto:${ta.email}`}>{ta.email}</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="section sectionAlt">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                📚 Materials &amp; Resources
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    This webpage serves as the central hub for all tutorial
                    materials. Participants can expect to find:
                  </p>
                  <ul>
                    <li>Setup instructions and prerequisites</li>
                    <li>
                      <Link href="#hands-on-programming-materials">
                        Hands-on lab instructions and starter code
                      </Link>
                    </li>
                    <li>Links to the LF documentation and example projects</li>
                  </ul>
                  <p>
                    Materials will be updated as we approach the tutorial date.
                    Check back regularly for the latest resources.
                  </p>

                  <Heading as="h4">Community Support</Heading>
                  <p className="margin-bottom--none">
                    Join the Lingua Franca{" "}
                    <Link href="https://lf-lang.zulipchat.com/">
                      Zulip community
                    </Link>{" "}
                    for Q&amp;A before and after the tutorial. This connects you
                    with an active open-source community spanning multiple
                    institutions for continued learning and support.
                  </p>
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
            Get started with Lingua Franca and learn more about the summer
            school.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className="button button--primary button--lg"
              href="https://www.fdl-conference.com/phdschool.html"
            >
              FDL 2026 Summer School
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
              href="https://github.com/lf-lang/lf-tutorial-fdl26"
            >
              Tutorial Labs on GitHub
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
