export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    category: "Peripherals",
    price: 149.99,
    stock: 42,
    description: "Custom mechanical keyboard with tactile switches and RGB backlighting."
  },
  {
    id: 2,
    name: "Precision Wireless Mouse",
    category: "Peripherals",
    price: 79.99,
    stock: 85,
    description: "Ergonomic 26,000 DPI sensor mouse with sub-1ms wireless latency."
  },
  {
    id: 3,
    name: "4K Ultra-Wide Monitor",
    category: "Displays",
    price: 899.99,
    stock: 14,
    description: "34-inch curved IPS display with 144Hz refresh rate and HDR600."
  },
  {
    id: 4,
    name: "Managed Gigabit Switch",
    category: "Networking",
    price: 199.99,
    stock: 29,
    description: "8-port Layer 2/3 switch with VLAN tagging and 802.3at PoE+."
  },
  {
    id: 5,
    name: "Wi-Fi 6E Mesh Router",
    category: "Networking",
    price: 249.99,
    stock: 37,
    description: "Tri-band AX5400 mesh router with WPA3 enterprise security."
  }
];
