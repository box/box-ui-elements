import * as React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Form from '..';

const sandbox = sinon.sandbox.create();

describe('components/form-elements/form/Form', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render default component', () => {
        const wrapper = shallow(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <input type="text" />
            </Form>,
        );

        expect(wrapper.find('form').length).toEqual(1);
        expect(wrapper.find('form').prop('noValidate')).toBeTruthy();
    });

    test('should call onChange when onChange event is triggered on child input', () => {
        const onChangeSpy = sinon.spy();
        const onValidSubmitMock = sandbox.mock().never();
        const onInvalidSubmitMock = sandbox.mock().never();

        const wrapper = mount(
            <Form onChange={onChangeSpy} onInvalidSubmit={onInvalidSubmitMock} onValidSubmit={onValidSubmitMock}>
                <input id="input" type="text" />
            </Form>,
        );

        const input = wrapper.find('input');

        input.simulate('change', {
            target: {
                value: 'a',
            },
        });

        expect(onChangeSpy.calledOnce).toBeTruthy();
    });

    test('should call onValidSubmit when submit event is triggered and child inputs are valid', () => {
        const onValidSubmit = sinon.spy();
        const onInvalidSubmitMock = sandbox.mock().never();

        const wrapper = mount(
            <Form onInvalidSubmit={onInvalidSubmitMock} onValidSubmit={onValidSubmit}>
                <input id="input" type="text" />
            </Form>,
        );

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => true;

        form.simulate('submit', { target: formEl });

        expect(onValidSubmit.calledOnce).toBeTruthy();
    });

    test('should call onInvalidSubmit when submit event is triggered and any of the child inputs are not valid', () => {
        const onValidSubmitMock = sandbox.mock().never();
        const onInvalidSubmit = sinon.spy();

        const wrapper = mount(
            <Form onInvalidSubmit={onInvalidSubmit} onValidSubmit={onValidSubmitMock}>
                <input id="input" name="input1" required type="text" />
            </Form>,
        );

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => false;

        form.simulate('submit', { target: formEl });

        expect(onInvalidSubmit.calledOnce).toBeTruthy();
    });

    test('should correctly serialize a forms contents when valid', done => {
        const onInvalidSubmitMock = sandbox.mock().never();
        const onValidSubmit = formData => {
            expect(formData).toEqual({
                input1: 'boom',
            });
            done();
        };

        const wrapper = mount(
            <Form onInvalidSubmit={onInvalidSubmitMock} onValidSubmit={onValidSubmit}>
                <input defaultValue="boom" id="input" name="input1" type="text" />
                <input id="input" type="text" />
            </Form>,
        );

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => true;
        form.simulate('submit', { target: formEl });
    });

    test('should correctly serialize a forms validity state when invalid', done => {
        const onValidSubmitMock = sandbox.mock().never();
        const onInvalidSubmit = formValidityState => {
            expect(formValidityState.input1.validityState).toBeTruthy();
            done();
        };

        const wrapper = mount(
            <Form onInvalidSubmit={onInvalidSubmit} onValidSubmit={onValidSubmitMock}>
                <input id="input" name="input1" required type="text" />
                <input id="input" type="text" />
            </Form>,
        );

        const form = wrapper.find('form');
        const formEl = form.getDOMNode();
        formEl.checkValidity = () => false;
        form.simulate('submit', { target: formEl });
    });

    test('should expose form register/unregister function on the context', () => {
        const wrapper = mount(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <div />
            </Form>,
        );

        const instance = wrapper.find('Form').instance();

        expect(instance.registerInput).toBeTruthy();
        expect(instance.unregisterInput).toBeTruthy();
    });

    test('should register an input when registerInput is called', () => {
        const wrapper = mount(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <div />
            </Form>,
        );

        const inputHandlerSpy = sinon.spy();
        const instance = wrapper.find('Form').instance();
        instance.registerInput('testinput', inputHandlerSpy);
        expect(instance.state.registeredInputs.testinput).toBe(inputHandlerSpy);
    });

    test('should correctly register multiple inputs when registerInput is called', () => {
        const wrapper = mount(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <div />
            </Form>,
        );

        const inputHandlerSpy = sinon.spy();
        const instance = wrapper.find('Form').instance();
        instance.registerInput('testinput1', inputHandlerSpy);
        instance.registerInput('testinput2', inputHandlerSpy);
        expect(instance.state.registeredInputs.testinput1).toBe(inputHandlerSpy);
        expect(instance.state.registeredInputs.testinput2).toBe(inputHandlerSpy);
    });

    test('should throw an error if registerInput is called for already registered input', done => {
        const wrapper = mount(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <div />
            </Form>,
        );

        const instance = wrapper.find('Form').instance();
        instance.registerInput('testinput', () => {});

        try {
            instance.registerInput('testinput', () => {});
        } catch (e) {
            expect(e.message).toEqual("Input 'testinput' is already registered.");
            done();
        }
    });

    test('should unregister an input when unregisterInput is called', () => {
        const wrapper = mount(
            <Form onInvalidSubmit={() => {}} onValidSubmit={() => {}}>
                <div />
            </Form>,
        );

        const inputHandlerSpy = sinon.spy();
        const instance = wrapper.find('Form').instance();
        instance.registerInput('testinput', inputHandlerSpy);
        expect(instance.state.registeredInputs.testinput).toBe(inputHandlerSpy);
        instance.unregisterInput('testinput');
        expect(instance.state.registeredInputs.testinput).toBeFalsy();
    });
});
