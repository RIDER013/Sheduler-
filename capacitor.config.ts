import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rider013.scheduler',
  appName: 'Daily Scheduler',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
