import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnalyticsErrorState from '../ContentAnalyticsErrorState';

const baseError = new Error('An error has occured');

describe('features/content-insights/ContentAnalyticsErrorState', () => {
    const getWrapper = (props = {}) => render(<ContentAnalyticsErrorState error={undefined} {...props} />);

    describe('render', () => {
        test('should show the default error state', () => {
            getWrapper();

            expect(screen.getByTestId('ContentAnalyticsErrorState-text')).toBeVisible();
            expect(screen.queryByTestId('ContentAnalyticsErrorState-text--permission')).not.toBeInTheDocument();
        });

        test('should show default error state when theres an error passed in', () => {
            getWrapper({ error: baseError });

            expect(screen.getByTestId('ContentAnalyticsErrorState-text')).toBeVisible();
            expect(screen.queryByTestId('ContentAnalyticsErrorState-text--permission')).not.toBeInTheDocument();
        });

        test('should show the permission error state when error exists and is a permission error', () => {
            getWrapper({ error: { ...baseError, status: 403 } });

            expect(screen.getByTestId('ContentAnalyticsErrorState-text--permission')).toBeVisible();
            expect(screen.queryByTestId('ContentAnalyticsErrorState-text')).not.toBeInTheDocument();
        });
    });
});
