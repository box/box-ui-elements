import React, { act } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import TextArea from '..';
import { FormContext } from '../../form/FormContext';

const sandbox = sinon.sandbox.create();

describe('components/form-elements/text-area/TextArea', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render default component', () => {
        const wrapper = shallow(<TextArea label="label" name="textarea" />);

        expect(wrapper.find('TextArea').length).toEqual(1);
    });

    test('should update state if value prop changes', () => {
        const wrapper = shallow(<TextArea label="label" name="textarea" value="test" />);

        wrapper.setProps({ value: 'new prop' });

        expect(wrapper.state('value')).toEqual('new prop');
    });

    test('should mark required fields invalid when empty', () => {
        const wrapper = mount(<TextArea className="coverage" isRequired label="label" name="input" />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');
        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeTruthy();
    });

    test('should mark required fields valid when not empty', () => {
        const wrapper = mount(<TextArea isRequired label="label" name="textarea" value="baba" />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');
        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeFalsy();
    });

    test('should correctly validate when change event is fired', () => {
        const wrapper = mount(<TextArea isRequired label="label" name="textarea" value="" />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeTruthy();

        wrapper.setProps({ value: 'a' });
        textarea.simulate('blur');
        textarea.simulate('change', {
            currentTarget: {
                value: 'a',
            },
        });

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeFalsy();
    });

    test('should set an textarea as valid when the validityFn returns an void', () => {
        function validityFn() {}

        const wrapper = mount(<TextArea label="label" name="textarea" type="custom" validation={validityFn} />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(textarea.instance().validity.valid).toBeTruthy();
    });

    test('should set an textarea as invalid when the validityFn returns an error string and input is not empty', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(
            <TextArea label="label" name="textarea" type="custom" validation={validityFn} value="yes" />,
        );
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(textarea.instance().validity.valid).toBeFalsy();
    });

    test('should set an textarea as valid when intially then fixed when using validityFn', () => {
        const stub = sinon.stub();

        stub.onCall(0).returns({
            code: 'errCode',
            message: 'errMessage',
        });

        stub.onCall(1).returns();

        const wrapper = mount(<TextArea label="label" name="textarea" type="custom" validation={stub} value="yes" />);
        let textarea = wrapper.find('textarea');

        textarea.simulate('blur');
        expect(textarea.instance().validity.valid).toBeFalsy();

        // Get the re-rendered textarea again
        textarea = wrapper.find('textarea');

        textarea.simulate('blur');
        expect(textarea.instance().validity.valid).toBeTruthy();
    });

    test('should not set textarea invalid when the validityFn returns an error string and textarea is empty and not required', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(<TextArea label="label" name="textarea" type="custom" validation={validityFn} />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(textarea.instance().validity.valid).toBeTruthy();
    });

    test('should set textarea invalid when the validityFn returns an error string, textarea is empty and is required', () => {
        function validityFn() {
            return {
                code: 'errCode',
                message: 'errMessage',
            };
        }

        const wrapper = mount(
            <TextArea isRequired label="label" name="textarea" type="custom" validation={validityFn} />,
        );
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(textarea.instance().validity.valid).toBeFalsy();
    });

    test('should re-validate when textarea is set via props programaticallly', () => {
        const wrapper = mount(<TextArea isRequired label="label" name="textarea" value="" />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeTruthy();

        wrapper.setProps({ value: 'abba' });

        textarea.simulate('blur');
        const textareaEl = textarea.getDOMNode();
        textareaEl.value = 'a';
        textarea.simulate('change', {
            currentTarget: textareaEl,
        });
        wrapper.update();

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeFalsy();
    });

    test('should validate onChange when textarea is already in error state', () => {
        const wrapper = mount(<TextArea isRequired label="label" name="textarea" value="" />);
        const textarea = wrapper.find('textarea');
        textarea.simulate('blur');

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeTruthy();

        const textareaEl = textarea.getDOMNode();
        textareaEl.value = 'a';
        textarea.simulate('change', {
            currentTarget: textareaEl,
        });
        wrapper.update();

        expect(wrapper.find('.text-area-container').hasClass('show-error')).toBeFalsy();
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
                <TextArea label="label" name="textarea" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });

        expect(component.find('TextArea').first().instance().state.error).toEqual(error);
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
                <TextArea label="label" name="textarea" value="" />
            </FormContext.Provider>,
        );

        act(() => {
            validityStateHandlerSpy.callArgWith(1, error);
        });
        expect(component.find('TextArea').first().instance().state.error.code).toEqual('badInput');
    });
});
