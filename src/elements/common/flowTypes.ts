import type { MessageDescriptor } from 'react-intl';
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

type ViewMode = typeof VIEW_MODE_GRID | typeof VIEW_MODE_LIST;

interface ErrorType {
    code: string;
    details?: Record<string, unknown>;
    displayMessage?: string;
    message?: string;
}

type GetAvatarUrlCallback = (id: string) => Promise<string | null>;

type GetProfileUrlCallback = (id: string) => Promise<string>;

interface Page {
    type: 'page';
    value: number;
}

interface AdditionalVersionInfo {
    currentVersionId?: string | null;
    updateVersionToCurrent: () => void;
}

type ElementOrigin =
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

type Alignment = 'left' | 'right';

interface ModalOptions {
    buttonClassName: string;
    buttonLabel: string;
    modalClassName: string;
    overlayClassName: string;
}

interface MaskError {
    errorHeader: MessageDescriptor;
    errorSubHeader?: MessageDescriptor;
}

interface InlineError {
    content: MessageDescriptor;
    title: MessageDescriptor;
}

interface Errors {
    error?: MessageDescriptor;
    inlineError?: InlineError;
    maskError?: MaskError;
}

export type {
    AdditionalVersionInfo,
    Alignment,
    ElementOrigin,
    ErrorType,
    Errors,
    GetAvatarUrlCallback,
    GetProfileUrlCallback,
    ModalOptions,
    Page,
    ViewMode,
};
