import { defineConfig } from 'cypress';

export default defineConfig({
    defaultCommandTimeout: 8000,
    fileServerFolder: 'test',
    fixturesFolder: 'test/fixtures',
    screenshotsFolder: 'test/screenshots',
    video: false,
    videosFolder: 'test/videos',
    viewportHeight: 1260,
    viewportWidth: 1600,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require('./test/plugins/index.js')(on, config);
        },
        baseUrl: 'http://localhost:6060/#',
        specPattern: 'test/integration/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'test/support/index.js',
    },
});
