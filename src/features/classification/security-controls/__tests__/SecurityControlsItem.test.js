import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import SecurityControlsItem from '../SecurityControlsItem';
import Tooltip from '../../../../components/tooltip';
import IconInfo from '../../../../icons/general/IconInfo';

describe('features/classification/security-controls/SecurityControlsItem', () => {
    let wrapper;
    let message;
    let tooltipMessage;

    const getWrapper = (props = {}) => shallow(<SecurityControlsItem {...props} />);

    beforeEach(() => {
        message = {
            id: 'id1',
            defaultMessage: 'message',
        };
        tooltipMessage = {
            id: 'id2',
            defaultMessage: 'message2',
        };
        wrapper = getWrapper({ message, tooltipMessage });
    });

    test('should render a SecurityControlsItem with a message and Tooltip', () => {
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Tooltip)).toHaveLength(1);
        expect(wrapper.find(IconInfo)).toHaveLength(1);
    });

    test('should not render Tooltip if tooltipMessage is received as undefined', () => {
        wrapper.setProps({ tooltipMessage: undefined });
        expect(wrapper.find(Tooltip).length).toBe(0);
        expect(wrapper.find(IconInfo).length).toBe(0);
    });

    test('should render message as if it is a valid element and not render FormattedMessage', () => {
        const messageElement = <div>Test Element</div>;
        wrapper.setProps({ message: messageElement });

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(FormattedMessage).length).toBe(0);
    });
});
