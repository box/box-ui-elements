import * as React from 'react';
import InlineNotice, { InlineNoticeType } from './InlineNotice';
import notes from './InlineNotice.stories.md';

export const defaultInlineNotice = () => (
    <>
        <InlineNotice title="Default">This is a default inline notice with title</InlineNotice>
        <InlineNotice>This is a default inline notice</InlineNotice>
    </>
);

export const successInlineNotice = () => (
    <>
        <InlineNotice title="Success" type={InlineNoticeType.SUCCESS}>
            This is a success inline notice with title
        </InlineNotice>
        <InlineNotice type={InlineNoticeType.SUCCESS}>This is a success inline notice</InlineNotice>
    </>
);

export const infoInlineNotice = () => (
    <>
        <InlineNotice title="Info" type={InlineNoticeType.INFO}>
            This is an info inline notice with title
        </InlineNotice>
        <InlineNotice type={InlineNoticeType.INFO}>This is an info inline notice</InlineNotice>
    </>
);

export const warningInlineNotice = () => (
    <>
        <InlineNotice title="Warning" type={InlineNoticeType.WARNING}>
            This is a warning inline notice with title
        </InlineNotice>
        <InlineNotice type={InlineNoticeType.WARNING}>This is a warning inline notice</InlineNotice>
    </>
);

export const errorInlineNotice = () => (
    <>
        <InlineNotice title="Error" type={InlineNoticeType.ERROR}>
            This is an error inline notice with title
        </InlineNotice>
        <InlineNotice type={InlineNoticeType.ERROR}>This is an error inline notice</InlineNotice>
    </>
);

export const genericInlineNotice = () => (
    <>
        <InlineNotice title="Generic" type={InlineNoticeType.GENERIC}>
            This is a generic inline notice with title
        </InlineNotice>
        <InlineNotice type={InlineNoticeType.GENERIC}>This is a generic inline notice</InlineNotice>
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
