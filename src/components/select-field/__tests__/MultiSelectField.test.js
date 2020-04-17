import React from 'react';

import MultiSelectField from '../MultiSelectField';

describe('components/select-field/MultiSelectField', () => {
    const options = [
        { displayText: 'Foo', value: 'foo' },
        { displayText: 'Bar', value: 'bar' },
        { displayText: 'Baz', value: 'baz' },
    ];

    describe('MultiSelectField', () => {
        test('should render a BaseSelectField with a selectedValues prop matching passed in selected value when called', () => {
            const wrapper = shallow(<MultiSelectField onChange={() => {}} options={options} />);

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toBe(options);
            expect(baseSelectFieldWrapper.prop('multiple')).toBe(true);
        });

        test('should render a BaseSelectField with an options prop containing a clear option if shouldShowClearOption is true', () => {
            const wrapper = shallow(<MultiSelectField onChange={() => {}} options={options} shouldShowClearOption />);
            const expectedOptions = options;
            expectedOptions.unshift({
                value: 'clear',
                displayText: 'Clear All',
            });

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toBe(expectedOptions);
        });
    });
});
