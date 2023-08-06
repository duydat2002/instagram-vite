import type { IAdjust } from '@/types'

export const FILTER_TEMPLATES = [
  {
    name: 'Normal',
    filter: {}
  },
  {
    name: 'Clarendon',
    filter: {
      contrast: 1.2,
      saturate: 1.35
    }
  },
  {
    name: 'Gingham',
    filter: {
      'hue-rotate': -10,
      brightness: 1.05
    }
  },
  {
    name: 'Moon',
    filter: {
      brightness: 1.1,
      contrast: 1.1,
      grayscale: 1
    }
  },
  {
    name: 'Lark',
    filter: {
      contrast: 0.9
    }
  },
  {
    name: 'Reyes',
    filter: {
      sepia: 0.22,
      contrast: 0.85,
      brightness: 1.1,
      saturate: 0.75
    }
  },
  {
    name: 'Juno',
    filter: {
      contrast: 1.2,
      brightness: 1.1,
      saturate: 1.4,
      sepia: 0.2,
      'hue-rotate': -10
    }
  },
  {
    name: 'Slumber',
    filter: {
      brightness: 1.05,
      saturate: 0.66
    }
  },
  {
    name: 'Crema',
    filter: {}
  },
  {
    name: 'Ludwig',
    filter: {}
  },
  {
    name: 'Aden',
    filter: {
      'hue-rotate': -20,
      contrast: 0.9,
      brightness: 1.2,
      saturate: 0.85
    }
  },
  {
    name: 'Perpetua',
    filter: {}
  }
]

export const DEFAULT_FILTER = {
  brightness: 1,
  contrast: 1,
  saturate: 1,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0
}

export const DEFAULT_ADJUST = {
  brightness: 0,
  contrast: 0,
  saturate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  'hue-rotate': 0,
  temperature: 0
}
