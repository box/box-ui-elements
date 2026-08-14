import * as React from 'react';
import { shallow } from 'enzyme';

import { TooltipPosition } from '../../tooltip';
import SelectButton from '..';

describe('components/select-button/SelectButton', () => {
    test('should correctly render children in select button', () => {
        const children = 'yooo';

        const wrapper = shallow(
            <SelectButton className="" isDisabled={false}>
                {children}
            </SelectButton>,
        ).find('button');

        expect(wrapper.hasClass('select-button')).toBe(true);
        expect(wrapper.contains(children)).toBe(true);
        expect(wrapper.prop('disabled')).toBe(false);
    });
    test('should not show error tooltip on button by default', () => {
        const wrapper = shallow(
            <SelectButton className="" isDisabled={false}>
                Button Text
            </SelectButton>,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should show error tooltip on button when error is has some value', () => {
        const wrapper = shallow(
            <SelectButton className="" error="error" isDisabled={false}>
                Button Text
            </SelectButton>,
        );
        expect(wrapper).toMatchSnapshot();
    });
    test('should align error tooltip on button when errorTooltipPosition has some value', () => {
        const wrapper = shallow(
            <SelectButton
                className=""
                error="error"
                errorTooltipPosition={TooltipPosition.MIDDLE_LEFT}
                isDisabled={false}
            >
                Button Text
            </SelectButton>,
        );
        expect(wrapper.find('Tooltip').prop('position')).toBe(TooltipPosition.MIDDLE_LEFT);
    });
});
