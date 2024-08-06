import * as React from 'react';
import { AxiosError } from 'axios';
import { render, screen } from '../../../test-utils/testing-library';
import ItemAction, { ItemActionProps } from '../ItemAction';
import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETE,
    STATUS_STAGED,
    STATUS_ERROR,
} from '../../../constants';

describe('elements/content-uploader/ItemAction', () => {
    const defaultError: AxiosError = {
        code: '',
        config: undefined,
        isAxiosError: false,
        toJSON: jest.fn(),
        name: '',
        message: '',
    };

    const defaultProps: ItemActionProps = {
        isResumableUploadsEnabled: false,
        onClick: jest.fn(),
        status: STATUS_PENDING,
        error: defaultError,
        isFolder: false,
        onUpgradeCTAClick: jest.fn(),
    };

    const getWrapper = (props: Partial<ItemActionProps>) => render(<ItemAction {...defaultProps} {...props} />);

    test.each`
        status
        ${STATUS_COMPLETE}
        ${STATUS_IN_PROGRESS}
        ${STATUS_STAGED}
        ${STATUS_ERROR}
        ${STATUS_PENDING}
    `('should render correctly with $status', ({ status }: Pick<ItemActionProps, 'status'>) => {
        getWrapper({ status });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test.each`
        status             | label
        ${STATUS_COMPLETE} | ${'complete'}
        ${STATUS_ERROR}    | ${'error'}
    `(
        'should render correctly with $status and resumable uploads enabled',
        ({ status, label }: Pick<ItemActionProps, 'status'> & { label: string }) => {
            getWrapper({ status, isResumableUploadsEnabled: true });
            expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
        },
    );

    test.each`
        status
        ${STATUS_IN_PROGRESS}
        ${STATUS_PENDING}
        ${STATUS_STAGED}
    `(
        'should render correctly with $status and resumable uploads enabled',
        ({ status }: Pick<ItemActionProps, 'status'>) => {
            getWrapper({ status, isResumableUploadsEnabled: true });
            expect(screen.getByRole('status', { name: 'loading' })).toBeInTheDocument();
        },
    );

    test.each`
        status                | label
        ${STATUS_IN_PROGRESS} | ${'staged'}
        ${STATUS_STAGED}      | ${'staged'}
    `(
        'should render correctly with $status and resumable uploads disabled',
        ({ status, label }: Pick<ItemActionProps, 'status'> & { label: string }) => {
            getWrapper({ status, isResumableUploadsEnabled: false });
            expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
        },
    );

    test('should render correctly with STATUS_PENDING and resumable uploads disabled', () => {
        getWrapper({ status: STATUS_PENDING, isResumableUploadsEnabled: false });
        expect(screen.getByRole('button', { name: 'Cancel this upload' })).toBeInTheDocument();
    });

    test('should render correctly with STATUS_ERROR and item is folder', () => {
        getWrapper({ status: STATUS_ERROR, isFolder: true });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('should render CTA button to upgrade when upload file size exceeded error is received', () => {
        getWrapper({
            status: STATUS_ERROR,
            error: { ...defaultError, code: ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED },
            onUpgradeCTAClick: jest.fn(),
        });
        expect(
            screen.getByRole('button', {
                name: 'Upgrade',
            }),
        ).toBeInTheDocument();
    });
});
