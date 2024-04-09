// @ts-nocheck override setImmediate to use setTimeout
import '@testing-library/jest-dom';

global.setImmediate = cb => {
    setTimeout(cb, 0);
};
