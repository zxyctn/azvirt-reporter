import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import type {
  BNS22,
  BNS32,
  Base,
  SMA,
  Theme,
  Calculation as CalculationType,
} from '@/lib/types';

class ThemeStore {
  theme: Theme = 'light';

  constructor() {
    makeAutoObservable(this);

    const theme = window.localStorage.getItem('theme') as Theme;
    this.setTheme(theme || 'light');
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    window.localStorage.setItem('theme', theme);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }
}

class SupabaseStore {
  client: SupabaseClient;

  constructor(client: SupabaseClient) {
    makeAutoObservable(this);
    this.client = client;
  }
}

class Defaults {
  type: 'length' | 'weight' = 'length';
  unit: 'm' | 't' = 'm';
  Base: Base = {
    general: {
      thickness: {
        value: 0.1,
        unit: '',
      },
      width: {
        value: 8.5,
        unit: '',
      },
      bulkDensity: {
        value: 2.2,
        unit: '',
      },
    },
  };
  BNS32: BNS32 = {
    general: {
      thickness: {
        value: 0.09,
        unit: '',
      },
      width: {
        value: 8.2,
        unit: '',
      },
      bulkDensity: {
        value: 2.4,
        unit: '',
      },
    },
    bitumen: {
      fraction: {
        value: 0.038,
        unit: '',
      },
    },
    limestone: [
      {
        thickness: {
          value: '0-4',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 40,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '4-8',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 5,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '8-16',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 30,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '16-32',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 30,
          unit: '%',
        },
      },
    ],
  };
  BNS22: BNS22 = {
    general: {
      thickness: {
        value: 0.07,
        unit: '',
      },
      width: {
        value: 8.1,
        unit: '',
      },
      bulkDensity: {
        value: 2.4,
        unit: '',
      },
    },
    bitumen: {
      fraction: {
        value: 0.041,
        unit: '',
      },
    },
    limestone: [
      {
        thickness: {
          value: '0-4',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 40,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '4-8',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 10,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '8-16',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 20,
          unit: '%',
        },
      },
      {
        thickness: {
          value: '16-22',
          unit: 'mm',
          disabled: true,
        },
        percentage: {
          value: 30,
          unit: '%',
        },
      },
    ],
  };
  SMA: SMA = {
    general: {
      thickness: {
        value: 0.04,
        unit: '',
      },
      width: {
        value: 8,
        unit: '',
      },
      bulkDensity: {
        value: 2.25,
        unit: '',
      },
    },
    bitumen: {
      fraction: {
        value: 0.064,
        unit: '',
      },
    },
  };

  constructor(defaults: Defaults | null = null) {
    if (defaults) {
      this.type = defaults.type;
      this.unit = defaults.unit;
      this.Base = defaults.Base;
      this.BNS32 = defaults.BNS32;
      this.BNS22 = defaults.BNS22;
      this.SMA = defaults.SMA;
    }
    makeAutoObservable(this);
  }

  setType(type: 'length' | 'weight') {
    this.type = type;
    this.unit = type === 'length' ? 'm' : 't';
  }

  setParameter(
    layer: 'Base' | 'BNS32' | 'BNS22' | 'SMA',
    group: 'general' | 'bitumen' | 'limestone',
    parameter: 'thickness' | 'width' | 'bulkDensity' | 'fraction',
    value: number
  ) {
    if (
      group in this[layer] &&
      // @ts-ignore
      parameter in this[layer][group] &&
      // @ts-ignore
      'value' in this[layer][group][parameter]
    ) {
      // @ts-ignore
      this[layer][group][parameter].value = value;
    } else {
      console.error('Invalid parameter');
    }
  }

  setLimestonePercentage(
    layer: 'BNS32' | 'BNS22',
    index: number,
    value: number
  ) {
    if (index < this[layer].limestone.length) {
      this[layer].limestone[index].percentage.value = value;
    } else {
      console.error('Invalid index');
    }
  }
}

class Calculation {
  createdAt: Date;
  parameters: Defaults;
  value: number = 0;

  constructor() {
    this.createdAt = new Date();
    this.parameters = new Defaults();
    makeAutoObservable(this);
  }

  update() {
    this.createdAt = new Date();
  }

  totalLength(layer: 'Base' | 'BNS32' | 'BNS22' | 'SMA') {
    if (this.parameters.type === 'length') return this.value;
    return (
      this.value /
      (this.parameters[layer].general.width.value *
        this.parameters[layer].general.bulkDensity.value *
        this.parameters[layer].general.thickness.value)
    );
  }

  totalWeight(layer: 'Base' | 'BNS32' | 'BNS22' | 'SMA') {
    if (this.parameters.type === 'weight') return this.value;
    return (
      this.parameters[layer].general.width.value *
      this.parameters[layer].general.bulkDensity.value *
      this.parameters[layer].general.thickness.value *
      this.value
    );
  }

  bitumenWeight(layer: 'BNS32' | 'BNS22' | 'SMA') {
    return (
      this.totalWeight(layer) * this.parameters[layer].bitumen.fraction.value
    );
  }

  limestoneWeight(layer: 'BNS32' | 'BNS22') {
    return this.parameters[layer].limestone.map((limestone) => {
      return (this.totalWeight(layer) * limestone.percentage.value) / 100;
    });
  }

  get totalBaseLength() {
    return this.totalLength('Base');
  }

  get totalBNS32Length() {
    return this.totalLength('BNS32');
  }

  get totalBNS22Length() {
    return this.totalLength('BNS22');
  }

  get totalSMALength() {
    return this.totalLength('SMA');
  }

  get totalBaseWeight() {
    return this.totalWeight('Base');
  }

  get totalLayerWeights() {
    return {
      Base: this.totalBaseWeight,
      BNS32: this.totalBNS32Weight,
      BNS22: this.totalBNS22Weight,
      SMA: this.totalSMAWeight,
    };
  }

  get totalLayerLengths() {
    return {
      Base: this.totalBaseLength,
      BNS32: this.totalBNS32Length,
      BNS22: this.totalBNS22Length,
      SMA: this.totalSMALength,
    };
  }

  get totalBNS32Weight() {
    return this.totalWeight('BNS32');
  }

  get totalBNS22Weight() {
    return this.totalWeight('BNS22');
  }

  get totalSMAWeight() {
    return this.totalWeight('SMA');
  }

  get totalBNS32BitumenWeight() {
    return this.bitumenWeight('BNS32');
  }

  get totalBNS22BitumenWeight() {
    return this.bitumenWeight('BNS22');
  }

  get totalSMABitumenWeight() {
    return this.bitumenWeight('SMA');
  }

  get totalBNS32LimestoneWeight() {
    return this.limestoneWeight('BNS32');
  }

  get totalBNS22LimestoneWeight() {
    return this.limestoneWeight('BNS22');
  }
}

class History {
  calculations: CalculationType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addCalculation(calculation: Calculation) {
    this.calculations.push({
      id: uuidv4(),
      createdAt: calculation.createdAt.toISOString(),
      value: calculation.value,
      parameters: calculation.parameters,
    });
  }
}

export const themeStore = new ThemeStore();
export const supabaseStore = new SupabaseStore(
  createClient(
    `${import.meta.env.VITE_SUPABASE_URL}`,
    `${import.meta.env.VITE_SUPABASE_API_KEY}`
  )
);
export const defaults = new Defaults();
export const calculation = new Calculation();
export const history = new History();
