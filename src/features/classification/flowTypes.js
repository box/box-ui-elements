// @flow
import type { MessageDescriptor } from 'react-intl';

import {
    LIST_ACCESS_LEVEL,
    MANAGED_USERS_ACCESS_LEVEL,
    SECURITY_CONTROLS_FORMAT,
    SHARED_LINK_ACCESS_LEVEL,
} from './constants';

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

type Controls = {
    app?: ApplicationRestriction,
    download?: DownloadRestrictions,
    externalCollab?: ExternalCollabRestriction,
    sharedLink?: SharedLinkRestrictions,
};

type ControlsFormat = $Values<typeof SECURITY_CONTROLS_FORMAT>;

type MessageItem = {
    message: MessageDescriptor,
    tooltipMessage?: MessageDescriptor,
};

export type {
    ApplicationRestriction,
    Controls,
    ControlsFormat,
    DownloadRestrictions,
    ExternalCollabRestriction,
    MessageItem,
    SharedLinkRestrictions,
};
