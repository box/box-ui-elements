import React from 'react';

import Classification from '../Classification';

describe('features/classification/Classification', () => {
    const getWrapper = (props = {}) => shallow(<Classification {...props} />);

    test('should render a classified badge with no advisory message', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render add classification badge', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render not classified message', () => {
        const wrapper = getWrapper({
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with an inline advisory message', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            advisoryMessage: 'fubar',
            messageStyle: 'inline',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with advisory message in tooltip', () => {
        const wrapper = getWrapper({
            name: 'Confidential',
            advisoryMessage: 'fubar',
            messageStyle: 'tooltip',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
