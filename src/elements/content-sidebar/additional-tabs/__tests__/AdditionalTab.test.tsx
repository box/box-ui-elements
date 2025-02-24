import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Plus } from '@box/blueprint-web-assets/icons/Fill';
import AdditionalTab from '../AdditionalTab';
import { AdditionalTabProps } from '../types';

describe('elements/content-sidebar/additional-tabs/AdditionalTab', () => {
    const noop = jest.fn();
    const defaultProps: AdditionalTabProps = {
        callback: noop,
        id: 1,
        title: '',
        isLoading: false,
        onImageLoad: noop,
    };
    const getComponent = (props: Partial<AdditionalTabProps>) => render(<AdditionalTab {...defaultProps} {...props} />);

    test('should render the tooltip and button contents', () => {
        const mockSrc = 'https://foo.com/image';
        const props = {
            title: 'test title',
            iconUrl: mockSrc,
            id: 4,
            callback: noop,
        };

        getComponent(props);

        const button = screen.getByRole('button', { name: 'test title' });
        expect(button).toBeInTheDocument();
        expect(button.querySelector('img')).toHaveAttribute('src', mockSrc);
    });

    test('should render the more icon ellipsis if no valid id and icon URL are provided', () => {
        const props = {
            title: 'test title',
            id: -1,
            callback: noop,
        };

        getComponent(props);

        expect(screen.getByRole('button', { name: 'test title' })).toBeInTheDocument();
    });

    test('should render icon if no valid id provided with an icon', () => {
        const props = {
            title: 'test title',
            id: -1,
            icon: <Plus />,
            callback: noop,
        };

        getComponent(props);

        expect(screen.getByRole('button', { name: 'test title' })).toBeInTheDocument();
    });

    test('should render the placeholder when an error occurs', () => {
        const props = {
            title: 'test title',
            id: -1,
            callback: noop,
            onImageLoad: noop,
        };

        const { container } = getComponent(props);
        const button = screen.getByRole('button', { name: 'test title' });
        const img = button.querySelector('img');

        if (img) {
            img.dispatchEvent(new Event('error'));
        }

        expect(container.querySelector('.bdl-AdditionalTabPlaceholder')).toBeInTheDocument();
    });

    test('should render disabled button when blocked by shield access policy', () => {
        const mockSrc = 'https://foo.com/image';
        const props = {
            title: 'test title',
            iconUrl: mockSrc,
            id: 4,
            callback: noop,
            status: 'BLOCKED_BY_SHIELD_ACCESS_POLICY',
        };

        getComponent(props);

        const button = screen.getByRole('button', { name: 'test title' });
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveClass('bdl-is-disabled');
    });

    test('should render the FTUX tooltip when ftuxTooltipData is present and the tab is not loading', () => {
        const mockSrc = 'https://foo.com/image';
        const props = {
            title: 'test title',
            iconUrl: mockSrc,
            id: 4,
            isLoading: false,
            ftuxTooltipData: {
                targetingApi: () => ({
                    canShow: true,
                    onShow: jest.fn(),
                }),
                text: 'ftux tooltip text',
            },
            callback: noop,
        };

        getComponent(props);

        // The tooltip should be rendered with the FTUX text
        expect(screen.getByText('ftux tooltip text')).toBeInTheDocument();
    });
});
