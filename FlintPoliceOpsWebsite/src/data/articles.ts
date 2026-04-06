export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "crime" | "local" | "community";
  date: string;
  author: string;
  featured: boolean;
  sponsored: boolean;
  image?: string;
  slug: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Flint Police Department Launches Community Safety Initiative",
    excerpt:
      "A new partnership between FPD and neighborhood watch groups aims to reduce crime in the downtown corridor through increased patrols and community engagement programs.",
    category: "crime",
    date: "2026-04-06",
    author: "Flint Police Ops",
    featured: true,
    sponsored: false,
    slug: "fpd-community-safety-initiative",
  },
  {
    id: "2",
    title: "City Council Approves $2.5M for Road Repairs on Saginaw Street",
    excerpt:
      "Major infrastructure improvements coming to Saginaw Street this summer. Construction expected to begin in June with completion by October.",
    category: "local",
    date: "2026-04-05",
    author: "Flint Police Ops",
    featured: true,
    sponsored: false,
    slug: "saginaw-street-road-repairs",
  },
  {
    id: "3",
    title: "Weekend Crime Report: Vehicle Thefts Down 15% in March",
    excerpt:
      "Flint PD reports a significant decrease in vehicle thefts compared to the same period last year, crediting new surveillance technology and community tips.",
    category: "crime",
    date: "2026-04-05",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "march-vehicle-theft-report",
  },
  {
    id: "4",
    title: "Local HVAC Company Expands Operations in Genesee County",
    excerpt:
      "Comfort Air Solutions announces a new service center and 25 new jobs, bringing reliable heating and cooling services closer to Flint families.",
    category: "community",
    date: "2026-04-04",
    author: "Sponsored",
    featured: false,
    sponsored: true,
    slug: "comfort-air-expansion",
  },
  {
    id: "5",
    title: "Flint Farmers Market Kicks Off Spring Season This Saturday",
    excerpt:
      "Over 50 vendors expected at the grand opening of the 2026 spring season. Live music, kids activities, and fresh local produce.",
    category: "community",
    date: "2026-04-04",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "farmers-market-spring-2026",
  },
  {
    id: "6",
    title: "Two Arrested in Connection with East Side Burglary Ring",
    excerpt:
      "Flint Police detectives apprehended two suspects linked to a series of residential break-ins spanning three months across the east side.",
    category: "crime",
    date: "2026-04-03",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "east-side-burglary-arrests",
  },
  {
    id: "7",
    title: "New Youth Center Opens on MLK Ave — Free Programs for Teens",
    excerpt:
      "The Flint Youth Development Center opens its doors with after-school tutoring, sports leagues, and career mentorship for ages 12–18.",
    category: "community",
    date: "2026-04-03",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "youth-center-mlk-ave",
  },
  {
    id: "8",
    title: "Water Quality Update: Latest Test Results Show Continued Improvement",
    excerpt:
      "City officials release quarterly water testing data showing lead levels remain below federal action levels for the 8th consecutive quarter.",
    category: "local",
    date: "2026-04-02",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "water-quality-q1-2026",
  },
  {
    id: "9",
    title: "Looking for Reliable Auto Repair? Check Out Motor City Garage",
    excerpt:
      "Family-owned since 1998, Motor City Garage offers honest pricing and certified mechanics. Now offering free diagnostics for Flint residents.",
    category: "local",
    date: "2026-04-02",
    author: "Sponsored",
    featured: false,
    sponsored: true,
    slug: "motor-city-garage-spotlight",
  },
  {
    id: "10",
    title: "Community Cleanup Day Draws 200+ Volunteers Across 8 Neighborhoods",
    excerpt:
      "Residents came together to clean up parks, vacant lots, and streets in one of the largest volunteer events Flint has seen this year.",
    category: "community",
    date: "2026-04-01",
    author: "Flint Police Ops",
    featured: false,
    sponsored: false,
    slug: "community-cleanup-day-2026",
  },
];

export const categoryLabels: Record<Article["category"], string> = {
  crime: "Crime & Safety",
  local: "Local News",
  community: "Community",
};

export const categoryColors: Record<Article["category"], string> = {
  crime: "bg-red-600",
  local: "bg-blue-600",
  community: "bg-green-600",
};
