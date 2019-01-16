/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import flow from 'lodash/flow';
import messages from '../common/messages';
import { SECTION_TARGETS } from '../common/interactionTargets';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarVersions from './SidebarVersions';
import SidebarNotices from './SidebarNotices';
import SidebarFileProperties from './SidebarFileProperties';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { EVENT_JS_READY } from '../common/logger/constants';
import { HTTP_STATUS_CODE_FORBIDDEN, ORIGIN_DETAILS_SIDEBAR, IS_ERROR_DISPLAYED } from '../../constants';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../utils/fields';
import { mark } from '../../utils/performance';
import API from '../../api';
import { isUserCorrectableError, getBadItemError } from '../../utils/error';
import './DetailsSidebar.scss';

type ExternalProps = {
    fileId: string, // TODO: add fileVersionId
    hasNotices?: boolean,
    hasProperties?: boolean,
    hasAccessStats?: boolean,
    hasClassification?: boolean,
    hasRetentionPolicy?: boolean,
    hasVersions?: boolean,
    retentionPolicy?: Object,
    bannerPolicy?: Object,
    onAccessStatsClick?: Function,
    onClassificationClick: Function,
    onRetentionPolicyExtendClick?: Function,
    onVersionHistoryClick?: Function,
} & ErrorContextProps &
    WithLoggerProps;
type Props = {
    api: API,
} & ExternalProps &
    ErrorContextProps &
    WithLoggerProps;

type State = {
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    isLoadingAccessStats: boolean,
    classification?: ClassificationInfo,
    classificationError?: Errors,
    isLoadingClassification: boolean,
    file?: BoxItem,
    fileError?: Errors,
};

