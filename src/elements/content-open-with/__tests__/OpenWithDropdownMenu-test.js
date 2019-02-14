import React from 'react';
import { shallow } from 'enzyme';
import noop from 'lodash/noop';
import Menu from '../../../components/menu/Menu';
import OpenWithDropdownMenu from '../OpenWithDropdownMenu';

describe('elements/content-open-with/OpenWithDropdownMenu', () => {
    const getWrapper = props => shallow(<OpenWithDropdownMenu {...props} />);

    test('should render a button and an menu item for each integration', () => {
        const integrations = [
            {
                appIntegrationId: 1,
                displayName: 'Adobe Sign',
            },
            {
                appIntegrationId: 2,
                displayName: 'Google Docs',
            },
        ];

        const wrapper = getWrapper({
            integrations,
            onClick: noop,
        });
        expect(wrapper.find(Menu).children()).toHaveLength(2);

        expect(wrapper).toMatchSnapshot();
    });
});
