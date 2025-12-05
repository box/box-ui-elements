import React, { act } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import TextInput from '..';
import { FormContext } from '../../form/FormContext';

const sandbox = sinon.sandbox.create();

describe('components/form-elements/text-input/TextInput', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render default component', () => {
        const wrapper = shallow(<TextInput label="label" name="input" />);

        expect(wrapper.find('TextInput').length).toEqual(1);
    });

    test('should update state if value prop changes', () => {
        const wrapper = shallow(<TextInput label="label" name="textarea" value="test" />);

        wrapper.setProps({ value: 'new prop' });

        expect(wrapper.state('value')).toEqual('new prop');
    });

    test('should mark required fields invalid when empty', () => {
        const wrapper = mount(<TextInput className="coverage" isRequired label="label" name="input" />);
        const input = wrapper.find('input');
        input.simulate('blur');
        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeTruthy();
    });

    test('should mark required fields valid when not empty', () => {
        const wrapper = mount(<TextInput isRequired label="label" name="input" value="baba" />);
        const input = wrapper.find('input');
        input.simulate('blur');
        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
    });

    test('should correctly validate when change event is fired', () => {
        const wrapper = mount(<TextInput isRequired label="label" name="input" value="" />);
        const input = wrapper.find('input');
        input.simulate('blur');

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeTruthy();

        wrapper.setProps({ value: 'a' });
        input.simulate('blur');
        const inputEl = input.getDOMNode();
        inputEl.value = 'a';
        input.simulate('change', {
            currentTarget: inputEl,
        });

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
    });

    test('should mark email fields invalid when invalid', () => {
        const wrapper = mount(<TextInput label="label" name="input" type="email" value="bob" />);
        const input = wrapper.find('input');
        input.simulate('blur');
        expect(wrapper.state('isValid')).toBeFalsy();
    });

    test('should mark email fields valid when valid', () => {
        const wrapper = mount(<TextInput label="label" name="input" type="email" value="bob@bob.com" />);
        const input = wrapper.find('input');
        input.simulate('blur');
        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
    });

    test('should mark url fields invalid when invalid', () => {
        const wrapper = mount(<TextInput label="label" name="input" type="url" value="bob" />);
        const instance = wrapper.instance();
        instance.input = { validity: { typeMismatch: true } };
        act(() => {
            instance.checkValidity();
        });
        wrapper.update();

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeTruthy();
    });

    test('should mark url fields valid when valid', () => {
        const wrapper = mount(<TextInput label="label" name="input" type="url" value="http://bob.com" />);
        const instance = wrapper.instance();
        instance.input = { validity: { valid: true } };
        act(() => {
            instance.checkValidity();
        });
        wrapper.update();

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
        expect(wrapper.state('errorMessage')).toBeFalsy();
    });

    test('should set an input as valid when the validityFn returns an void', () => {
        function validityFn() {}

        const wrapper = mount(<TextInput label="label" name="input" type="custom" validation={validityFn} />);
        const input = wrapper.find('input');
        input.simulate('blur');

        expect(input.getDOMNode().validity.valid).toBeTruthy();
    });

    test('should set an input as invalid when the validityFn returns an error string and input is not empty', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(
            <TextInput label="label" name="input" type="custom" validation={validityFn} value="yes" />,
        );
        const input = wrapper.find('input');
        const setCustomValiditySpy = jest.spyOn(input.getDOMNode(), 'setCustomValidity');
        input.simulate('blur');

        expect(setCustomValiditySpy).toHaveBeenCalledWith('errCode');
    });

    test('should set an input as valid when intially then fixed when using validityFn', () => {
        const stub = sinon.stub();

        stub.onCall(0).returns({
            code: 'errCode',
            message: 'errMessage',
        });

        stub.onCall(1).returns();

        const wrapper = mount(<TextInput label="label" name="input" type="custom" validation={stub} value="yes" />);
        let input = wrapper.find('input');
        let setCustomValiditySpy = jest.spyOn(input.getDOMNode(), 'setCustomValidity');

        input.simulate('blur');
        expect(setCustomValiditySpy).toHaveBeenCalledWith('errCode');

        // Get the re-rendered input again
        input = wrapper.find('input');
        setCustomValiditySpy = jest.spyOn(input.getDOMNode(), 'setCustomValidity');

        input.simulate('blur');
        expect(setCustomValiditySpy).toHaveBeenCalledWith('');
    });

    test('should not set input invalid when the validityFn returns an error string and input is empty and not required', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(<TextInput label="label" name="input" type="custom" validation={validityFn} />);
        const input = wrapper.find('input');
        input.simulate('blur');

        expect(input.getDOMNode().validity.valid).toBeTruthy();
    });

    test('should set input invalid when the validityFn returns an error string, input is empty and is required', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(
            <TextInput isRequired label="label" name="input" type="custom" validation={validityFn} />,
        );
        const input = wrapper.find('input');
        const setCustomValiditySpy = jest.spyOn(input.getDOMNode(), 'setCustomValidity');
        input.simulate('blur');

        expect(setCustomValiditySpy).toHaveBeenCalledWith('errCode');
    });

    test('should re-validate when input is set via props programaticallly', () => {
        const wrapper = mount(<TextInput isRequired label="label" name="input" value="" />);
        const input = wrapper.find('input');
        input.simulate('blur');

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeTruthy();

        wrapper.setProps({ value: 'abba' });

        input.simulate('blur');
        const inputEl = input.getDOMNode();
        inputEl.value = 'a';
        input.simulate('change', {
            currentTarget: inputEl,
        });
        wrapper.update();

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
    });

    test('should validate onChange when input is already in error state', () => {
        const wrapper = mount(<TextInput isRequired label="label" name="input" value="" />);
        const input = wrapper.find('input');
        input.simulate('blur');

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeTruthy();

        const inputEl = input.getDOMNode();
        inputEl.value = 'a';
        input.simulate('change', {
            currentTarget: inputEl,
        });
        wrapper.update();

        expect(wrapper.find('.text-input-container').hasClass('show-error')).toBeFalsy();
    });

    test('should set validity state when set validity state handler is called with custom error', () => {
        const validityStateHandlerSpy = sinon.spy();
        const mockForm = {
            registerInput: validityStateHandlerSpy,
            unregisterInput: sandbox.mock().never(),
        };
        const error = {
            errorCode: 'errorCode',
            errorMessage: 'Error Message',
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <TextInput label="label" name="input" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });

        expect(component.find('TextInput').first().instance().state.error).toEqual(error);
    });

    test('should set validity state when set validity state handler is called with ValidityState object', () => {
        const validityStateHandlerSpy = sinon.spy();
        const mockForm = {
            registerInput: validityStateHandlerSpy,
            unregisterInput: sandbox.mock().never(),
        };
        const error = {
            valid: false,
            badInput: true,
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <TextInput label="label" name="input" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });
        expect(component.find('TextInput').first().instance().state.error.code).toEqual('badInput');
    });

    /**
     * Using the context to test these code paths since phantomJS doesn't
     * support the functionality
     */
    test('should correctly validate patternMismatch', () => {
        const validityStateHandlerSpy = sinon.spy();
        const mockForm = {
            registerInput: validityStateHandlerSpy,
            unregisterInput: sandbox.mock().never(),
        };
        const error = {
            valid: false,
            patternMismatch: true,
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <TextInput label="label" name="input" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });
        expect(component.find('TextInput').first().instance().state.error.code).toEqual('patternMismatch');
    });

    test('should correctly validate tooLong', () => {
        const validityStateHandlerSpy = sinon.spy();
        const mockForm = {
            registerInput: validityStateHandlerSpy,
            unregisterInput: sandbox.mock().never(),
        };
        const error = {
            valid: false,
            tooLong: true,
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <TextInput label="label" maxLength={10} name="input" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });
        expect(component.find('TextInput').first().instance().state.error.code).toEqual('tooLong');
    });

    test('should correctly validate tooShort', () => {
        const validityStateHandlerSpy = sinon.spy();
        const mockForm = {
            registerInput: validityStateHandlerSpy,
            unregisterInput: sandbox.mock().never(),
        };

        const error = {
            valid: false,
            tooShort: true,
        };

        const component = mount(
            <FormContext.Provider value={{ form: mockForm }}>
                <TextInput label="label" minLength={1} name="input" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });
        expect(component.find('TextInput').first().instance().state.error.code).toEqual('tooShort');
    });
});
