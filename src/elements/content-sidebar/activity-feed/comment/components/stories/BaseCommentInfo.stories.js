// @flow
import * as React from 'react';

import { IntlProvider } from 'react-intl';
import { BaseCommentInfo, type BaseCommentInfoProps } from '../BaseCommentInfo';
import AnnotationActivityLinkProvider from '../../../activity-feed/AnnotationActivityLinkProvider';
import { annotationActivityLinkProviderProps } from '../../stories/common';
import { baseCommmentInfoDefaultProps } from './common';

const getTemplate = customProps => (props: BaseCommentInfoProps) => (
    <IntlProvider locale="en">
        <BaseCommentInfo {...baseCommmentInfoDefaultProps} {...customProps} {...props} />
    </IntlProvider>
);

export const Annotation = getTemplate({
    annotationActivityLink: <AnnotationActivityLinkProvider {...annotationActivityLinkProviderProps} />,
});
export const Comment = getTemplate();

export default {
    title: 'Components/BaseCommentInfo',
    component: BaseCommentInfo,
    parameters: { layout: 'centered' },
};
