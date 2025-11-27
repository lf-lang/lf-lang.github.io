import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import styles from "./event-page.module.css";

interface VideoSection {
  title: string;
  description: string;
  videoUrl: string;
  topics: { name: string; timestamp: string; url: string }[];
}

const videoSections: VideoSection[] = [
  {
    title: "Part I: Introduction",
    description:
      "This part briefly describes the background of the project and explains how to get started with the software.",
    videoUrl:
      "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1",
    topics: [
      {
        name: "Introduction",
        timestamp: "0:00",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=0s",
      },
      {
        name: "Motivation",
        timestamp: "1:01",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=61s",
      },
      {
        name: "Overview of this tutorial",
        timestamp: "3:05",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=185s",
      },
      {
        name: "History of the project",
        timestamp: "11:08",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=668s",
      },
      {
        name: "Participating",
        timestamp: "14:57",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=897s",
      },
      {
        name: "Getting started",
        timestamp: "15:25",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=925s",
      },
      {
        name: "Native releases (Epoch IDE and lfc)",
        timestamp: "17:43",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=1063s",
      },
      {
        name: "Virtual Machine with LF pre-installed",
        timestamp: "21:51",
        url: "https://www.youtube.com/watch?v=7vkhX5tS_oI&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=1&t=1311s",
      },
    ],
  },
  {
    title: "Part II: Hello World",
    description:
      "This part introduces the language with a simple example.",
    videoUrl:
      "https://www.youtube.com/watch?v=GNwaf4OpfPM&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=2",
    topics: [
      {
        name: "Open Epoch and create a project",
        timestamp: "0:00",
        url: "https://www.youtube.com/watch?v=GNwaf4OpfPM&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=2&t=0s",
      },
      {
        name: "Hello World",
        timestamp: "1:44",
        url: "https://www.youtube.com/watch?v=GNwaf4OpfPM&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=2&t=104s",
      },
      {
        name: "Adding a timer",
        timestamp: "4:44",
        url: "https://www.youtube.com/watch?v=GNwaf4OpfPM&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=2&t=284s",
      },
    ],
  },
  {
    title: "Part III: Target Languages",
    description:
      "This part describes how different target languages work with Lingua Franca.",
    videoUrl:
      "https://www.youtube.com/watch?v=k0LtpH9VFCE&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=3",
    topics: [],
  },
  {
    title: "Part IV: Basic Concepts",
    description:
      "This part covers fundamental concepts including composing reactors, parameters, state variables, and physical actions.",
    videoUrl:
      "https://www.youtube.com/watch?v=tl3F_jgc248&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=4",
    topics: [],
  },
  {
    title: "Part V: Concurrency",
    description:
      "This part focuses on how the language expresses concurrency, exploits multicore, and supports distributed execution.",
    videoUrl:
      "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5",
    topics: [
      {
        name: "Introduction",
        timestamp: "0:00",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=0s",
      },
      {
        name: "Banks and Multiports",
        timestamp: "0:39",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=39s",
      },
      {
        name: "Utilizing Multicore",
        timestamp: "9:29",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=569s",
      },
      {
        name: "Tracing",
        timestamp: "17:49",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=1069s",
      },
      {
        name: "Performance",
        timestamp: "23:40",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=1420s",
      },
      {
        name: "Federated Execution",
        timestamp: "29:25",
        url: "https://www.youtube.com/watch?v=MoTf8L0jOD0&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=5&t=1765s",
      },
    ],
  },
  {
    title: "Part VI: Research Overview",
    description:
      "This part focuses on a few of the research projects that have been stimulated by the Lingua Franca project.",
    videoUrl:
      "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6",
    topics: [
      {
        name: "Introduction",
        timestamp: "0:00",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=0s",
      },
      {
        name: "AUTOSAR",
        timestamp: "6:15",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=375s",
      },
      {
        name: "Autoware/Carla",
        timestamp: "14:27",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=867s",
      },
      {
        name: "Bare Iron Platforms",
        timestamp: "27:43",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=1663s",
      },
      {
        name: "Modal Models",
        timestamp: "34:36",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=2076s",
      },
      {
        name: "Automated Verification",
        timestamp: "40:32",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=2432s",
      },
      {
        name: "Secure Federated Execution",
        timestamp: "47:57",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=2877s",
      },
      {
        name: "LF Language Server",
        timestamp: "54:07",
        url: "https://www.youtube.com/watch?v=afJowM35YHg&list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o&index=6&t=3247s",
      },
    ],
  },
];

const VideoCard = ({ section }: { section: VideoSection }) => (
  <div className={clsx("card", "margin-bottom--lg", styles.videoCard)}>
    <div className="card__header">
      <Heading as="h3">{section.title}</Heading>
    </div>
    <div className="card__body">
      <p>{section.description}</p>
      {section.topics.length > 0 && (
        <div className={styles.topicList}>
          <strong>Topics covered:</strong>
          <ul>
            {section.topics.map((topic, idx) => (
              <li key={idx}>
                <Link href={topic.url}>
                  {topic.name} ({topic.timestamp})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className="card__footer">
      <Link
        className="button button--primary button--sm"
        href={section.videoUrl}
      >
        Watch Video
      </Link>
    </div>
  </div>
);

export default function ESWEEKTutorial() {
  return (
    <Layout
      title="ESWEEK 2021 Tutorial"
      description="Lingua Franca Tutorial at EMSOFT/ESWEEK 2021"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.eventBadge}>Past Event</div>
          <Heading as="h1" className={styles.heroTitle}>
            Lingua Franca Tutorial
          </Heading>
          <p className={styles.heroSubtitle}>
            EMSOFT Conference at Embedded Systems Week (ESWEEK) 2021
          </p>
          <div className={styles.eventMeta}>
            <span>📅 October 8, 2021</span>
            <span>📍 Online</span>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2">About This Tutorial</Heading>
              <p>
                Lingua Franca (LF) is a polyglot coordination language for
                concurrent and possibly time-sensitive applications ranging from
                low-level embedded code to distributed cloud and edge
                applications. This tutorial was offered on October 8, 2021, as
                part of the EMSOFT conference at ESWEEK (Embedded Systems Week).
              </p>
              <p>
                The complete tutorial is available as a{" "}
                <Link href="https://www.youtube.com/playlist?list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o">
                  video playlist on YouTube
                </Link>
                , organized into six segments covering everything from basic
                concepts to advanced research topics.
              </p>

              <div className={styles.resourceLinks}>
                <Heading as="h3">Quick Links</Heading>
                <ul>
                  <li>
                    <Link href="https://www.youtube.com/playlist?list=PL4zzL7roKtfXyKE3k8lOwPub9YEjulS4o">
                      Complete Video Playlist
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/lf-lang/lingua-franca/wiki/Tutorial">
                      Original Tutorial Wiki Page
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/">Current Lingua Franca Documentation</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Sections */}
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            Tutorial Videos
          </Heading>
          <div className="row">
            <div className="col col--8 col--offset-2">
              {videoSections.map((section, idx) => (
                <VideoCard key={idx} section={section} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="section">
        <div className="container text--center">
          <Heading as="h2">Ready to Get Started?</Heading>
          <p>
            Check out our up-to-date documentation and start building with
            Lingua Franca today.
          </p>
          <div className={styles.ctaButtons}>
            <Link className="button button--primary button--lg" href="/docs/installation">
              Install Lingua Franca
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="/docs/"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

