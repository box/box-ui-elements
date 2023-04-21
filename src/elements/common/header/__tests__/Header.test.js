import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeaderBase as Header } from '../Header';

describe('elements/common/header/Header', () => {
    const intl = {
        formatMessage: jest.fn().mockImplementation(message => message.defaultMessage),
    };

    const renderComponent = props => render(<Header intl={intl} {...props} />);

    test('renders Logo component when isHeaderLogoVisible is `true`', () => {
        renderComponent({ isHeaderLogoVisible: true });
        expect(screen.getByTestId('be-Logo')).toBeInTheDocument();
    });

    test('does not render Logo component when isHeaderLogoVisible is `false`', () => {
        renderComponent({ isHeaderLogoVisible: false });
        expect(screen.queryByTestId('be-Logo')).not.toBeInTheDocument();
    });

    test('renders matching values for aria-label and placeholder attributes', () => {
        renderComponent();
        const searchInput = screen.getByTestId('be-Header-searchInput');
        const searchMessage = 'Search files and folders';

        expect(searchInput.getAttribute('aria-label')).toBe(searchMessage);
        expect(searchInput.getAttribute('placeholder')).toBe(searchMessage);
    });

    test('disables search input when view is not `folder` and not `search`', () => {
        renderComponent({ view: 'recents' });
        expect(screen.getByTestId('be-Header-searchInput')).toBeDisabled();
    });

    test.each(['folder', 'search'])('does not disable search input when view is %s', view => {
        renderComponent({ view });
        expect(screen.getByTestId('be-Header-searchInput')).not.toBeDisabled();
    });
});
