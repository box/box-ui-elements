/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import '@testing-library/jest-dom';
import ItemGridThumbnail from '../ItemGridThumbnail';
import type { BoxItem } from '../../../common/types/core';

describe('elements/content-explorer/ItemGridThumbnail', () => {
    const defaultProps: { item: BoxItem } = {
        item: {
            id: '1',
            name: 'test-item',
            type: 'file',
            thumbnailUrl: null,
        },
    };

    test('renders with icon when no thumbnail', () => {
        render(<ItemGridThumbnail {...defaultProps} />);
        expect(screen.getByTestId('item-icon')).toBeVisible();
    });

    test('renders with thumbnail when available', () => {
        const propsWithThumbnail = {
            item: {
                ...defaultProps.item,
                thumbnailUrl: 'https://example.com/thumb.jpg',
                representations: {
                    entries: [{ status: { state: 'success' } }],
                },
            },
        };
        render(<ItemGridThumbnail {...propsWithThumbnail} />);
        const thumbnailDiv = screen.getByRole('presentation');
        expect(thumbnailDiv).toHaveStyle({ backgroundImage: 'url("https://example.com/thumb.jpg")' });
    });

    test('handles thumbnail loading state', () => {
        const loadingProps = {
            item: {
                ...defaultProps.item,
                thumbnailUrl: 'https://example.com/thumb.jpg',
                representations: {
                    entries: [{ status: { state: 'pending' } }],
                },
            },
        };
        render(<ItemGridThumbnail {...loadingProps} />);
        expect(screen.getByTestId('item-icon')).toBeVisible();
    });

    test('handles thumbnail error state', () => {
        const errorProps = {
            item: {
                ...defaultProps.item,
                thumbnailUrl: 'https://example.com/thumb.jpg',
                representations: {
                    entries: [{ status: { state: 'error' } }],
                },
            },
        };
        render(<ItemGridThumbnail {...errorProps} />);
        expect(screen.getByTestId('item-icon')).toBeVisible();
    });
});
