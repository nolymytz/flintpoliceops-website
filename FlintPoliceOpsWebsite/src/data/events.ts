export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  featured: boolean;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Flint Farmers Market — Spring Opening",
    date: "2026-04-11",
    time: "9:00 AM – 3:00 PM",
    location: "Flint Farmers Market, 300 E 1st St",
    description:
      "50+ vendors, live music, kids activities, and fresh local produce.",
    featured: true,
  },
  {
    id: "2",
    title: "Community Safety Town Hall",
    date: "2026-04-14",
    time: "6:00 PM – 8:00 PM",
    location: "Berston Field House",
    description:
      "Meet your local police officers and discuss neighborhood safety.",
    featured: false,
  },
  {
    id: "3",
    title: "Small Business Networking Mixer",
    date: "2026-04-18",
    time: "5:30 PM – 7:30 PM",
    location: "Flint Institute of Arts",
    description:
      "Connect with local entrepreneurs and business owners over appetizers.",
    featured: true,
  },
  {
    id: "4",
    title: "Youth Basketball Tournament",
    date: "2026-04-20",
    time: "10:00 AM – 4:00 PM",
    location: "Dort Federal Credit Union Event Center",
    description: "Annual spring tournament for ages 10–17. Free admission.",
    featured: false,
  },
];
