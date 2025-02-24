// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';
import util from 'util';

// Polyfill setImmediate
global.setImmediate = callback => setTimeout(callback, 0);

// Polyfill TextEncoder
Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
});

// Mock ResizeObserver since it's not available in JSDOM
/* eslint-disable @typescript-eslint/no-empty-function */
class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
}
/* eslint-enable @typescript-eslint/no-empty-function */
global.ResizeObserver = ResizeObserver;

// Mock matchMedia since it's not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
