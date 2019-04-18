// @flow
import isFinite from 'lodash/isFinite';

const isFloat = (value: number) => {
    return !/^\s*$/.test(value) && isFinite(value);
};

// eslint-disable-next-line import/prefer-default-export
export { isFloat };
