import React from 'react';
import { shallow } from 'enzyme';
import ActivitySidebar from '../ActivitySidebar';

describe('components/ContentSidebar/ActivitySidebar', () => {
    const getWrapper = (props) => shallow(<ActivitySidebar {...props} />);

    test('should render the activity feed sidebar', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
