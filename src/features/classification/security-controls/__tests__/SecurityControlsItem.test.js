import React from 'react';
import SecurityControlsItem from '../SecurityControlsItem';
import Tooltip from '../../../../components/tooltip';
import IconInfo from '../../../../icons/general/IconInfo';

describe('features/classification/security-controls/SecurityControlsItem', () => {
    let wrapper;
    let message;
    let appNames;

    const getWrapper = (props = {}) => shallow(<SecurityControlsItem {...props} />);

    beforeEach(() => {
        message = {
            id: 'boxui.securityControls.appDownloadWhitelistOverflow',
            defaultMessage: 'message',
        };
        appNames = {
            id: 'id2',
            defaultMessage: 'message2',
        };
        wrapper = getWrapper({ message, appNames });
    });

    test('should render a SecurityControlsItem with a message and Tooltip', () => {
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Tooltip)).toHaveLength(1);
        expect(wrapper.find(IconInfo)).toHaveLength(1);
    });

    test('should not render Tooltip if appNames is received as null', () => {
        wrapper.setProps({ appNames: null });
        expect(wrapper.find(Tooltip).length).toBe(0);
        expect(wrapper.find(IconInfo).length).toBe(0);
    });

    test('should not render Tooltip if not related to app restriction', () => {
        message = {
            id: 'id1',
            defaultMessage: 'message1',
        };
        wrapper.setProps({ message });
        expect(wrapper.find(Tooltip).length).toBe(0);
        expect(wrapper.find(IconInfo).length).toBe(0);
    });
});
