import React from 'react';
import { shallow } from 'enzyme';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import OpenWithDropdownMenu from '../OpenWithDropdownMenu';

describe('components/ContentOpenWith/OpenWithMenu', () => {
    const getWrapper = props => shallow(<OpenWithDropdownMenu {...props} />);

    it('should render a button and an menu item for each integration', () => {
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

        const wrapper = getWrapper({ integrations });
        expect(wrapper.find(Menu).children()).toHaveLength(2);

        expect(wrapper).toMatchSnapshot();
    });
});
