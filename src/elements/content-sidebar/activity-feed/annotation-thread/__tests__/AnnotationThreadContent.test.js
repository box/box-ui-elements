// @flow

import React from 'react';
import { render } from '@testing-library/react';
import { AnnotationThreadContentComponent } from '../AnnotationThreadContent';
import { annotation } from '../../../../../__mocks__/annotations';

let mockedAnnotation = annotation;
let mockedIsError = false;
let mockedIsLoading = false;

jest.mock('../useAnnotationAPI', () => {
    return jest.fn(() => ({
        annotation: mockedAnnotation,
        isError: mockedIsError,
        isLoading: mockedIsLoading,
        handleDelete: jest.fn(),
        handleEdit: jest.fn(),
        handleResolve: jest.fn(),
    }));
});

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadContent', () => {
    const mockGetAvatarUrlWithAccessToken = jest.fn();

    const defaultProps = {
        annotationId: mockedAnnotation.id,
        api: {
            getAnnotationApi: () => ({
                getAnnotation: jest.fn(),
            }),
            getUsersAPI: () => ({
                getAvatarUrlWithAccessToken: mockGetAvatarUrlWithAccessToken,
            }),
        },
        fileId: 'fileId',
        filePermissions: {
            can_view_annotations: true,
            can_annotate: true,
        },
    };

    const getWrapper = (props = {}) => render(<AnnotationThreadContentComponent {...defaultProps} {...props} />);

    test('Should render properly', () => {
        const { getByText, queryByTestId } = getWrapper();
        expect(getByText(mockedAnnotation.description.message)).toBeInTheDocument();
        expect(getByText(mockedAnnotation.created_by.name)).toBeInTheDocument();
        expect(queryByTestId('annotation-loading')).not.toBeInTheDocument();
    });

    test('Should call getAvatarUrl with creator id', async () => {
        getWrapper();
        expect(mockGetAvatarUrlWithAccessToken).toBeCalledWith('1', 'fileId');
    });

    test('Should render loading state properly', () => {
        mockedAnnotation = undefined;
        mockedIsLoading = true;

        const { getByTestId } = getWrapper();

        expect(getByTestId('annotation-loading')).toBeInTheDocument();
    });

    test('Should not render if api call fails', () => {
        mockedIsError = true;
        mockedAnnotation = undefined;
        mockedIsLoading = false;

        const { container } = getWrapper();
        expect(container).toBeEmptyDOMElement();
    });
});
