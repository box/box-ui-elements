const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = function envSetup() {
    process.env.TZ = 'America/Los_Angeles';

    // Mock window and document for tests
    if (typeof window === 'undefined') {
        const dom = new JSDOM('<!doctype html><html><body></body></html>', {
            url: 'http://localhost/',
            pretendToBeVisual: true,
            runScripts: 'dangerously',
            resources: 'usable',
        });

        // Set up window and document
        const { window } = dom;
        const { document } = window;

        // Copy window properties to global
        global.window = window;
        global.document = document;

        // Set up navigator
        window.navigator = {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            platform: 'MacIntel',
            language: 'en-US',
        };

        // Initialize window.matchMedia
        window.matchMedia = () => ({
            matches: false,
            addListener: () => {},
            removeListener: () => {},
        });

        // Initialize window.getComputedStyle
        window.getComputedStyle = () => ({
            getPropertyValue: () => '',
        });

        // Copy DOM globals
        ['HTMLElement', 'Element', 'Node'].forEach(prop => {
            global[prop] = window[prop];
        });

        // Initialize Element prototypes
        if (window.Element) {
            window.Element.prototype.matches = window.Element.prototype.matches || (() => false);
            window.Element.prototype.closest = window.Element.prototype.closest || (() => null);
            window.Element.prototype.msMatchesSelector = window.Element.prototype.msMatchesSelector || (() => false);
            window.Element.prototype.webkitMatchesSelector =
                window.Element.prototype.webkitMatchesSelector || (() => false);
        }

        // Initialize window.location
        window.location = {
            href: 'http://localhost/',
            pathname: '/',
            search: '',
            hash: '',
        };
    }
};
