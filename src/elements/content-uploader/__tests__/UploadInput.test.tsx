import * as React from 'react';

import { render, screen } from '@testing-library/react';

import UploadInput from '../UploadInput';

describe('elements/content-uploader/UploadInput', () => {
    const getWrapper = props => render(<UploadInput handleChange={jest.fn()} {...props} />);

    test('should render correctly when inputLabel is available', () => {
        getWrapper({
            inputLabelClass: 'inputLabelClass',
            inputLabel: 'yo',
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByText('yo')).toHaveClass('inputLabelClass');
    });

    test('should render correctly when inputLabel is not available', () => {
        const { container } = getWrapper({});
        expect(container).toBeEmptyDOMElement();
    });

    test('should render correctly when isFolderUpload is true', () => {
        getWrapper({
            inputLabel: 'yo',
            isFolderUpload: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('webkitdirectory', '');
    });

    test('should render correctly when isFolderUpload is false', () => {
        getWrapper({
            inputLabel: 'yo',
            isFolderUpload: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('webkitdirectory');
    });

    test('should render correctly when isMultiple is true', () => {
        getWrapper({
            inputLabel: 'yo',
            isMultiple: true,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).toHaveAttribute('multiple');
    });

    test('should render correctly when isMultiple is false', () => {
        getWrapper({
            inputLabel: 'yo',
            isMultiple: false,
        });

        expect(screen.getByText('yo')).toBeInTheDocument();
        expect(screen.getByLabelText('yo')).not.toHaveAttribute('multiple');
    });
});
