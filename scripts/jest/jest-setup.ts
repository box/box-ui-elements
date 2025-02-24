// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';
import util from 'util';

// Polyfill setImmediate
global.setImmediate = callback => setTimeout(callback, 0);

// Polyfill TextEncoder
Object.defineProperty(global, 'TextEncoder', {
    value: util.TextEncoder,
});
