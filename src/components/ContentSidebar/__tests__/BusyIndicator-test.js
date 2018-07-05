import * as React from 'react';
import { shallow } from 'enzyme';
import BusyIndicator from '../BusyIndicator';

describe('components/ContentSidebar/BusyIndicator', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<BusyIndicator />);
        expect(wrapper).toMatchSnapshot();
    });
});
