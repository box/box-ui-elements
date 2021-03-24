import * as React from 'react';
import { act } from 'react-dom/test-utils';
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

    test('should format input on blur', () => {
        const onBlurSpy = jest.fn();
        const wrapper = getWrapper({ intl: intlFake, onBlur: onBlurSpy });
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
        expect(parseTimeFromString).toHaveBeenCalledWith(VALID_INPUT);
        expect(intlFake.formatTime).toHaveBeenCalled();
        expect(onBlurSpy).toHaveBeenCalledWith({ hours: 3, minutes: 0, displayTime: '3:00 AM' });
    });

    test('should not format input on blur when value has an invalid format', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parseTimeFromString as jest.Mock<any>).mockImplementation(() => {
            throw new SyntaxError();
        });
        const wrapper = getWrapper({ intl: intlFake });
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
        expect(parseTimeFromString).toHaveBeenCalledWith(INVALID_INPUT);
        expect(intlFake.formatTime).not.toHaveBeenCalled();
    });

    test('should format input on change', () => {
        const onBlurSpy = jest.fn();
        const onChangeSpy = jest.fn();
        const wrapper = getWrapper({
            intl: intlFake,
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
        expect(parseTimeFromString).toHaveBeenCalledWith(VALID_INPUT);
        expect(intlFake.formatTime).toHaveBeenCalled();
        expect(onChangeSpy).toHaveBeenCalledWith({ hours: 3, minutes: 0, displayTime: '3:00 AM' });
        expect(onBlurSpy).not.toHaveBeenCalled();
    });
});
