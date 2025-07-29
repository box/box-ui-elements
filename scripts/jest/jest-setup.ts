import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

Object.defineProperties(global, {
    __VERSION__: {
        value: 'test',
    },
    ResizeObserver: {
        value: jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        })),
    },
    setImmediate: {
        writable: true,
        // @ts-ignore Override setImmediate with setTimeout
        value: (fn, ...args) => global.setTimeout(fn, 0, ...args),
    },
    TextEncoder: {
        value: TextEncoder,
    },
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
