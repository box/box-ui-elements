import React from 'react';
import sinon from 'sinon';

import ExpirationSection from '../ExpirationSection';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-settings-modal/ExpirationSection', () => {
    const canChangeExpiration = true;
    const expirationDate = new Date();
    const isExpirationEnabled = true;
    const onCheckboxChange = sandbox.stub();
    const onExpirationDateChange = sandbox.stub();

    const getWrapper = (props = {}) =>
        shallow(
            <ExpirationSection
                canChangeExpiration={canChangeExpiration}
                expirationDate={expirationDate}
                isExpirationEnabled={isExpirationEnabled}
                onCheckboxChange={onCheckboxChange}
                onExpirationDateChange={onExpirationDateChange}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should pass passthrough props to Checkbox', () => {
        const wrapper = getWrapper({
            expirationCheckboxProps: { 'data-prop': 'checkbox' },
        });

        expect(wrapper.find('Checkbox').prop('data-prop')).toEqual('checkbox');
    });

    test('should render a fieldset with an hr', () => {
        const wrapper = getWrapper();

        const fieldset = wrapper.find('Fieldset');
        expect(fieldset.length).toBe(1);
        expect(fieldset.prop('title')).toBeTruthy();
    });

    test('should render a Checkbox with no subsection when expiration not enabled', () => {
        const wrapper = getWrapper({
            isExpirationEnabled: false,
            onCheckboxChange: sandbox.mock(),
        });

        const checkbox = wrapper.find('Checkbox');
        expect(checkbox.length).toBe(1);
        expect(checkbox.prop('isChecked')).toBe(false);
        expect(checkbox.prop('subsection')).toBeFalsy();
        checkbox.simulate('change');
    });

    test('should disable Checkbox when canChangeExpiration is false', () => {
        const wrapper = getWrapper({
            canChangeExpiration: false,
        });

        expect(wrapper.find('Checkbox').prop('isDisabled')).toBe(true);
    });

    describe('expiration is enabled', () => {
        const getSubsection = (props = {}) =>
            shallow(
                getWrapper(props)
                    .find('Checkbox')
                    .prop('subsection'),
            ).find('DatePicker');

        test('should render DatePicker when expiration is enabled', () => {
            const wrapper = getSubsection({
                onExpirationDateChange: sandbox.mock(),
            });

            expect(wrapper.is('DatePicker')).toBe(true);
            wrapper.simulate('change');
        });

        test('should disable DatePicker when user cannot change expiration', () => {
            const wrapper = getSubsection({ canChangeExpiration: false });

            expect(wrapper.prop('isDisabled')).toBe(true);
        });

        test('should pass passthrough props to DatePicker', () => {
            const wrapper = getSubsection({
                expirationInputProps: { 'data-prop': 'input' },
            });

            expect(wrapper.prop('inputProps')['data-prop']).toEqual('input');
        });
    });
});
