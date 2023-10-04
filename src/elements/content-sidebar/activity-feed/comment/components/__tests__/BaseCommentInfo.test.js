// @flow

import React from 'react';

import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';

import { BaseCommentInfo } from '../BaseCommentInfo';
import localize from '../../../../../../../test/support/i18n';

import { annotationActivityLinkProviderProps, user1 } from '../../stories/common';
import { baseCommmentInfoDefaultProps } from '../stories/common';
import AnnotationActivityLinkProvider from '../../../activity-feed/AnnotationActivityLinkProvider';

import messages from '../../messages';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

const getWrapper = props =>
    render(
        <IntlProvider locale="en">
            <BaseCommentInfo {...baseCommmentInfoDefaultProps} {...props} />
        </IntlProvider>,
    );

describe('elements/content-sidebar/ActivityFeed/comment/BaseCommentInfo', () => {
    test('should render appropriate contents if annotationActivityLink is undefined', () => {
        const wrapper = getWrapper();
        expect(wrapper.getByText(user1.name)).toBeInTheDocument();

        const userInitials = user1.name
            .split(' ')
            .map(word => word[0])
            .join('');
        expect(wrapper.getByText(userInitials)).toBeInTheDocument();

        // This could fail for some locales, but I was unable to use the ReadableTime component to get the properly-formatted time programmatically
        expect(wrapper.getByText('Sep 27, 2017')).toBeInTheDocument();

        expect(wrapper.queryByText(localize(messages.inlineCommentAnnotationIconTitle.id))).not.toBeInTheDocument();
    });
    test('should render an annotation badge if annotationActivityLink is defined', () => {
        const wrapper = getWrapper({
            annotationActivityLink: <AnnotationActivityLinkProvider {...annotationActivityLinkProviderProps} />,
        });
        expect(wrapper.getByText(localize(messages.inlineCommentAnnotationIconTitle.id))).toBeInTheDocument();
    });
});
