// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';
import util from 'util';

global.setImmediate = cb => {
    setTimeout(cb, 0);
};

Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
