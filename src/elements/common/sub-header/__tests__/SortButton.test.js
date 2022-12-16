import React from 'react';
import Button from '../../../../components/button';
import IconSort from '../../../../icons/general/IconSort';
import { SortButtonBase } from '../SortButton';

const intlMock = {
    formatMessage: jest.fn().mockReturnValue('Sort'),
};

describe('elements/common/sub-header/SortButton', () => {
    const getWrapper = () => shallow(<SortButtonBase intl={intlMock} />);

    test('should render IconSort', () => {
        const wrapper = getWrapper();
        expect(wrapper.exists(IconSort)).toBe(true);
    });

    test('should have aria-label "Sort"', () => {
        const wrapper = getWrapper();
        const button = wrapper.find(Button);
        expect(button.prop('aria-label')).toBe('Sort');
        expect(button.prop('aria-describedby')).toBeFalsy();
    });
});
