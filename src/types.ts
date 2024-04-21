export type Default = {
  '0/31': Base;
  BNS32: BNS32;
  BNS22: BNS22;
  SMA: SMA;
  type: 'length' | 'weight';
};

export type Calculation = {
  id: string;
  createdAt: string;
  type: 'length' | 'weight';
  value: number;
  '0/31': Base;
  BNS32: BNS32;
  BNS22: BNS22;
  SMA: SMA;
};

export type Base = {
  general: General;
};

export type BNS32 = {
  general: General;
  bitumen: Bitumen;
  limestone: LimestoneBNS32;
};

export type BNS22 = {
  general: General;
  bitumen: Bitumen;
  limestone: LimestoneBNS22;
};

export type SMA = {
  general: General;
};

export type General = {
  thickness: number;
  width: number;
  bulkDensity: number;
};

export type Bitumen = {
  percentage: number;
};

export type LimestoneBNS22 = {
  '0-4': {
    percentage: number;
  };
  '4-8': {
    percentage: number;
  };
  '8-16': {
    percentage: number;
  };
  '16-22': {
    percentage: number;
  };
  '16-32': {
    percentage: number;
  };
};

export type LimestoneBNS32 = Omit<LimestoneBNS22, '16-22'>;
