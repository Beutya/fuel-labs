const config = {
  browsers: ['chromium'],
  collectCoverage: false,
  exitOnPageError: false, // GitHub currently throws errors
  launchOptions: {
    headless: true,
  },
};

export default config;