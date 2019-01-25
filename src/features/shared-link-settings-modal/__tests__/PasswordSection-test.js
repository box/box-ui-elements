import React from 'react';
import sinon from 'sinon';

import { PasswordSectionBase as PasswordSection } from '../PasswordSection';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-settings-modal/PasswordSection', () => {
    const canChangePassword = true;
    const intl = { formatMessage: sandbox.stub() };
    const isPasswordAvailable = true;
    const isPasswordEnabled = true;
    const isPasswordInitiallyEnabled = true;
    const onCheckboxChange = sandbox.stub();
    const onPasswordChange = sandbox.stub();
    const password = 'password';

    const getWrapper = (props = {}) =>
        shallow(
            <PasswordSection
                canChangePassword={canChangePassword}
                intl={intl}
                isPasswordAvailable={isPasswordAvailable}
                isPasswordEnabled={isPasswordEnabled}
                isPasswordInitiallyEnabled={isPasswordInitiallyEnabled}
                onCheckboxChange={onCheckboxChange}
                onPasswordChange={onPasswordChange}
                password={password}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render a fieldset with an hr', () => {
        const wrapper = getWrapper();

        const fieldset = wrapper.find('Fieldset');
        expect(fieldset.length).toBe(1);
        expect(fieldset.prop('title')).toBeTruthy();

        expect(wrapper.find('hr').length).toBe(1);
    });

    test('should return null when isPasswordAvailable is false', () => {
        const wrapper = getWrapper({ isPasswordAvailable: false });

        expect(wrapper.type()).toBeNull();
    });

    test('should pass passthrough props to Checkbox', () => {
        const wrapper = getWrapper({
            passwordCheckboxProps: { 'data-prop': 'checkbox' },
        });

        expect(wrapper.find('Checkbox').prop('data-prop')).toEqual('checkbox');
    });

    test('should render a Checkbox with no subsection when isPasswordEnabled is false', () => {
        const wrapper = getWrapper({
            isPasswordEnabled: false,
            onCheckboxChange: sandbox.mock(),
        });

        const checkbox = wrapper.find('Checkbox');
        expect(checkbox.length).toBe(1);
        expect(checkbox.prop('subsection')).toBeFalsy();
        checkbox.simulate('change');
    });

    test('should disable Checkbox when canChangePassword is false', () => {
        const wrapper = getWrapper({
            canChangePassword: false,
        });

        expect(wrapper.find('Checkbox').prop('isDisabled')).toBe(true);
    });

    describe('isPasswordEnabled === true ', () => {
        const getInputWrapper = (props = {}) =>
            shallow(
                getWrapper(props)
                    .find('Checkbox')
                    .prop('subsection'),
            ).find('TextInput');

        test('should render a TextInput subsection when isPasswordEnabled is true', () => {
            const wrapper = getInputWrapper({
                onPasswordChange: sandbox.mock(),
            });

            expect(wrapper.is('TextInput')).toBe(true);
            wrapper.simulate('change');
        });

        test('should disable TextInput when canChangePassword is false', () => {
            const wrapper = getInputWrapper({ canChangePassword: false });

            expect(wrapper.prop('disabled')).toBe(true);
        });

        test('should set TextInput to required when isPasswordInitiallyEnabled is false', () => {
            const wrapper = getInputWrapper({
                isPasswordInitiallyEnabled: false,
            });

            expect(wrapper.prop('isRequired')).toBe(true);
        });

        test('should pass passthrough props to TextInput', () => {
            const wrapper = getInputWrapper({
                passwordInputProps: { 'data-prop': 'input' },
            });

            expect(wrapper.prop('data-prop')).toEqual('input');
        });
    });
});
