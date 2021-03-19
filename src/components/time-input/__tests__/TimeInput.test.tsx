import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
// @ts-ignore flow import
import TextInput from '../../TextInput';
import { TimeInputComponent as TimeInput, TimeInputProps } from '../TimeInput';
import { parseTimeFromString } from '../TimeInputUtils';

const VALID_TIME_INPUTS = [
    '3:00 PM',
    '3:00 P M',
    '3:00PM',
    '3:00P M',
    '300 PM',
    '300 P M',
    '300PM',
    '300P M',
    '3 PM',
    '3 P M',
    '3PM',
    '3P M',
    '3:00 P.M.',
    '3:00 P. M.',
    '3:00P.M.',
    '3:00P. M.',
    '300 P.M.',
    '300 P. M.',
    '300P.M.',
    '300P. M.',
    '3 P.M.',
    '3 P. M.',
    '3P.M.',
    '3P. M.',
    '3:00 p.m.',
    '3:00 p. m.',
    '3:00p.m.',
    '3:00p. m.',
    '300 p.m.',
    '300 p. m.',
    '300p.m.',
    '300p. m.',
    '3 p.m.',
    '3 p. m.',
    '3p.m.',
    '3p. m.',
    '3:00 pm',
    '3:00 p m',
    '3:00pm',
    '3:00p m',
    '300 pm',
    '300 p m',
    '300pm',
    '300p m',
    '3 pm',
    '3 p m',
    '3pm',
    '3p m',
    '3.00',
    '3h00',
    '3 h 00',
    '15:00',
    '1500',
    '15.00',
    '15h00',
    '15 h 00',
    '12:00',
    '3',
    '3am',
    '3pm',
    '11',
    '11am',
    '01',
    '01am',
    '11pm',
    '01pm',
    '3:00',
    '3:00am',
    '3:00pm',
    '11:00pm',
    '12am',
];

const INVALID_TIME_INPUTS = ['abcde', '154309', '4449292 p.m.'];

jest.mock('../TimeInputUtils', () => ({
    parseInputTimeFromString: jest.fn().mockReturnValue({
        hours: 3,
        minutes: 0,
    }),
}));

describe('src/components/time-input/TimeInput', () => {
    const getWrapper = (props: TimeInputProps) => {
        return mount(<TimeInput {...props} />);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intlFake: any;

    beforeEach(() => {
        intlFake = {
            formatTime: jest.fn(),
        };
    });

    test('should render TextInput', () => {
        const wrapper = getWrapper({ intl: intlFake });
        expect(wrapper.exists(TextInput)).toBe(true);
    });

    test.each(VALID_TIME_INPUTS)('should call intl.formatTime for valid input %s', input => {
        const wrapper = getWrapper({ intl: intlFake });
        const inputField = wrapper.find('input');
        act(() => {
            inputField.simulate('change', {
                target: {
                    value: input,
                },
            });
        });
        expect(parseTimeFromString).toHaveBeenCalled();
        expect(intlFake.formatTime).toHaveBeenCalled();
    });

    test.each(INVALID_TIME_INPUTS)('should not call intl.formatTime for invalid input %s', input => {
        (parseTimeFromString as jest.Mock<any>).mockImplementation(() => {
            throw new SyntaxError();
        });
        const wrapper = getWrapper({ intl: intlFake });
        const inputField = wrapper.find('input');
        act(() => {
            inputField.simulate('change', {
                target: {
                    value: input,
                },
            });
        });
        expect(parseTimeFromString).toHaveBeenCalled();
        expect(intlFake.formatTime).not.toHaveBeenCalled();
    });

    test.each`
        tooltipShown | inputClasses       | description
        ${false}     | ${'bdl-TextInput'}
    `;
});
