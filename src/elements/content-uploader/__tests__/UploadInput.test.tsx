import * as React from 'react';

import { render, screen } from '@testing-library/react';

import UploadInput from '../UploadInput';

describe('elements/content-uploader/UploadInput', () => {
    const renderComponent = props => render(<UploadInput handleChange={jest.fn()} {...props} />);

    test('should render correctly when inputLabel is available', () => {
        renderComponent({
            inputLabelClass: 'inputLabelClass',
            inputLabel: 'yo',
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByText('yo')).toHaveClass('inputLabelClass');
    });

    test('should render correctly when inputLabel is not available', () => {
        const { container } = renderComponent({});
        expect(container).toBeEmptyDOMElement();
    });

    test('should render correctly when isFolderUpload is true', () => {
        renderComponent({
            inputLabel: 'yo',
            isFolderUpload: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('webkitdirectory', '');
    });

    test('should render correctly when isFolderUpload is false', () => {
        renderComponent({
            inputLabel: 'yo',
            isFolderUpload: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('webkitdirectory');
    });

    test('should render correctly when isMultiple is true', () => {
        renderComponent({
            inputLabel: 'yo',
            isMultiple: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('multiple');
    });

    test('should render correctly when isMultiple is false', () => {
        renderComponent({
            inputLabel: 'yo',
            isMultiple: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('multiple');
    });
});
