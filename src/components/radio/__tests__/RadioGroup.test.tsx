import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import sinon from 'sinon';

import { RadioButton, RadioGroup } from '..';

const sandbox = sinon.sandbox.create();

describe('components/radio/RadioGroup', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const renderRadioButtons = (
        onChange?: (event: React.SyntheticEvent<HTMLElement>) => void,
        children?: Array<React.ReactElement> | React.ReactElement,
    ): ReactWrapper => {
        children = children || [
            <RadioButton
                data-resin-target="resin1"
                description="radio1desc"
                key="1"
                label="Radio Button 1"
                value="radio1"
            />,
            <RadioButton key="2" label="Radio Button 2" value="radio2" />,
            <RadioButton description="radio3desc" key="3" label="Radio Button 3" value="radio3" />,
            <RadioButton key="4" label="Radio Button 4" value="radio4" />,
        ];

        return mount(
            <RadioGroup name="radiogroup" onChange={onChange} value="radio3">
                {children}
            </RadioGroup>,
        );
    };

    test('should correctly render component with radio buttons', () => {
        const component = renderRadioButtons();

        expect(component.find('.radio-group')).toBeTruthy();
        expect(component.find('input[name="radiogroup"]').length).toEqual(4);
        expect(component.find('.radio-description').at(0).text()).toEqual('radio1desc');
        expect(component.find('.radio-description').at(1).text()).toEqual('radio3desc');
    });

    test('should set correct value to input', () => {
        const component = renderRadioButtons();

        expect(component.find('input').at(0).prop('value')).toEqual('radio1');
        expect(component.find('input').at(0).prop('value')).toEqual('radio1');
    });

    test('should pass rest of props to input', () => {
        const component = renderRadioButtons();
        const inputEl = component.find('input').at(0);

        expect(inputEl.prop('data-resin-target')).toEqual('resin1');
    });

    test('should select the correct radio button based on value', () => {
        const component = renderRadioButtons();

        expect(component.find('input[name="radiogroup"]').at(2).prop('checked')).toEqual(true);
    });

    test('should call onChange callback when onchange triggers', () => {
        const onChange = sandbox.spy();
        const component = renderRadioButtons(onChange);
        const inputEl: HTMLInputElement = component.find('input').at(0).getDOMNode();
        inputEl.value = 'radio4';
        const event = {
            target: inputEl,
        };
        component.simulate('change', event);
        expect(onChange.calledWithMatch(event)).toBeTruthy();
    });

    test('should update state when change event is fired', () => {
        const component = renderRadioButtons();
        const inputEl: HTMLInputElement = component.find('input').at(0).getDOMNode();
        inputEl.value = 'radio4';

        component.simulate('change', {
            target: inputEl,
        });

        expect(component.state('value')).toEqual('radio4');
        expect(component.find('input[name="radiogroup"]').at(2).prop('checked')).toEqual(false);
        expect(component.find('input[name="radiogroup"]').at(3).prop('checked')).toEqual(true);
    });

    test('should preserve radio button component type and props', () => {
        const radioButtonProps = {
            'data-resin-target': 'resinTarget',
            description: 'description',
            label: 'label',
            randomProp: true,
            value: 'radio3',
        };

        const CustomRadioButton = () => <span />;
        const component = renderRadioButtons(jest.fn(), <CustomRadioButton {...radioButtonProps} />);

        expect(component.find(CustomRadioButton).at(0).props()).toEqual({
            ...radioButtonProps,
            isSelected: true,
            name: 'radiogroup',
        });
    });
});
