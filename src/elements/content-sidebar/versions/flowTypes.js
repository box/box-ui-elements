// @flow
import type { AdditionalVersionInfo } from '../../common/flowTypes';
import type { BoxItemVersion } from '../../../common/types/core';

export type VersionActionCallback = (versionId: string) => void;
export type ComparisonVersionActions = {
    delete: (versionId: string) => Promise<void>,
    download: (versionId: string) => Promise<void>,
    promote: (versionId: string) => Promise<void>,
    isArchived: boolean,
    isWatermarked: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};
export type RegisterVersionActionsCallback = (actions: ComparisonVersionActions | null) => void;
export type ComparisonBannerVersionActions = {
    onDelete?: () => Promise<void>,
    onDownload?: () => Promise<void>,
    onMakeCurrent?: () => Promise<void>,
    ...
};
export type ComparisonBannerProps = {
    ...ComparisonBannerVersionActions,
    onOpenFullPreview?: () => mixed,
    ...
};
export type VersionChangeCallback = (version: ?BoxItemVersion, additionalVersionInfo: ?AdditionalVersionInfo) => void;
export type SidebarLoadCallback = (data: Object) => void;
