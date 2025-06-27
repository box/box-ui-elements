import React, { act } from 'react';
import { mount } from 'enzyme';
import debounce from 'lodash/debounce';
// @ts-ignore flow import
import TextInput from '../../text-input';
import { TimeInputComponent as TimeInput, TimeInputProps } from '../TimeInput';
import { parseTimeFromString } from '../TimeInputUtils';

jest.mock('../TimeInputUtils');
jest.mock('lodash/debounce');

const VALID_INPUT = '3:00 am';
const INVALID_INPUT = '300000';
const FORMATTED_TIME_OBJECT = { hours: 3, minutes: 0, displayTime: '3:00 AM' };

describe('src/components/time-input/TimeInput', () => {
    const getWrapper = (props: TimeInputProps) => {
        return mount(<TimeInput {...props} />);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intlFake: any;

    beforeEach(() => {
        intlFake = {
            formatTime: jest.fn().mockReturnValue('3:00 AM'),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (debounce as jest.Mock<any>).mockImplementation(fn => fn);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parseTimeFromString as jest.Mock<any>).mockImplementation(() => ({
            hours: 3,
            minutes: 0,
        }));
    });

    test('should render TextInput', () => {
        const wrapper = getWrapper({ intl: intlFake });
        expect(wrapper.exists(TextInput)).toBe(true);
    });

    test.each([true, false])('should format input on blur when isRequired is %s', isRequired => {
        const onBlurSpy = jest.fn();
        const wrapper = getWrapper({ intl: intlFake, isRequired, onBlur: onBlurSpy });
        const inputField = wrapper.find('input');
        act(() => {
            inputField.simulate('change', {
                target: {
                    value: VALID_INPUT,
                },
            });
        });
        act(() => {
            inputField.simulate('blur');
        });
        expect(parseTimeFromString).toHaveBeenCalledWith(VALID_INPUT, isRequired);
        expect(intlFake.formatTime).toHaveBeenCalled();
        expect(onBlurSpy).toHaveBeenCalledWith(FORMATTED_TIME_OBJECT);
    });

    test.each([true, false])(
        'should not format input on blur when value has an invalid format and isRequired is %s',
        isRequired => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (parseTimeFromString as jest.Mock<any>).mockImplementation(() => {
                throw new SyntaxError();
            });
            const onBlurSpy = jest.fn();
            const onChangeSpy = jest.fn();
            const onErrorSpy = jest.fn();
            const wrapper = getWrapper({
                intl: intlFake,
                isRequired,
                onBlur: onBlurSpy,
                onChange: onChangeSpy,
                onError: onErrorSpy,
            });
            const inputField = wrapper.find('input');
            act(() => {
                inputField.simulate('change', {
                    target: {
                        value: INVALID_INPUT,
                    },
                });
            });
            act(() => {
                inputField.simulate('blur');
            });
            expect(parseTimeFromString).toHaveBeenCalledWith(INVALID_INPUT, isRequired);
            expect(intlFake.formatTime).not.toHaveBeenCalled();
            expect(onChangeSpy).not.toHaveBeenCalledWith(FORMATTED_TIME_OBJECT);
            expect(onBlurSpy).not.toHaveBeenCalled();
            expect(onErrorSpy).toHaveBeenCalled();
        },
    );

    test.each([true, false])('should format input on change when isRequired is %s', isRequired => {
        const onBlurSpy = jest.fn();
        const onChangeSpy = jest.fn();
        const wrapper = getWrapper({
            intl: intlFake,
            isRequired,
            onBlur: onBlurSpy,
            onChange: onChangeSpy,
        });
        const inputField = wrapper.find('input');
        act(() => {
            inputField.simulate('change', {
                target: {
                    value: VALID_INPUT,
                },
            });
        });
        expect(parseTimeFromString).toHaveBeenCalledWith(VALID_INPUT, isRequired);
        expect(intlFake.formatTime).toHaveBeenCalled();
        expect(onBlurSpy).toHaveBeenCalledWith(FORMATTED_TIME_OBJECT);
        expect(onChangeSpy).toHaveBeenCalledWith(FORMATTED_TIME_OBJECT);
    });
});
