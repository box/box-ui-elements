import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ContentAnswersOpenButton from '../ContentAnswersOpenButton';

import messages from '../messages';

describe('features/content-answers/ContentAnswersOpenButton', () => {
    const getWrapper = (props: {}) => render(<ContentAnswersOpenButton handleClick={jest.fn()} {...props} />);

    test('should call the onClick callback', () => {
        const handleClick = jest.fn();
        const wrapper = getWrapper({ handleClick });
        expect(handleClick).toBeCalledTimes(0);

        fireEvent.click(wrapper.getByTestId('content-answers-open-button'));
        expect(handleClick).toBeCalledTimes(1);
    });

    test('should display correct tooltip', () => {
        const wrapper = getWrapper({});
        fireEvent.mouseOver(wrapper.getByTestId('content-answers-open-button'));
        expect(wrapper.getByText(messages.defaultTooltip.defaultMessage)).toBeInTheDocument();
    });
});
