/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import { generatePath } from '../../common/routing/utils';
import withRouter from '../../common/routing/withRouter';
import { withFeatureConsumer, isFeatureEnabled } from '../../common/feature-checking';
import { FIELD_METADATA_ARCHIVE } from '../../../constants';
import messages from './messages';
import openUrlInsideIframe from '../../../utils/iframe';
import StaticVersionsSidebar from './StaticVersionSidebar';
import VersionsSidebar from './VersionsSidebar';
import VersionsSidebarAPI from './VersionsSidebarAPI';
import { withAPIContext } from '../../common/api-context';

/**
 * @typedef {Object} Props
 * @property {API} api
 * @property {Object} features
 * @property {string} fileId
 * @property {boolean} [hasSidebarInitialized]
 * @property {Object} history
 * @property {Object} match
 * @property {Function} onLoad
 * @property {Function} [onUpgradeClick]
 * @property {Function} onVersionChange
 * @property {Function} onVersionDelete
 * @property {Function} onVersionDownload
 * @property {Function} onVersionPreview
 * @property {Function} onVersionPromote
 * @property {Function} onVersionRestore
 * @property {string} parentName
 * @property {string} [versionId]
 */

/**
 * @typedef {Object} State
 * @property {Object} [error]
 * @property {boolean} isArchived
 * @property {boolean} isLoading
 * @property {boolean} isWatermarked
 * @property {number} versionCount
 * @property {number} versionLimit
 * @property {Array<Object>} versions
 */

/** @extends {React.Component} */
class VersionsSidebarContainer extends React.Component {
    static defaultProps = {
        onLoad: noop,
        onVersionChange: noop,
        onVersionDelete: noop,
        onVersionDownload: noop,
        onVersionPreview: noop,
        onVersionPromote: noop,
        onVersionRestore: noop,
        parentName: '',
    };

    api: VersionsSidebarAPI;

    props: Props;

    state: State = {
        isArchived: false,
        isLoading: true,
        isWatermarked: false,
        versionCount: Infinity,
        versionLimit: Infinity,
        versions: [],
    };

    window: any = window;

    componentDidMount() {
        const { onLoad } = this.props;
        this.initialize();
        this.fetchData().then(() => {
            onLoad({ component: 'preview', feature: 'versions' });
        });
    }

    componentDidUpdate({ fileId: prevFileId, versionId: prevVersionId }: Props) {
        const { fileId, versionId } = this.props;

        if (fileId !== prevFileId) {
            this.refresh();
        }

        if (versionId !== prevVersionId) {
            this.verifyVersion();
        }
    }

