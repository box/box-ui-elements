import React from 'react';
import sinon from 'sinon';
import Checkbox from '../../../components/checkbox';
import TextInput from '../../../components/text-input';

import { VanityNameSectionBase as VanityNameSection } from '../VanityNameSection';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-settings-modla/VanityNameSection', () => {
    const vanityName = 'vanity';
    const serverURL = 'url/';

    const getWrapper = (props = {}) =>
        mount(
            <VanityNameSection
                canChangeVanityName
                intl={{ formatMessage: sandbox.stub() }}
                onChange={sandbox.stub()}
                onCheckboxChange={sandbox.stub()}
                serverURL={serverURL}
                vanityName={vanityName}
                isVanityEnabled
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render a TextInput and a Checkbox', () => {
        const wrapper = getWrapper();

        const textInput = wrapper.find(TextInput);
        expect(textInput.length).toBe(1);
        expect(textInput.prop('value')).toEqual(vanityName);

        const checkbox = wrapper.find(Checkbox);
        expect(checkbox.length).toBe(1);
        expect(checkbox.prop('isDisabled')).toBe(false);
    });

    test('should pass passthrough props to TextInput', () => {
        const wrapper = getWrapper({
            vanityNameInputProps: { 'data-prop': 'input' },
        });

        expect(wrapper.find(TextInput).prop('data-prop')).toEqual('input');
    });

    test('should render a URL preview', () => {
        const wrapper = getWrapper();

        const preview = wrapper.find('.custom-url-preview');
        expect(preview.text()).toEqual(`${serverURL}${vanityName}`);
    });

    test('should not render URL preview when user cannot change vanity name and no vanity name is set', () => {
        const wrapper = getWrapper({
            canChangeVanityName: false,
            vanityName: '',
        });

        expect(wrapper.find('.custom-url-preview').length).toBe(0);
    });

    test('should disable TextInput and Checkbox when user cannot change vanity name', () => {
        const wrapper = getWrapper({
            canChangeVanityName: false,
        });

        const textInput = wrapper.find(TextInput);
        expect(textInput.prop('disabled')).toBe(true);

        const checkbox = wrapper.find(Checkbox);
        expect(checkbox.prop('isDisabled')).toBe(true);
    });

    test('should show message in TextInput when user cannot change vanity name and no vanity name is set', () => {
        const message = 'no vanity name set';
        const wrapper = getWrapper({
            canChangeVanityName: false,
            intl: { formatMessage: sandbox.stub().returns(message) },
            vanityName: '',
        });

        expect(wrapper.find(TextInput).prop('value')).toEqual(message);
        expect(wrapper.find(Checkbox).prop('isDisabled')).toBe(true);
    });
});
