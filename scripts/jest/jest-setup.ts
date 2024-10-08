// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';
import util from 'util';

global.setImmediate = cb => {
    setTimeout(cb, 0);
};

Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
