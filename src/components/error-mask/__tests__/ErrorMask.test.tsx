import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ErrorMask from '..';

let component: ShallowWrapper;

describe('components/error-mask/ErrorMask', () => {
    beforeEach(() => {
        component = shallow(<ErrorMask errorHeader="Header Womp" errorSubHeader="SubHeader Womp" />);
    });

    test('should render an error mask with the sad cloud', () => {
        expect(component.find('.sad-cloud').find('SadCloud')).toBeTruthy();
    });

    test('should render the header and subheader', () => {
        expect(component.find('h4').text()).toEqual('Header Womp');
        expect(component.find('h5').text()).toEqual('SubHeader Womp');
    });
});
