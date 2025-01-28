/**
 * @file Details sidebar component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarClassification from './SidebarClassification';
import SidebarContentInsights from './SidebarContentInsights';
import SidebarContent from './SidebarContent';
import SidebarFileProperties from './SidebarFileProperties';
import SidebarNotices from './SidebarNotices';
import SidebarSection from './SidebarSection';
import SidebarVersions from './SidebarVersions';
import { EVENT_JS_READY } from '../common/logger/constants';
import { getBadItemError } from '../../utils/error';
import { isFeatureEnabled, withFeatureConsumer, FeatureConfig } from '../common/feature-checking';
import { mark } from '../../utils/performance';
import { SECTION_TARGETS } from '../common/interactionTargets';
import { SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE } from '../../utils/fields';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { HTTP_STATUS_CODE_FORBIDDEN, ORIGIN_DETAILS_SIDEBAR, SIDEBAR_VIEW_DETAILS } from '../../constants';
import { ClassificationInfo, FileAccessStats } from './flowTypes';
import { ElementsErrorCallback, ElementsXhrError } from '../../common/types/api';
import { ElementOrigin } from '../common/flowTypes';
import { BoxItem } from '../../common/types/core';
import './DetailsSidebar.scss';

interface ExternalProps {
    // Required props
    elementId: string;
    fileId: string;

    // Error handling props from ErrorContextProps
    onError: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: { e?: ElementsXhrError; isErrorDisplayed?: boolean },
        origin?: ElementOrigin,
    ) => void;

    // Logger props from WithLoggerProps
    logger: {
        onPreviewMetric: (data: { [key: string]: string | number | boolean }) => void;
        onReadyMetric: (data: { endMarkName: string; startMarkName?: string }) => void;
    };

    // Optional boolean props with default false
    hasNotices?: boolean;
    hasProperties?: boolean;
    hasAccessStats?: boolean;
    hasClassification?: boolean;
    hasRetentionPolicy?: boolean;
    hasVersions?: boolean;

    // Optional boolean props without defaults
    hasContentInsights?: boolean;
    hasSidebarInitialized?: boolean;

    // Simple callback props
    onClassificationClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
    onContentInsightsClick?: () => void;
    fetchContentInsights?: () => void;

    // Complex types needing verification
    classification?: ClassificationInfo;
    // ContentInsights with more specific types
    contentInsights?: {
        error?: ElementsXhrError;
        graphData: {
            date: string;
            value: number;
        }[];
        isLoading: boolean;
        previousPeriodCount: number;
        totalCount: number;
    };
    // Function props with specific signatures based on component usage
    onAccessStatsClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
    onRetentionPolicyExtendClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
    onVersionHistoryClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
    retentionPolicy?: {
        dispositionTime?: number;
        openModal?: (e: React.SyntheticEvent<HTMLButtonElement>) => void;
        policyType?: string;
        retentionPolicyDescription?: string;
    };
}
interface Props extends ExternalProps {
    /** API instance with file and stats methods */
    api: {
        getFileAPI: () => {
            getFile: (
                fileId: string,
                successCallback: (file: BoxItem) => void,
                errorCallback: ElementsErrorCallback,
                options: { fields: string[] },
            ) => void;
            setFileDescription: (
                file: BoxItem,
                newDescription: string,
                successCallback: (file: BoxItem) => void,
                errorCallback: (file: BoxItem) => void,
            ) => void;
        };
        getFileAccessStatsAPI: (shouldDestroy: boolean) => {
            getFileAccessStats: (
                fileId: string,
                successCallback: (stats: FileAccessStats) => void,
                errorCallback: ElementsErrorCallback,
            ) => void;
        };
    };
    /** Feature flags configuration */
    features: FeatureConfig;
}

interface State {
    isLoadingAccessStats: boolean;
    accessStats?: FileAccessStats;
    accessStatsError?: {
        error?: string;
        maskError?: {
            errorHeader: string;
            errorSubHeader: string;
        };
    };
    file?: BoxItem;
    fileError?: {
        inlineError?: {
            title: string;
            content: string;
        };
        maskError?: {
            errorHeader: string;
            errorSubHeader: string;
        };
        error?: string;
    };
}

