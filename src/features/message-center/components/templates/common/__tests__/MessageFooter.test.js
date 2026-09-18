/* eslint-disable no-script-url -- javascript: payloads assert URL sanitization */
import * as React from 'react';
import { shallow } from 'enzyme';

import MessageFooter from '../MessageFooter';

const defaultProps = {
    date: new Date(1600297599505),
    name: 'testmessagename',
};

const getWrapper = props => shallow(<MessageFooter {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessageFooter', () => {
    test('should render correctly if no action item present', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render correctly if action item provided', () => {
        expect(
            getWrapper({
                actionItem: {
                    label: 'label',
                    actions: [{ type: 'openURL', url: 'https://example.com', target: '_self' }],
                },
            }),
        ).toMatchSnapshot();
    });

    test('should add noopener noreferrer to action links', () => {
        const wrapper = getWrapper({
            actionItem: {
                label: 'label',
                actions: [{ type: 'openURL', url: 'https://example.com', target: '_blank' }],
            },
        });
        const link = wrapper.find('a');

        expect(link.prop('href')).toEqual('https://example.com');
        expect(link.prop('rel')).toEqual('noopener noreferrer');
        expect(link.prop('target')).toEqual('_blank');
    });

    test('should not render javascript: action URLs', () => {
        const wrapper = getWrapper({
            actionItem: {
                label: 'label',
                actions: [{ type: 'openURL', url: 'javascript:alert(1)', target: '_blank' }],
            },
        });

        expect(wrapper.find('a').exists()).toBe(false);
    });
});
