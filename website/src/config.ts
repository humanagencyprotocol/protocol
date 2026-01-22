// Site configuration - version is read from package.json
import pkg from '../package.json';

export const siteConfig = {
  version: pkg.version,
  title: 'Human Agency Protocol',
  description: 'A global protocol for strengthening human agency in AI-native systems, without sharing content.',
};
