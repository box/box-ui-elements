import * as React from 'react';
import InlineNotice, { InlineNoticeType } from './InlineNotice';

export const defaultInlineNotice = () => <InlineNotice>This is a default inline notice</InlineNotice>;

export const successInlineNotice = () => (
    <InlineNotice type={InlineNoticeType.SUCCESS}>This is a warning inline notice</InlineNotice>
);

export const infoInlineNotice = () => (
    <InlineNotice type={InlineNoticeType.INFO}>This is a warning inline notice</InlineNotice>
);

export const warningInlineNotice = () => (
    <InlineNotice type={InlineNoticeType.WARNING}>This is a warning inline notice</InlineNotice>
);

export const errorInlineNotice = () => (
    <InlineNotice type={InlineNoticeType.ERROR}>This is a warning inline notice</InlineNotice>
);
