import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";
import bannerStyles from "./cpsweek-2026-tutorial.module.css";

interface ScheduleItem {
  session: string;
  duration: string;
  time: string;
  description?: React.ReactNode;
  leads?: string;
}

interface TeaserVideo {
  youtubeId: string;
  shortUrl: string;
  title: string;
  description: React.ReactNode;
}

const teaserVideos: TeaserVideo[] = [
  {
    youtubeId: "C_g9nNrR2GY",
    shortUrl: "https://youtu.be/C_g9nNrR2GY",
    title: "Lingua Franca tutorial teaser",
    description:
      "Using Lingua Franca for building agentic-AI powered human-in-the-loop CPS: Agentic Driving Coach.",
  },
  {
    youtubeId: "ucXgmFU9k_4",
    shortUrl: "https://youtu.be/ucXgmFU9k_4",
    title: "Lingua Franca tutorial teaser — additional preview",
    description:
      "Another preview of the CPS-IoT Week hands-on Lingua Franca tutorial.",
  },
];

const scheduleItems: ScheduleItem[] = [
  {
    session: "Introductory Presentations",
    duration: "45 minutes",
    time: "2:00 PM – 2:45 PM",
    description:
      "Introduction to CPS concurrency challenges and motivation for Lingua Franca. Explanation of the reactor-oriented programming model and key language concepts (reactors, ports, timers, logical time). Real-world scenarios in automotive and avionic systems where deterministic coordination is vital.",
    leads: "Organizers",
  },
  {
    session: "Live Demos",
    duration: "45 minutes",
    time: "2:45 PM – 3:30 PM",
    description: (
      <>
        CPS-focused example applications built with LF, including distributed
        (federated) execution, physics simulation integration, and embodied AI
        agents using robotic platforms. Demos will leverage example programs
        from the{" "}
        <Link href="https://github.com/lf-lang/playground-lingua-franca">
          LF Playground
        </Link>{" "}
        and{" "}
        <Link href="https://github.com/lf-lang/lf-demos">LF Demos</Link>{" "}
        repositories such as the vehicle simulation integrated with the
        physics-based simulation engine,{" "}
        <Link href="https://mujoco.org/">MuJoCo</Link>.
      </>
    ),
    leads: "Organizers",
  },
  {
    session: "Installation and Hello World of Lingua Franca",
    duration: "30 minutes",
    time: "3:30 PM – 4:00 PM",
    description:
      "Set up your Lingua Franca toolchain and walk through a minimal “hello world” style program to verify your environment.",
    leads: "Organizers & Teaching Assistants",
  },
  {
    session: "Break",
    duration: "30 minutes",
    time: "4:00 PM – 4:30 PM",
  },
  {
    session: "Hands-on Programming Sessions",
    duration: "80 minutes",
    time: "4:30 PM – 5:50 PM",
    description:
      "Interactive coding sessions with progressively challenging exercises using CPS-themed examples. Hands-on work uses the C target in Lingua Franca, starting from template code provided for the tutorial; participants implement distributed cyber-physical system examples that build on these templates.",
    leads: "Organizers & Teaching Assistants",
  },
  {
    session: "Wrap-Up and Q&A",
    duration: "10 minutes",
    time: "5:50 PM – 6:00 PM",
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
  image: string;
}

const organizers: Organizer[] = [
  {
    name: "Hokeun Kim",
    affiliation: "Arizona State University, USA",
    email: "hokeun@asu.edu",
    website: "https://hokeun.github.io/",
    image: "/img/events/cpsweek-2026-tutorial/hokeun-kim.jpg",
    bio: "Assistant professor of Computer Science and Engineering in the School of Computing and Augmented Intelligence (SCAI) at Arizona State University. Ph.D. in EECS from UC Berkeley (2017) with a focus on distributed cyber-physical systems and IoT security. Research interests include cyber-physical systems, distributed systems, real-time systems, computer security, and computer architecture. Recipient of ACM/IEEE Best Paper Award at CPSWeek, IEEE Micro Top Picks Honorable Mention, and 1st Place in ESSC at ESWEEK.",
  },
  {
    name: "Chadlia Jerad",
    affiliation: "University of Manouba, Tunisia",
    email: "chadlia.jerad@ensi-uma.tn",
    website: "https://chadliajerad.github.io/",
    image: "/img/events/cpsweek-2026-tutorial/chadlia-jerad.jpg",
    bio: "Associate professor at the National School of Computer Science (ENSI), University of Manouba, Tunisia. Fulbright Visiting Scholar at EECS, UC Berkeley in 2016-2017 (Accessors project) and 2022-2023 (Lingua Franca project). Recognized by DAAD Tunisia as 'Portrait of the Month' in 2018. Research interests include embedded and cyber-physical systems, distributed and real-time systems, computer architecture, and formal verification.",
  },
  {
    name: "Edward A. Lee",
    affiliation: "University of California, Berkeley, USA",
    email: "eal@berkeley.edu",
    website: "https://ptolemy.berkeley.edu/~eal/",
    image: "/img/events/cpsweek-2026-tutorial/edward-lee.jpg",
    bio: "Professor of the Graduate School and Distinguished Professor Emeritus in EECS at UC Berkeley. Author of seven books and hundreds of papers. Director of iCyPhy, the Berkeley Industrial Cyber-Physical Systems Research Center. Fellow of the IEEE, NSF Presidential Young Investigator. Awards include the 2016 IEEE TCRTS Outstanding Technical Achievement and Leadership Award, 2019 IEEE TCCPS Technical Achievement Award, 2022 EDAA Achievement Award, 2022 ACM SIGBED Technical Achievement Award, and Honorary Doctorate from the Technical University of Vienna (2022).",
  },
];

interface TeachingAssistant {
  name: string;
  role: string;
  affiliation: string;
  email: string;
  linkedIn: string;
  image: string;
}

const teachingAssistants: TeachingAssistant[] = [
  {
    name: "Deeksha Prahlad",
    role: "Ph.D. Student",
    affiliation: "Arizona State University, USA",
    email: "dprahlad@asu.edu",
    linkedIn: "https://www.linkedin.com/in/deekshaprahlad/",
    image: "/img/events/cpsweek-2026-tutorial/deeksha-prahlad.jpg",
  },
  {
    name: "Daniel Fan",
    role: "Undergraduate Student",
    affiliation: "Arizona State University, USA",
    email: "danielfa@asu.edu",
    linkedIn: "https://www.linkedin.com/in/daniel-fan-801b8235b/",
    image: "/img/events/cpsweek-2026-tutorial/daniel-fan.jpg",
  },
];

export default function CPSWeek2026Tutorial() {
  return (
    <Layout
      title="LF Tutorial at CPS-IoT Week 2026"
      description="Tutorial on Lingua Franca: An Open-Source Coordination Language for Deterministic Integration of Cyber-Physical Systems at CPS-IoT Week 2026"
    >
      {/* Hero Section */}
      <div className={bannerStyles.heroWithBanner}>
        <div className="container">
          <div className={clsx(styles.eventBadge, styles.upcoming, bannerStyles.heroBadge)}>
            Upcoming Tutorial
          </div>
          <Heading as="h1" className={clsx(styles.heroTitle, bannerStyles.heroHeading)}>
            Lingua Franca:
          </Heading>
          <p className={clsx(styles.heroSubtitle, bannerStyles.heroTagline)}>
            An Open-Source Coordination Language for Deterministic Integration
            of Cyber-Physical Systems
          </p>
          <div className={clsx(styles.eventMeta, bannerStyles.heroDetails)}>
            <span>📅 May 11, 2026</span>
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
          <p className={bannerStyles.heroFootnote}>
            Half-day hands-on tutorial (2:00 - 6:00 PM CET, 4 hours)
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
                language. It is held during{" "}
                <Link
                  href="https://cps-iot-week2026.inria.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CPS-IoT Week 2026
                </Link>
                , the premier CPS and IoT research week (May 11–14, 2026, Saint
                Malo, France).
              </p>
              <p>
                This tutorial emphasizes how LF enables deterministic
                concurrency, simplifies integration, and enhances reliability
                across CPS and IoT domains. The tutorial is intended for
                researchers, engineers, and graduate students with programming
                experience interested in robust CPS design.
              </p>

              <div className={clsx("card", "margin-top--lg", styles.videoCard)}>
                <div className="card__header">
                  <Heading as="h3">🎬 Demo videos</Heading>
                </div>
                <div className="card__body">
                  {teaserVideos.map((video, idx) => (
                    <div
                      key={video.youtubeId}
                      className={idx > 0 ? "margin-top--lg" : undefined}
                    >
                      <p className="margin-bottom--sm">{video.description}</p>
                      <div className={styles.videoEmbedContainer}>
                        <iframe
                          className={styles.videoEmbed}
                          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                          title={video.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                      <div className={styles.videoEmbedActions}>
                        <Link
                          className="button button--primary button--sm"
                          href={video.shortUrl}
                        >
                          Watch on YouTube
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                Schedule: May 11, 2026, 2:00 PM – 6:00 PM (4 hours including a break)
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
                        <p className={item.leads ? "margin-bottom--sm" : "margin-bottom--none"}>
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
                <div key={idx} className={clsx("card", "margin-bottom--lg")}>
                  <div className="card__body">
                    <div className="row">
                      <div className="col col--3">
                        <img
                          src={organizer.image}
                          alt={organizer.name}
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
                          <Link href={organizer.website}>{organizer.name}</Link>
                        </Heading>
                        <p
                          className="margin-bottom--sm margin-top--xs"
                          style={{ opacity: 0.8, fontStyle: "italic" }}
                        >
                          {organizer.affiliation}
                        </p>
                        <p className="margin-bottom--sm" style={{ fontSize: "0.95rem" }}>
                          {organizer.bio}
                        </p>
                        <p className="margin-bottom--none" style={{ fontSize: "0.9rem" }}>
                          📧{" "}
                          <Link href={`mailto:${organizer.email}`}>
                            {organizer.email}
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
                🧑‍🏫 Teaching Assistants
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
                          <Link href={ta.linkedIn}>{ta.name}</Link>
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
                        <p className="margin-bottom--none" style={{ fontSize: "0.9rem" }}>
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
                📚 Materials & Resources
              </Heading>
              <div className="card">
                <div className="card__body">
                  <p>
                    This webpage serves as the central hub for all tutorial
                    materials. Participants can expect to find:
                  </p>
                  <ul>
                    <li>Setup instructions and prerequisites</li>
                    <li>Slide decks and presentation materials</li>
                    <li>Hands-on exercise instructions and starter code</li>
                    <li>Links to example projects and the LF Playground</li>
                    <li>Video recordings of presentations and demos (after the event)</li>
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

