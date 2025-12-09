import type { RailOption, Material } from '@/types';

// Rail options shared across all products
// Prices differ based on case material (acrylic vs 3dp)
export const railOptions: Record<Material, RailOption[]> = {
  acrylic: [
    { type: 'lite', name: 'Lite', price: 7980 },
    { type: 'dual', name: 'Dual', price: 11980 },
    { type: 'metal', name: 'Metal', price: 15980 },
  ],
  '3dp': [
    { type: 'lite', name: 'Lite', price: 4980 },
    { type: 'dual', name: 'Dual', price: 8980 },
    { type: 'metal', name: 'Metal', price: 12980 },
  ],
};

// Get rail options for a specific case based on HP and material
export function getRailOptions(hp: number, material: Material): RailOption[] {
  // For 60HP cases, adjust prices
  if (hp === 60) {
    return railOptions[material].map((rail) => ({
      ...rail,
      price:
        material === 'acrylic'
          ? rail.price + 2000 // 60HP acrylic costs 2000 more
          : rail.price + 2000, // 60HP 3dp also costs 2000 more
    }));
  }

  // For 40HP cases, use base prices
  return railOptions[material];
}
