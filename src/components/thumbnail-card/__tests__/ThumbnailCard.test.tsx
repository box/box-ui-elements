import React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ThumbnailCard from '../ThumbnailCard';

describe('components/thumbnail-card/ThumbnailCard', () => {
    const getComponent = (props = {}) => {
        const defaultProps = {
            thumbnail: <div>Foo Bar!</div>,
            title: <div>Hello World!</div>,
        };
        return render(<ThumbnailCard {...defaultProps} {...props} />);
    };

    test('should render with basic props', () => {
        getComponent();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Hello World!')).toBeInTheDocument();
        expect(screen.getByText('Foo Bar!')).toBeInTheDocument();
    });

    test('should render with additional className', () => {
        const className = 'fooBar';
        getComponent({ className });
        const element = screen.getByRole('button');
        expect(element).toHaveClass('thumbnail-card', className);
    });

    test('should render with actionItem, icon, and subtitle', () => {
        const icon = <img alt="icon" />;
        const subtitle = <div>Subtitle!</div>;
        const actionItem = <button type="button">Click Me</button>;
        getComponent({ actionItem, icon, subtitle });

        expect(screen.getByRole('img', { name: 'icon' })).toBeInTheDocument();
        expect(screen.getByText('Subtitle!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    test('should apply highlight class when highlightOnHover is true', () => {
        getComponent({ highlightOnHover: true });
        const element = screen.getByRole('button');
        expect(element).toHaveClass('is-highlight-applied');
    });

    test('should not render button role and tabIndex when onKeyDown is provided', () => {
        getComponent({ onKeyDown: () => undefined });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
