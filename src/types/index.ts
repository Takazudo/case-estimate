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
  material: 'acrylic' | '3d-printed';
  panels: Panel[];
}

export interface Cases {
  [key: string]: Case;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Preset {
  id: string;
  name: string;
  colors: {
    all?: string;
    primary?: string;
    secondary?: string;
  };
}

export interface Colors {
  acrylic: Color[];
  '3d-printed': Color[];
  presets: {
    '3d-printed': Preset[];
  };
}
