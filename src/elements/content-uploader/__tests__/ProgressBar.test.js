import React from 'react';
import { shallow } from 'enzyme';
import ProgressBar from '../ProgressBar';

describe('componentDidUpdate()', () => {
    test('it should increment the progress bar', () => {
        const component = shallow(<ProgressBar percent={20} />);

        component.setProps({ percent: 30 });
        expect(component.state('percent')).toEqual(30);
    });
});
