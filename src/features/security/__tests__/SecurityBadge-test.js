import React from 'react';

import SecurityBadge from '../SecurityBadge';

describe('features/security/SecurityBadge', () => {
    const getWrapper = (props = {}) => shallow(<SecurityBadge {...props} />);

    test('should render a classified badge with default icon (IconAlertDefault)', () => {
        const wrapper = getWrapper({
            message: 'Suspicious',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a classified badge with a custom icon', () => {
        const wrapper = getWrapper({
            icon: <span>Custom Icon</span>,
            message: 'Suspicious',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render custom class when provided', () => {
        const wrapper = getWrapper({
            className: 'custom',
            message: 'Suspicious',
        });
        expect(wrapper.props().className).toBe('bdl-SecurityBadge custom');
    });
});
