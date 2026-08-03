import base from './playwright.config';

// This sandbox ships chromium build 1194; @playwright/test 1.60 wants 1223.
export default {
  ...base,
  use: { ...base.use, launchOptions: { executablePath: '/opt/pw-browsers/chromium' } },
};
