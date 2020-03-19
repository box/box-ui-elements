// @flow
import * as React from 'react';
import BoxAnnotations from 'box-annotations';
import { button, text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import ContentPreview from '../ContentPreview';
import notes from './ContentPreview.notes.md';

// Used to re-render the story with props from the knobs
let key = 0;

const reRender = () => {
    key += 1;
};

export const Preview = () => {
    button('Refresh Story', reRender);

    return (
        <IntlProvider locale="en" key={key}>
            <ContentPreview
                features={global.FEATURES}
                fileId={text('File ID', global.FILE_ID)}
                hasHeader
                token={text('Access Token', global.TOKEN)}
            />
        </IntlProvider>
    );
};

export const PreviewWithAnnotations = () => {
    button('Refresh Story', reRender);

    return (
        <IntlProvider locale="en" key={key}>
            <ContentPreview
                boxAnnotations={new BoxAnnotations()}
                contentSidebarProps={{
                    detailsSidebarProps: {
                        hasAccessStats: true,
                        hasClassification: true,
                        hasNotices: true,
                        hasProperties: true,
                        hasRetentionPolicy: true,
                        hasVersions: true,
                    },
                    features: global.FEATURES,
                    hasActivityFeed: true,
                    hasMetadata: true,
                    hasSkills: true,
                    hasVersions: true,
                }}
                features={global.FEATURES}
                fileId={text('File ID', global.FILE_ID)}
                hasHeader
                showAnnotations
                token={text('Access Token', global.TOKEN)}
            />
        </IntlProvider>
    );
};

export const PreviewWithSidebar = () => {
    button('Refresh Story', reRender);

    return (
        <IntlProvider locale="en" key={key}>
            <ContentPreview
                contentSidebarProps={{
                    detailsSidebarProps: {
                        hasAccessStats: true,
                        hasClassification: true,
                        hasNotices: true,
                        hasProperties: true,
                        hasRetentionPolicy: true,
                        hasVersions: true,
                    },
                    features: global.FEATURES,
                    hasActivityFeed: true,
                    hasMetadata: true,
                    hasSkills: true,
                    hasVersions: true,
                }}
                features={global.FEATURES}
                fileId={text('File ID', global.FILE_ID)}
                hasHeader
                token={text('Access Token', global.TOKEN)}
            />
        </IntlProvider>
    );
};

export default {
    title: 'Elements|ContentPreview',
    component: ContentPreview,
    parameters: {
        notes,
    },
};
