import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdditionalTabs from '../AdditionalTabs';
import { AdditionalTabsProps } from '../types';

describe('elements/content-sidebar/AdditionalTabs', () => {
    const getComponent = (props: Partial<AdditionalTabsProps>) => render(<AdditionalTabs {...props} />);

    test('should render the correct number of tabs and the loading state', () => {
        const props = {
            tabs: [
                {
                    id: 200,
                    title: 'Test title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
                {
                    id: 1,
                    title: 'Another title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
            ],
        };

        getComponent(props);
        expect(screen.getByTestId('additional-tabs-loading')).toBeInTheDocument();
        const tabs = screen.getByTestId('additional-tabs');
        expect(tabs).toBeInTheDocument();
        expect(tabs).toHaveAttribute('aria-hidden', 'true');
    });

    test('should not render the loading state after the image URLs have loaded', () => {
        const props = {
            tabs: [
                {
                    id: 200,
                    title: 'Test title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
            ],
        };

        getComponent(props);
        const button = screen.getByRole('button', { name: 'Test title', hidden: true });
        const img = button.querySelector('img');

        if (img) {
            act(() => {
                img.dispatchEvent(new Event('load'));
            });
        }

        expect(screen.queryByTestId('additional-tabs-loading')).not.toBeInTheDocument();
        const tabs = screen.getByTestId('additional-tabs');
        expect(tabs).toBeInTheDocument();
        expect(tabs).not.toHaveAttribute('aria-hidden');
    });

    test('should render the more tabs entry correctly', () => {
        const props = {
            tabs: [
                {
                    id: 200,
                    title: 'Test title',
                    iconUrl: 'https://foo.com/icon',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
                {
                    id: -1,
                    title: 'More Apps',
                    callback: jest.fn(),
                    status: 'ADDED',
                },
            ],
        };

        getComponent(props);
        expect(screen.getByRole('button', { name: 'More Apps', hidden: true })).toBeInTheDocument();
    });
});
