/**
 * @flow
 * @file Versions list backed by the shared `@box/version-history` component.
 *
 * Renders in place of `VersionsMenu` when the `versions.versionExperience.enabled` feature is on.
 * Data fetching, permissions and navigation stay here in the host; the shared component only renders.
 */
import * as React from 'react';
import { Route } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { VersionHistory } from '@box/version-history';
import getVersionEntries from './getVersionEntries';
import messages from './messages';
import type { BoxItemVersion } from '../../../common/types/core';
import type { InternalSidebarNavigation } from '../../common/types/SidebarNavigation';
import type { VersionActionCallback } from './flowTypes';

type Props = {
    isArchived?: boolean,
    isWatermarked?: boolean,
    internalSidebarNavigation?: InternalSidebarNavigation,
    /** When provided, Compare is offered on previewable, non-current versions. */
    onCompare?: VersionActionCallback,
    onDelete?: VersionActionCallback,
    onDownload?: VersionActionCallback,
    onPreview?: VersionActionCallback,
    onPromote?: VersionActionCallback,
    onRestore?: VersionActionCallback,
    routerDisabled?: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

type ListProps = Props & { selectedVersionId?: ?string };

const VersionsExperienceList = ({
    isArchived,
    isWatermarked,
    onCompare,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    onRestore,
    selectedVersionId,
    versionCount,
    versionLimit,
    versions,
}: ListProps) => {
    const { formatMessage } = useIntl();
    const authorFallbackName = formatMessage(messages.versionUserUnknown);
    const fileRequestName = formatMessage(messages.fileRequestDisplayName);

    const entries = React.useMemo(
        () =>
            getVersionEntries({
                authorFallbackName,
                canCompare: !!onCompare,
                fileRequestName,
                isArchived,
                isWatermarked,
                versionCount,
                versionLimit,
                versions,
            }),
        [
            authorFallbackName,
            fileRequestName,
            isArchived,
            isWatermarked,
            onCompare,
            versionCount,
            versionLimit,
            versions,
        ],
    );

    return (
        <VersionHistory.List versions={entries}>
            {row => (
                <VersionHistory.Item
                    onCompare={onCompare}
                    onDelete={onDelete}
                    onDownload={onDownload}
                    onPromote={onPromote}
                    onRestore={onRestore}
                    onSelect={onPreview}
                    selectedVersionId={selectedVersionId}
                    versions={row}
                />
            )}
        </VersionHistory.List>
    );
};

const VersionsExperienceMenu = ({ internalSidebarNavigation, routerDisabled = false, ...rest }: Props) => {
    if (routerDisabled) {
        return <VersionsExperienceList {...rest} selectedVersionId={internalSidebarNavigation?.versionId} />;
    }

    return (
        <Route
            render={({ match }) => <VersionsExperienceList {...rest} selectedVersionId={match.params.versionId} />}
        />
    );
};

export default VersionsExperienceMenu;
