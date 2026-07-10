// @flow
import * as React from 'react';
import type { MessageDescriptor } from 'react-intl';

import {
    LIST_ACCESS_LEVEL,
    PREVIEW_ACCESS_LEVEL,
    MANAGED_USERS_ACCESS_LEVEL,
    SECURITY_CONTROLS_FORMAT,
    SHARED_LINK_ACCESS_LEVEL,
} from './constants';

type CitationType = {
    content: string | number,
    fileId: string | number,
    location: string | number,
    title?: string | number,
};

type AiClassificationReason = {
    answer?: string,
    modifiedAt?: string,
    citations?: CitationType[],
};

type DownloadManagedUserAccessLevel = $Values<typeof MANAGED_USERS_ACCESS_LEVEL> | null;

type SharedLinkAccessLevel = $Values<typeof SHARED_LINK_ACCESS_LEVEL> | null;

type ExternalCollabAccessLevel = $Values<typeof LIST_ACCESS_LEVEL> | null;

type ApplicationAccessLevel = $Values<typeof LIST_ACCESS_LEVEL> | null;

type AppPreviewAccessLevel = $Values<typeof PREVIEW_ACCESS_LEVEL> | null;

type App = {
    displayText: string,
};

type ExternalCollabRestriction = {
    accessLevel?: ExternalCollabAccessLevel,
};

type ApplicationRestriction = {
    accessLevel?: ApplicationAccessLevel,
    apps: Array<App>,
};

type AppPreviewRestriction = {
    accessLevel?: AppPreviewAccessLevel,
    apps: Array<App>,
};

type BoxSignRequestRestriction = {
    enabled?: boolean,
};

type DownloadRestriction = {
    restrictExternalUsers?: boolean,
    restrictManagedUsers?: DownloadManagedUserAccessLevel,
};

type DownloadRestrictions = {
    desktop?: DownloadRestriction,
    mobile?: DownloadRestriction,
    web?: DownloadRestriction,
};

type SharedLinkRestrictions = {
    accessLevel: SharedLinkAccessLevel,
};

type WatermarkControl = {
    enabled?: boolean,
};

type SharedLinkAutoExpirationRestriction = {};

type Controls = {
    app?: ApplicationRestriction,
    appPreview?: AppPreviewRestriction,
    boxSignRequest?: BoxSignRequestRestriction,
    download?: DownloadRestrictions,
    externalCollab?: ExternalCollabRestriction,
    sharedLink?: SharedLinkRestrictions,
    sharedLinkAutoExpiration?: SharedLinkAutoExpirationRestriction,
    watermark?: WatermarkControl,
};

type ControlsFormat = $Values<typeof SECURITY_CONTROLS_FORMAT>;

type MessageItem = {
    message: MessageDescriptor | React.Node,
    tooltipMessage?: MessageDescriptor,
};

export type {
    AiClassificationReason,
    ApplicationRestriction,
    AppPreviewRestriction,
    Controls,
    ControlsFormat,
    DownloadRestrictions,
    ExternalCollabRestriction,
    MessageItem,
    SharedLinkRestrictions,
    SharedLinkAutoExpirationRestriction,
};
