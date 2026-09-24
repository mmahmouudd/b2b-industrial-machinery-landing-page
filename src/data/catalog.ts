export type Category =
  | "CNC Machining"
  | "Robotics & Automation"
  | "Material Handling"
  | "Metal Fabrication"
  | "Packaging Lines";

export type Certification = "CE" | "UL" | "ISO 9001" | "OSHA";

export type Tier = {
  min: number;
  max: number | null;
  discount: number; // 0 – 1
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: Category;
  image: string;
  alt: string;
  blurb: string;
  listPrice: number; // per-unit list price (USD)
  moq: number; // minimum order quantity
  leadTimeDays: number;
  stock: number;
  rating: number;
  reviews: number;
  powerKw: number;
  voltage: "220V" | "380V" | "480V";
  certifications: Certification[];
  specs: { label: string; value: string }[];
  badge?: string;
  financing: boolean;
  popularity: number;
  tiers: Tier[];
};

const STANDARD_TIERS: Tier[] = [
  { min: 1, max: 2, discount: 0 },
  { min: 3, max: 5, discount: 0.07 },
  { min: 6, max: 11, discount: 0.13 },
  { min: 12, max: 24, discount: 0.19 },
  { min: 25, max: null, discount: 0.26 },
];

const VOLUME_TIERS: Tier[] = [
  { min: 2, max: 9, discount: 0 },
  { min: 10, max: 24, discount: 0.09 },
  { min: 25, max: 49, discount: 0.16 },
  { min: 50, max: 99, discount: 0.22 },
  { min: 100, max: null, discount: 0.3 },
];

