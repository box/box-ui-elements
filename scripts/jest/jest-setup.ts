// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';
import util from 'util';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

global.setImmediate = cb => {
    setTimeout(cb, 0);
};

Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
    value: util.TextDecoder,
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
