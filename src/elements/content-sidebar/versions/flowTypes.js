// @flow
import type { AdditionalVersionInfo } from '../../common/flowTypes';

export type VersionActionCallback = (versionId: string) => void;
export type VersionChangeCallback = (version: ?BoxItemVersion, additionalVersionInfo: ?AdditionalVersionInfo) => void;
