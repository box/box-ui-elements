import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import OpenWithDropdownMenuItem from '../OpenWithDropdownMenuItem';

describe('components/ContentOpenWith/OpenWithMenuItem', () => {
    const getWrapper = props => shallow(<OpenWithDropdownMenuItem {...props} />);

    test('should render the description and correct icon', () => {
        const props = {
            integration: {
                displayName: 'Adobe Sign',
                displayDescription: 'Open With Adobe',
                appIntegrationId: '1',
                disabledReasons: [],
            },
            onClick: noop,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should use the default icon when no mapping can be found to an existing icon', () => {
        const props = {
            integration: {
                displayName: 'A new integration',
                displayDescription: 'Open With the new integration',
                appIntegrationId: '22',
                disabledReasons: [],
            },
            onClick: noop,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should be disabled with a reason if the integration is disabled', () => {
        const props = {
            integration: {
                displayName: 'A new integration',
                displayDescription: 'Open With the new integration',
                isDisabled: true,
                disabledReasons: ['The integration is not currently available'],
                appIntegrationId: '22',
            },
            onClick: noop,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });

    test('should use the default error for a disabled integration if there is no reason', () => {
        const props = {
            integration: {
                displayName: 'A new integration',
                disabledReasons: [],
                displayDescription: 'Open With the new integration',
                isDisabled: true,
                appIntegrationId: '22',
            },
            onClick: noop,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });
});
