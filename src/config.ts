import { parserFactory } from '@eegli/tinyparse';
import { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  token: '',
  type: 'light',
  genres: false,
  features: false,
  outDir: '',
};

export const parseConfig = parserFactory(defaultConfig, {
  required: ['token'],
});
