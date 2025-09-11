// @flow
import * as React from 'react';
import type { MessageDescriptor } from 'react-intl';

import {
    LIST_ACCESS_LEVEL,
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
    answer: string,
    modifiedAt?: string,
    citations?: CitationType[],
};

type DownloadManagedUserAccessLevel = $Values<typeof MANAGED_USERS_ACCESS_LEVEL> | null;

type SharedLinkAccessLevel = $Values<typeof SHARED_LINK_ACCESS_LEVEL> | null;

type ExternalCollabAccessLevel = $Values<typeof LIST_ACCESS_LEVEL> | null;

type ApplicationAccessLevel = $Values<typeof LIST_ACCESS_LEVEL> | null;

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

type Controls = {
    app?: ApplicationRestriction,
    boxSignRequest?: BoxSignRequestRestriction,
    download?: DownloadRestrictions,
    externalCollab?: ExternalCollabRestriction,
    sharedLink?: SharedLinkRestrictions,
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
    Controls,
    ControlsFormat,
    DownloadRestrictions,
    ExternalCollabRestriction,
    MessageItem,
    SharedLinkRestrictions,
};
