import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

import type { Defaults } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const camelCaseToWords = (s: string) => {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const defaultsServerConverter = (
  user_id: string,
  defaults: Defaults
) => ({
  user_id: user_id,
  created_at: new Date().toISOString(),
  type: defaults.type,
  base_thickness: defaults.Base.general.thickness.value,
  base_width: defaults.Base.general.width.value,
  base_bulkDensity: defaults.Base.general.bulkDensity.value,
  bns32_thickness: defaults.BNS32.general.thickness.value,
  bns32_width: defaults.BNS32.general.width.value,
  bns32_bulkDensity: defaults.BNS32.general.bulkDensity.value,
  bns32_bitumen: defaults.BNS32.bitumen.fraction.value,
  bns32_limestone_04_percentage: defaults.BNS32.limestone[0].percentage.value,
  bns32_limestone_48_percentage: defaults.BNS32.limestone[1].percentage.value,
  bns32_limestone_816_percentage: defaults.BNS32.limestone[2].percentage.value,
  bns32_limestone_1632_percentage: defaults.BNS32.limestone[3].percentage.value,
  bns22_thickness: defaults.BNS22.general.thickness.value,
  bns22_width: defaults.BNS22.general.width.value,
  bns22_bulkDensity: defaults.BNS22.general.bulkDensity.value,
  bns22_bitumen: defaults.BNS22.bitumen.fraction.value,
  bns22_limestone_04_percentage: defaults.BNS22.limestone[0].percentage.value,
  bns22_limestone_48_percentage: defaults.BNS22.limestone[1].percentage.value,
  bns22_limestone_816_percentage: defaults.BNS22.limestone[2].percentage.value,
  bns22_limestone_1622_percentage: defaults.BNS22.limestone[3].percentage.value,
  sma_thickness: defaults.SMA.general.thickness.value,
  sma_width: defaults.SMA.general.width.value,
  sma_bulkDensity: defaults.SMA.general.bulkDensity.value,
  sma_bitumen: defaults.SMA.bitumen.fraction.value,
});

export const defaultsClientConverter = (defaults: any) => {
  return {
    type: defaults.type,
    unit: (defaults.type === 'length' ? 'm' : 't') as 'm' | 't',
    Base: {
      general: {
        thickness: {
          value: defaults.base_thickness,
          unit: '',
        },
        width: {
          value: defaults.base_width,
          unit: '',
        },
        bulkDensity: {
          value: defaults.base_bulkDensity,
          unit: '',
        },
      },
    },
    BNS32: {
      general: {
        thickness: {
          value: defaults.bns32_thickness,
          unit: '',
        },
        width: {
          value: defaults.bns32_width,
          unit: '',
        },
        bulkDensity: {
          value: defaults.bns32_bulkDensity,
          unit: '',
        },
      },
      bitumen: {
        fraction: {
          value: defaults.bns32_bitumen,
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
            value: defaults.bns32_limestone_04_percentage,
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
            value: defaults.bns32_limestone_48_percentage,
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
            value: defaults.bns32_limestone_816_percentage,
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
            value: defaults.bns32_limestone_1632_percentage,
            unit: '%',
          },
        },
      ],
    },
    BNS22: {
      general: {
        thickness: {
          value: defaults.bns22_thickness,
          unit: '',
        },
        width: {
          value: defaults.bns22_width,
          unit: '',
        },
        bulkDensity: {
          value: defaults.bns22_bulkDensity,
          unit: '',
        },
      },
      bitumen: {
        fraction: {
          value: defaults.bns22_bitumen,
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
            value: defaults.bns22_limestone_04_percentage,
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
            value: defaults.bns22_limestone_48_percentage,
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
            value: defaults.bns22_limestone_816_percentage,
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
            value: defaults.bns22_limestone_1622_percentage,
            unit: '%',
          },
        },
      ],
    },
    SMA: {
      general: {
        thickness: {
          value: defaults.sma_thickness,
          unit: '',
        },
        width: {
          value: defaults.sma_width,
          unit: '',
        },
        bulkDensity: {
          value: defaults.sma_bulkDensity,
          unit: '',
        },
      },
      bitumen: {
        fraction: {
          value: defaults.sma_bitumen,
          unit: '',
        },
      },
    },
  };
};

export const calculationServerConverter = (
  user_id: string,
  calculation: any
) => {
  const clientData: any = defaultsServerConverter(
    user_id,
    calculation.parameters
  );
  clientData.base_total =
    calculation.parameters.type === 'length'
      ? calculation.totalBaseWeight
      : calculation.totalBaseLength;
  clientData.bns32_total =
    calculation.parameters.type === 'length'
      ? calculation.totalBNS32Weight
      : calculation.totalBNS32Length;
  clientData.bns22_total =
    calculation.parameters.type === 'length'
      ? calculation.totalBNS22Weight
      : calculation.totalBNS22Length;
  clientData.sma_total =
    calculation.parameters.type === 'length'
      ? calculation.totalSMAWeight
      : calculation.totalSMALength;
  clientData.bns32_bitumen_weight = calculation.totalBNS32BitumenWeight;
  clientData.bns22_bitumen_weight = calculation.totalBNS22BitumenWeight;
  clientData.sma_bitumen_weight = calculation.totalSMABitumenWeight;
  clientData.bns32_limestone_04_weight =
    calculation.totalBNS32LimestoneWeight[0];
  clientData.bns32_limestone_48_weight =
    calculation.totalBNS32LimestoneWeight[1];
  clientData.bns32_limestone_816_weight =
    calculation.totalBNS32LimestoneWeight[2];
  clientData.bns32_limestone_1632_weight =
    calculation.totalBNS32LimestoneWeight[3];
  clientData.bns22_limestone_04_weight =
    calculation.totalBNS22LimestoneWeight[0];
  clientData.bns22_limestone_48_weight =
    calculation.totalBNS22LimestoneWeight[1];
  clientData.bns22_limestone_816_weight =
    calculation.totalBNS22LimestoneWeight[2];
  clientData.bns22_limestone_1622_weight =
    calculation.totalBNS22LimestoneWeight[3];
  return clientData;
};

export const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));
