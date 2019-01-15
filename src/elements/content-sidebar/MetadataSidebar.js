/**
 * @flow
 * @file Metadata sidebar component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import Instances from 'box-react-ui/lib/features/metadata-instance-editor/Instances';
import EmptyContent from 'box-react-ui/lib/features/metadata-instance-editor/EmptyContent';
import TemplateDropdown from 'box-react-ui/lib/features/metadata-instance-editor/TemplateDropdown';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import API from '../../api';
import { isUserCorrectableError } from '../../utils/error';
import { EVENT_JS_READY } from '../common/logger/constants';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR,
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
} from '../../constants';
import './MetadataSidebar.scss';

type ExternalProps = {
    isFeatureEnabled: boolean,
};

type PropsWithoutContext = {
    fileId: string,
} & ExternalProps;

type Props = {
    api: API,
} & PropsWithoutContext &
    ErrorContextProps &
    ElementsMetricCallback;

type State = {
    editors?: Array<MetadataEditor>,
    file?: BoxItem,
    error?: MessageDescriptor,
    isLoading: boolean,
    templates?: Array<MetadataEditorTemplate>,
};

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;

window.performance.mark(MARK_NAME_JS_READY);

class MetadataSidebar extends React.PureComponent<Props, State> {
    state = { hasError: false, isLoading: false };

    static defaultProps = {
        isFeatureEnabled: true,
        onMetric: noop,
    };

    constructor(props: Props) {
        super(props);
        this.props.onMetric(
            METRIC_TYPE_ELEMENTS_LOAD_METRIC,
            {
                startMarkName: null, // TODO: replace with actual start mark once code splitting implemented
                endMarkName: MARK_NAME_JS_READY,
            },
            EVENT_JS_READY,
        );
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
    onApiError(error: ElementsXhrError, code: string, newState: Object = {}) {
        const { onError }: Props = this.props;
        const { status } = error;
        const isValidError = isUserCorrectableError(status);
        this.setState(
            Object.assign(
                {
                    error: messages.sidebarMetadataEditingErrorContent,
                    isLoading: false,
                },
                newState,
            ),
        );
        onError(error, code, {
            error,
            [IS_ERROR_DISPLAYED]: isValidError,
        });
    }

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
    onAdd = (template: MetadataEditorTemplate) => {
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
    onSave = (id: string, ops: JsonPatchData): void => {
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
        templates: Array<MetadataEditorTemplate>,
    }) => {
        this.setState({
            editors: editors.slice(0), // cloned for potential editing
            error: undefined,
            isLoading: false,
            templates: templates.slice(0), // cloned for potential editing
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

    render() {
        const { editors, file, error, isLoading, templates }: State = this.state;
        const showEditor = !!file && !!templates && !!editors;
        const showLoadingIndicator = !error && !showEditor;
        const canEdit = this.canEdit();
        const showTemplateDropdown = showEditor && canEdit;
        const showEmptyContent = showEditor && ((editors: any): Array<MetadataEditor>).length === 0;

        return (
            <SidebarContent
                title={<FormattedMessage {...messages.sidebarMetadataTitle} />}
                actions={
                    showTemplateDropdown ? (
                        <TemplateDropdown
                            hasTemplates={templates && templates.length !== 0}
                            isDropdownBusy={false}
                            onAdd={this.onAdd}
                            templates={templates}
                            usedTemplates={editors && editors.map(editor => editor.template)}
                        />
                    ) : null
                }
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
                                onSave={this.onSave}
                                onRemove={this.onRemove}
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
export default withLogger(ORIGIN_METADATA_SIDEBAR)(
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR)(withAPIContext(MetadataSidebar)),
);
