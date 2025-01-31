import React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import DateValue from '../DateValue';

describe('elements/common/date-value/DateValue', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            date: '2021-10-18T09:00:00-07:00',
        };
        render(<DateValue {...defaultProps} {...props} />);
    };

    test('renders component correctly', () => {
        renderComponent();

        expect(screen.getByText('Oct 18, 2021')).toBeInTheDocument();
    });

    test('renders component correctly with custom formatting', () => {
        const format = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };

        renderComponent({ format });

        expect(screen.getByText('10/18/2021')).toBeInTheDocument();
    });

    test('renders component correctly when the date is today and relative', () => {
        const date = new Date();

        renderComponent({ date: date.toISOString(), isRelative: true });

        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    test('renders component correctly when the date is yesterday and relative', () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);

        renderComponent({ date: date.toISOString(), isRelative: true });

        expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });
});