const MARK_NAME_JS_READY = `${ORIGIN_DETAILS_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class DetailsSidebar extends React.PureComponent<Props, State> {
    static defaultProps = {
        hasNotices: false,
        hasProperties: false,
        hasAccessStats: false,
        hasClassification: false,
        hasRetentionPolicy: false,
        hasVersions: false,
        onClassificationClick: noop,
        onError: noop,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoadingAccessStats: false,
            isLoadingClassification: false,
        };
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    componentDidMount() {
        this.fetchFile();
        if (this.props.hasAccessStats) {
            this.fetchAccessStats();
        }
        if (this.props.hasClassification) {
            this.fetchClassification();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { hasAccessStats, hasClassification } = this.props;
        // Component visibility props such as hasAccessStats can sometimes be flipped after an async call
        const hasAccessStatsChanged = prevProps.hasAccessStats !== hasAccessStats;
        const hasClassificationChanged = prevProps.hasClassification !== hasClassification;
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

        if (hasClassificationChanged) {
            if (hasClassification) {
                this.fetchClassification();
            } else {
                this.setState({
                    classification: undefined,
                    classificationError: undefined,
                    isLoadingClassification: false,
                });
            }
        }
    }

    /**
     * File description update callback
     *
     * @private
     * @param {BoxItem} file - Updated file object
     * @return {void}
     */
    descriptionChangeSuccessCallback = (file: BoxItem): void => {
        this.setState({ file, fileError: undefined });
    };

    /**
     * Fetches a file with the fields needed for details sidebar
     *
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    fetchFile(
        successCallback: (file: BoxItem) => void = this.fetchFileSuccessCallback,
        errorCallback: ElementsErrorCallback = this.fetchFileErrorCallback,
    ): void {
        const { api, fileId }: Props = this.props;
        api.getFileAPI().getFile(fileId, successCallback, errorCallback, {
            fields: SIDEBAR_FIELDS_TO_FETCH, // TODO: replace this with DETAILS_SIDEBAR_FIELDS_TO_FETCH as we do not need all the sidebar fields
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
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
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
    descriptionChangeErrorCallback = (file: BoxItem): void => {
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
     * @param {string} newDescription - New file description
     * @return {void}
     */
    onDescriptionChange = (newDescription: string): void => {
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
            [IS_ERROR_DISPLAYED]: !isForbidden,
        });
    };

    /**
     * File access stats fetch success callback
     *
     * @private
     * @param {Object} accessStats - access stats for a file
     * @return {void}
     */
    fetchAccessStatsSuccessCallback = (accessStats: FileAccessStats): void => {
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
     * @return {void}
     */
    fetchAccessStats(): void {
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

    /**
     * File classification fetch success callback.
     *
     * @param {ClassificationInfo} classification - Info about the file's classification
     * @return {void}
     */
    fetchClassificationSuccessCallback = (classification: ClassificationInfo): void => {
        if (!this.props.hasClassification) {
            return;
        }

        this.setState({
            classification,
            classificationError: undefined,
            isLoadingClassification: false,
        });
    };

    /**
     * Handles a failed file classification fetch
     *
     * @private
     * @param {ElementsXhrError} error - API error
     * @param {string} code - Error code
     * @return {void}
     */
    fetchClassificationErrorCallback = (error: ElementsXhrError, code: string): void => {
        if (!this.props.hasClassification) {
            return;
        }

        const isValidError = isUserCorrectableError(error.status);
        let classificationError;

        if (isValidError) {
            classificationError = {
                inlineError: {
                    title: messages.fileClassificationErrorHeaderMessage,
                    content: messages.defaultErrorMaskSubHeaderMessage,
                },
            };
        }

        this.setState({
            classification: undefined,
            classificationError,
            isLoadingClassification: false,
        });

        this.props.onError(error, code, {
            error,
            [IS_ERROR_DISPLAYED]: isValidError,
        });
    };

    /**
     * Fetches the classification for a file
     *
     * @private
     * @return {void}
     */
    fetchClassification = (): void => {
        const { api, fileId }: Props = this.props;
        const { isLoadingClassification } = this.state;

        if (isLoadingClassification) {
            return;
        }

        this.setState({ isLoadingClassification: true });
        api.getMetadataAPI(false).getClassification(
            fileId,
            this.fetchClassificationSuccessCallback,
            this.fetchClassificationErrorCallback,
            {
                refreshCache: true,
            },
        );
    };

    /**
     * Add classification click handler
     *
     * @private
     * @return {void}
     */
    onClassificationClick = (): void => {
        const { onClassificationClick }: Props = this.props;
        onClassificationClick(this.fetchClassification);
    };

    render() {
        const {
            hasProperties,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasRetentionPolicy,
            hasVersions,
            onAccessStatsClick,
            onVersionHistoryClick,
            onRetentionPolicyExtendClick,
            retentionPolicy,
            bannerPolicy,
        }: Props = this.props;

        const {
            accessStats,
            accessStatsError,
            classification,
            classificationError,
            file,
            fileError,
            isLoadingAccessStats,
            isLoadingClassification,
        }: State = this.state;

        if (!file) {
            return null; // TODO: change to loading indicator and handle errors once file call split out
        }

        return (
            <SidebarContent title={<FormattedMessage {...messages.sidebarDetailsTitle} />}>
                {hasNotices && (
                    <div className="bcs-details-content">{hasNotices && <SidebarNotices file={file} />}</div>
                )}
                {hasAccessStats && (
                    <SidebarAccessStats
                        accessStats={accessStats}
                        onAccessStatsClick={onAccessStatsClick}
                        file={file}
                        {...accessStatsError}
                    />
                )}
                {hasProperties && (
                    <SidebarSection
                        interactionTarget={SECTION_TARGETS.FILE_PROPERTIES}
                        title={<FormattedMessage {...messages.sidebarProperties} />}
                    >
                        {hasVersions && (
                            <div className="bcs-details-content">
                                {hasVersions && (
                                    <SidebarVersions onVersionHistoryClick={onVersionHistoryClick} file={file} />
                                )}
                            </div>
                        )}
                        <SidebarFileProperties
                            onDescriptionChange={this.onDescriptionChange}
                            file={file}
                            {...fileError}
                            hasClassification={hasClassification}
                            onClassificationClick={this.onClassificationClick}
                            classification={classification}
                            hasRetentionPolicy={hasRetentionPolicy}
                            retentionPolicy={retentionPolicy}
                            bannerPolicy={bannerPolicy}
                            onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                            isLoading={isLoadingAccessStats && isLoadingClassification}
                            {...classificationError}
                        />
                    </SidebarSection>
                )}
            </SidebarContent>
        );
    }
}

export type DetailsSidebarProps = ExternalProps;
export { DetailsSidebar as DetailsSidebarComponent };
export default flow([withLogger(ORIGIN_DETAILS_SIDEBAR), withErrorBoundary(ORIGIN_DETAILS_SIDEBAR), withAPIContext])(
    DetailsSidebar,
);
