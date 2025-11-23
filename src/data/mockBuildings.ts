export interface Building {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  borough: string;
  totalUnits: number;
  availableUnits: number;
  yearBuilt: number;
  description: string;
  amenities: string[];
  image: string;
  galleryImages: string[];
  type: "luxury" | "boutique" | "prewar" | "new-development";
}

export const mockBuildings: Building[] = [
  {
    id: "1",
    name: "the laureate",
    address: "21 east 12th street",
    neighborhood: "greenwich village",
    borough: "manhattan",
    totalUnits: 48,
    availableUnits: 3,
    yearBuilt: 2019,
    description: "the laureate is a distinguished collection of just 48 residences in greenwich village. designed by morris adjmi architects, this boutique condominium offers refined interiors, exceptional amenities, and a prime location steps from union square. each residence features custom millwork, wide-plank oak flooring, and floor-to-ceiling windows.",
    amenities: [
      "24-hour doorman",
      "fitness center",
      "resident lounge",
      "rooftop terrace",
      "private storage",
      "bike room",
      "package room"
    ],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop"
    ],
    type: "boutique"
  },
  {
    id: "2",
    name: "15 hudson yards",
    address: "15 hudson yards",
    neighborhood: "hudson yards",
    borough: "manhattan",
    totalUnits: 285,
    availableUnits: 8,
    yearBuilt: 2019,
    description: "15 hudson yards stands as an architectural landmark at the center of manhattan's newest neighborhood. this striking 88-story tower by diller scofidio + renfro and rockwell group offers unparalleled luxury living with sweeping views, white-glove service, and access to an extraordinary collection of amenities spanning three floors.",
    amenities: [
      "concierge service",
      "75-foot swimming pool",
      "private dining room",
      "screening room",
      "golf simulator",
      "spa with sauna and steam",
      "yoga studio",
      "children's playroom",
      "pet spa"
    ],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop"
    ],
    type: "luxury"
  },
  {
    id: "3",
    name: "the standish",
    address: "171 columbia heights",
    neighborhood: "brooklyn heights",
    borough: "brooklyn",
    totalUnits: 33,
    availableUnits: 2,
    yearBuilt: 1903,
    description: "the standish is a meticulously restored beaux-arts landmark in brooklyn heights. originally built in 1903, this 12-story building has been transformed into 33 exceptional residences while preserving its historic grandeur. residents enjoy stunning views of new york harbor, the statue of liberty, and lower manhattan.",
    amenities: [
      "24-hour doorman",
      "concierge service",
      "fitness center",
      "residents' lounge",
      "children's playroom",
      "roof deck with bbq",
      "bike storage",
      "cold storage"
    ],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop"
    ],
    type: "prewar"
  },
  {
    id: "4",
    name: "25 park row",
    address: "25 park row",
    neighborhood: "financial district",
    borough: "manhattan",
    totalUnits: 110,
    availableUnits: 5,
    yearBuilt: 2021,
    description: "25 park row is a new architectural icon in lower manhattan. this 50-story residential tower by cook + fox architects combines sustainable design with luxury living. the building features a dramatic cantilever design and offers sweeping views of city hall park, the brooklyn bridge, and new york harbor.",
    amenities: [
      "doorman",
      "concierge",
      "fitness center with terrace",
      "residents' lounge",
      "library",
      "game room",
      "chef's kitchen",
      "rooftop observatory",
      "bike room"
    ],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop"
    ],
    type: "new-development"
  },
  {
    id: "5",
    name: "111 murray street",
    address: "111 murray street",
    neighborhood: "tribeca",
    borough: "manhattan",
    totalUnits: 157,
    availableUnits: 4,
    yearBuilt: 2018,
    description: "111 murray street is a striking 58-story tower designed by kohn pedersen fox in the heart of tribeca. the building features a distinctive faceted facade and offers residents an unparalleled collection of amenities designed by david rockwell. with sweeping views and refined interiors, this is downtown living at its finest.",
    amenities: [
      "24-hour doorman and concierge",
      "82-foot lap pool",
      "golf simulator and virtual sports",
      "squash court",
      "library lounge",
      "screening room",
      "wine storage",
      "children's playroom",
      "landscaped terrace"
    ],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop"
    ],
    type: "luxury"
  },
  {
    id: "6",
    name: "the austin",
    address: "426 11th avenue",
    neighborhood: "west chelsea",
    borough: "manhattan",
    totalUnits: 168,
    availableUnits: 6,
    yearBuilt: 2017,
    description: "the austin brings scandinavian-inspired design to west chelsea. developed by binyan studios and designed by hill west architects, this building offers a refined take on modern luxury with clean lines, natural materials, and thoughtfully curated amenities. located steps from the high line and hudson river park.",
    amenities: [
      "doorman",
      "fitness center",
      "yoga studio",
      "resident lounge",
      "coworking spaces",
      "rooftop terrace",
      "bbq grills",
      "bike storage",
      "package room"
    ],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop"
    ],
    type: "boutique"
  }
];
