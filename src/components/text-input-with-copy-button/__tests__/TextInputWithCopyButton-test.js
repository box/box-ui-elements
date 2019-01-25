import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import TextInputWithCopyButton from '..';

const sandbox = sinon.sandbox.create();

document.execCommand = () => {};
document.queryCommandSupported = () => false;

describe('components/text-input-with-copy-button/TextInputWithCopyButton', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const buttonDefaultText = 'copy';
    const buttonSuccessText = 'copied';

    const renderComponent = props =>
        shallow(
            <TextInputWithCopyButton
                buttonDefaultText={buttonDefaultText}
                buttonSuccessText={buttonSuccessText}
                label="label"
                value={1}
                {...props}
            />,
        );

    describe('render()', () => {
        test('should correctly render default component when copy command is supported', () => {
            const wrapper = renderComponent({
                buttonProps: { 'data-resin-thing': 'copy' },
            });
            wrapper.instance().isCopyCommandSupported = true;
            wrapper.setState({
                copySuccess: true,
            });

            const button = wrapper.find('Button');
            expect(button.prop('data-resin-thing')).toEqual('copy');

            const textInputComponent = wrapper.find('TextInput');

            expect(wrapper.hasClass('text-input-with-copy-button-container')).toBe(true);
            expect(wrapper.hasClass('copy-success')).toBe(true);
            expect(textInputComponent.length).toBe(1);
            expect(textInputComponent.prop('readOnly')).toBe(true);
            expect(typeof textInputComponent.prop('inputRef')).toBe('function');
            expect(textInputComponent.prop('hideOptionalLabel')).toBe(true);
            expect(textInputComponent.prop('type')).toEqual('text');
            expect(textInputComponent.prop('value')).toEqual(1);
            expect(textInputComponent.prop('onFocus')).toEqual(wrapper.instance().handleFocus);
        });

        test('should correctly render default component when copy command is not supported', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();
            instance.isCopyCommandSupported = false;
            const textInputComponent = wrapper.find('TextInput');

            expect(wrapper.hasClass('text-input-with-copy-button-container')).toBe(false);
            expect(textInputComponent.length).toBe(1);
            expect(textInputComponent.prop('readOnly')).toBe(true);
            expect(textInputComponent.prop('inputRef')).not.toBeDefined();
        });

        test('should autofocus text if autofocus is true', () => {
            const selectMock = jest.fn();
            const wrapper = renderComponent({
                autofocus: true,
            });
            const instance = wrapper.instance();
            instance.copyInputRef = {
                select: selectMock,
            };

            instance.componentDidMount();

            expect(selectMock).toHaveBeenCalled();
        });

        test('should autofocus if the value updates from empty to something', () => {
            const selectMock = jest.fn();

            const wrapper = renderComponent({
                value: '',
                autofocus: true,
            });
            const instance = wrapper.instance();
            instance.copyInputRef = { select: selectMock };

            instance.componentDidMount();

            wrapper.setProps({
                value: 'http://example.com/',
            });

            expect(selectMock.mock.calls.length).toBe(1);
        });

        test('should not autofocus if autofocus is enabled, but there is no value', () => {
            const selectMock = jest.fn();

            const wrapper = renderComponent({
                autofocus: true,
                value: '',
            });

            const instance = wrapper.instance();
            instance.copyInputRef = {
                select: selectMock,
            };

            instance.componentDidMount();

            expect(selectMock).not.toHaveBeenCalled();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should call clearCopySuccessTimeout()', () => {
            const wrapper = mount(
                <TextInputWithCopyButton
                    buttonDefaultText={buttonDefaultText}
                    buttonSuccessText={buttonSuccessText}
                    label="label"
                    value={1}
                />,
            );
            const instance = wrapper.instance();
            instance.clearCopySuccessTimeout = sandbox.mock();

            wrapper.unmount();
        });
    });

    describe('clearCopySuccessTimeout()', () => {
        test('should clear the copySuccessTimeout and set it to null when copySuccessTimeout is set', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            const func = sandbox.mock().never();
            instance.copySuccessTimeout = setTimeout(func, 1000);

            instance.clearCopySuccessTimeout();
            expect(instance.copySuccessTimeout).toBeNull();
            clock.tick(1001);
        });
    });

    describe('renderCopyButton()', () => {
        test('should render a Button correctly when copy command is supported', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();
            instance.isCopyCommandSupported = true;

            const copyButton = wrapper.wrap(instance.renderCopyButton());
            const button = copyButton.find('Button');

            expect(button.length).toBe(1);
            expect(typeof button.prop('onClick')).toBe('function');
            expect(button.prop('type')).toEqual('button');
            expect(button.prop('children')).toEqual(buttonDefaultText);
        });

        test('should not render a copy button when copy command is not supported', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();
            instance.isCopyCommandSupported = false;

            expect(instance.renderCopyButton()).toBeNull();
        });

        test('should disable the copy button when props.disabled is true', () => {
            const wrapper = renderComponent({
                disabled: true,
            });
            const instance = wrapper.instance();
            instance.isCopyCommandSupported = true;

            const copyButton = wrapper.wrap(instance.renderCopyButton());
            const button = copyButton.find('Button');
            expect(button.prop('isDisabled')).toBe(true);
        });
    });

    describe('handleCopyButtonClick()', () => {
        test('should select input text and copy text when called', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            instance.copyInputRef = {
                select: sandbox.mock(),
            };
            instance.copySelectedText = sandbox.mock();
            wrapper.setProps({});

            instance.handleCopyButtonClick();
        });

        test('should call clearCopySuccessTimeout() when called', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            instance.copyInputRef = {
                select: sandbox.stub(),
            };
            instance.clearCopySuccessTimeout = sandbox.mock();

            instance.handleCopyButtonClick();
        });

        test('should set state correctly and provide correct callback', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = renderComponent();
            const instance = wrapper.instance();
            let callback;
            let data;
            instance.copyInputRef = {
                select: sandbox.stub(),
            };
            instance.setState = (obj, cb) => {
                data = obj;
                callback = cb;
            };
            wrapper.setProps({});

            instance.handleCopyButtonClick();
            instance.restoreCopyButton = sandbox.mock();
            expect(data).toEqual({
                copySuccess: true,
                buttonText: buttonSuccessText,
                hasFocused: true,
            });
            callback();
            clock.tick(4000);
        });
    });

    describe('handleCopyEvent()', () => {
        test('should animate copy button when called with cmd + c', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();

            sinon.mock(instance, 'animateCopyButton');

            instance.handleCopyEvent();
        });

        test('should call correct callback', () => {
            const wrapper = renderComponent({
                onCopySuccess: sandbox.mock(),
            });
            const instance = wrapper.instance();

            instance.handleCopyEvent();
        });
    });

    describe('restoreCopyButton()', () => {
        test('should set state correctly when called', () => {
            const wrapper = renderComponent();
            const instance = wrapper.instance();
            instance.setState = sandbox.mock().withArgs({
                copySuccess: false,
                buttonText: buttonDefaultText,
            });

            instance.restoreCopyButton();
        });
    });

    describe('handleFocus()', () => {
        test('should select the input and call onFocus when it exists', () => {
            const wrapper = renderComponent({
                onFocus: sandbox.mock(),
            });
            const instance = wrapper.instance();

            instance.copyInputRef = {
                select: sandbox.mock(),
            };

            instance.handleFocus({});
        });
    });
});
