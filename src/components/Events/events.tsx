export interface Event {
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  link?: string;
  type: "conference" | "workshop" | "meetup" | "webinar" | "hackathon" | "tutorial";
  isUpcoming: boolean;
  isExternal?: boolean; // true if link goes to external site
}

// Add your events here
// Events are automatically sorted by date
export const events: Event[] = [
  // Upcoming Events
  {
    title: "Lingua Franca Tutorial at CPS-IoT Week 2026",
    date: "2026-05-11",
    location: "Saint Malo, France (CPS-IoT Week 2026)",
    description:
      "Half-day hands-on tutorial on Lingua Franca, an open-source coordination language for building deterministic, concurrent, and time-sensitive cyber-physical systems. Includes technical overview, CPS demos, and programming sessions with C and Python.",
    link: "/events/cpsweek-2026-tutorial",
    type: "tutorial",
    isUpcoming: true,
  },
  {
    title: "ReCPS: Workshop on Reactive Cyber-Physical Systems",
    date: "2026-04-20",
    location: "Verona, Italy (DATE 2026 Conference)",
    description:
      "Workshop on Reactive Cyber-Physical Systems: Design, Simulation, and Coordination, co-located with the Design, Automation and Test in Europe (DATE) Conference 2026.",
    link: "/events/recps-2026",
    type: "workshop",
    isUpcoming: true,
  },
  // Past Events
  {
    title: "TCRS '25: Time-Centric Reactive Software",
    date: "2025-10-02",
    location: "Taipei, Taiwan (ESWEEK 2025)",
    description:
      "Third edition of the workshop on Time-Centric Reactive Software, co-located with Embedded Systems Week (ESWEEK) 2025 at the Taipei International Convention Center.",
    link: "https://www.tcrs.io/",
    type: "workshop",
    isUpcoming: false,
    isExternal: true,
  },
  {
    title: "TCRS '24: Time-Centric Reactive Software",
    date: "2024-10-03",
    location: "Raleigh, NC, USA (ESWEEK 2024)",
    description:
      "Second edition of the workshop on Time-Centric Reactive Software, co-located with Embedded Systems Week (ESWEEK) 2024.",
    link: "https://www.tcrs.io/2024/",
    type: "workshop",
    isUpcoming: false,
    isExternal: true,
  },
  {
    title: "TCRS '23: Time-Centric Reactive Software",
    date: "2023-05-09",
    location: "San Antonio, Texas (CPS-IoT Week 2023)",
    description:
      "First edition of the workshop on Time-Centric Reactive Software, co-located with ACM/IEEE CPS-IoT Week 2023.",
    link: "https://www.tcrs.io/2023/",
    type: "workshop",
    isUpcoming: false,
    isExternal: true,
  },
  {
    title: "Lingua Franca Tutorial at ESWEEK 2021",
    date: "2021-10-08",
    location: "Online (EMSOFT Conference)",
    description:
      "A comprehensive tutorial introducing Lingua Franca, a polyglot coordination language for concurrent and time-sensitive applications. Part of the Embedded Systems Week (ESWEEK) 2021.",
    link: "/events/esweek-2021-tutorial",
    type: "tutorial",
    isUpcoming: false,
  },
];

// Helper to sort events by date
export const sortEventsByDate = (eventList: Event[], ascending = true): Event[] => {
  return [...eventList].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const upcomingEvents = sortEventsByDate(
  events.filter((e) => e.isUpcoming),
  true
);

export const pastEvents = sortEventsByDate(
  events.filter((e) => !e.isUpcoming),
  false
);

