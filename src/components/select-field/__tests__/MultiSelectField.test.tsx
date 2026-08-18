import * as React from 'react';
import { shallow } from 'enzyme';
import type { IntlShape } from 'react-intl';

import { MultiSelectFieldBase } from '../MultiSelectField';
import CLEAR from '../constants';

const intl = {
    formatMessage: jest.fn().mockImplementation(() => 'Clear All'),
} as unknown as IntlShape;

describe('components/select-field/MultiSelectField', () => {
    const options = [
        { displayText: 'Foo', value: 'foo' },
        { displayText: 'Bar', value: 'bar' },
        { displayText: 'Baz', value: 'baz' },
    ];

    describe('MultiSelectField', () => {
        test('should render a BaseSelectField with a selectedValues prop matching passed in selected value when called', () => {
            const wrapper = shallow(<MultiSelectFieldBase intl={intl} onChange={jest.fn()} options={options} />);

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper).toHaveLength(1);
            expect(baseSelectFieldWrapper.prop('options')).toEqual(options);
            expect(baseSelectFieldWrapper.prop('multiple')).toBe(true);
        });

        test('should render a BaseSelectField with an options prop containing a clear option if shouldShowClearOption is true', () => {
            const wrapper = shallow(
                <MultiSelectFieldBase intl={intl} onChange={jest.fn()} options={options} shouldShowClearOption />,
            );
            const expectedOptions = [
                {
                    value: CLEAR,
                    displayText: 'Clear All',
                },
                ...options,
            ];

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper).toHaveLength(1);
            expect(baseSelectFieldWrapper.prop('options')).toEqual(expectedOptions);
        });
    });
});
