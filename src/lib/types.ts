export type Theme = 'light' | 'dark' | 'system';

export type Defaults = {
  Base: Base;
  BNS32: BNS32;
  BNS22: BNS22;
  SMA: SMA;
  type: 'length' | 'weight';
  unit: 'm' | 't';
};

export interface Calculation {
  id: string;
  createdAt: string;
  value: number;
  parameters: Defaults;
}

export interface CalculationServer extends Omit<Calculation, 'createdAt'> {
  created_at: string;
}

export type Base = {
  general: General;
};

export type BNS32 = {
  general: General;
  bitumen: Bitumen;
  limestone: Limestone[];
};

export type BNS22 = {
  general: General;
  bitumen: Bitumen;
  limestone: Limestone[];
};

export type SMA = {
  general: General;
  bitumen: Bitumen;
};

export type Parameter = {
  value: number;
  unit: string;
};

export type General = {
  thickness: Parameter;
  width: Parameter;
  bulkDensity: Parameter;
};

export type Bitumen = {
  fraction: Parameter;
};

export type Limestone = {
  thickness: {
    value: string;
    unit: string;
    disabled: boolean;
  };
  percentage: Parameter;
};

// Component props
export type ParameterProps = {
  readOnly?: boolean;
  disabled?: boolean;
  layer?: 'Base' | 'BNS32' | 'BNS22' | 'SMA';
  group?: 'general' | 'bitumen' | 'limestone';
  name:
    | 'thickness'
    | 'width'
    | 'bulkDensity'
    | 'fraction'
    | 'weight'
    | 'length'
    | 'percentage';
  unit?: string;
  value?: number;
  computed?: number;
  parameters?: any[];
  onChange?: (value: number, parameters: any[]) => void;
};