export const PRODUCTS: Product[] = [
  {
    id: "vx620",
    sku: "AX-VX620-5A",
    name: "Vertex VX-620 5-Axis Machining Center",
    category: "CNC Machining",
    image:
      "https://images.pexels.com/photos/20607184/pexels-photo-20607184.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Close-up of a precision CNC milling machine cutting a metal workpiece",
    blurb:
      "Simultaneous 5-axis contouring with a 24-tool ATC and thermal-compensated spindle for aerospace-grade tolerances.",
    listPrice: 148500,
    moq: 1,
    leadTimeDays: 28,
    stock: 34,
    rating: 4.9,
    reviews: 128,
    powerKw: 32,
    voltage: "480V",
    certifications: ["CE", "UL", "ISO 9001"],
    specs: [
      { label: "Travel (X/Y/Z)", value: "620 × 520 × 460 mm" },
      { label: "Spindle", value: "15,000 rpm / 32 kW" },
      { label: "Positioning", value: "±0.003 mm" },
      { label: "Control", value: "AxlonOS 7 / Fanuc" },
    ],
    badge: "Best seller",
    financing: true,
    popularity: 98,
    tiers: STANDARD_TIERS,
  },
  {
    id: "titan18",
    sku: "AX-TTN-R18",
    name: "Titan R18 Six-Axis Robotic Arm",
    category: "Robotics & Automation",
    image:
      "https://images.pexels.com/photos/34207369/pexels-photo-34207369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Blue six-axis industrial robotic arm mounted on a production cell",
    blurb:
      "18 kg payload welding and pick-and-place robot with force sensing, IP67 wrist and fleet-level OTA updates.",
    listPrice: 42900,
    moq: 2,
    leadTimeDays: 21,
    stock: 120,
    rating: 4.8,
    reviews: 214,
    powerKw: 6.5,
    voltage: "380V",
    certifications: ["CE", "ISO 9001", "OSHA"],
    specs: [
      { label: "Payload", value: "18 kg" },
      { label: "Reach", value: "1,820 mm" },
      { label: "Repeatability", value: "±0.02 mm" },
      { label: "Protection", value: "IP67 wrist / IP54 body" },
    ],
    badge: "Volume favourite",
    financing: true,
    popularity: 95,
    tiers: VOLUME_TIERS,
  },
  {
    id: "profeed",
    sku: "AX-PF4000-M",
    name: "ProFeed 4000 Modular Conveyor Line",
    category: "Material Handling",
    image:
      "https://images.pexels.com/photos/38427501/pexels-photo-38427501.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Industrial conveyor system running through a manufacturing facility",
    blurb:
      "Tool-less 3 m modules with variable-frequency drives, zero-pressure accumulation and stainless wash-down frames.",
    listPrice: 8750,
    moq: 4,
    leadTimeDays: 14,
    stock: 460,
    rating: 4.7,
    reviews: 342,
    powerKw: 2.2,
    voltage: "220V",
    certifications: ["CE", "UL", "OSHA"],
    specs: [
      { label: "Module length", value: "3,000 mm" },
      { label: "Belt speed", value: "4 – 60 m/min" },
      { label: "Load", value: "120 kg/m" },
      { label: "Frame", value: "304 stainless" },
    ],
    badge: "Ships in 14 days",
    financing: false,
    popularity: 88,
    tiers: VOLUME_TIERS,
  },
  {
    id: "fibercut",
    sku: "AX-FC-L900",
    name: "FiberCut L900 Laser Cutting System",
    category: "Metal Fabrication",
    image:
      "https://images.pexels.com/photos/36522041/pexels-photo-36522041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Industrial metal cutting machine operating on a steel sheet",
    blurb:
      "9 kW fiber source with automatic pallet changer, nitrogen assist and nesting software licensed per seat.",
    listPrice: 212000,
    moq: 1,
    leadTimeDays: 45,
    stock: 11,
    rating: 4.9,
    reviews: 76,
    powerKw: 45,
    voltage: "480V",
    certifications: ["CE", "UL", "ISO 9001", "OSHA"],
    specs: [
      { label: "Source", value: "9 kW fiber" },
      { label: "Sheet size", value: "3,050 × 1,525 mm" },
      { label: "Rapid traverse", value: "168 m/min" },
      { label: "Changer", value: "Dual pallet, 28 s" },
    ],
    financing: true,
    popularity: 82,
    tiers: STANDARD_TIERS,
  },
  {
    id: "hydra250",
    sku: "AX-HP-250T",
    name: "HydraPress 250T Servo Hydraulic Press",
    category: "Metal Fabrication",
    image:
      "https://images.pexels.com/photos/8865189/pexels-photo-8865189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Heavy duty press and milling machinery inside a machine shop",
    blurb:
      "Servo-driven 250-ton press with programmable ram profiles, cutting energy draw by up to 58% versus fixed pumps.",
    listPrice: 96400,
    moq: 1,
    leadTimeDays: 35,
    stock: 22,
    rating: 4.6,
    reviews: 94,
    powerKw: 37,
    voltage: "480V",
    certifications: ["CE", "ISO 9001"],
    specs: [
      { label: "Capacity", value: "250 t" },
      { label: "Stroke", value: "500 mm" },
      { label: "Bed", value: "1,600 × 900 mm" },
      { label: "Cycle", value: "22 strokes/min" },
    ],
    financing: true,
    popularity: 74,
    tiers: STANDARD_TIERS,
  },
  {
    id: "cobot12",
    sku: "AX-CB-N12",
    name: "CoBot Nano 12 Collaborative Cell",
    category: "Robotics & Automation",
    image:
      "https://images.pexels.com/photos/35280311/pexels-photo-35280311.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "White collaborative robotic arm operating in a clean industrial setting",
    blurb:
      "Fence-free 12 kg cobot on a mobile cart — deploy machine tending in an afternoon with no safety re-engineering.",
    listPrice: 27400,
    moq: 2,
    leadTimeDays: 10,
    stock: 210,
    rating: 4.8,
    reviews: 401,
    powerKw: 1.4,
    voltage: "220V",
    certifications: ["CE", "UL", "ISO 9001"],
    specs: [
      { label: "Payload", value: "12 kg" },
      { label: "Reach", value: "1,300 mm" },
      { label: "Setup", value: "< 4 hours" },
      { label: "Safety", value: "ISO/TS 15066" },
    ],
    badge: "Fast ship",
    financing: true,
    popularity: 91,
    tiers: VOLUME_TIERS,
  },
  {
    id: "palletx",
    sku: "AX-PLX-900",
    name: "PalletX 900 Case Packing Line",
    category: "Packaging Lines",
    image:
      "https://images.pexels.com/photos/38336747/pexels-photo-38336747.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Automated bottling and packaging line inside a modern plant",
    blurb:
      "Turnkey case erector, filler and palletiser cell rated for 900 cases/hour with recipe-driven changeovers.",
    listPrice: 134900,
    moq: 1,
    leadTimeDays: 52,
    stock: 8,
    rating: 4.5,
    reviews: 58,
    powerKw: 18,
    voltage: "380V",
    certifications: ["CE", "OSHA"],
    specs: [
      { label: "Throughput", value: "900 cases/h" },
      { label: "Changeover", value: "< 8 min" },
      { label: "Footprint", value: "14 × 6 m" },
      { label: "HMI", value: '15" AxlonOS panel' },
    ],
    financing: true,
    popularity: 66,
    tiers: STANDARD_TIERS,
  },
  {
    id: "grind700",
    sku: "AX-SG-700",
    name: "PrecisionGrind SG-700 Surface Grinder",
    category: "CNC Machining",
    image:
      "https://images.pexels.com/photos/7018175/pexels-photo-7018175.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Operator grinding a metal part on industrial grinding equipment",
    blurb:
      "Hydrostatic-way surface grinder with auto-dressing and in-process gauging for sub-micron finish consistency.",
    listPrice: 38900,
    moq: 2,
    leadTimeDays: 24,
    stock: 64,
    rating: 4.6,
    reviews: 112,
    powerKw: 11,
    voltage: "380V",
    certifications: ["CE", "ISO 9001"],
    specs: [
      { label: "Table", value: "700 × 400 mm" },
      { label: "Finish", value: "Ra 0.1 µm" },
      { label: "Wheel", value: "Ø 355 mm" },
      { label: "Gauging", value: "In-process, closed loop" },
    ],
    financing: false,
    popularity: 71,
    tiers: VOLUME_TIERS,
  },
  {
    id: "loader90",
    sku: "AX-HL-90E",
    name: "HaulLift 90E Electric Warehouse Loader",
    category: "Material Handling",
    image:
      "https://images.pexels.com/photos/27490857/pexels-photo-27490857.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Heavy duty electric loader transferring material inside a warehouse",
    blurb:
      "9-ton lithium loader with fast-swap packs, telematics fleet tracking and zero in-plant emissions.",
    listPrice: 61200,
    moq: 2,
    leadTimeDays: 18,
    stock: 47,
    rating: 4.7,
    reviews: 167,
    powerKw: 24,
    voltage: "480V",
    certifications: ["CE", "UL", "OSHA"],
    specs: [
      { label: "Capacity", value: "9,000 kg" },
      { label: "Runtime", value: "10 h / swap pack" },
      { label: "Charge", value: "80% in 45 min" },
      { label: "Telematics", value: "Axlon Fleet included" },
    ],
    badge: "Electric",
    financing: true,
    popularity: 79,
    tiers: VOLUME_TIERS,
  },
];

