import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';

import UploadState, { UploadStateProps } from '../UploadState';

import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../../constants';

describe('elements/content-uploader/UploadState', () => {
    const getWrapper = (props: Partial<UploadStateProps>) =>
        render(
            <UploadState
                canDrop={false}
                hasItems={false}
                isFolderUploadEnabled={false}
                isOver={false}
                isTouch={false}
                onSelect={jest.fn()}
                view={VIEW_ERROR}
                {...props}
            />,
        );

    test.each`
        view                       | iconAriaLabel
        ${VIEW_ERROR}              | ${'upload-error-state'}
        ${VIEW_UPLOAD_EMPTY}       | ${'upload-empty-state'}
        ${VIEW_UPLOAD_IN_PROGRESS} | ${'upload-empty-state'}
        ${VIEW_UPLOAD_SUCCESS}     | ${'upload-success-state'}
    `('should render icon correctly based on the view', ({ view, iconAriaLabel }) => {
        getWrapper({ view });
        expect(screen.getByLabelText(iconAriaLabel)).toBeInTheDocument();
    });

    test('should render upload_empty view correctly when canDrop and hasItems set to true', () => {
        getWrapper({ view: VIEW_UPLOAD_EMPTY, canDrop: true, hasItems: true });
        expect(screen.getByText('Drag and drop to add additional files')).toBeInTheDocument();
    });

    test('should render upload_empty view correctly when isTouch set to true', () => {
        getWrapper({ view: VIEW_UPLOAD_EMPTY, isTouch: true });
        expect(screen.getByText('Select files from your device')).toBeInTheDocument();
    });

    test('should render content for upload_empty view correctly when isFolderUploadEnabled set to false', () => {
        getWrapper({ view: VIEW_UPLOAD_EMPTY });
        expect(screen.getByText('Browse your device')).toBeInTheDocument();
        expect(screen.getByText('Drag and drop files')).toBeInTheDocument();
    });

    test('should render content for upload_empty view correctly when isFolderUploadEnabled set to true', () => {
        getWrapper({ view: VIEW_UPLOAD_EMPTY, isFolderUploadEnabled: true });
        expect(screen.getByText('Select Folders')).toBeInTheDocument();
        expect(screen.getByText('Drag and drop files and folders')).toBeInTheDocument();
    });

    test('should render content for upload_in_progress view correctly when isFolderUploadEnabled set to true', () => {
        getWrapper({ view: VIEW_UPLOAD_IN_PROGRESS });
        expect(screen.getByText('Drag and drop to add additional files')).toBeInTheDocument();
    });

    test('should render content for upload_success view correctly when isFolderUploadEnabled set to false', () => {
        getWrapper({ view: VIEW_UPLOAD_SUCCESS });
        expect(screen.getByText('Select More Files')).toBeInTheDocument();
        expect(screen.getByText('Success! Your files have been uploaded.')).toBeInTheDocument();
    });

    test('should render content for upload_success view correctly when isFolderUploadEnabled set to true', () => {
        getWrapper({ view: VIEW_UPLOAD_SUCCESS, isFolderUploadEnabled: true });
        expect(screen.getByText('Select More Folders')).toBeInTheDocument();
        expect(screen.getByText('Success! Your files have been uploaded.')).toBeInTheDocument();
    });
});
