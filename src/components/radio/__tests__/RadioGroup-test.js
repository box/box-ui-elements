import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { RadioButton, RadioGroup } from '..';

const sandbox = sinon.sandbox.create();

describe('components/radio/RadioGroup', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const renderRadioButtons = onChange =>
        mount(
            <RadioGroup name="radiogroup" onChange={onChange} value="radio3">
                <RadioButton
                    data-resin-target="resin1"
                    description="radio1desc"
                    label="Radio Button 1"
                    value="radio1"
                />
                <RadioButton label="Radio Button 2" value="radio2" />
                <RadioButton description="radio3desc" label="Radio Button 3" value="radio3" />
                <RadioButton label="Radio Button 4" value="radio4" />
            </RadioGroup>,
        );

    test('should correctly render component with radio buttons', () => {
        const component = renderRadioButtons();

        expect(component.find('.radio-group')).toBeTruthy();
        expect(component.find('input[name="radiogroup"]').length).toEqual(4);
        expect(
            component
                .find('.radio-description')
                .at(0)
                .text(),
        ).toEqual('radio1desc');
        expect(
            component
                .find('.radio-description')
                .at(1)
                .text(),
        ).toEqual('radio3desc');
    });

    test('should set correct value to input', () => {
        const component = renderRadioButtons();

        expect(
            component
                .find('input')
                .at(0)
                .prop('value'),
        ).toEqual('radio1');
        expect(
            component
                .find('input')
                .at(0)
                .prop('value'),
        ).toEqual('radio1');
    });

    test('should pass rest of props to input', () => {
        const component = renderRadioButtons();
        const inputEl = component.find('input').at(0);

        expect(inputEl.prop('data-resin-target')).toEqual('resin1');
    });

    test('should select the correct radio button based on value', () => {
        const component = renderRadioButtons();

        expect(
            component
                .find('input[name="radiogroup"]')
                .at(2)
                .prop('checked'),
        ).toEqual(true);
    });

    test('should call onChange callback when onchange triggers', () => {
        const onChange = sandbox.spy();
        const component = renderRadioButtons(onChange);
        const inputEl = component
            .find('input')
            .at(0)
            .getDOMNode();
        inputEl.value = 'radio4';
        const event = {
            target: inputEl,
        };
        component.simulate('change', event);
        expect(onChange.calledWithMatch(event)).toBeTruthy();
    });

    test('should update state when change event is fired', () => {
        const component = renderRadioButtons();
        const inputEl = component
            .find('input')
            .at(0)
            .getDOMNode();
        inputEl.value = 'radio4';

        component.simulate('change', {
            target: inputEl,
        });

        expect(component.state('value')).toEqual('radio4');
        expect(
            component
                .find('input[name="radiogroup"]')
                .at(2)
                .prop('checked'),
        ).toEqual(false);
        expect(
            component
                .find('input[name="radiogroup"]')
                .at(3)
                .prop('checked'),
        ).toEqual(true);
    });
});
