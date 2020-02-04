import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Pikaday, { setDate as mockSetDate } from 'pikaday';

import DatePicker, { DatePickerBase } from '../DatePicker';

const sandbox = sinon.sandbox.create();
let clock;

jest.mock('pikaday');

describe('components/date-picker/DatePicker', () => {
    const getWrapper = (props = {}) =>
        mount(<DatePicker name="dateinput" label="Date" placeholder="a date" {...props} />);

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
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
            <DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} dateFormat="utcTime" />,
        );

        expect(wrapper.find('.date-picker-unix-time-input').instance().value).toEqual(expectedOffset.toString());
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
                dateFormat="utcISOString"
            />,
        );

        expect(wrapper.find('.date-picker-unix-time-input').instance().value).toEqual(date.toISOString());
    });

    test('should hide optional label text when specified', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" hideOptionalLabel />);

        expect(wrapper.find('Label').prop('showOptionalText')).toBe(false);
    });

    test('should set value if one is defined', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} />);

        expect(wrapper.find('.date-picker-unix-time-input').instance().value).toEqual('0');
    });

    test('should set value in iso format when iso date format is specified', () => {
        const date = new Date(1461953802469);
        const wrapper = mount(
            <DatePicker name="dateinput" label="Date" placeholder="a date" value={date} dateFormat="isoString" />,
        );

        expect(wrapper.find('.date-picker-unix-time-input').instance().value).toEqual(date.toISOString());
    });

    test('should show clear button when formatted date exists', () => {
        const wrapper = mount(<DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} />);

        expect(wrapper.find('PlainButton.date-picker-clear-btn').length).toEqual(1);
        expect(wrapper.find('IconClear').length).toEqual(1);
    });

    test('should clear datepicker and call onChange() prop when clear button is clicked', () => {
        const onChangeSpy = sinon.spy();
        const wrapper = mount(
            <DatePicker name="dateinput" label="Date" placeholder="a date" value={new Date()} onChange={onChangeSpy} />,
        );

        wrapper.find('PlainButton.date-picker-clear-btn').simulate('click', { preventDefault: sandbox.mock() });

        expect(onChangeSpy.calledWith(null, '')).toBe(true);
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
                errorTooltipPosition="middle-right"
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

    describe('Stub Pikaday', () => {
        let intlFake;

        const renderDatepicker = (props = {}) =>
            mount(
                <DatePickerBase
                    intl={intlFake}
                    label="Date"
                    name="dateinput"
                    placeholder="a date"
                    onChange={() => {}}
                    value={new Date()}
                    {...props}
                />,
            );

        beforeEach(() => {
            Pikaday.mockClear();

            intlFake = {
                formatMessage: message => message.defaultMessage || message.message,
                formatDate: date => date,
                locale: 'en-US',
            };
        });

        describe('componentDidMount()', () => {
            test('should set first day of week to Monday if locale is not US, CA, or JP', () => {
                renderDatepicker();
                expect(Pikaday).toBeCalledWith(
                    expect.objectContaining({
                        firstDay: 0,
                    }),
                );

                intlFake.locale = 'en-UK';
                renderDatepicker();
                expect(Pikaday).toBeCalledWith(
                    expect.objectContaining({
                        firstDay: 1,
                    }),
                );
            });
        });

        describe('onSelectHandler()', () => {
            test('should call onChange prop with formatted date param', () => {
                const onChangeStub = sandbox.stub();
                const formattedDate = 1234567;
                const testDate = new Date();
                const wrapper = renderDatepicker({
                    onChange: onChangeStub,
                    value: testDate,
                });
                const instance = wrapper.instance();
                sandbox
                    .stub(instance, 'formatValue')
                    .withArgs(testDate)
                    .returns(formattedDate);

                instance.onSelectHandler(testDate);

                expect(onChangeStub.calledWith(testDate, formattedDate)).toBe(true);
            });
        });

        describe('focusDatePicker()', () => {
            test('should call focus on date picker input when called', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                const inputEl = wrapper
                    .find('input')
                    .at(0)
                    .getDOMNode();
                sandbox.mock(inputEl).expects('focus');

                instance.focusDatePicker();
            });
        });

        describe('handleInputKeyDown()', () => {
            test('should stop propagation when datepicker is visible', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'isVisible').returns(true);

                instance.handleInputKeyDown({
                    preventDefault: sandbox.stub(),
                    stopPropagation: sandbox.mock(),
                    key: 'anything',
                });
            });

            test('should not stop propagation when datepicker is not visible', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'isVisible').returns(false);

                instance.handleInputKeyDown({
                    preventDefault: sandbox.stub(),
                    stopPropagation: sandbox.mock().never(),
                    key: 'anything',
                });
            });

            test('should prevent default on input when key pressed was not a Tab', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.handleInputKeyDown({
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.stub(),
                    key: 'ArrowDown',
                });
            });

            test('should not prevent default on input when key pressed was a Tab', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.handleInputKeyDown({
                    preventDefault: sandbox.mock().never(),
                    stopPropagation: sandbox.stub(),
                    key: 'Tab',
                });
            });

            test('should not prevent default on input when key pressed was a Tab', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.handleInputKeyDown({
                    preventDefault: sandbox.mock().never(),
                    stopPropagation: sandbox.stub(),
                    key: 'Tab',
                });
            });

            [
                {
                    key: 'Enter',
                },
                {
                    key: 'Escape',
                },
                {
                    key: ' ',
                },
            ].forEach(({ key }) => {
                test('should hide date picker if when Enter, Escape, or Spacebar is pressed in datepicker input when date picker is visible', () => {
                    const wrapper = renderDatepicker();
                    const instance = wrapper.instance();

                    sandbox.stub(instance.datePicker, 'isVisible').returns(true);
                    sandbox.mock(instance.datePicker).expects('hide');

                    instance.handleInputKeyDown({
                        preventDefault: () => {},
                        stopPropagation: () => {},
                        key,
                    });
                });

                test('should not hide date picker if when Enter, Escape, or Spacebar is pressed in datepicker input when date picker is not visible', () => {
                    const wrapper = renderDatepicker();
                    const instance = wrapper.instance();

                    sandbox.stub(instance.datePicker, 'isVisible').returns(false);
                    sandbox
                        .mock(instance.datePicker)
                        .expects('hide')
                        .never();

                    instance.handleInputKeyDown({
                        preventDefault: () => {},
                        stopPropagation: () => {},
                        key,
                    });
                });
            });
        });

        describe('handleInputBlur()', () => {
            test('should call onBlur prop when called', () => {
                const event = {};
                const wrapper = renderDatepicker({
                    onBlur: sandbox.mock().withArgs(event),
                });
                const instance = wrapper.instance();

                instance.handleInputBlur(event);
            });

            [
                {
                    isVisible: true,
                },
                {
                    isVisible: false,
                },
            ].forEach(({ isVisible }) => {
                test('should set shouldStayClosed when related/active target is the date picker button and visibility of date picker', () => {
                    const wrapper = renderDatepicker();
                    const instance = wrapper.instance();
                    const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn').getDOMNode();

                    sandbox.stub(instance.datePicker, 'isVisible').returns(isVisible);
                    const event = {
                        relatedTarget: datePickerButtonEl,
                    };
                    instance.handleInputBlur(event);

                    expect(instance.shouldStayClosed).toEqual(isVisible);
                });

                test('should not set shouldStayClosed when related/active target is not the date picker button', () => {
                    const wrapper = renderDatepicker();
                    const instance = wrapper.instance();

                    sandbox.stub(instance.datePicker, 'isVisible').returns(isVisible);
                    const event = {
                        relatedTarget: null,
                    };
                    instance.handleInputBlur(event);

                    expect(instance.shouldStayClosed).toBe(false);
                });
            });

            test('should reset shouldStayClosed after a brief delay', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();
                const datePickerButtonEl = wrapper.find('PlainButton.date-picker-open-btn').getDOMNode();

                sandbox.stub(instance.datePicker, 'isVisible').returns(true);
                const event = {
                    relatedTarget: datePickerButtonEl,
                };
                instance.handleInputBlur(event);

                expect(instance.shouldStayClosed).toBe(true);

                clock.tick(400);

                expect(instance.shouldStayClosed).toBe(false);
            });
        });

        describe('handleButtonClick()', () => {
            test('should call event.preventDefault when called', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.handleButtonClick({
                    preventDefault: sandbox.mock(),
                });
            });

            test('should not focus input when shouldStayClosed is true', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.shouldStayClosed = true;

                sandbox
                    .mock(instance)
                    .expects('focusDatePicker')
                    .never();

                instance.handleButtonClick({
                    preventDefault: () => {},
                });
            });

            test('should focus input when shouldStayClosed is false', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                instance.shouldStayClosed = false;

                sandbox.mock(instance).expects('focusDatePicker');

                instance.handleButtonClick({
                    preventDefault: () => {},
                });
            });
        });

        describe('render()', () => {
            test('should render the date-picker-open btn', () => {
                const wrapper = renderDatepicker();

                const buttonEl = wrapper.find('PlainButton.date-picker-open-btn');

                expect(buttonEl.length).toBe(1);
            });

            test('should render a disabled date-picker-open btn when date picker is disabled', () => {
                const wrapper = renderDatepicker({
                    isDisabled: true,
                });

                const buttonEl = wrapper.find('PlainButton.date-picker-open-btn');

                expect(buttonEl.prop('disabled')).toBe(true);
            });
        });

        describe('componentWillUnmount()', () => {
            test('should destroy the date picker widget', () => {
                const wrapper = renderDatepicker();
                const instance = wrapper.instance();

                sandbox.mock(instance.datePicker).expects('destroy');

                wrapper.unmount();
            });
        });

        describe('UNSAFE_componentWillReceiveProps()', () => {
            test('should call setDate() when value changes', () => {
                const wrapper = renderDatepicker();
                const nextValue = new Date(123);

                wrapper.setProps({
                    value: nextValue,
                });

                expect(mockSetDate).toBeCalledWith(nextValue);
            });

            test('should call setMinDate() when minDate prop is set after being null', () => {
                const currentDate = new Date(500);
                const wrapper = renderDatepicker({
                    value: currentDate,
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const minDate = new Date(100);

                sandbox
                    .mock(instance.datePicker)
                    .expects('setMinDate')
                    .withArgs(minDate);
                sandbox
                    .mock(instance.datePicker)
                    .expects('gotoDate')
                    .never(); // Current date is way ahead of timestamp 100

                wrapper.setProps({
                    minDate,
                });
            });

            test('should call setMinDate() when minDate prop changes value', () => {
                const currentDate = new Date(500);
                const wrapper = renderDatepicker({
                    value: currentDate,
                    minDate: new Date(200),
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const minDate = new Date(100);

                sandbox
                    .mock(instance.datePicker)
                    .expects('setMinDate')
                    .withArgs(minDate);

                wrapper.setProps({
                    minDate,
                });
            });

            test('should call gotoDate() when minDate prop passed is further in the future than current date', () => {
                const currentDate = new Date(100);
                const wrapper = renderDatepicker({
                    value: currentDate,
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const minDate = new Date(500);

                sandbox
                    .mock(instance.datePicker)
                    .expects('gotoDate')
                    .withArgs(minDate);

                wrapper.setProps({
                    minDate,
                });
            });

            test('should call setMaxDate() when maxDate prop after being null', () => {
                const currentDate = new Date(500);
                const wrapper = renderDatepicker({
                    value: currentDate,
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const maxDate = new Date(1000000);

                sandbox
                    .mock(instance.datePicker)
                    .expects('setMaxDate')
                    .withArgs(maxDate);
                sandbox
                    .mock(instance.datePicker)
                    .expects('gotoDate')
                    .never(); // Current date is way behind of timestamp 1000000

                wrapper.setProps({
                    maxDate,
                });
            });

            test('should call setMaxDate() when maxDate prop changes value', () => {
                const currentDate = new Date(500);
                const wrapper = renderDatepicker({
                    value: currentDate,
                    maxDate: new Date(200000),
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const maxDate = new Date(1000000);

                sandbox
                    .mock(instance.datePicker)
                    .expects('setMaxDate')
                    .withArgs(maxDate);

                wrapper.setProps({
                    maxDate,
                });
            });

            test('should call gotoDate() when maxDate prop passed is behind the current date', () => {
                const currentDate = new Date(1000000);
                const wrapper = renderDatepicker({
                    value: currentDate,
                });
                const instance = wrapper.instance();

                sandbox.stub(instance.datePicker, 'getDate').returns(currentDate);

                const maxDate = new Date(500);

                sandbox
                    .mock(instance.datePicker)
                    .expects('gotoDate')
                    .withArgs(maxDate);

                wrapper.setProps({
                    maxDate,
                });
            });
        });
    });
});
