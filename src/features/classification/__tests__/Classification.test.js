import React from 'react';

import Classification from '../Classification';
import ClassifiedBadge from '../ClassifiedBadge';

describe('features/classification/Classification', () => {
    const getWrapper = (props = {}) => shallow(<Classification {...props} />);

    test('should render a classified badge with no definition', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty when classification does not exist but is editable', () => {
        const wrapper = getWrapper();
        expect(wrapper.find(ClassifiedBadge).length).toBe(0);
        expect(wrapper.find('.bdl-Classification-definition').length).toBe(0);
        expect(wrapper.find('.bdl-Classification-missingMessage').length).toBe(0);
    });

    test('should render not classified message', () => {
        const wrapper = getWrapper({
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with an inline definition', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with definition in tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'tooltip',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with click functionality', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            definition: 'fubar',
            messageStyle: 'tooltip',
            onClick: () => {},
        });
        expect(wrapper).toMatchSnapshot();
    });
});
