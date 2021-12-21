// @flow
import type { AdditionalVersionInfo } from '../../common/flowTypes';
import type { BoxItemVersion } from '../../../common/types/core';

export type VersionActionCallback = (versionId: string) => void;
export type VersionChangeCallback = (version: ?BoxItemVersion, additionalVersionInfo: ?AdditionalVersionInfo) => void;
/** Function for opening the Upgrade Plan Modal */
export type openUpgradePlanModal = () => void;
