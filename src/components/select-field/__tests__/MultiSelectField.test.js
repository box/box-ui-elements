import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { MultiSelectFieldBase } from '../MultiSelectField';

describe('components/select-field/MultiSelectField', () => {
    const options = [
        { displayText: 'Foo', value: 'foo' },
        { displayText: 'Bar', value: 'bar' },
        { displayText: 'Baz', value: 'baz' },
    ];

    const intl = {
        formatMessage: jest.fn().mockReturnValue('Clear All'),
    };

    describe('MultiSelectField', () => {
        test('should render a BaseSelectField with a selectedValues prop matching passed in selected value when called', () => {
            const wrapper = shallow(<MultiSelectFieldBase intl={intl} onChange={() => {}} options={options} />);

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toBe(options);
            expect(baseSelectFieldWrapper.prop('multiple')).toBe(true);
        });

        test('should render a BaseSelectField with an options prop containing a clear option if shouldShowClearOption is true', () => {
            const wrapper = shallow(
                <MultiSelectFieldBase intl={intl} onChange={() => {}} options={options} shouldShowClearOption />,
            );
            const expectedOptions = cloneDeep(options);
            expectedOptions.unshift({
                value: 'clear',
                displayText: 'Clear All',
            });

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toStrictEqual(expectedOptions);
        });
    });
});
