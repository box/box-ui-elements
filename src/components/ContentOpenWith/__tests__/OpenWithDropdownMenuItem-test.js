import React from 'react';
import noop from 'lodash/noop';
import { shallow } from 'enzyme';
import OpenWithDropdownMenuItem from '../OpenWithDropdownMenuItem';

describe('components/ContentOpenWith/OpenWithMenu', () => {
    const getWrapper = props =>
        shallow(<OpenWithDropdownMenuItem {...props} />);

    test('should render the description and correct icon', () => {
        const props = {
            integration: {
                displayName: 'Adobe Sign',
                displayDescription: 'Open With Adobe',
                appIntegrationId: '1',
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
            },
            onClick: noop,
        };
        const wrapper = getWrapper(props);
        expect(wrapper).toMatchSnapshot();
    });
});
