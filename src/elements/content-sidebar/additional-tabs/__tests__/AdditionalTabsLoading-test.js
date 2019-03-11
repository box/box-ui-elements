import React from 'react';
import { shallow } from 'enzyme';
import AdditionalTabsLoading from '../AdditionalTabsLoading';

describe('elements/content-sidebar/additional-tabs/AdditionalTabs', () => {
    const getWrapper = props => shallow(<AdditionalTabsLoading {...props} />);

    test('should render the correct loading state', () => {
        const wrapper = getWrapper({});
        expect(wrapper).toMatchSnapshot();
    });
});
