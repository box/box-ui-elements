import React from 'react';

import Tooltip from '../../../../components/tooltip';

import SecurityControlsItem from '../SecurityControlsItem';

describe('features/classification/security-controls/SecurityControlsItem', () => {
    let wrapper;
    let message;

    const getWrapper = (props = {}) =>
        shallow(<SecurityControlsItem message={message} tooltipItems={[]} tooltipPosition="middle-left" {...props} />);

    beforeEach(() => {
        message = {
            id: 'msg1',
            defaultMessage: 'message',
        };
        wrapper = getWrapper();
    });

    test('should render a SecurityControlsItem with a message', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should render a SecurityControlsItem item with a message and a tooltip when tooltip items are provided', () => {
        const tooltipItems = [
            {
                id: 'item1',
                defaultMessage: 'item1',
            },
            {
                id: 'item2',
                defaultMessage: 'item2',
            },
        ];

        wrapper.setProps({ tooltipItems });
        expect(wrapper).toMatchSnapshot();
    });

    test('should set tooltip position when provided', () => {
        const tooltipPosition = 'foo';
        wrapper.setProps({ tooltipItems: [message], tooltipPosition });
        expect(wrapper.find(Tooltip).props().position).toBe('foo');
    });
});
