import clsx from "clsx";

import Translate from "@docusaurus/Translate";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

import { Event, upcomingEvents, pastEvents } from "./events";
import styles from "./styles.module.css";

// Calendar icon
const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Location pin icon
const LocationIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Empty calendar icon
const EmptyCalendarIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const formatDate = (dateStr: string, endDateStr?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const startDate = new Date(dateStr).toLocaleDateString("en-US", options);

  if (endDateStr) {
    const endDate = new Date(endDateStr).toLocaleDateString("en-US", options);
    return `${startDate} - ${endDate}`;
  }

  return startDate;
};

// External link icon
const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: "4px", verticalAlign: "middle" }}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const EventCard = ({ event }: { event: Event }) => {
  const typeClassName = styles[event.type] || "";
  const linkProps = event.isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className={clsx("card", "margin-bottom--md", styles.eventCard)}>
      <div className="card__header">
        <div className="row">
          <div className="col">
            <span className={clsx(styles.eventType, typeClassName)}>
              {event.type}
            </span>
            <Heading as="h3" className="margin-top--sm margin-bottom--none">
              {event.link ? (
                <Link href={event.link} {...linkProps}>
                  {event.title}
                  {event.isExternal && <ExternalLinkIcon />}
                </Link>
              ) : (
                event.title
              )}
            </Heading>
          </div>
        </div>
      </div>
      <div className="card__body">
        <p>{event.description}</p>
        <div className={styles.eventMeta}>
          <span>
            <CalendarIcon /> {formatDate(event.date, event.endDate)}
          </span>
          <span>
            <LocationIcon /> {event.location}
          </span>
        </div>
      </div>
      {event.link && (
        <div className="card__footer">
          <Link
            className="button button--primary button--sm"
            href={event.link}
            {...linkProps}
          >
            <Translate>{event.isExternal ? "Visit Website" : "Learn More"}</Translate>
            {event.isExternal && <ExternalLinkIcon />}
          </Link>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className={styles.emptyState}>
    <EmptyCalendarIcon />
    <p>{message}</p>
  </div>
);

export default function Events(): JSX.Element {
  return (
    <Layout
      title="Events"
      description="Lingua Franca events, workshops, and conferences"
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            <Translate>Events</Translate>
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate>
              Join us at conferences, workshops, and meetups to learn more about
              Lingua Franca and connect with the community.
            </Translate>
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="section">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            <Translate>Upcoming Events</Translate>
          </Heading>
          {upcomingEvents.length > 0 ? (
            <div className="row">
              <div className="col col--8 col--offset-2">
                {upcomingEvents.map((event, idx) => (
                  <EventCard key={idx} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No upcoming events scheduled. Check back soon or follow us on Zulip for announcements!" />
          )}
        </div>
      </div>

      {/* Past Events */}
      <div className="section sectionAlt">
        <div className="container">
          <Heading
            as="h2"
            className={clsx("margin-bottom--lg", "text--center")}
          >
            <Translate>Past Events</Translate>
          </Heading>
          {pastEvents.length > 0 ? (
            <div className="row">
              <div className="col col--8 col--offset-2">
                {pastEvents.map((event, idx) => (
                  <EventCard key={idx} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No past events to display yet." />
          )}
        </div>
      </div>
    </Layout>
  );
}

