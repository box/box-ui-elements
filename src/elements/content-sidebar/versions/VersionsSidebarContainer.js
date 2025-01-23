/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import type { MessageDescriptor } from 'react-intl';
import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import type { BoxItem, BoxItemVersion } from '../../../common/types/core';
import type { FileVersions } from '../../../common/types/api';
import type { FeatureConfig } from '../../common/feature-checking';
import type { RouterHistory, RouterMatch } from '../../common/routing/flowTypes';
import type API from '../../../api';
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

type Props = {|
    api: API,
    features: FeatureConfig,
    fileId: string,
    hasSidebarInitialized?: boolean,
    history: RouterHistory,
    match: RouterMatch,
    onLoad: Function,
    onUpgradeClick?: Function,
    onVersionChange: Function,
    onVersionDelete: Function,
    onVersionDownload: Function,
    onVersionPreview: Function,
    onVersionPromote: Function,
    onVersionRestore: Function,
    parentName: string,
    versionId?: string,
|};

type State = {|
    error?: MessageDescriptor,
    isArchived: boolean,
    isLoading: boolean,
    isWatermarked: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
|};
class VersionsSidebarContainer extends React.Component<Props, State> {
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

    state = {
        isArchived: false,
        isLoading: true,
        isWatermarked: false,
        versionCount: Infinity,
        versionLimit: Infinity,
        versions: [],
    };

    componentDidMount() {
        const { onLoad } = this.props;
        this.initialize();
        this.fetchData().then(() => {
            onLoad({ component: 'preview', feature: 'versions' });
        });
    }

    componentDidUpdate({ fileId: prevFileId, versionId: prevVersionId }) {
        const { fileId, versionId } = this.props;

        if (fileId !== prevFileId) {
            this.refresh();
        }

        if (versionId !== prevVersionId) {
            this.verifyVersion();
        }
    }

    handleActionDelete = versionId => {
        this.setState({ isLoading: true });

        return this.api
            .deleteVersion(this.findVersion(versionId))
            .then(() => this.api.fetchVersion(versionId))
            .then(this.handleDeleteSuccess)
            .then(() => this.props.onVersionDelete(versionId))
            .catch(() => this.handleActionError(messages.versionActionDeleteError));
    };

    handleActionDownload = versionId => {
        return this.api
            .fetchDownloadUrl(this.findVersion(versionId))
            .then(openUrlInsideIframe)
            .then(() => this.props.onVersionDownload(versionId))
            .catch(() => this.handleActionError(messages.versionActionDownloadError));
    };

    handleActionPreview = versionId => {
        this.updateVersion(versionId);
        this.props.onVersionPreview(versionId);
    };

    handleActionPromote = versionId => {
        this.setState({ isLoading: true });

        return this.api
            .promoteVersion(this.findVersion(versionId))
            .then(this.api.fetchData)
            .then(this.handleFetchSuccess)
            .then(this.handlePromoteSuccess)
            .then(() => this.props.onVersionPromote(versionId))
            .catch(() => this.handleActionError(messages.versionActionPromoteError));
    };

    handleActionRestore = versionId => {
        this.setState({ isLoading: true });

        return this.api
            .restoreVersion(this.findVersion(versionId))
            .then(() => this.api.fetchVersion(versionId))
            .then(this.handleRestoreSuccess)
            .then(() => this.props.onVersionRestore(versionId))
            .catch(() => this.handleActionError(messages.versionActionRestoreError));
    };

    handleActionError = message => {
        this.setState({
            error: message,
            isLoading: false,
        });
    };

    handleDeleteSuccess = data => {
        const { versionId: selectedVersionId } = this.props;
        const { id: versionId } = data;

        this.mergeResponse(data);

        // Bump the user to the current version if they deleted their selected version
        if (versionId === selectedVersionId) {
            this.updateVersionToCurrent();
        }
    };

    handleRestoreSuccess = data => {
        this.mergeResponse(data);
    };

    handleFetchError = () => {
        this.setState({
            error: messages.versionFetchError,
            isArchived: false,
            isLoading: false,
            isWatermarked: false,
            versionCount: 0,
            versions: [],
        });
    };

    handleFetchSuccess = (responses: [BoxItem, FileVersions]) => {
        const [fileResponse, versionsResponse] = responses;
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

    handlePromoteSuccess = ([file]) => {
        const { file_version: fileVersion } = file;

        if (fileVersion) {
            this.updateVersion(fileVersion.id);
        }
    };

    initialize = () => {
        const { api, features, fileId } = this.props;
        const isArchiveFeatureEnabled = isFeatureEnabled(features, 'contentSidebar.archive.enabled');

        this.api = new VersionsSidebarAPI({ api, fileId, isArchiveFeatureEnabled });
    };

    fetchData = () => {
        return this.api.fetchData().then(this.handleFetchSuccess).catch(this.handleFetchError);
    };

    findVersion = versionId => {
        const { versions } = this.state;

        return versions.find(version => version.id === versionId);
    };

    getCurrentVersionId = () => {
        const { versions } = this.state;
        return versions[0] ? versions[0].id : null;
    };

    mergeVersions = newVersion => {
        const { versions } = this.state;
        const newVersionId = newVersion ? newVersion.id : '';
        return versions.map(version => (version.id === newVersionId ? merge({ ...version }, newVersion) : version));
    };

    mergeResponse = data => {
        const newVersions = this.mergeVersions(data);

        this.setState({
            error: undefined,
            isLoading: false,
            versions: newVersions,
        });
    };

    refresh = () => {
        this.initialize();
        this.setState({ isLoading: true }, this.fetchData);
    };

    sortVersions = (versions = []) => {
        return [...versions].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    };

    updateVersion = versionId => {
        const { history, match } = this.props;
        return history.push(generatePath(match.path, { ...match.params, versionId }));
    };

    updateVersionToCurrent = () => {
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
