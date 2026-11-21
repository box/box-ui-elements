import * as React from 'react';
import { IntlProvider } from 'react-intl';
import noop from 'lodash/noop';

import AnnotationActivity from '../AnnotationActivity';
import { annotation, currentUser, annotationActivityLinkProviderProps } from '../../comment/stories/common';
import AnnotationActivityLinkProvider from '../../activity-feed/AnnotationActivityLinkProvider';

export const Basic = () => (
    <IntlProvider locale="en">
        <div style={{ width: 300, padding: 20 }}>
            <AnnotationActivity
                currentUser={currentUser}
                getAvatarUrl={() => Promise.resolve('')}
                getMentionWithQuery={noop}
                getUserProfileUrl={() => Promise.resolve('')}
                hasVersions
                isCurrentVersion
                mentionSelectorContacts={[]}
                onDelete={noop}
                onEdit={noop}
                onSelect={noop}
                onStatusChange={noop}
                item={{
                    ...annotation,
                    permissions: {
                        can_delete: true,
                        can_edit: true,
                        can_reply: true,
                        can_resolve: true,
                    },
                    annotationActivityLink: <AnnotationActivityLinkProvider {...annotationActivityLinkProviderProps} />,
                }}
            />
        </div>
    </IntlProvider>
);

export default {
    title: 'Elements/ContentSidebar/ActivityFeed/AnnotationActivity',
    component: AnnotationActivity,
};
