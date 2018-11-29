/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import messages from '../messages';
import { SECTION_TARGETS } from '../../interactionTargets';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarSection from './SidebarSection';
import SidebarContent from './SidebarContent';
import SidebarVersions from './SidebarVersions';
import SidebarNotices from './SidebarNotices';
import SidebarFileProperties from './SidebarFileProperties';
import { withAPIContext } from '../APIContext';
import { withErrorBoundary } from '../ErrorBoundary';
import {
    ERROR_CODE_FETCH_ACCESS_STATS,
    ERROR_CODE_FETCH_CLASSIFICATION,
    HTTP_STATUS_CODE_FORBIDDEN,
    ORIGIN_DETAILS_SIDEBAR,
} from '../../constants';
import API from '../../api';
import './DetailsSidebar.scss';

type ExternalProps = {
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
};

type PropsWithoutContext = {
    file: BoxItem,
} & ExternalProps;

type Props = {
    api: API,
} & PropsWithoutContext &
    ErrorContextProps;

type State = {
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    isLoadingAccessStats: boolean,
    classificationInfo?: ClassificationInfo,
    classificationError?: Errors,
    isLoadingClassification: boolean,
    file: BoxItem,
    fileError?: Errors,
};

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
            file: props.file,
            isLoadingAccessStats: false,
            isLoadingClassification: false,
        };
    }

    componentDidMount() {
        const { hasAccessStats, hasClassification }: Props = this.props;
        if (hasAccessStats) {
            this.fetchAccessStats();
        }

        if (hasClassification) {
            this.fetchClassification();
        }
    }

    componentWillUnmount() {
        // Reset loading state to allow loading spinner
        this.setState({
            isLoadingAccessStats: false,
            isLoadingClassification: false,
        });
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
     * @param {ElementsXhrError} error - API error
     * @return {void}
     */
    fetchAccessStatsErrorCallback = (error: ElementsXhrError) => {
        let accessStatsError;

        if (getProp(error, 'status') === HTTP_STATUS_CODE_FORBIDDEN) {
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

        this.props.onError(error, ERROR_CODE_FETCH_ACCESS_STATS, {
            error,
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
        const { api }: Props = this.props;
        const { file }: State = this.state;
        this.setState({ isLoadingAccessStats: true });
        api.getFileAccessStatsAPI(false).get({
            id: file.id,
            successCallback: this.fetchAccessStatsSuccessCallback,
            errorCallback: this.fetchAccessStatsErrorCallback,
        });
    }

    /**
     * File classification fetch success callback.
     *
     * @param {ClassificationInfo} classificationInfo - Info about the file's classification
     * @return {void}
     */
    fetchClassificationSuccessCallback = (classificationInfo: ClassificationInfo): void => {
        this.setState({
            classificationInfo,
            classificationError: undefined,
            isLoadingClassification: false,
        });
    };

    /**
     * Handles a failed file classification fetch
     *
     * @private
     * @param {ElementsXhrError} error - API error
     * @return {void}
     */
    fetchClassificationErrorCallback = (error: ElementsXhrError): void => {
        let classificationError;

        if (getProp(error, 'status') === HTTP_STATUS_CODE_FORBIDDEN) {
            classificationError = {
                error: messages.fileClassificationPermissionsError,
            };
        } else {
            classificationError = {
                maskError: {
                    errorHeader: messages.fileClassificationErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                },
            };
        }

        this.setState({
            classificationInfo: undefined,
            classificationError,
            isLoadingClassification: false,
        });

        this.props.onError(error, ERROR_CODE_FETCH_CLASSIFICATION, {
            error,
        });
    };

    /**
     * Fetches the classification for a file
     *
     * @private
     * @return {void}
     */
    fetchClassification = (): void => {
        const { api }: Props = this.props;
        const { file }: State = this.state;
        this.setState({ isLoadingClassification: true });
        api.getMetadataAPI(false).getClassification(
            file,
            this.fetchClassificationSuccessCallback,
            this.fetchClassificationErrorCallback,
            false,
            true,
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
            classificationInfo,
            classificationError,
            file,
            fileError,
            isLoadingAccessStats,
            isLoadingClassification,
        }: State = this.state;

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
                        {...classificationError}
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
                            classificationInfo={classificationInfo}
                            hasRetentionPolicy={hasRetentionPolicy}
                            retentionPolicy={retentionPolicy}
                            bannerPolicy={bannerPolicy}
                            onRetentionPolicyExtendClick={onRetentionPolicyExtendClick}
                            isLoading={isLoadingAccessStats && isLoadingClassification}
                        />
                    </SidebarSection>
                )}
            </SidebarContent>
        );
    }
}

export type DetailsSidebarProps = ExternalProps;
export { DetailsSidebar as DetailsSidebarComponent };
export default withErrorBoundary(ORIGIN_DETAILS_SIDEBAR)(withAPIContext(DetailsSidebar));
