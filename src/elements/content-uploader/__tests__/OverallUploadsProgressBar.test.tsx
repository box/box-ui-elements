import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import OverallUploadsProgressBar, { OverallUploadsProgressBarProps } from '../OverallUploadsProgressBar';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR, VIEW_UPLOAD_EMPTY } from '../../../constants';

describe('elements/content-uploader/OverallUploadsProgressBar', () => {
    const defaultProps = {
        hasMultipleFailedUploads: false,
        isDragging: false,
        isExpanded: true,
        isResumeVisible: false,
        isVisible: true,
        onClick: jest.fn(),
        onKeyDown: jest.fn(),
        onUploadsManagerActionClick: jest.fn(),
        percent: 2,
        view: VIEW_UPLOAD_EMPTY,
    };
    const renderComponent = (props: OverallUploadsProgressBarProps = defaultProps) =>
        render(
            <OverallUploadsProgressBar
                isDragging={false}
                isExpanded
                isVisible
                onClick={jest.fn()}
                onKeyDown={jest.fn()}
                percent={2}
                view={VIEW_UPLOAD_EMPTY}
                {...props}
            />,
        );

    test('should render correctly when view is VIEW_UPLOAD_EMPTY', () => {
        renderComponent();
        expect(
            screen.getByRole('button', { name: 'Drop files on this page to upload them into this folder.' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should render correctly when view is VIEW_UPLOAD_SUCCESS', () => {
        renderComponent({ ...defaultProps, view: VIEW_UPLOAD_SUCCESS });
        expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should render correctly when view is VIEW_ERROR', () => {
        renderComponent({ ...defaultProps, view: VIEW_ERROR });
        expect(screen.getByRole('button', { name: 'Some Uploads Failed' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should render correctly when view is VIEW_UPLOAD_IN_PROGRESS', () => {
        renderComponent({ ...defaultProps, view: VIEW_UPLOAD_IN_PROGRESS });
        expect(screen.getByRole('button', { name: 'Uploading' })).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('should render correctly when isVisible is false', () => {
        renderComponent({ ...defaultProps, isVisible: false, view: VIEW_UPLOAD_SUCCESS });
        expect(screen.getByRole('button', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });

    test('should render correctly when isDragging is true', () => {
        renderComponent({ ...defaultProps, view: VIEW_UPLOAD_SUCCESS, isDragging: true });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('should render correctly when isResumeVisible is false', () => {
        renderComponent({ ...defaultProps, isResumeVisible: false });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('should render correctly when isResumeVisible is true and hasMultipleFailedUploads is false', () => {
        renderComponent({ ...defaultProps, isResumeVisible: true, hasMultipleFailedUploads: false });
        expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    test('should render correctly when isResumeVisible is true and hasMultipleFailedUploads is true', () => {
        renderComponent({ ...defaultProps, isResumeVisible: true, hasMultipleFailedUploads: true });
        expect(screen.getByText('Resume All')).toBeInTheDocument();
    });

    test('should be invisible for assistive technologies when hidden', () => {
        renderComponent({ ...defaultProps, isVisible: false });
        expect(screen.getByRole('button', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });

    test('should be visible for assistive technologies when displayed', () => {
        renderComponent({ ...defaultProps, isVisible: true });
        expect(screen.getByRole('button')).toHaveAttribute('aria-hidden', 'false');
    });
});