const MARK_NAME_JS_READY = `${ORIGIN_DETAILS_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class DetailsSidebar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoadingAccessStats: false,
        };
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    componentDidMount() {
        const { hasAccessStats, hasContentInsights, fetchContentInsights } = this.props;

        this.fetchFile();
        if (hasAccessStats) {
            this.fetchAccessStats();
        }

        if (hasContentInsights && fetchContentInsights) {
            fetchContentInsights();
        }
    }

    componentDidUpdate({ hasAccessStats: prevHasAccessStats, hasContentInsights: prevHasContentInsights }: Props) {
        const { hasAccessStats, hasContentInsights, fetchContentInsights } = this.props;
        // Component visibility props such as hasAccessStats can sometimes be flipped after an async call
        const hasAccessStatsChanged = prevHasAccessStats !== hasAccessStats;
        const hasContentInsightsChanged = prevHasContentInsights !== hasContentInsights;

        if (hasAccessStatsChanged) {
            if (hasAccessStats) {
                this.fetchAccessStats();
            } else {
                this.setState({
                    isLoadingAccessStats: false,
                    accessStats: undefined,
                    accessStatsError: undefined,
                });
            }
        }

        if (hasContentInsightsChanged && hasContentInsights && fetchContentInsights) {
            fetchContentInsights();
        }
    }

    /**
     * File description update callback
     *
     * @private
     * @param {BoxItem} file - Updated file object
     * @return {void}
     */
    descriptionChangeSuccessCallback = (file: BoxItem) => {
        this.setState({ file, fileError: undefined });
    };

    /**
     * Fetches a file with the fields needed for details sidebar
     *
     * @param successCallback - the success callback
     * @param errorCallback - the error callback
     */
    fetchFile(successCallback = this.fetchFileSuccessCallback, errorCallback = this.fetchFileErrorCallback) {
        const { api, features, fileId }: Props = this.props;
        const archiveEnabled = isFeatureEnabled(features, 'contentSidebar.archive.enabled');

        // TODO: replace this with DETAILS_SIDEBAR_FIELDS_TO_FETCH as we do not need all the sidebar fields
        const fields = archiveEnabled ? SIDEBAR_FIELDS_TO_FETCH_ARCHIVE : SIDEBAR_FIELDS_TO_FETCH;

        api.getFileAPI().getFile(fileId, successCallback, errorCallback, {
            fields,
        });
    }

    /**
     * Handles a successful file fetch
     *
     * @param {Object} file - the box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem) => {
        this.setState({
            file,
            fileError: undefined,
        });
    };

    /**
     * Handles a failed file fetch
     *
     * @private
     * @param e - API error
     * @param code - error code
     */
    fetchFileErrorCallback = (e: ElementsXhrError, code: string) => {
        // TODO: handle the error properly (probably with maskError) once files call split out
        this.setState({
            file: undefined,
        });

        this.props.onError(e, code, {
            e,
        });
    };

    /**
     * Handles a failed file description update
     *
     * @private
     * @param {BoxItem} file - Original file object
     * @return {void}
     */
    descriptionChangeErrorCallback = (file: BoxItem) => {
        // Reset the state back to the original description since the API call failed
        this.setState({
            file,
            fileError: {
                inlineError: {
                    title: messages.fileDescriptionInlineErrorTitleMessage,
                    content: messages.defaultInlineErrorContentMessage,
                },
            },
        });
    };

    /**
     * Function to update file description
     *
     * @private
     * @param newDescription - New file description
     */
    onDescriptionChange = (newDescription: string) => {
        const { api }: Props = this.props;
        const { file }: State = this.state;
        if (!file) {
            throw getBadItemError();
        }

        const { description }: BoxItem = file;
        if (newDescription === description) {
            return;
        }

        api.getFileAPI().setFileDescription(
            file,
            newDescription,
            this.descriptionChangeSuccessCallback,
            this.descriptionChangeErrorCallback,
        );
    };

    /**
     * Handles a failed file access stats fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    fetchAccessStatsErrorCallback = (e: ElementsXhrError, code: string) => {
        if (!this.props.hasAccessStats) {
            return;
        }

        const isForbidden = getProp(e, 'status') === HTTP_STATUS_CODE_FORBIDDEN;
        let accessStatsError;

        if (isForbidden) {
            accessStatsError = {
                error: messages.fileAccessStatsPermissionsError,
            };
        } else {
            accessStatsError = {
                maskError: {
                    errorHeader: messages.fileAccessStatsErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                },
            };
        }

        this.setState({
            isLoadingAccessStats: false,
            accessStats: undefined,
            accessStatsError,
        });

        this.props.onError(e, code, {
            e,
            isErrorDisplayed: !isForbidden,
        });
    };

    /**
     * File access stats fetch success callback
     *
     * @private
     * @param {Object} accessStats - access stats for a file
     * @return {void}
     */
    fetchAccessStatsSuccessCallback = (accessStats: FileAccessStats) => {
        if (!this.props.hasAccessStats) {
            return;
        }

        this.setState({
            accessStats,
            accessStatsError: undefined,
            isLoadingAccessStats: false,
        });
    };

    /**
     * Fetches the access stats for a file
     *
     * @private
     */
    fetchAccessStats() {
        const { api, fileId }: Props = this.props;
        const { isLoadingAccessStats } = this.state;

        if (isLoadingAccessStats) {
            return;
        }

        this.setState({ isLoadingAccessStats: true });
        api.getFileAccessStatsAPI(false).getFileAccessStats(
            fileId,
            this.fetchAccessStatsSuccessCallback,
            this.fetchAccessStatsErrorCallback,
        );
    }

    refresh() {
        this.fetchAccessStats();
    }

    render() {
        const {
            classification,
            contentInsights,
            elementId,
            hasProperties,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasContentInsights,
            hasRetentionPolicy,
            hasVersions,
            onAccessStatsClick,
            onVersionHistoryClick,
            onClassificationClick,
            onContentInsightsClick,
            onRetentionPolicyExtendClick,
            retentionPolicy,
        }: Props = this.props;

        const { accessStats, accessStatsError, file, fileError, isLoadingAccessStats }: State = this.state;

        // TODO: Add loading indicator and handle errors once file call is split out
        return (
            <SidebarContent
                className="bcs-details"
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_DETAILS}
                title={<FormattedMessage {...messages.sidebarDetailsTitle} />}
            >
                {file && hasNotices && (
                    <div className="bcs-DetailsSidebar-notices">
                        <SidebarNotices file={file} />
                    </div>
                )}
                {file && hasClassification && (
                    <SidebarClassification classification={classification} file={file} onEdit={onClassificationClick} />
                )}
                {file && hasAccessStats && (
                    <SidebarAccessStats
                        accessStats={accessStats}
                        file={file}
                        onAccessStatsClick={onAccessStatsClick}
                        {...accessStatsError}
                    />
                )}
                {file && hasContentInsights && (
                    <SidebarContentInsights
                        contentInsights={contentInsights}
                        onContentInsightsClick={onContentInsightsClick}
                    />
                )}
                {file && hasProperties && (
                    <SidebarSection
                        interactionTarget={SECTION_TARGETS.FILE_PROPERTIES}
                        title={<FormattedMessage {...messages.sidebarProperties} />}
                    >
                        {hasVersions && <SidebarVersions file={file} onVersionHistoryClick={onVersionHistoryClick} />}
                        <SidebarFileProperties
                            file={file}
                            onDescriptionChange={this.onDescriptionChange}
                            {...fileError}
                            hasRetentionPolicy={hasRetentionPolicy}
                            isLoading={isLoadingAccessStats}
                            onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                            retentionPolicy={retentionPolicy}
                        />
                    </SidebarSection>
                )}
            </SidebarContent>
        );
    }
}

export interface DetailsSidebarProps extends ExternalProps {
    refreshIdentity?: boolean;
    file?: BoxItem;
}
export { DetailsSidebar as DetailsSidebarComponent };
export default flow([
    withLogger(ORIGIN_DETAILS_SIDEBAR),
    withErrorBoundary(ORIGIN_DETAILS_SIDEBAR),
    withAPIContext,
    withFeatureConsumer,
])(DetailsSidebar);
