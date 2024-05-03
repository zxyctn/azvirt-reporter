import { v4 as uuidv4 } from 'uuid';
import { makeAutoObservable } from 'mobx';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';

import {
  calculationServerConverter,
  deepCopy,
  defaultsClientConverter,
  defaultsServerConverter,
} from '@/lib/utils';
import type {
  BNS22,
  BNS32,
  Base,
  SMA,
  Theme,
  Calculation as CalculationType,
  Defaults as DefaultsType,
  CalculationServer,
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
  user: User | null = null;

  constructor(client: SupabaseClient) {
    this.client = client;
    makeAutoObservable(this);
  }

  updateDefaults(defaults: Defaults) {
    if (!this.user) {
      throw new Error('Not authenticated');
    }

    return this.client
      .from('defaults')
      .upsert(defaultsServerConverter(this.user.id, defaults), {
        onConflict: 'user_id',
      });
  }

  async fetchDefaults() {
    if (!this.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await this.client
      .from('defaults')
      .select()
      .eq('user_id', this.user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) return;

    const converted = defaultsClientConverter(data[0]);
    editDefaults.update(converted);
    defaults.update(converted);
    defaults.updateLocalStorage();
  }

  async fetchHistory() {
    if (!this.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await this.client
      .from('calculations')
      .select()
      .eq('user_id', this.user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) return;

    data.forEach((calc: CalculationServer) => {
      const defaultParameters = new Defaults();
      defaultParameters.update(defaultsClientConverter(calc));

      const calculation = new Calculation();
      calculation.value = calc.value;
      calculation.createdAt = new Date(calc.created_at);
      calculation.parameters = defaultParameters;

      history.addCalculation(calculation);
    });

    history.isFetched = true;
  }

  async addCalculation(calculation: Calculation) {
    if (!this.user) return;

    this.client
      .from('calculations')
      .insert([
        {
          user_id: this.user.id,
          value: calculation.value,
          created_at: calculation.createdAt.toISOString(),
          ...calculationServerConverter(this.user.id, calculation),
        },
      ])
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        }
      });
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

  constructor() {
    // check local storage for defaults
    const localDefaults = window.localStorage.getItem('defaults');

    if (localDefaults) {
      const parsed = JSON.parse(localDefaults);
      this.update(parsed);
    }

    makeAutoObservable(this);
  }

  update(parameters: DefaultsType) {
    this.type = parameters.type;
    this.unit = parameters.unit;
    this.Base = parameters.Base;
    this.BNS32 = parameters.BNS32;
    this.BNS22 = parameters.BNS22;
    this.SMA = parameters.SMA;
  }

  updateLocalStorage() {
    window.localStorage.setItem('defaults', JSON.stringify(this));
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

  updateCalculation() {
    this.createdAt = new Date();
    this.parameters = new Defaults();
    this.parameters.update(deepCopy(defaults));
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
  isFetched: boolean = false;
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
export const editDefaults = new Defaults();
export const calculation = new Calculation();
export const history = new History();
