/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import API from '../../api';
import { type WithLoggerProps } from '../../common/types/logging';
import './MetadataSidebarRedesign.scss';
export interface ExternalProps {
    isFeatureEnabled: boolean;
    getStructuredTextRep?: (fileId: string, accessToken: string) => Promise<string>;
}
interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileExtension?: string;
    fileId: string;
    filteredTemplateIds?: string[];
    hasSidebarInitialized?: boolean;
}
export interface ErrorContextProps {
    onError: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
}
export interface SuccessContextProps {
    onSuccess: (code: string, showNotification: boolean) => void;
}
export interface MetadataSidebarRedesignProps extends PropsWithoutContext, ErrorContextProps, SuccessContextProps, WithLoggerProps, RouteComponentProps {
    api: API;
    createSessionRequest?: (payload: Record<string, unknown>, fileId: string) => Promise<{
        metadata: {
            is_large_file: boolean;
        };
    }>;
}
declare function MetadataSidebarRedesign({ api, elementId, fileExtension, fileId, filteredTemplateIds, history, onError, onSuccess, isFeatureEnabled, createSessionRequest, getStructuredTextRep, }: MetadataSidebarRedesignProps): React.JSX.Element;
export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
declare const _default: any;
export default _default;
