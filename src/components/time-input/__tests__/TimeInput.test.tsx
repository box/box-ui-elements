import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
// @ts-ignore flow import
import TextInput from '../../text-input';
import { TimeInputComponent as TimeInput, TimeInputProps } from '../TimeInput';
import { parseTimeFromString } from '../TimeInputUtils';

jest.mock('../TimeInputUtils');

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
    });

    test('should render TextInput', () => {
        const wrapper = getWrapper({ intl: intlFake });
        expect(wrapper.exists(TextInput)).toBe(true);
    });

    test('should call intl.formatTime for a valid input', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parseTimeFromString as jest.Mock<any>).mockImplementation(() => ({
            hours: 3,
            minutes: 0,
        }));
        const VALID_INPUT = '3:00 am';
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

    test('should not call intl.formatTime for an invalid input', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parseTimeFromString as jest.Mock<any>).mockImplementation(() => {
            throw new SyntaxError();
        });
        const INVALID_INPUT = '300000';
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
});
