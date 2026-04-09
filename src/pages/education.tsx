import clsx from "clsx";
import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

interface EducationItem {
  title: string;
  href: string;
  external?: boolean;
  /** Decorative emoji shown before the card title */
  icon: string;
  description: ReactNode;
}

const labMaterials: EducationItem[] = [
  {
    icon: "🔬",
    title: "Embedded Systems Labs",
    href: "https://www.lf-lang.org/embedded-lab/index.html",
    external: true,
    description: (
      <>
        <p>
          A full sequence of <strong>hands-on labs</strong> for introductory{" "}
          <strong>embedded systems</strong> and{" "}
          <strong>cyber-physical systems</strong>. Exercises use{" "}
          <strong>Lingua Franca</strong> for timing, concurrency, and modal
          models, with reactor logic in <strong>C</strong> on the{" "}
          <strong>Raspberry Pi RP2040</strong> (Pololu 3pi+ 2040 robot).
        </p>
        <p className="margin-bottom--none">
          Accompanied by the textbook{" "}
          <Link
            href="https://ptolemy.berkeley.edu/books/leeseshia/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <em>
              <strong>
                Introduction to Embedded Systems: A Cyber-Physical Systems
                Approach
              </strong>
            </em>
          </Link>{" "}
          by <strong>Edward A. Lee</strong> and <strong>Sanjit A. Seshia</strong>{" "}
          (2nd ed., MIT Press, 2017)—the standard CPS/embedded systems textbook.
        </p>
      </>
    ),
  },
];

const upcomingTutorials: EducationItem[] = [
  {
    icon: "📅",
    title: "Lingua Franca Tutorial at CPS-IoT Week 2026",
    href: "/events/cpsweek-2026-tutorial/",
    description: (
      <p className="margin-bottom--none">
        <strong>Half-day, in-person</strong> tutorial on{" "}
        <strong>Lingua Franca</strong> for deterministic integration of
        cyber-physical systems: <strong>technical overview</strong>,{" "}
        <strong>CPS-focused demos</strong>, and hands-on programming in{" "}
        <strong>C</strong> and <strong>Python</strong>. Offered during{" "}
        <Link
          href="https://cps-iot-week2026.inria.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>CPS-IoT Week 2026</strong>
        </Link>{" "}
        (<strong>May 11, 2026</strong>, Saint Malo, France).
      </p>
    ),
  },
];

const pastTutorials: EducationItem[] = [
  {
    icon: "🎬",
    title: "Lingua Franca Tutorial at ESWEEK 2021",
    href: "/events/esweek-2021-tutorial/",
    description: (
      <p className="margin-bottom--none">
        <strong>Recorded tutorial</strong> from <strong>EMSOFT</strong> as part
        of{" "}
        <Link
          href="https://esweek.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Embedded Systems Week (ESWEEK)</strong>
        </Link>{" "}
        <strong>2021</strong> (online), covering motivation, language basics,
        and hands-on use of <strong>Lingua Franca</strong> with supporting videos
        and materials on the event page.
      </p>
    ),
  },
  {
    icon: "▶️",
    title: "Tutorial videos (playlist)",
    href: "/docs/videos/",
    description: (
      <p className="margin-bottom--none">
        <strong>Curated video walkthroughs</strong> from past tutorials,
        including sessions from the <strong>2021</strong>{" "}
        <Link
          href="https://esweek.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>ESWeek</strong>
        </Link>{" "}
        tutorial, for <strong>self-paced</strong> learning alongside the{" "}
        <strong>handbook</strong>.
      </p>
    ),
  },
];

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <div className={clsx("card", "margin-bottom--md")}>
      <div className="card__header">
        <Heading
          as="h3"
          className="margin-bottom--none"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "1.35rem", lineHeight: 1 }}>
            {item.icon}
          </span>
          {item.external ? (
            <Link href={item.href} target="_blank" rel="noopener noreferrer">
              {item.title}
            </Link>
          ) : (
            <Link to={item.href}>{item.title}</Link>
          )}
        </Heading>
      </div>
      <div className="card__body">{item.description}</div>
    </div>
  );
}

export default function Education(): JSX.Element {
  return (
    <Layout
      title="Education"
      description="Educational materials, labs, and tutorials for learning Lingua Franca and the reactor model."
    >
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h1" className="text--center margin-bottom--md">
                <span aria-hidden="true">🎓 </span>
                Education
              </Heading>
              <p className="text--center margin-bottom--lg">
                <strong>Courseware</strong>, <strong>lab sequences</strong>, and{" "}
                <strong>tutorials</strong> for teaching and learning{" "}
                <strong>Lingua Franca</strong>,{" "}
                <strong>deterministic concurrency</strong>, and{" "}
                <strong>cyber-physical systems</strong>. For conference
                workshops and meetups, see also the{" "}
                <Link to="/events/">
                  <strong>Events</strong>
                </Link>{" "}
                page.
              </p>

              <Heading as="h2" className="margin-bottom--md">
                <span aria-hidden="true">📚 </span>
                Labs &amp; courseware
              </Heading>
              {labMaterials.map((item) => (
                <EducationCard key={item.title} item={item} />
              ))}

              <Heading as="h2" className="margin-top--lg margin-bottom--md">
                <span aria-hidden="true">✨ </span>
                Upcoming tutorials
              </Heading>
              {upcomingTutorials.map((item) => (
                <EducationCard key={item.title} item={item} />
              ))}

              <Heading as="h2" className="margin-top--lg margin-bottom--md">
                <span aria-hidden="true">📼 </span>
                Past tutorials
              </Heading>
              {pastTutorials.map((item) => (
                <EducationCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
