import * as React from 'react';
import InlineNotice, { InlineNoticeType } from './InlineNotice';
import notes from './InlineNotice.stories.md';

export const defaultInlineNotice = () => (
    <>
        <InlineNotice>This is a default inline notice</InlineNotice>
        <InlineNotice title="Default">This is a default inline notice with title</InlineNotice>
    </>
);

export const successInlineNotice = () => (
    <>
        <InlineNotice type={InlineNoticeType.SUCCESS}>This is a success inline notice</InlineNotice>
        <InlineNotice title="Success" type={InlineNoticeType.SUCCESS}>
            This is a success inline notice with title
        </InlineNotice>
    </>
);

export const infoInlineNotice = () => (
    <>
        <InlineNotice type={InlineNoticeType.INFO}>This is an info inline notice</InlineNotice>
        <InlineNotice title="Info" type={InlineNoticeType.INFO}>
            This is an info inline notice with title
        </InlineNotice>
    </>
);

export const warningInlineNotice = () => (
    <>
        <InlineNotice type={InlineNoticeType.WARNING}>This is a warning inline notice</InlineNotice>
        <InlineNotice title="Warning" type={InlineNoticeType.WARNING}>
            This is a warning inline notice with title
        </InlineNotice>
    </>
);

export const errorInlineNotice = () => (
    <>
        <InlineNotice type={InlineNoticeType.ERROR}>This is an error inline notice</InlineNotice>
        <InlineNotice title="Error" type={InlineNoticeType.ERROR}>
            This is an error inline notice with title
        </InlineNotice>
    </>
);

export const genericInlineNotice = () => (
    <>
        <InlineNotice type={InlineNoticeType.GENERIC}>This is a generic inline notice</InlineNotice>
        <InlineNotice title="Generic" type={InlineNoticeType.GENERIC}>
            This is a generic inline notice with title
        </InlineNotice>
    </>
);

export const allInlineNotices = () => (
    <>
        {defaultInlineNotice()}
        <br />
        {successInlineNotice()}
        <br />
        {infoInlineNotice()}
        <br />
        {warningInlineNotice()}
        <br />
        {errorInlineNotice()}
        <br />
        {genericInlineNotice()}
    </>
);

export default {
    title: 'Components|InlineNotice',
    component: InlineNotice,
    parameters: {
        notes,
    },
};
