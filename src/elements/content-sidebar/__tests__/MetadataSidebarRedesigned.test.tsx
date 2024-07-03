import React from 'react';
import { IntlProvider } from 'react-intl';

import { screen, render } from '@testing-library/react';

import { MetadataSidebarRedesignedComponent as MetadataSidebar } from '../MetadataSidebarRedesigned';

jest.unmock('react-intl');

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesigned', () => {
    const renderComponent = (props = {}) =>
        render(<MetadataSidebar {...props} />, {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <IntlProvider locale="en-US">{children}</IntlProvider>
            ),
        });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeVisible();
    });
});
