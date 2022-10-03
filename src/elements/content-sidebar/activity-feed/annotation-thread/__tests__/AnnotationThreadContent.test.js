// @flow
import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnnotationThreadContent from '../AnnotationThreadContent';
import { annotation, user } from '../../../../../__mocks__/annotations';

import commonMessages from '../../../../common/messages';
import messages from '../messages';

let mockedAnnotation = annotation;
let mockedError;
let mockedIsLoading = false;

jest.mock('react-intl', () => jest.requireActual('react-intl'));
jest.mock('../useAnnotationAPI', () => {
    return jest.fn(() => ({
        annotation: mockedAnnotation,
        error: mockedError,
        isLoading: mockedIsLoading,
        handleDelete: jest.fn(),
        handleEdit: jest.fn(),
        handleResolve: jest.fn(),
    }));
});

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadContent', () => {
    const mockGetAvatarUrl = jest.fn(() => Promise.resolve());

    const defaultProps = {
        annotationId: mockedAnnotation.id,
        api: {
            getAnnotationApi: () => ({
                getAnnotation: jest.fn(),
            }),
        },
        file: {
            id: 'fileId',
            permissions: {
                can_view_annotations: true,
                can_annotate: true,
            },
        },
        getAvatarUrl: mockGetAvatarUrl,
    };

    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const getWrapper = () => render(<AnnotationThreadContent {...defaultProps} />, { wrapper: IntlWrapper });

    test('Should render properly', () => {
        const { getByText, queryByTestId } = getWrapper();
        expect(getByText(mockedAnnotation.description.message)).toBeInTheDocument();
        expect(getByText(mockedAnnotation.created_by.name)).toBeInTheDocument();
        expect(queryByTestId('annotation-loading')).not.toBeInTheDocument();
    });

    test('Should call getAvatarUrl with creator id', async () => {
        getWrapper();
        expect(mockGetAvatarUrl).toBeCalledWith(user.id);
    });

    test('Should render loading state properly', () => {
        mockedAnnotation = undefined;
        mockedIsLoading = true;

        const { getByTestId } = getWrapper();

        expect(getByTestId('annotation-loading')).toBeInTheDocument();
    });

    test('Should render error state properly', () => {
        mockedError = {
            title: commonMessages.errorOccured,
            message: messages.errorFetchAnnotation,
        };
        mockedAnnotation = undefined;
        mockedIsLoading = false;

        const { queryByText, getByText } = getWrapper();
        expect(getByText(commonMessages.errorOccured.defaultMessage)).toBeInTheDocument();
        expect(queryByText(messages.errorFetchAnnotation.defaultMessage)).toBeInTheDocument();
    });
});
