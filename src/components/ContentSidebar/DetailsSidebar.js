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
    HTTP_STATUS_CODE_FORBIDDEN,
    FIELD_METADATA_CLASSIFICATION,
} from '../../constants';
import API from '../../api';
import type { $AxiosXHR } from 'axios'; // eslint-disable-line
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
} & PropsWithoutContext;

type State = {
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    file: BoxItem,
    fileError?: Errors,
    isLoading: boolean,
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
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            file: props.file,
            isLoading: false,
        };
    }

    componentDidMount() {
        const { hasAccessStats }: Props = this.props;
        if (hasAccessStats) {
            this.fetchAccessStats();
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
     * @param {Error} e - API error
     * @return {void}
     */
    fetchAccessStatsErrorCallback = (error: $AxiosXHR<any>) => {
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
            isLoading: false,
            accessStats: undefined,
            accessStatsError,
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
            isLoading: false,
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
        this.setState({ isLoading: true });
        api.getFileAccessStatsAPI(false).get({
            id: file.id,
            successCallback: this.fetchAccessStatsSuccessCallback,
            errorCallback: this.fetchAccessStatsErrorCallback,
        });
    }

    /**
     * Sucess callback for classification change
     *
     * @private
     * @return {void}
     */
    classifiationChangeSuccessCallback = (file: BoxItem) => {
        this.setState({
            file,
            isLoading: false,
        });
    };

    /**
     * Error callback for classification change
     *
     * @private
     * @return {void}
     */
    classifiationChangeErrorCallback = () => {
        this.setState({
            isLoading: false,
        });
    };

    /**
     * Refreshes sidebar when classification is changed
     *
     * @private
     * @return {void}
     */
    onClassificationChange = (): void => {
        const { file }: State = this.state;
        const { api }: Props = this.props;
        this.setState({ isLoading: true });
        api.getFileAPI().getFile(
            file.id,
            this.classifiationChangeSuccessCallback,
            this.classifiationChangeErrorCallback,
            {
                forceFetch: true,
                updateCache: true,
                fields: [FIELD_METADATA_CLASSIFICATION],
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
        onClassificationClick(this.onClassificationChange);
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
            file,
            fileError,
            isLoading,
        }: State = this.state;

        return (
            <SidebarContent
                title={<FormattedMessage {...messages.sidebarDetailsTitle} />}
            >
                {hasNotices && (
                    <div className="bcs-details-content">
                        {hasNotices && <SidebarNotices file={file} />}
                    </div>
                )}
                {hasAccessStats && (
                    <SidebarAccessStats
                        accessStats={accessStats}
                        onAccessStatsClick={onAccessStatsClick}
                        file={file}
                        {...accessStatsError}
                    />
                )}
                {hasVersions && (
                    <div className="bcs-details-content">
                        {hasVersions && (
                            <SidebarVersions
                                onVersionHistoryClick={onVersionHistoryClick}
                                file={file}
                            />
                        )}
                    </div>
                )}
                {hasProperties && (
                    <SidebarSection
                        interactionTarget={SECTION_TARGETS.FILE_PROPERTIES}
                        title={
                            <FormattedMessage {...messages.sidebarProperties} />
                        }
                    >
                        <SidebarFileProperties
                            onDescriptionChange={this.onDescriptionChange}
                            file={file}
                            {...fileError}
                            hasClassification={hasClassification}
                            onClassificationClick={this.onClassificationClick}
                            hasRetentionPolicy={hasRetentionPolicy}
                            retentionPolicy={retentionPolicy}
                            bannerPolicy={bannerPolicy}
                            onRetentionPolicyExtendClick={
                                onRetentionPolicyExtendClick
                            }
                            isLoading={isLoading}
                        />
                    </SidebarSection>
                )}
            </SidebarContent>
        );
    }
}

export type DetailsSidebarProps = ExternalProps;
export { DetailsSidebar as DetailsSidebarComponent };
export default withErrorBoundary(withAPIContext(DetailsSidebar));
