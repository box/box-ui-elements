import { MessageDescriptor } from 'react-intl';
import {
    VIEW_MODE_GRID,
    VIEW_MODE_LIST,
    ORIGIN_CONTENT_SIDEBAR,
    ORIGIN_PREVIEW,
    ORIGIN_CONTENT_PREVIEW,
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_BOXAI_SIDEBAR,
    ORIGIN_ACTIVITY_SIDEBAR,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    ORIGIN_OPEN_WITH,
} from '../../constants';

export type ViewMode = typeof VIEW_MODE_GRID | typeof VIEW_MODE_LIST;

export type ErrorType = {
    code: string;
    details?: Object;
    displayMessage?: string;
    message?: string;
};

export type GetAvatarUrlCallback = (id: string) => Promise<string | null>;

export type GetProfileUrlCallback = (id: string) => Promise<string>;

export type Page = {
    type: 'page';
    value: number;
};

export type AdditionalVersionInfo = {
    currentVersionId?: string | null;
    updateVersionToCurrent: () => void;
};

export type ElementOrigin =
    | typeof ORIGIN_CONTENT_SIDEBAR
    | typeof ORIGIN_CONTENT_PREVIEW
    | typeof ORIGIN_PREVIEW
    | typeof ORIGIN_DETAILS_SIDEBAR
    | typeof ORIGIN_BOXAI_SIDEBAR
    | typeof ORIGIN_ACTIVITY_SIDEBAR
    | typeof ORIGIN_SKILLS_SIDEBAR
    | typeof ORIGIN_METADATA_SIDEBAR
    | typeof ORIGIN_METADATA_SIDEBAR_REDESIGN
    | typeof ORIGIN_OPEN_WITH;

export type Alignment = 'left' | 'right';

export type ModalOptions = {
    buttonClassName: string;
    buttonLabel: string;
    modalClassName: string;
    overlayClassName: string;
};

export type MaskError = {
    errorHeader: MessageDescriptor;
    errorSubHeader?: MessageDescriptor;
};

export type InlineError = {
    content: MessageDescriptor;
    title: MessageDescriptor;
};

export type Errors = {
    error?: MessageDescriptor;
    inlineError?: InlineError;
    maskError?: MaskError;
};
