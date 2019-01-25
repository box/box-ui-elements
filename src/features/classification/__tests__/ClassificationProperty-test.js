import React from 'react';

import ClassificationProperty from '../ClassificationProperty';

describe('features/classification/ClassificationProperty', () => {
    const getWrapper = (props = {}) => shallow(<ClassificationProperty {...props} />);

    test('should render null when openModal and value are not specified', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render add classification correctly', () => {
        const wrapper = getWrapper({
            openModal: () => {},
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render edit classification correctly', () => {
        const wrapper = getWrapper({
            openModal: () => {},
            value: 'Classified',
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render readonly classification correctly', () => {
        const wrapper = getWrapper({
            tooltip: 'Sensitive',
            value: 'Classified',
        });

        expect(wrapper).toMatchSnapshot();
    });
});
