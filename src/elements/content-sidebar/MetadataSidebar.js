/**
 * @flow
 * @file Metadata sidebar component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import EmptyContent from '../../features/metadata-instance-editor/EmptyContent';
import InlineError from '../../components/inline-error/InlineError';
import Instances from '../../features/metadata-instance-editor/Instances';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import TemplateDropdown from '../../features/metadata-instance-editor/TemplateDropdown';
import { normalizeTemplates } from '../../features/metadata-instance-editor/metadataUtil';
import { EVENT_JS_READY } from '../common/logger/constants';
import { isUserCorrectableError } from '../../utils/error';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
import type { WithLoggerProps } from '../../common/types/logging';
import type { ElementsXhrError, ErrorContextProps, JSONPatchOperations } from '../../common/types/api';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';
import type { BoxItem } from '../../common/types/core';
import './MetadataSidebar.scss';

type ExternalProps = {
    isFeatureEnabled: boolean,
    selectedTemplateKey?: string,
    templateFilters?: Array<string> | string,
};

type PropsWithoutContext = {
    elementId: string,
    fileId: string,
    hasSidebarInitialized?: boolean,
} & ExternalProps;

type Props = {
    api: API,
} & PropsWithoutContext &
    ErrorContextProps &
    WithLoggerProps;

type State = {
    editors?: Array<MetadataEditor>,
    error?: MessageDescriptor,
    file?: BoxItem,
    isLoading: boolean,
    templates?: Array<MetadataTemplate>,
};

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class MetadataSidebar extends React.PureComponent<Props, State> {
    state = { isLoading: false };

    static defaultProps = {
        isFeatureEnabled: true,
    };

    constructor(props: Props) {
        super(props);
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    componentDidMount() {
        this.fetchFile();
    }

    /**
     * Common error callback
     *
     * @param {Error} error - API error
     * @param {string} code - error code
     * @param {Object} [newState] - optional state to set
     * @return {void}
     */
    onApiError = (error: ElementsXhrError, code: string, newState: Object = {}) => {
        const { onError }: Props = this.props;
        const { status } = error;
        const isValidError = isUserCorrectableError(status);
        this.setState({
            error: messages.sidebarMetadataEditingErrorContent,
            isLoading: false,
            ...newState,
        });
        onError(error, code, {
            error,
            [IS_ERROR_DISPLAYED]: isValidError,
        });
    };

    /**
     * Checks upload permission
     *
     * @return {boolean} - true if metadata can be edited
     */
    canEdit(): boolean {
        const { file }: State = this.state;
        return getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    }

    /**
     * Finds the editor we are editing
     *
     * @param {number} id - instance id
     * @return {Object} editor instance
     */
    getEditor(id: string): ?MetadataEditor {
        const { editors = [] }: State = this.state;
        return editors.find(({ instance }) => instance.id === id);
    }

    /**
     * Instance remove success handler
     *
     * @param {Object} editor - the editor to remove
     * @return {void}
     */
    onRemoveSuccessHandler(editor: MetadataEditor): void {
        const { editors = [] }: State = this.state;
        const clone = editors.slice(0);
        clone.splice(editors.indexOf(editor), 1);
        this.setState({ editors: clone });
    }

    /**
     * Instance remove handler
     *
     * @param {string} id - instance id
     * @return {void}
     */
    onRemove = (id: string): void => {
        const { api }: Props = this.props;
        const { file }: State = this.state;
        const editor = this.getEditor(id);

        if (!editor || !file) {
            return;
        }

        api.getMetadataAPI(false).deleteMetadata(
            file,
            editor.template,
            () => this.onRemoveSuccessHandler(editor),
            this.onApiError,
        );
    };

    /**
     * Instance add success handler
     *
     * @param {Object} editor - instance editor
     * @return {void}
     */
    onAddSuccessHandler = (editor: MetadataEditor): void => {
        const { editors = [] }: State = this.state;
        const clone = editors.slice(0);
        clone.push(editor);
        this.setState({ editors: clone, isLoading: false });
    };

    /**
     * Instance add handler
     *
     * @param {Object} template - instance template
     * @return {void}
     */
    onAdd = (template: MetadataTemplate) => {
        const { api }: Props = this.props;
        const { file }: State = this.state;

        if (!file) {
            return;
        }

        this.setState({ isLoading: true });
        api.getMetadataAPI(false).createMetadata(file, template, this.onAddSuccessHandler, this.onApiError);
    };

    /**
     * Instance save success handler
     *
     * @param {Object} oldEditor - prior editor
     * @param {Object} newEditor - updated editor
     * @return {void}
     */
    replaceEditor(oldEditor: MetadataEditor, newEditor: MetadataEditor): void {
        const { editors = [] }: State = this.state;
        const clone = editors.slice(0);
        clone.splice(editors.indexOf(oldEditor), 1, newEditor);
        this.setState({ editors: clone });
    }

    /**
     * Instance save error handler
     *
     * @param {Object} oldEditor - prior editor
     * @param {Object} error - api error
     * @param {string} code - error code
     * @return {void}
     */
    onSaveErrorHandler(oldEditor: MetadataEditor, error: ElementsXhrError, code: string): void {
        const clone: MetadataEditor = { ...oldEditor, hasError: true }; // shallow clone suffices for hasError setting
        this.replaceEditor(oldEditor, clone);
        this.onApiError(error, code);
    }

    /**
     * Instance save handler
     *
     * @param {string} id - instance id
     * @param {Array} ops - json patch ops
     * @return {void}
     */
    onSave = (id: string, ops: JSONPatchOperations): void => {
        const { api }: Props = this.props;
        const { file }: State = this.state;
        const oldEditor = this.getEditor(id);

        if (!oldEditor || !file) {
            return;
        }

        api.getMetadataAPI(false).updateMetadata(
            file,
            oldEditor.template,
            ops,
            (newEditor: MetadataEditor) => {
                this.replaceEditor(oldEditor, newEditor);
            },
            (error: ElementsXhrError, code: string) => {
                this.onSaveErrorHandler(oldEditor, error, code);
            },
        );
    };

    /**
     * Instance dirty handler
     *
     * @param {string} id - instance id
     * @param {boolean} isDirty - instance dirty state
     * @return {void}
     */
    onModification = (id: string, isDirty: boolean) => {
        const oldEditor = this.getEditor(id);
        if (!oldEditor) {
            return;
        }
        const newEditor = { ...oldEditor, isDirty }; // shallow clone suffices for isDirty setting
        this.replaceEditor(oldEditor, newEditor);
    };

    /**
     * Handles a failed metadata fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    fetchMetadataErrorCallback = (e: ElementsXhrError, code: string) => {
        this.onApiError(e, code, {
            editors: undefined,
            error: messages.sidebarMetadataFetchingErrorContent,
            templates: undefined,
        });
    };

    /**
     * Handles a successful metadata fetch
     *
     * @param {Object} metadata - instances and templates
     * @return {void}
     */
    fetchMetadataSuccessCallback = ({
        editors,
        templates,
    }: {
        editors: Array<MetadataEditor>,
        templates: Array<MetadataTemplate>,
    }) => {
        const { selectedTemplateKey, templateFilters } = this.props;
        this.setState({
            editors: editors.slice(0), // cloned for potential editing
            error: undefined,
            isLoading: false,
            templates: normalizeTemplates(templates, selectedTemplateKey, templateFilters),
        });
    };

    /**
     * Fetches the metadata editors
     *
     * @return {void}
     */
    fetchMetadata(): void {
        const { api, isFeatureEnabled }: Props = this.props;
        const { file }: State = this.state;

        if (!file) {
            return;
        }

        api.getMetadataAPI(false).getMetadata(
            file,
            this.fetchMetadataSuccessCallback,
            this.fetchMetadataErrorCallback,
            isFeatureEnabled,
            { refreshCache: true },
        );
    }

    /**
     * Handles a failed file fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    fetchFileErrorCallback = (e: ElementsXhrError, code: string) => {
        this.onApiError(e, code, { error: messages.sidebarFileFetchingErrorContent, file: undefined });
    };

    /**
     * Handles a successful file fetch.
     * Can be called multiple times when refreshing caches.
     * On file load we should fetch metadata, but we shouldn't need to fetch
     * if the file permissions haven't changed from a prior file fetch.
     * Metadata editors mostly care about upload permission.
     *
     * @param {Object} file - the Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem) => {
        const { file: currentFile }: State = this.state;
        const currentCanUpload = getProp(currentFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
        const newCanUpload = getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
        const shouldFetchMetadata = !currentFile || currentCanUpload !== newCanUpload;
        const callback = shouldFetchMetadata ? this.fetchMetadata : noop;
        this.setState({ file }, callback);
    };

    /**
     * Fetches a file with the fields needed for metadata sidebar
     *
     * @return {void}
     */
    fetchFile(): void {
        const { api, fileId }: Props = this.props;
        api.getFileAPI().getFile(fileId, this.fetchFileSuccessCallback, this.fetchFileErrorCallback, {
            fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
            refreshCache: true, // see implications in file success callback
        });
    }

    refresh(): void {
        this.fetchMetadata();
    }

    render() {
        const { editors, file, error, isLoading, templates }: State = this.state;
        const { elementId, selectedTemplateKey }: Props = this.props;
        const showEditor = !!file && !!templates && !!editors;
        const showLoadingIndicator = !error && !showEditor;
        const canEdit = this.canEdit();
        const showTemplateDropdown = showEditor && canEdit;
        const showEmptyContent = showEditor && ((editors: any): Array<MetadataEditor>).length === 0;

        return (
            <SidebarContent
                actions={
                    showTemplateDropdown ? (
                        <TemplateDropdown
                            hasTemplates={templates && templates.length !== 0}
                            isDropdownBusy={false}
                            onAdd={this.onAdd}
                            // $FlowFixMe checked via showTemplateDropdown & showEditor
                            templates={templates}
                            // $FlowFixMe checked via showTemplateDropdown & showEditor
                            usedTemplates={editors.map(editor => editor.template)}
                        />
                    ) : null
                }
                className="bcs-metadata"
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_METADATA}
                title={<FormattedMessage {...messages.sidebarMetadataTitle} />}
            >
                {error && (
                    <InlineError title={<FormattedMessage {...messages.error} />}>
                        <FormattedMessage {...error} />
                    </InlineError>
                )}
                {showLoadingIndicator && <LoadingIndicator />}
                {showEditor && (
                    <LoadingIndicatorWrapper className="metadata-instance-editor" isLoading={isLoading}>
                        {showEmptyContent ? (
                            <EmptyContent canAdd={canEdit} />
                        ) : (
                            <Instances
                                editors={editors}
                                onModification={this.onModification}
                                onRemove={this.onRemove}
                                onSave={this.onSave}
                                selectedTemplateKey={selectedTemplateKey}
                            />
                        )}
                    </LoadingIndicatorWrapper>
                )}
            </SidebarContent>
        );
    }
}

export type MetadataSidebarProps = ExternalProps;
export { MetadataSidebar as MetadataSidebarComponent };
export default flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(
    MetadataSidebar,
);
