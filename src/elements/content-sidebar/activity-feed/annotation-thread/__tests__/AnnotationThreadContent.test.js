// @flow
import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnnotationThreadContent from '../AnnotationThreadContent';
import { annotation as mockAnnotation, user } from '../../../../../__mocks__/annotations';

import commonMessages from '../../../../common/messages';
import messages from '../messages';

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('elements/content-sidebar/activity-feed/annotation-thread/AnnotationThreadContent', () => {
    const defaultProps = {
        annotation: mockAnnotation,
        isLoading: false,
        replies: [],
    };

    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };
    const getWrapper = props =>
        render(<AnnotationThreadContent {...defaultProps} {...props} />, { wrapper: IntlWrapper });

    test('Should render properly', () => {
        const { getByText, queryByTestId } = getWrapper();
        expect(getByText(mockAnnotation.description.message)).toBeInTheDocument();
        expect(getByText(mockAnnotation.created_by.name)).toBeInTheDocument();
        expect(queryByTestId('annotation-loading')).not.toBeInTheDocument();
    });

    test('Should call getAvatarUrl with creator id', async () => {
        const getAvatarUrl = jest.fn(() => Promise.resolve());

        getWrapper({ getAvatarUrl });
        expect(getAvatarUrl).toBeCalledWith(user.id);
    });

    test('Should render loading state properly', () => {
        const annotation = undefined;
        const isLoading = true;

        const { getByTestId } = getWrapper({ annotation, isLoading });

        expect(getByTestId('annotation-loading')).toBeInTheDocument();
    });

    test('Should render error state properly', () => {
        const annotation = undefined;
        const error = {
            title: commonMessages.errorOccured,
            message: messages.errorFetchAnnotation,
        };

        const { queryByText, getByText } = getWrapper({ annotation, error });
        expect(getByText(commonMessages.errorOccured.defaultMessage)).toBeInTheDocument();
        expect(queryByText(messages.errorFetchAnnotation.defaultMessage)).toBeInTheDocument();
    });
});
