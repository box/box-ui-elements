import * as React from 'react';
import { IntlProvider } from 'react-intl';
import ContentUploader from '../ContentUploader';
import notes from './ContentUploader.notes.md';

export const Uploader = () => (
    <IntlProvider locale="en">
        <ContentUploader features={global.FEATURES} rootFolderId={global.FOLDER_ID} token={global.TOKEN} />
    </IntlProvider>
);

export default {
    title: 'Elements|ContentUploader',
    component: ContentUploader,
    parameters: {
        notes,
    },
};
