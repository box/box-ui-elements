import React from 'react';
import sinon from 'sinon';

import SingleSelectField from '../SingleSelectField';

const sandbox = sinon.sandbox.create();

describe('components/select-field/SingleSelectField', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const onChangeStub = () => {};

    const options = [
        { displayText: 'Foo', value: 'foo' },
        { displayText: 'Bar', value: 'bar' },
        { displayText: 'Baz', value: 'baz' },
    ];

    describe('render()', () => {
        test('should render a BaseSelectField with a selectedValues prop matching passed in selected value when called', () => {
            const wrapper = shallow(
                <SingleSelectField isDisabled={false} onChange={onChangeStub} options={options} selectedValue="bar" />,
            );
            const instance = wrapper.instance();

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toBe(options);
            expect(baseSelectFieldWrapper.prop('onChange')).toBe(instance.handleChange);
            expect(baseSelectFieldWrapper.prop('selectedValues')).toEqual(['bar']);
            expect(baseSelectFieldWrapper.prop('isDisabled')).toEqual(false);
        });

        test('should strip out props that are multi-select specific when called', () => {
            const wrapper = shallow(
                <SingleSelectField
                    defaultValue="foo"
                    multiple
                    onChange={onChangeStub}
                    options={options}
                    placeholder="Select something"
                    selectedValue="foo"
                />,
            );

            const baseSelectFieldWrapper = wrapper.find('BaseSelectField');
            expect(baseSelectFieldWrapper.length).toBe(1);
            expect(baseSelectFieldWrapper.prop('options')).toBe(options);
            expect(baseSelectFieldWrapper.prop('onChange')).not.toBe(onChangeStub);
            expect(baseSelectFieldWrapper.prop('defaultValue')).toBeFalsy();
            expect(baseSelectFieldWrapper.prop('placeholder')).toBe('Select something');
            expect(baseSelectFieldWrapper.prop('multiple')).toBeFalsy();
        });
    });

    describe('handleChange()', () => {
        test('should not call onChange() when there is no selected items', () => {
            const onChangeMock = sandbox.mock().never();
            const wrapper = shallow(
                <SingleSelectField onChange={onChangeMock} options={options} selectedValue="foo" />,
            );
            const instance = wrapper.instance();

            instance.handleChange([]);
        });

        test('should call onChange() when there is a selected item', () => {
            const onChangeMock = sandbox.mock().withArgs('foo');
            const wrapper = shallow(
                <SingleSelectField onChange={onChangeMock} options={options} selectedValue="foo" />,
            );
            const instance = wrapper.instance();

            instance.handleChange(['foo']);
        });

        test('should not call onChange() when there are more than 1 selected items (potentially an error)', () => {
            const onChangeMock = sandbox.mock().never();
            const wrapper = shallow(
                <SingleSelectField onChange={onChangeMock} options={options} selectedValue="foo" />,
            );
            const instance = wrapper.instance();

            instance.handleChange(['foo', 'bar']);
        });
    });
});
