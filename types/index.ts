export interface Panel {
  id: string;
  name: string;
}

export interface RailOption {
  type: string;
  name: string;
  price: number;
}

export interface Case {
  name: string;
  hp: number;
  material: 'acrylic' | '3dp';
  panels: Panel[];
}

export interface Cases {
  [key: string]: Case;
}

export interface Color {
  id: string;
  name: string;
  value: string;
  material: string;
  opacity?: number;
  imageUrl?: string;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  colors: {
    all?: string;
    primary?: string;
    secondary?: string;
  };
}

export interface Colors {
  acrylic: Color[];
  '3dp': Color[];
  presets: {
    acrylic: Preset[];
    '3dp': Preset[];
  };
}
