import '@testing-library/jest-dom';

global.setImmediate = callback => {
    setTimeout(callback, 0);
};
