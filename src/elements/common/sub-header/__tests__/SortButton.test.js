import React from 'react';
import { shallow } from 'enzyme';
import { SortButtonBase } from '../SortButton';
import Button from '../../../../components/button';
import IconSort from '../../../../icons/general/IconSort';

const intlMock = {
    formatMessage: jest.fn().mockReturnValue('Sort'),
};

describe('Elements/SubHeader/SortButton', () => {
    const getWrapper = () => shallow(<SortButtonBase intl={intlMock} />);

    test('should render IconSort', () => {
        const wrapper = getWrapper();
        expect(wrapper.exists(IconSort)).toBe(true);
    });

    test('should have aria-label "sort"', () => {
        const wrapper = getWrapper();
        const button = wrapper.find(Button);
        expect(button.prop('aria-label')).toBe('Sort');
        expect(button.prop('aria-describedBy')).toBeFalsy();
    });
});
