import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';

import DateField, { DateFieldProps } from '../DateField';

describe('elements/common/date/DateField', () => {
    const renderComponent = (props: Partial<DateFieldProps> = {}) => {
        render(<DateField date="2023-10-10T10:00:00Z" {...props} />);
    };
    test('renders formatted date', () => {
        renderComponent();
        expect(screen.getByText('Tue, Oct 10, 2023')).toBeInTheDocument();
    });

    test("renders today message for today's date", () => {
        renderComponent({ date: new Date().toISOString(), relative: true });
        expect(screen.getByText('today')).toBeInTheDocument();
    });

    test("renders yesterday message for yesterday's date", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        renderComponent({ date: yesterday.toISOString(), relative: true });
        expect(screen.getByText('yesterday')).toBeInTheDocument();
    });

    test('renders formatted date without commas', () => {
        renderComponent({ omitCommas: true });
        expect(screen.getByText('Tue Oct 10 2023')).toBeInTheDocument();
    });

    test('renders capitalized today message', () => {
        renderComponent({ date: new Date().toISOString(), relative: true, capitalize: true });
        expect(screen.getByText('today')).toHaveClass('be-date-capitalize');
    });

    test('renders capitalized yesterday message', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        renderComponent({ date: yesterday.toISOString(), relative: true, capitalize: true });
        expect(screen.getByText('yesterday')).toHaveClass('be-date-capitalize');
    });

    test('renders formatted date with custom format', () => {
        renderComponent({ dateFormat: { year: '2-digit', month: '2-digit', day: '2-digit' } });
        expect(screen.getByText('10/10/23')).toBeInTheDocument();
    });
});
