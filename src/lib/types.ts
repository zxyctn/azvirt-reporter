export type Theme = 'light' | 'dark' | 'system';

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

export type LimestoneBNS22 = [
  {
    thickness: {
      range: {
        from: 0;
        to: 4;
      };
      unit: 'mm';
    };
    percentage: 40;
  },
  {
    thickness: {
      range: {
        from: 4;
        to: 8;
      };
      unit: 'mm';
    };
    percentage: 10;
  },
  {
    thickness: {
      range: {
        from: 8;
        to: 16;
      };
      unit: 'mm';
    };
    percentage: 20;
  },
  {
    thickness: {
      range: {
        from: 16;
        to: 22;
      };
      unit: 'mm';
    };
    percentage: 30;
  }
];

export type LimestoneBNS32 = [
  {
    thickness: {
      range: {
        from: 0;
        to: 4;
      };
      unit: 'mm';
    };
    percentage: 40;
  },
  {
    thickness: {
      range: {
        from: 4;
        to: 8;
      };
      unit: 'mm';
    };
    percentage: 5;
  },
  {
    thickness: {
      range: {
        from: 8;
        to: 16;
      };
      unit: 'mm';
    };
    percentage: 30;
  },
  {
    thickness: {
      range: {
        from: 16;
        to: 32;
      };
      unit: 'mm';
    };
    percentage: 30;
  }
];
