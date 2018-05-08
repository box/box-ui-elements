import * as React from 'react';
import { shallow } from 'enzyme';
import Timeslice from '../Timeslice';

describe('components/ContentSidebar/Skills/Timeline/Timeslice', () => {
    test('should correctly render the time slice with no end', () => {
        const props = {
            start: 10,
            duration: 100,
            interactionTarget: 'foobar'
        };

        const wrapper = shallow(<Timeslice {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render the time slice with proper end', () => {
        const props = {
            start: 10,
            end: 20,
            duration: 100,
            interactionTarget: 'foobar'
        };

        const wrapper = shallow(<Timeslice {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
