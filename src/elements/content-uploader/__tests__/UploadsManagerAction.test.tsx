import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import UploadsManagerAction from '../UploadsManagerAction';

describe('elements/content-uploader/UploadsManagerAction', () => {
    test('should render correctly with hasMultipleFailedUploads as true', () => {
        render(<UploadsManagerAction hasMultipleFailedUploads={true} onClick={jest.fn()} />);

        expect(screen.getByText('Resume All')).toBeInTheDocument();
    });

    test('should render correctly with hasMultipleFailedUploads as false', () => {
        render(<UploadsManagerAction hasMultipleFailedUploads={false} onClick={jest.fn()} />);

        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.queryByText('Resume All')).toBeNull();
    });

    test('should call onClick when resume button is clicked', () => {
        const handleResumeClick = jest.fn();

        render(<UploadsManagerAction hasMultipleFailedUploads={false} onClick={handleResumeClick} />);

        fireEvent.click(screen.getByText('Resume'));
        expect(handleResumeClick).toHaveBeenCalledTimes(1);
    });
});
