import * as React from 'react';
import { render, screen } from '@testing-library/react';
import AdditionalTabsLoading from '../AdditionalTabsLoading';

describe('elements/content-sidebar/additional-tabs/AdditionalTabs', () => {
    test('should render the correct loading state', () => {
        render(<AdditionalTabsLoading />);
        expect(screen.getAllByTestId('additional-tab-placeholder')).toHaveLength(3);
    });
});
