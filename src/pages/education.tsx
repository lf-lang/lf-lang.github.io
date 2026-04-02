import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

interface EducationItem {
  title: string;
  href: string;
  external?: boolean;
  description: string;
}

const labMaterials: EducationItem[] = [
  {
    title: "Embedded Systems Labs",
    href: "https://www.lf-lang.org/embedded-lab/index.html",
    external: true,
    description:
      "A full sequence of hands-on labs for introductory embedded systems and cyber-physical systems. Exercises use Lingua Franca for timing, concurrency, and modal models, with reactor logic in C on the Raspberry Pi RP2040 (Pololu 3pi+ 2040 robot). Designed as companion material for Lee and Seshia, Introduction to Embedded Systems: A Cyber-Physical Systems Approach.",
  },
];

const upcomingTutorials: EducationItem[] = [
  {
    title: "Lingua Franca Tutorial at CPS-IoT Week 2026",
    href: "/events/cpsweek-2026-tutorial/",
    description:
      "Half-day, in-person tutorial on Lingua Franca for deterministic integration of cyber-physical systems: overview, CPS-focused demos, and hands-on programming in C and Python (May 2026, Saint Malo, France).",
  },
];

const pastTutorials: EducationItem[] = [
  {
    title: "Lingua Franca Tutorial at ESWEEK 2021",
    href: "/events/esweek-2021-tutorial/",
    description:
      "Recorded tutorial from EMSOFT / Embedded Systems Week 2021 (online), covering motivation, language basics, and hands-on use of Lingua Franca with supporting videos and materials on the event page.",
  },
  {
    title: "Tutorial videos (playlist)",
    href: "/docs/videos/",
    description:
      "Curated video walkthroughs from past tutorials, including the 2021 ESWEEK sessions, for self-paced learning alongside the handbook.",
  },
];

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <div className={clsx("card", "margin-bottom--md")}>
      <div className="card__header">
        <Heading as="h3" className="margin-bottom--none">
          {item.external ? (
            <Link href={item.href} target="_blank" rel="noopener noreferrer">
              {item.title}
            </Link>
          ) : (
            <Link to={item.href}>{item.title}</Link>
          )}
        </Heading>
      </div>
      <div className="card__body">
        <p className="margin-bottom--none">{item.description}</p>
      </div>
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
                Education
              </Heading>
              <p className="text--center margin-bottom--lg">
                Courseware, lab sequences, and tutorials for teaching and
                learning Lingua Franca, deterministic concurrency, and
                cyber-physical systems. For conference workshops and meetups, see
                also the{" "}
                <Link to="/events/">Events</Link> page.
              </p>

              <Heading as="h2" className="margin-bottom--md">
                Labs & courseware
              </Heading>
              {labMaterials.map((item) => (
                <EducationCard key={item.title} item={item} />
              ))}

              <Heading as="h2" className="margin-top--lg margin-bottom--md">
                Upcoming tutorials
              </Heading>
              {upcomingTutorials.map((item) => (
                <EducationCard key={item.title} item={item} />
              ))}

              <Heading as="h2" className="margin-top--lg margin-bottom--md">
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