export const CATEGORIES: Category[] = [
  "CNC Machining",
  "Robotics & Automation",
  "Material Handling",
  "Metal Fabrication",
  "Packaging Lines",
];

export const CERTIFICATIONS: Certification[] = ["CE", "UL", "ISO 9001", "OSHA"];

export const VOLTAGES = ["220V", "380V", "480V"] as const;

export const LEAD_TIME_OPTIONS = [
  { id: "any", label: "Any lead time", max: Infinity },
  { id: "14", label: "Ships ≤ 14 days", max: 14 },
  { id: "30", label: "Ships ≤ 30 days", max: 30 },
  { id: "60", label: "Ships ≤ 60 days", max: 60 },
] as const;

export const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Unit price: low to high" },
  { id: "price-desc", label: "Unit price: high to low" },
  { id: "lead", label: "Fastest lead time" },
  { id: "rating", label: "Top rated" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

/** Returns the discount tier that applies to a given quantity. */
export function tierFor(product: Product, qty: number): Tier {
  const sorted = [...product.tiers].sort((a, b) => a.min - b.min);
  let active = sorted[0];
  for (const tier of sorted) if (qty >= tier.min) active = tier;
  return active;
}

/** Net unit price for a quantity, after volume discount. */
export function unitPriceFor(product: Product, qty: number): number {
  return Math.round(product.listPrice * (1 - tierFor(product, qty).discount));
}

export function bestDiscount(product: Product): number {
  return Math.max(...product.tiers.map((t) => t.discount));
}

export const currency = (value: number, fractionDigits = 0) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const compactCurrency = (value: number) =>
  value >= 1000 ? `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : `$${value}`;
