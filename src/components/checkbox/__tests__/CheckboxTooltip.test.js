import React from 'react';

import CheckboxTooltip from '../CheckboxTooltip';

describe('components/checkbox/CheckboxTooltip', () => {
    let wrapper;
    let tooltip;

    beforeEach(() => {
        // eslint-disable-next-line jsx-a11y/label-has-for
        wrapper = shallow(<CheckboxTooltip label={<label />} tooltip="foobar" />);
        tooltip = wrapper.find('Tooltip');
    });

    test('should correctly render default component', () => {
        expect(wrapper.find('.checkbox-tooltip-wrapper').length).toBeTruthy();
        expect(wrapper.find('label').length).toBeTruthy();
        expect(tooltip.length).toBeTruthy();
    });
});