    handleActionDelete = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.api
            .deleteVersion(this.findVersion(versionId))
            .then(() => this.api.fetchVersion(versionId))
            .then(this.handleDeleteSuccess)
            .then(() => this.props.onVersionDelete(versionId))
            .catch(() => this.handleActionError(messages.versionActionDeleteError));
    };

    handleActionDownload = (versionId: string): Promise<void> => {
        return this.api
            .fetchDownloadUrl(this.findVersion(versionId))
            .then(openUrlInsideIframe)
            .then(() => this.props.onVersionDownload(versionId))
            .catch(() => this.handleActionError(messages.versionActionDownloadError));
    };

    handleActionPreview = (versionId: string): void => {
        this.updateVersion(versionId);
        this.props.onVersionPreview(versionId);
    };

    handleActionPromote = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.api
            .promoteVersion(this.findVersion(versionId))
            .then(this.api.fetchData)
            .then(this.handleFetchSuccess)
            .then(this.handlePromoteSuccess)
            .then(() => this.props.onVersionPromote(versionId))
            .catch(() => this.handleActionError(messages.versionActionPromoteError));
    };

    handleActionRestore = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.api
            .restoreVersion(this.findVersion(versionId))
            .then(() => this.api.fetchVersion(versionId))
            .then(this.handleRestoreSuccess)
            .then(() => this.props.onVersionRestore(versionId))
            .catch(() => this.handleActionError(messages.versionActionRestoreError));
    };

    handleActionError = (message: MessageDescriptor): void => {
        this.setState({
            error: message,
            isLoading: false,
        });
    };

    handleDeleteSuccess = (data: BoxItemVersion): void => {
        const { versionId: selectedVersionId } = this.props;
        const { id: versionId } = data;

        this.mergeResponse(data);

        // Bump the user to the current version if they deleted their selected version
        if (versionId === selectedVersionId) {
            this.updateVersionToCurrent();
        }
    };

    handleRestoreSuccess = (data: BoxItemVersion): void => {
        this.mergeResponse(data);
    };

    handleFetchError = (): void => {
        this.setState({
            error: messages.versionFetchError,
            isArchived: false,
            isLoading: false,
            isWatermarked: false,
            versionCount: 0,
            versions: [],
        });
    };

    handleFetchSuccess = ([fileResponse, versionsResponse]: [BoxItem, FileVersions]): [BoxItem, FileVersions] => {
        const { api } = this.props;
        const { version_limit } = fileResponse;
        const isArchived = !!getProp(fileResponse, FIELD_METADATA_ARCHIVE);
        const isWatermarked = getProp(fileResponse, 'watermark_info.is_watermarked', false);
        const versionLimit = version_limit !== null && version_limit !== undefined ? version_limit : Infinity;
        const versionsWithPermissions = api.getVersionsAPI(false).addPermissions(versionsResponse, fileResponse) || {};
        const { entries: versions, total_count: versionCount } = versionsWithPermissions;

        this.setState(
            {
                error: undefined,
                isArchived,
                isLoading: false,
                isWatermarked,
                versionCount,
                versionLimit,
                versions: this.sortVersions(versions),
            },
            this.verifyVersion,
        );

        return [fileResponse, versionsResponse];
    };

    handlePromoteSuccess = ([file]: [BoxItem, FileVersions]): void => {
        const { file_version: fileVersion } = file;

        if (fileVersion) {
            this.updateVersion(fileVersion.id);
        }
    };

    initialize = (): void => {
        const { api, features, fileId }: Props = this.props;
        const isArchiveFeatureEnabled = isFeatureEnabled(features, 'contentSidebar.archive.enabled');

        this.api = new VersionsSidebarAPI({ api, fileId, isArchiveFeatureEnabled });
    };

    fetchData = (): Promise<?[BoxItem, FileVersions]> => {
        return this.api.fetchData().then(this.handleFetchSuccess).catch(this.handleFetchError);
    };

    findVersion = (versionId: ?string): ?BoxItemVersion => {
        const { versions } = this.state;

        return versions.find(version => version.id === versionId);
    };

    getCurrentVersionId = (): ?string => {
        const { versions } = this.state;
        return versions[0] ? versions[0].id : null;
    };

    mergeVersions = (newVersion: BoxItemVersion): Array<BoxItemVersion> => {
        const { versions } = this.state;
        const newVersionId = newVersion ? newVersion.id : '';
        return versions.map(version => (version.id === newVersionId ? merge({ ...version }, newVersion) : version));
    };

    mergeResponse = (data: BoxItemVersion): void => {
        const newVersions = this.mergeVersions(data);

        this.setState({
            error: undefined,
            isLoading: false,
            versions: newVersions,
        });
    };

    refresh(): void {
        this.initialize();
        this.setState({ isLoading: true }, this.fetchData);
    }

    sortVersions(versions?: Array<BoxItemVersion> = []): Array<BoxItemVersion> {
        return [...versions].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    }

    updateVersion = (versionId?: ?string): void => {
        const { history, match } = this.props;
        return history.push(generatePath(match.path, { ...match.params, versionId }));
    };

    updateVersionToCurrent = (): void => {
        this.updateVersion(this.getCurrentVersionId());
    };

    verifyVersion = () => {
        const { onVersionChange, versionId } = this.props;
        const selectedVersion = this.findVersion(versionId);

        if (selectedVersion) {
            onVersionChange(selectedVersion, {
                currentVersionId: this.getCurrentVersionId(),
                updateVersionToCurrent: this.updateVersionToCurrent,
            });
        } else {
            this.updateVersionToCurrent();
        }
    };

    render() {
        const { fileId, parentName, onUpgradeClick } = this.props;

        if (onUpgradeClick) {
            return <StaticVersionsSidebar onUpgradeClick={onUpgradeClick} parentName={parentName} {...this.state} />;
        }

        return (
            <VersionsSidebar
                fileId={fileId}
                onDelete={this.handleActionDelete}
                onDownload={this.handleActionDownload}
                onPreview={this.handleActionPreview}
                onPromote={this.handleActionPromote}
                onRestore={this.handleActionRestore}
                parentName={parentName}
                {...this.state}
            />
        );
    }
}

export type VersionsSidebarProps = Props;
export { VersionsSidebarContainer as VersionsSidebarContainerComponent };
export default flow([withRouter, withAPIContext, withFeatureConsumer])(VersionsSidebarContainer);
