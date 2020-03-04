import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import CheckboxTooltip from '../CheckboxTooltip';

describe('components/checkbox/CheckboxTooltip', () => {
    let wrapper: ShallowWrapper;
    let tooltip;

    beforeEach(() => {
        wrapper = shallow(<CheckboxTooltip tooltip="foobar" />);
        tooltip = wrapper.find('Tooltip');
    });

    test('should correctly render default component', () => {
        expect(wrapper.find('.checkbox-tooltip-wrapper').length).toBeTruthy();
        expect(tooltip.length).toBeTruthy();
    });
});
