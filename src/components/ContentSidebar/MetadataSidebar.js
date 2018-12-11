/**
 * @flow
 * @file Metadata sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Instances from 'box-react-ui/lib/features/metadata-instance-editor/Instances';
import EmptyContent from 'box-react-ui/lib/features/metadata-instance-editor/EmptyContent';
import TemplateDropdown from 'box-react-ui/lib/features/metadata-instance-editor/TemplateDropdown';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import messages from '../messages';
import SidebarContent from './SidebarContent';
import { withAPIContext } from '../APIContext';
import { withErrorBoundary } from '../ErrorBoundary';
import API from '../../api';
import { isUserCorrectableError } from '../../util/error';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR,
} from '../../constants';
import './MetadataSidebar.scss';

type ExternalProps = {
    isFeatureEnabled?: boolean,
};

type PropsWithoutContext = {
    fileId: string,
} & ExternalProps;

type Props = {
    api: API,
} & PropsWithoutContext &
    ErrorContextProps;

type State = {
    editors?: Array<MetadataEditor>,
    file?: BoxItem,
    error?: MessageDescriptor,
    isLoading: boolean,
    templates?: Array<MetadataEditorTemplate>,
};

class MetadataSidebar extends React.PureComponent<Props, State> {
    state = { hasError: false, isLoading: false };

    componentDidMount() {
        this.fetchFile();
    }

    /**
     * Common error callback
     *
     * @return {void}
     */
    commonErrorCallback(error: ElementsXhrError, code: string, newState: Object = {}) {
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
        if (!file) {
            return false;
        }
        const { permissions = {} }: BoxItem = file;
        const { can_upload }: BoxItemPermission = permissions;
        return !!can_upload;
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
     * @param {number} id - instance id
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
            this.commonErrorCallback,
        );
    };

    /**
     * Instance add success handler
     *
     * @param {number} id - instance id
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
        api.getMetadataAPI(false).createMetadata(file, template, this.onAddSuccessHandler, this.commonErrorCallback);
    };

    /**
     * Instance save success handler
     *
     * @param {Object} oldEditor - prior editor
     * @param {Object} newEditor - updated editor
     * @return {void}
     */
    onSaveSuccessHandler(oldEditor: MetadataEditor, newEditor: MetadataEditor): void {
        const { editors = [] }: State = this.state;
        const clone = editors.slice(0);
        clone.splice(editors.indexOf(oldEditor), 1, newEditor);
        this.setState({ editors: clone });
    }

    /**
     * Instance save error handler
     *
     * @param {Object} oldEditor - prior editor
     * @param {Object} newEditor - updated editor
     * @return {void}
     */
    onSaveErrorHandler(oldEditor: MetadataEditor, error: ElementsXhrError, code: string): void {
        const clone: MetadataEditor = { ...oldEditor }; // shallow clone only needed
        clone.hasError = true;
        this.onSaveSuccessHandler(oldEditor, clone);
        this.commonErrorCallback(error, code);
    }

    /**
     * Instance save handler
     *
     * @param {number} id - instance id
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
                this.onSaveSuccessHandler(oldEditor, newEditor);
            },
            (error: ElementsXhrError, code: string) => {
                this.onSaveErrorHandler(oldEditor, error, code);
            },
        );
    };

    /**
     * Instance dirty handler
     *
     * @param {number} id - instance id
     * @param {boolean} isDirty - instance dirty state
     * @return {void}
     */
    onModification = (id: string, isDirty: boolean) => {
        const oldEditor = this.getEditor(id);
        if (!oldEditor) {
            return;
        }
        const newEditor = { ...oldEditor };
        newEditor.isDirty = isDirty;
        this.onSaveSuccessHandler(oldEditor, newEditor);
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
        this.commonErrorCallback(e, code, {
            editors: undefined,
            error: messages.sidebarMetadataFetchingErrorContent,
            templates: undefined,
        });
    };

    /**
     * Handles a successful metadata fetch
     *
     * @param {Object} file - the box file
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
            editors: editors.slice(0),
            error: undefined,
            isLoading: false,
            templates,
        });
    };

    /**
     * Fetches the metadata editors
     *
     * @return {void}
     */
    fetchMetadata(): void {
        const { api, isFeatureEnabled = true }: Props = this.props;
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
        this.commonErrorCallback(e, code, { error: messages.sidebarFileFetchingErrorContent, file: undefined });
    };

    /**
     * Handles a successful file fetch
     *
     * @param {Object} file - the box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem) => {
        this.setState({ file }, this.fetchMetadata);
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
            refreshCache: true,
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
export default withErrorBoundary(ORIGIN_METADATA_SIDEBAR)(withAPIContext(MetadataSidebar));
