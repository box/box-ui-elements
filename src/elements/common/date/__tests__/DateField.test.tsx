import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../../test-utils/intl-test-utils';
import DateField from '../DateField';

describe('components/DateField', () => {
    const renderComponent = props => renderWithIntl(<DateField {...props} />);

    test('should render a date', () => {
        renderComponent({ date: '2019-04-16T20:00:00.000Z' });
        expect(screen.getByText('Apr 16, 2019')).toBeInTheDocument();
    });

    test('should render a date with time', () => {
        renderComponent({ date: '2019-04-16T20:00:00.000Z', showTime: true });
        expect(screen.getByText('Apr 16, 2019, 8:00 PM')).toBeInTheDocument();
    });

    test('should render a date with custom format', () => {
        renderComponent({
            date: '2023-10-10T20:00:00.000Z',
            dateFormat: { year: '2-digit', month: '2-digit', day: '2-digit' },
        });
        expect(screen.getByText('10/10/23')).toBeInTheDocument();
    });

    test('returns empty string for empty date string', () => {
        renderComponent({ date: '' });
        expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
    });

    test('returns empty string for invalid date string', () => {
        renderComponent({ date: 'not-a-date' });
        expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
    });

    test('returns empty string for null date', () => {
        // @ts-ignore - Testing invalid input
        renderComponent({ date: null });
        expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
    });
});
