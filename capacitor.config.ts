import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.518fa1e5db604d98be560b885eb92d7b',
  appName: 'matematica-distractiva',
  webDir: 'dist',
  server: {
    url: 'https://518fa1e5-db60-4d98-be56-0b885eb92d7b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystorePassword: '',
      keystoreAlias: 'upload',
      keystoreAliasPassword: '',
      releaseType: 'APK'
    }
  }
};

export default config;
