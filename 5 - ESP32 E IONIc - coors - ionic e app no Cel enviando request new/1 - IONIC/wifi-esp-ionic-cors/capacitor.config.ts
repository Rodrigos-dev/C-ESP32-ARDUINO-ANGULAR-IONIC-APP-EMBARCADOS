import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'wifi-esp-ionic-cors',
  webDir: 'www',

  server: {    
    cleartext: true
  },

  android: {
    allowMixedContent: true
  }

};

export default config;
