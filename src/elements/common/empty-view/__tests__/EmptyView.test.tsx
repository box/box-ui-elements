import React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';
import EmptyView from '../EmptyView';

describe('elements/common/empty-view/EmptyView', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            isLoading: false,
            view: 'folder',
        };
        render(<EmptyView {...defaultProps} {...props} />);
    };

    test.each`
        view          | text
        ${'error'}    | ${'A network error has occurred while trying to load.'}
        ${'folder'}   | ${'There are no items in this folder.'}
        ${'metadata'} | ${'There are no items in this folder.'}
        ${'recents'}  | ${'There are no recent items yet.'}
        ${'search'}   | ${"Sorry, we couldn't find what you're looking for."}
        ${'selected'} | ${"You haven't selected any items yet."}
    `('renders component correctly when the view is `$view`', ({ text, view }) => {
        renderComponent({ view });
        expect(screen.getByRole('paragraph')).toHaveTextContent(text);
    });

    test('renders component correctly when items are being fetched', () => {
        renderComponent({ isLoading: true });
        expect(screen.getByRole('paragraph')).toHaveTextContent('Please wait while the items load...');
    });
});
