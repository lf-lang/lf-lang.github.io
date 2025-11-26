export interface Event {
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  link?: string;
  type: "conference" | "workshop" | "meetup" | "webinar" | "hackathon";
  isUpcoming: boolean;
  isExternal?: boolean; // true if link goes to external site
}

// Add your events here
// Events are automatically sorted by date
export const events: Event[] = [
  // Upcoming Events
  {
    title: "ReCPS: Workshop on Reactive Cyber-Physical Systems",
    date: "2026-04-20",
    endDate: "2026-04-22",
    location: "DATE 2026 Conference, Verona, Italy",
    description:
      "Workshop on Reactive Cyber-Physical Systems: Design, Simulation, and Coordination. Co-located with the Design, Automation and Test in Europe (DATE) Conference 2026.",
    link: "/events/recps-2026",
    type: "workshop",
    isUpcoming: true,
  },
  // Past Events
  {
    title: "TCRS Workshop Series",
    date: "2024-01-01",
    location: "Various Locations",
    description:
      "Workshop series on Timing Centric Reactive Software, exploring reactor-oriented programming and time-sensitive applications.",
    link: "https://www.tcrs.io/",
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
    type: "workshop",
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

