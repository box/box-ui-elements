/**
 * @flow
 * @file Metadata sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MetadataInstanceEditor from 'box-react-ui/lib/features/metadata-instance-editor/MetadataInstanceEditor';
import TemplateDropdown from 'box-react-ui/lib/features/metadata-instance-editor/TemplateDropdown';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import messages from '../messages';
import SidebarContent from './SidebarContent';
import APIContext from '../APIContext';
import API from '../../api';
import './MetadataSidebar.scss';

type ExternalProps = {
    getMetadata?: Function
};

type PropsWithoutContext = {
    file: BoxItem
} & ExternalProps;

type Props = {
    api: API
} & PropsWithoutContext;

type State = {
    editors?: Array<MetadataEditor>,
    templates?: Array<MetadataEditorTemplate>,
    isLoading: boolean,
    hasError: boolean
};

class MetadataSidebar extends React.PureComponent<Props, State> {
    state = {
        isLoading: false,
        hasError: false
    };

    componentDidMount() {
        this.getMetadataEditors();
    }

    /**
     * Sets the error state to true
     *
     * @return {void}
     */
    errorCallback = (): void => {
        this.setState({ isLoading: false, hasError: true });
    };

    /**
     * Fetches the metadata editors
     *
     * @return {void}
     */
    getMetadataEditors = (): void => {
        const { api, file, getMetadata }: Props = this.props;
        api.getMetadataAPI(true).getEditors(
            file,
            ({ editors, templates }: { editors: Array<MetadataEditor>, templates: Array<MetadataEditorTemplate> }) => {
                this.setState({ templates, editors: editors.slice(0), isLoading: false, hasError: false });
            },
            this.errorCallback,
            getMetadata
        );
    };

    /**
     * Checks upload permission
     *
     * @return {boolean} - true if metadata can be edited
     */
    canEdit(): boolean {
        const { file }: Props = this.props;
        const { permissions = {} }: BoxItem = file;
        const { can_upload }: BoxItemPermission = permissions;
        return !!can_upload;
    }

    /**
     * Instance remove handler
     *
     * @param {number} id - instance id
     * @return {void}
     */
    onRemove = (id: string): void => {
        const { api, file }: Props = this.props;
        const { editors = [] }: State = this.state;
        const editor = editors.find(({ instance }) => instance.id === id);
        if (!editor) {
            return;
        }

        api.getMetadataAPI(false).deleteMetadata(file, editor.template, this.getMetadataEditors, this.errorCallback);
    };

    /**
     * Instance add handler
     *
     * @param {Object} template - instance template
     * @return {void}
     */
    onAdd = (template: MetadataEditorTemplate) => {
        const { api, file }: Props = this.props;
        this.setState({ isLoading: true });
        api.getMetadataAPI(false).createMetadata(file, template, this.getMetadataEditors, this.errorCallback);
    };

    /**
     * Instance save handler
     *
     * @param {number} id - instance id
     * @param {Array} ops - json patch ops
     * @return {void}
     */
    onSave = (id: string, ops: JsonPatchData): void => {
        const { api, file }: Props = this.props;
        const { editors = [] }: State = this.state;
        const editor = editors.find(({ instance }) => instance.id === id);
        if (!editor) {
            return;
        }

        api.getMetadataAPI(false).updateMetadata(
            file,
            editor.template,
            ops,
            this.getMetadataEditors,
            this.errorCallback
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
        const { editors = [] }: State = this.state;
        const index = editors.findIndex(({ instance }) => instance.id === id);
        if (index === -1) {
            return;
        }

        const editor = { ...editors[index] };
        editor.isDirty = isDirty;
        const clone = editors.slice(0);
        clone.splice(index, 1, editor);
        this.setState({ editors: clone });
    };

    render() {
        const { editors, templates, isLoading, hasError }: State = this.state;
        const showEditor = !!templates && !!editors;
        const showLoadingIndicator = !hasError && !showEditor;
        const canEdit = this.canEdit();
        const showTemplateDropdown = showEditor && canEdit;

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
                            usedTemplates={editors && editors.map((editor) => editor.template)}
                        />
                    ) : null
                }
            >
                {hasError && (
                    <InlineError title={<FormattedMessage {...messages.sidebarMetadataErrorTitle} />}>
                        <FormattedMessage {...messages.sidebarMetadataErrorContent} />
                    </InlineError>
                )}
                {showLoadingIndicator && <LoadingIndicator />}
                {showEditor && (
                    <LoadingIndicatorWrapper isLoading={isLoading}>
                        <MetadataInstanceEditor
                            canAdd={canEdit}
                            editors={editors}
                            onSave={this.onSave}
                            onModification={this.onModification}
                            onAdd={this.onAdd}
                            onRemove={this.onRemove}
                            templates={templates}
                        />
                    </LoadingIndicatorWrapper>
                )}
            </SidebarContent>
        );
    }
}

export type MetadataSidebarProps = ExternalProps;
export { MetadataSidebar as MetadataSidebarComponent };
export default (props: PropsWithoutContext) => (
    <APIContext.Consumer>{(api) => <MetadataSidebar {...props} api={api} />}</APIContext.Consumer>
);
