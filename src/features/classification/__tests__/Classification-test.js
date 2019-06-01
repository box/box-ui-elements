import React from 'react';

import Classification from '../Classification';

describe('features/classification/Classification', () => {
    const getWrapper = (props = {}) => shallow(<Classification {...props} />);

    test('should render default component in yellow with no advisory message', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render default component in yellow and inline advisory message', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            advisoryMessage: 'fubar',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render inline advisory message in tooltip when specified', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            advisoryMessage: 'fubar',
            isMessageInline: false,
        });
        expect(wrapper).toMatchSnapshot();
    });
});
