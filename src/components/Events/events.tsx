export interface Event {
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  link?: string;
  type: "conference" | "workshop" | "meetup" | "webinar" | "hackathon";
  isUpcoming: boolean;
}

// Add your events here
// Events are automatically sorted by date
export const events: Event[] = [
  // Example events - replace with actual events
  // {
  //   title: "Lingua Franca Workshop 2025",
  //   date: "2025-03-15",
  //   endDate: "2025-03-16",
  //   location: "UC Berkeley, CA",
  //   description: "A two-day workshop on reactor-oriented programming with Lingua Franca.",
  //   link: "https://example.com/workshop",
  //   type: "workshop",
  //   isUpcoming: true,
  // },
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

