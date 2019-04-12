import React from 'react';
import { shallow } from 'enzyme';
import AddTaskMenu from '../AddTaskMenu';

describe('elements/content-sidebar/AddTaskMenu', () => {
    const getWrapper = props => shallow(<AddTaskMenu {...props} />);

    describe('render', () => {
        test('should render a default component with default props', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
