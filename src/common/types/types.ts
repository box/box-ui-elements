import type { AxiosError } from 'axios';
import type { ElementOrigin } from '../../elements/common/flowTypes';

export interface ElementsXhrError extends AxiosError {
    code?: string;
    context_info?: Record<string, unknown>;
    message?: string;
    status?: number;
    type?: 'error';
}

export interface ElementsError {
    code: string;
    context_info: Record<string, unknown>;
    message: string;
    origin: ElementOrigin;
    type: 'error';
}

export interface ErrorContextProps {
    onError: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Record<string, unknown>,
        origin?: ElementOrigin,
    ) => void;
}

export type ElementsErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Record<string, unknown>) => void;

export interface WithLoggerProps {
    logger: {
        onPreviewMetric: (data: Record<string, unknown>) => void;
        onReadyMetric: (data: { endMarkName: string; startMarkName?: string }) => void;
    };
}

export interface BoxItem {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    size?: number;
    created_at?: string;
    modified_at?: string;
    file_version?: {
        id: string;
        type: string;
        sha1?: string;
    };
    permissions?: {
        can_delete?: boolean;
        can_download?: boolean;
        can_edit?: boolean;
        can_preview?: boolean;
        can_share?: boolean;
        can_rename?: boolean;
    };
    shared_link?: {
        url: string;
        download_url?: string;
        vanity_url?: string;
        is_password_enabled?: boolean;
        access?: string;
        permissions?: {
            can_download?: boolean;
            can_preview?: boolean;
        };
    };
}
