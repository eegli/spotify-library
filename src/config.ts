import { AppConfig } from './types';
import { goodbye, hasOwnProperty } from './utils';

export const defaultConfig: AppConfig = {
  token: '',
  type: 'normal',
  genres: false,
  features: false,
  outDir: '',
};

export const createConfig = (args: string[]): AppConfig => {
  const config: AppConfig = { ...defaultConfig };

  args.forEach((val, idx, orig) => {
    if (val.startsWith('--')) {
      const key = val.slice(2);
      if (hasOwnProperty(config, key)) {
        // Flag argument
        if (orig[idx + 1] && !orig[idx + 1].startsWith('--')) {
          config[key] = orig[idx + 1];
          // Boolean flag
        } else {
          config[key] = true;
        }
      } else {
        console.warn(`Ignoring unknown option: ${val}`);
      }
    }
  });

  if (!['full', 'normal'].includes(config.type)) {
    config.type = defaultConfig.type;
  }

  if (!config.token) {
    goodbye('Missing Spotify authentication token');
  }

  return config;
};
