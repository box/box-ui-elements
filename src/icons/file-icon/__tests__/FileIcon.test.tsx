import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import FileIcon from '../FileIcon';

jest.mock('@box/blueprint-web', () => ({
    TooltipProvider: ({ children }) => children,
}));

describe('icons/file-icon/FileIcon', () => {
    const renderComponent = (props = {}) => render(<FileIcon {...props} />);

    test('should render default 32 icon when no extension and dimension is defined', () => {
        renderComponent();
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test.each([
        'doc',
        'docx',
        'docm',
        'gdoc',
        'gsheet',
        'gslides',
        'gslide',
        'key',
        'numbers',
        'pages',
        'ppt',
        'pptx',
        'pptm',
        'xls',
        'xlsm',
        'xlsb',
        'zip',
        'heic',
        'heif',
        'HEIC',
        'HEIF',
        'xbd',
        'xdw',
    ])('should render the expected icon when %s is defined', extension => {
        renderComponent({ extension });
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('height', '32');
        expect(icon).toHaveAttribute('width', '32');
    });

    test('should render 64 icon when dimension is defined', () => {
        renderComponent({ dimension: 64 });
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('height', '64');
        expect(icon).toHaveAttribute('width', '64');
    });

    test('should render title when title is defined', () => {
        const title = 'Custom Title';
        renderComponent({ title });
        const icon = screen.getByRole('img', { name: title });
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('aria-labelledby');
        const titleElement = screen.getByText(title);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.tagName.toLowerCase()).toBe('title');
    });
});
