import React from 'react';
import { shallow } from 'enzyme';
import { SidebarComponent as Sidebar } from '../Sidebar';

jest.mock('../../common/async-load', () => () => 'LoadableComponent');

describe('elements/content-sidebar/Sidebar', () => {
    const getWrapper = props => shallow(<Sidebar file={{ id: 'id' }} {...props} />);

    describe('componentDidUpdate', () => {
        test('should set isOpen if isLarge prop has changed', () => {
            const wrapper = getWrapper({ isLarge: true });

            expect(wrapper.state('isOpen')).toEqual(true);

            wrapper.setProps({ isLarge: false });

            expect(wrapper.state('isOpen')).toEqual(false);
        });
    });
});
