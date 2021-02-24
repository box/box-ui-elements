import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import sinon, { SinonFakeTimers } from 'sinon';
import Pikaday from 'pikaday';
import { MessageDescriptor } from 'react-intl';
import noop from 'lodash/noop';

import { TooltipPosition } from '../../tooltip';
import DatePicker, { DateFormat, DatePickerBase } from '../DatePicker';

let clock: SinonFakeTimers;

jest.mock('pikaday');

describe('components/date-picker/DatePicker', () => {
    const getWrapper = (props = {}) =>
        mount(<DatePicker name="dateinput" label="Date" placeholder="a date" {...props} />);

    const getInputField = (wrapper: ReactWrapper) =>
        wrapper
            .find('.date-picker-unix-time-input')
            .at(0)
            .getDOMNode() as HTMLInputElement;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        clock.restore();
    });

    test('should pass hideLabel to Label', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" hideLabel placeholder="a date" />);

        expect(wrapper.find('Label').prop('hideLabel')).toBe(true);
    });

    test('should add resin target to datepicker input when specified', () => {
        const resinTarget = 'target';
        const wrapper = mount(
            <DatePicker name="dateinput" label="Date" placeholder="a date" resinTarget={resinTarget} />,
        );

        expect(wrapper.find('.date-picker-input').prop('data-resin-target')).toEqual(resinTarget);
    });

    test('should pass inputProps to datepicker input when provided', () => {
        const wrapper = mount(
            <DatePicker name="dateinput" label="Date" placeholder="a date" inputProps={{ 'data-prop': 'hello' }} />,
        );

        expect(wrapper.find('.date-picker-input').prop('data-prop')).toEqual('hello');
    });

    test('should set hidden input to readOnly', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" />);

        expect(wrapper.find('.date-picker-unix-time-input').prop('readOnly')).toBe(true);
    });

    test('should set value in UTC time when UTC date format is specified', () => {
        const expectedOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
        const wrapper = mount(
            <DatePicker
                name="dateinput"
                label="Date"
                placeholder="a date"
                value={new Date()}
                dateFormat={DateFormat.UTC_TIME_DATE_FORMAT}
            />,
        );

        expect(getInputField(wrapper).value).toEqual(expectedOffset.toString());
    });

    test('should set value in utc iso format when utc iso date format is specified', () => {
        // utc time if clock is 0
        const expectedOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;

        const date = new Date(expectedOffset);
        const wrapper = mount(
            <DatePicker
                name="dateinput"
                label="Date"
                placeholder="a date"
                value={new Date(0)}
                dateFormat={DateFormat.UTC_ISO_STRING_DATE_FORMAT}
            />,
        );

        expect(getInputField(wrapper).value).toEqual(date.toISOString());
    });

    test('should hide optional label text when specified', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" hideOptionalLabel />);

        expect(wrapper.find('Label').prop('showOptionalText')).toBe(false);
    });

    test('should set value if one is defined', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} />);

        expect(getInputField(wrapper).value).toEqual('0');
    });

    test('should set value in iso format when iso date format is specified', () => {
        const date = new Date(1461953802469);
        const wrapper = mount(
            <DatePicker
                name="dateinput"
                label="Date"
                placeholder="a date"
                value={date}
                dateFormat={DateFormat.ISO_STRING_DATE_FORMAT}
            />,
        );

        expect(getInputField(wrapper).value).toEqual(date.toISOString());
    });

    test('should show clear button when formatted date exists', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} />);

        expect(wrapper.find('PlainButton.date-picker-clear-btn').length).toEqual(1);
        expect(wrapper.find('IconClear').length).toEqual(1);
    });

    test('should clear datepicker and call onChange() prop when clear button is clicked', () => {
        const onChangeSpy = jest.fn();
        const wrapper = mount(
            <DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} onChange={onChangeSpy} />,
        );

        wrapper.find('PlainButton.date-picker-clear-btn').simulate('click', { preventDefault: noop });

        expect(onChangeSpy).toHaveBeenCalledWith(null, '');
    });

    test('should hide clear button when disabled is passed in', () => {
        const wrapper = mount(
            <DatePicker isDisabled label="Date" name="dateinput" placeholder="a date" value={new Date()} />,
        );

        expect(wrapper.find('.date-picker-clear-btn').length).toEqual(0);
    });

    test('should not have clear button when isClearable prop is false', () => {
        const wrapper = mount(
            <DatePicker name="dateinput" isClearable={false} label="Date" placeholder="a date" value={new Date()} />,
        );

        expect(wrapper.find('IconClear').length).toEqual(0);
    });

    test('should show tooltip when error exists', () => {
        const wrapper = mount(
            <DatePicker
                error="error!"
                errorTooltipPosition={TooltipPosition.MIDDLE_RIGHT}
                label="Date"
                name="dateinput"
                placeholder="a date"
            />,
        );

        const tooltip = wrapper.find('Tooltip');
        expect(tooltip.prop('text')).toEqual('error!');
        expect(tooltip.prop('position')).toEqual('middle-right');
        expect(tooltip.prop('isShown')).toBe(true);
        expect(tooltip.prop('className')).toEqual('date-picker-error-tooltip');
    });

    test('should fire the onChange prop on blur if isTextInputAllowed is true', () => {
        const mockOnChangeHandler = jest.fn();
        const wrapper = getWrapper({
            isTextInputAllowed: true,
            onChange: mockOnChangeHandler,
            value: new Date(),
        });

        wrapper.find('.date-picker-input').simulate('blur');

        expect(mockOnChangeHandler).toHaveBeenCalled();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intlFake: any;

    const renderDatePicker = (props = {}) =>
        mount<DatePickerBase>(
            <DatePickerBase
                intl={intlFake}
                label="Date"
                name="dateinput"
                placeholder="a date"
                onChange={noop}
                value={new Date()}
                {...props}
            />,
        );

    beforeEach(() => {
        intlFake = {
            formatMessage: (message: MessageDescriptor) => message.defaultMessage,
            formatDate: (date: string | number | Date | undefined) => (date ? date.toString() : ''),
            locale: 'en-US',
        };
    });

    describe('componentDidMount()', () => {
        test('should set first day of week to Monday if locale is not US, CA, or JP', () => {
            renderDatePicker();
            expect(Pikaday).toBeCalledWith(
                expect.objectContaining({
                    firstDay: 0,
                }),
            );

            intlFake.locale = 'en-UK';
            renderDatePicker();
            expect(Pikaday).toBeCalledWith(
                expect.objectContaining({
                    firstDay: 1,
                }),
            );
        });
    });

    describe('onSelectHandler()', () => {
        test('should call onChange prop with formatted date param', () => {
            const formattedDate = 1234567;
            const onChangeStub = jest.fn();
            const testDate = new Date();
            const wrapper = renderDatePicker({
                onChange: onChangeStub,
                value: testDate,
            });
            const instance = wrapper.instance();
            instance.formatValue = jest.fn().mockReturnValueOnce(formattedDate);
            instance.onSelectHandler(testDate);
            expect(onChangeStub).toHaveBeenCalledWith(testDate, formattedDate);
        });
    });

    describe('focusDatePicker()', () => {
        test('should call focus on DatePicker input when called', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            const inputEl: HTMLInputElement = wrapper
                .find('input')
                .at(0)
                .getDOMNode();
            inputEl.focus = jest.fn();
            instance.focusDatePicker();
            expect(inputEl.focus).toHaveBeenCalled();
        });
    });

    describe('handleInputKeyDown()', () => {
        test('should stop propagation when datepicker is visible', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            const inputEl = wrapper.find('input').at(0);
            const stopPropagationSpy = jest.fn();
            if (instance.datePicker) {
                instance.datePicker.isVisible = jest.fn().mockReturnValue(true);
            }
            inputEl.simulate('keyDown', {
                preventDefault: noop,
                stopPropagation: stopPropagationSpy,
                key: 'anything',
            });
            expect(stopPropagationSpy).toHaveBeenCalled();
        });

        test('should not stop propagation when datepicker is not visible', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            const inputEl = wrapper.find('input').at(0);
            const stopPropagationSpy = jest.fn();
            if (instance.datePicker) {
                instance.datePicker.isVisible = jest.fn().mockReturnValue(false);
            }
            inputEl.simulate('keyDown', {
                preventDefault: noop,
                stopPropagation: stopPropagationSpy,
                key: 'anything',
            });
            expect(stopPropagationSpy).not.toHaveBeenCalled();
        });

        test('should prevent default on input when key pressed was not a Tab', () => {
            const wrapper = renderDatePicker();
            const inputEl = wrapper.find('input').at(0);
            const preventDefaultSpy = jest.fn();
            inputEl.simulate('keyDown', {
                preventDefault: preventDefaultSpy,
                stopPropagation: noop,
                key: 'ArrowDown',
            });
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        test('should not prevent default on input when key pressed was a Tab', () => {
            const wrapper = renderDatePicker();
            const inputEl = wrapper.find('input').at(0);
            const preventDefaultSpy = jest.fn();
            inputEl.simulate('keyDown', {
                preventDefault: preventDefaultSpy,
                stopPropagation: noop,
                key: 'Tab',
            });
            expect(preventDefaultSpy).not.toHaveBeenCalled();
        });

        test.each`
            key         | keyName
            ${'Enter'}  | ${'enter key'}
            ${'Escape'} | ${'escape key'}
            ${' '}      | ${'spacebar'}
        `(
            'should hide DatePicker when $keyName is pressed in the input field and the DatePicker is visible',
            ({ key }) => {
                const wrapper = renderDatePicker();
                const instance = wrapper.instance();
                const inputEl = wrapper.find('input').at(0);
                if (instance.datePicker) {
                    instance.datePicker.isVisible = jest.fn().mockReturnValue(true);
                    instance.datePicker.hide = jest.fn();
                }

                inputEl.simulate('keyDown', {
                    preventDefault: noop,
                    stopPropagation: noop,
                    key,
                });

                expect(instance.datePicker && instance.datePicker.hide).toHaveBeenCalled();
            },
        );

        test.each`
            key         | keyName
            ${'Enter'}  | ${'enter key'}
            ${'Escape'} | ${'escape key'}
            ${' '}      | ${'spacebar'}
        `(
            'should not hide DatePicker when %s is pressed in the input field and the DatePicker is not visible',
            ({ key }) => {
                const wrapper = renderDatePicker();
                const instance = wrapper.instance();
                const inputEl = wrapper.find('input').at(0);
                if (instance.datePicker) {
                    instance.datePicker.isVisible = jest.fn().mockReturnValue(false);
                    instance.datePicker.hide = jest.fn();
                }

                inputEl.simulate('keyDown', {
                    preventDefault: noop,
                    stopPropagation: noop,
                    key,
                });

                expect(instance.datePicker && instance.datePicker.hide).not.toHaveBeenCalled();
            },
        );
    });

    describe('handleInputBlur()', () => {
        test('should call onBlur prop when called', () => {
            const onBlurSpy = jest.fn();
            const wrapper = renderDatePicker({ onBlur: onBlurSpy });
            const instance = wrapper.instance();
            const inputEl = wrapper.find('input').at(0);
            if (instance.datePicker) {
                instance.datePicker.isVisible = jest.fn().mockReturnValue(false);
            }
            inputEl.simulate('blur');
            expect(onBlurSpy).toHaveBeenCalled();
        });

        test.each`
            isVisible | target                     | shouldStayClosed | visibility
            ${true}   | ${'the DatePicker button'} | ${true}          | ${'visible'}
            ${false}  | ${'the DatePicker button'} | ${false}         | ${'not visible'}
            ${true}   | ${null}                    | ${false}         | ${'visible'}
            ${false}  | ${null}                    | ${false}         | ${'not visible'}
        `(
            'should set shouldStayClosed when related/active target is $target and DatePicker is $visibility',
            ({ isVisible, target, shouldStayClosed }) => {
                const wrapper = renderDatePicker();
                const instance = wrapper.instance();
                const inputEl = wrapper.find('input').at(0);
                const targetEl = target ? wrapper.find('PlainButton.date-picker-open-btn').getDOMNode() : null;
                if (instance.datePicker) {
                    instance.datePicker.isVisible = jest.fn().mockReturnValue(isVisible);
                }
                inputEl.simulate('blur', {
                    relatedTarget: targetEl,
                });

                expect(instance.shouldStayClosed).toEqual(shouldStayClosed);
            },
        );
    });

    test('should reset shouldStayClosed after a brief delay', () => {
        const wrapper = renderDatePicker();
        const instance = wrapper.instance();
        const inputEl = wrapper.find('input').at(0);
        const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn').getDOMNode();
        if (instance.datePicker) {
            instance.datePicker.isVisible = jest.fn().mockReturnValue(true);
        }
        inputEl.simulate('blur', {
            relatedTarget: datePickerButtonEl,
        });

        expect(instance.shouldStayClosed).toBe(true);
        clock.tick(400);

        expect(instance.shouldStayClosed).toBe(false);
    });

    describe('handleButtonClick()', () => {
        test('should call event.preventDefault when called', () => {
            const preventDefaultSpy = jest.fn();
            const wrapper = renderDatePicker();
            const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn');
            datePickerButtonEl.simulate('click', {
                preventDefault: preventDefaultSpy,
            });
        });

        test('should not focus input when shouldStayClosed is true', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn');
            instance.shouldStayClosed = true;
            instance.focusDatePicker = jest.fn();
            datePickerButtonEl.simulate('click', {
                preventDefault: noop,
            });
            expect(instance.focusDatePicker).not.toHaveBeenCalled();
        });

        test('should focus input when shouldStayClosed is false', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn');
            instance.shouldStayClosed = false;
            instance.focusDatePicker = jest.fn();
            datePickerButtonEl.simulate('click', {
                preventDefault: noop,
            });
            expect(instance.focusDatePicker).toHaveBeenCalled();
        });
    });

    describe('render()', () => {
        test('should render the date-picker-open btn', () => {
            const wrapper = renderDatePicker();
            const buttonEl = wrapper.find('PlainButton.date-picker-open-btn');
            expect(buttonEl.exists()).toBe(true);
        });

        test('should render a disabled date-picker-open btn when DatePicker is disabled', () => {
            const wrapper = renderDatePicker({
                isDisabled: true,
            });
            const buttonEl = wrapper.find('PlainButton.date-picker-open-btn');
            expect(buttonEl.prop('isDisabled')).toBe(true);
        });
    });

    describe('componentWillUnmount()', () => {
        test('should destroy the DatePicker widget', () => {
            const wrapper = renderDatePicker();
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.destroy = jest.fn();
            }
            wrapper.unmount();
            expect(instance.datePicker && instance.datePicker.destroy).toHaveBeenCalled();
        });
    });

    describe('UNSAFE_componentWillReceiveProps()', () => {
        test('should call setDate() when value changes', () => {
            const wrapper = renderDatePicker();
            const nextValue = new Date(123);
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.setDate = jest.fn();
            }
            wrapper.setProps({
                value: nextValue,
            });
            expect(instance.datePicker && instance.datePicker.setDate).toHaveBeenCalledWith(nextValue);
        });

        test('should call setMinDate() when minDate prop is set after being null', () => {
            const currentDate = new Date(500);
            const wrapper = renderDatePicker({
                value: currentDate,
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.getDate = jest.fn().mockReturnValue(currentDate);
                instance.datePicker.gotoDate = jest.fn();
                instance.datePicker.setMinDate = jest.fn();
            }
            const minDate = new Date(100);
            wrapper.setProps({
                minDate,
            });
            expect(instance.datePicker && instance.datePicker.setMinDate).toHaveBeenCalledWith(minDate);
            expect(instance.datePicker && instance.datePicker.gotoDate).not.toHaveBeenCalled(); // Current date is way ahead of timestamp 100
        });

        test('should call setMinDate() when minDate prop changes value', () => {
            const currentDate = new Date(500);
            const wrapper = renderDatePicker({
                value: currentDate,
                minDate: new Date(200),
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.setMinDate = jest.fn();
            }
            const minDate = new Date(100);
            wrapper.setProps({
                minDate,
            });
            expect(instance.datePicker && instance.datePicker.setMinDate).toHaveBeenCalledWith(minDate);
        });

        test('should call gotoDate() when minDate prop passed is further in the future than current date', () => {
            const currentDate = new Date(100);
            const wrapper = renderDatePicker({
                value: currentDate,
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.getDate = jest.fn().mockReturnValue(currentDate);
                instance.datePicker.gotoDate = jest.fn();
            }
            const minDate = new Date(500);
            wrapper.setProps({
                minDate,
            });
            expect(instance.datePicker && instance.datePicker.gotoDate).toHaveBeenCalledWith(minDate);
        });

        test('should call setMaxDate() when maxDate prop after being null', () => {
            const currentDate = new Date(500);
            const wrapper = renderDatePicker({
                value: currentDate,
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.getDate = jest.fn().mockReturnValue(currentDate);
                instance.datePicker.gotoDate = jest.fn();
                instance.datePicker.setMaxDate = jest.fn();
            }
            const maxDate = new Date(1000000);
            wrapper.setProps({
                maxDate,
            });
            expect(instance.datePicker && instance.datePicker.setMaxDate).toHaveBeenCalledWith(maxDate);
            expect(instance.datePicker && instance.datePicker.gotoDate).not.toHaveBeenCalled(); // Current date is way behind of timestamp 1000000
        });

        test('should call setMaxDate() when maxDate prop changes value', () => {
            const currentDate = new Date(500);
            const wrapper = renderDatePicker({
                value: currentDate,
                maxDate: new Date(200000),
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.getDate = jest.fn().mockReturnValue(currentDate);
                instance.datePicker.setMaxDate = jest.fn();
            }
            const maxDate = new Date(1000000);
            wrapper.setProps({
                maxDate,
            });
            expect(instance.datePicker && instance.datePicker.setMaxDate).toHaveBeenCalledWith(maxDate);
        });

        test('should call gotoDate() when maxDate prop passed is behind the current date', () => {
            const currentDate = new Date(1000000);
            const wrapper = renderDatePicker({
                value: currentDate,
            });
            const instance = wrapper.instance();
            if (instance.datePicker) {
                instance.datePicker.getDate = jest.fn().mockReturnValue(currentDate);
                instance.datePicker.gotoDate = jest.fn();
            }
            const maxDate = new Date(500);
            wrapper.setProps({
                maxDate,
            });
            expect(instance.datePicker && instance.datePicker.gotoDate).toHaveBeenCalledWith(maxDate);
        });
    });
});
