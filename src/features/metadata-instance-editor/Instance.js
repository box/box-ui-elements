// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';

import type { AgentType } from '@box/box-ai-agent-selector';
import Collapsible from '../../components/collapsible/Collapsible';
import Form from '../../components/form-elements/form/Form';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import IconMetadataColored from '../../icons/general/IconMetadataColored';
import IconAlertCircle from '../../icons/general/IconAlertCircle';
import IconEdit from '../../icons/general/IconEdit';
import { bdlWatermelonRed } from '../../styles/variables';
import { scrollIntoView } from '../../utils/dom';

import CascadePolicy from './CascadePolicy';
import TemplatedInstance from './TemplatedInstance';
import CustomInstance from './CustomInstance';
import MetadataInstanceConfirmDialog from './MetadataInstanceConfirmDialog';
import Footer from './Footer';
import messages from './messages';
import { FIELD_TYPE_FLOAT, FIELD_TYPE_INTEGER } from '../metadata-instance-fields/constants';
import {
    CASCADE_POLICY_TYPE_AI_EXTRACT,
    TEMPLATE_CUSTOM_PROPERTIES,
    ENHANCED_AGENT_CONFIGURATION,
    ENHANCED_AGENT_ID,
} from './constants';
import {
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
} from '../../common/constants';
import { isValidValue } from '../metadata-instance-fields/validateMetadataField';
import { isHidden } from './metadataUtil';
import { RESIN_TAG_TARGET } from '../../common/variables';
import type {
    MetadataFields,
    MetadataTemplate,
    MetadataCascadePolicy,
    MetadataCascadePolicyConfiguration,
    MetadataCascadingPolicyData,
    MetadataTemplateField,
    MetadataFieldValue,
} from '../../common/types/metadata';
import type { JSONPatchOperations } from '../../common/types/api';
import './Instance.scss';

type Props = {
    canEdit: boolean,
    canUseAIFolderExtraction?: boolean,
    canUseAIFolderExtractionAgentSelector?: boolean,
    cascadePolicy?: MetadataCascadePolicy, // eslint-disable-line
    data: MetadataFields,
    hasError: boolean,
    id: string,
    intl: Object,
    isCascadingPolicyApplicable?: boolean,
    isDirty: boolean,
    isOpen: boolean,
    onModification?: (id: string, isDirty: boolean, type?: string) => void,
    onRemove?: (id: string) => void,
    onSave?: (
        id: string,
        data: JSONPatchOperations,
        cascadingPolicy?: MetadataCascadingPolicyData,
        rawData: Object,
    ) => void,
    template: MetadataTemplate,
};

type State = {
    cascadePolicyConfiguration: MetadataCascadePolicyConfiguration | null,
    data: Object,
    errors: { [string]: React.Node },
    isAIFolderExtractionEnabled: boolean,
    isBusy: boolean,
    isCascadingEnabled: boolean,
    isCascadingOverwritten: boolean,
    isEditing: boolean,
    shouldConfirmRemove: boolean,
    shouldShowCascadeOptions: boolean,
};

const createFieldKeyToTypeMap = (fields?: Array<MetadataTemplateField> = []) =>
    fields.reduce((prev, { key, type }) => {
        prev[key] = type;
        return prev;
    }, {});

const getValue = (data: Object, key: string, type: string) => {
    const value = data[key];

    switch (type) {
        case FIELD_TYPE_FLOAT:
            return parseFloat(value);

        case FIELD_TYPE_INTEGER:
            return parseInt(value, 10);

        default:
            return value;
    }
};

class Instance extends React.PureComponent<Props, State> {
    static defaultProps = {
        data: {},
        isDirty: false,
    };

    constructor(props: Props) {
        super(props);
        this.state = this.getState(props);
        this.fieldKeyToTypeMap = createFieldKeyToTypeMap(props.template.fields);
    }

    componentDidUpdate({ hasError: prevHasError, isDirty: prevIsDirty }: Props, prevState: State): void {
        const currentElement = this.collapsibleRef.current;
        const { hasError, isDirty }: Props = this.props;
        const { isEditing }: State = prevState;

        if (currentElement && this.state.shouldConfirmRemove) {
            scrollIntoView(currentElement, {
                block: 'start',
                behavior: 'smooth',
            });
        }

        if (hasError && hasError !== prevHasError) {
            // If hasError is true, which means an error occurred while
            // doing a network operation and hence hide the busy indicator
            // Saving also disables isEditing, so need to enable that back.
            // isDirty remains as it was before.
            this.setState({ isBusy: false, isEditing: true });
        } else if (prevIsDirty && !isDirty) {
            // If the form was dirty and now its not dirty
            // we know a successful save may have happened.
            // We don't modify isEditing here because we maintain the
            // prior state for that. If we came here from a save
            // success then save already disabled isEditing.
            if (isEditing) {
                // We are still editing so don't reset it
                this.setState({ isBusy: false });
            } else {
                // For a successfull save we reset cascading overwrite radio
                this.setState({ isBusy: false, isCascadingOverwritten: false });
            }
        }
    }

    /**
     * Undo any changes made
     *
     * @return {void}
     */
    onCancel = (): void => {
        const { id, onModification }: Props = this.props;
        this.setState(this.getState(this.props));

        // Callback to parent to tell that something is dirty
        if (onModification) {
            onModification(id, false);
        }
    };

    /**
     * Allows a user to confirm metadata instance removal
     *
     * @return {void}
     */
    onConfirmRemove = (): void => {
        this.setState({ shouldConfirmRemove: true });
    };

    /**
     * Cancel the remove instance attempt
     *
     * @return {void}
     */
    onConfirmCancel = (): void => {
        this.setState({ shouldConfirmRemove: false });
    };

    /**
     * Removes an instance
     *
     * @return {void}
     */
    onRemove = (): void => {
        if (!this.isEditing()) {
            return;
        }

        const { id, onRemove }: Props = this.props;
        if (onRemove) {
            onRemove(id);
            this.setState({ isBusy: true });
        }
    };

    /**
     * Saves instance data
     *
     * @return {void}
     */
    onSave = (): void => {
        const {
            cascadePolicy,
            data: originalData,
            id,
            isDirty,
            isCascadingPolicyApplicable,
            onSave,
        }: Props = this.props;
        const {
            cascadePolicyConfiguration,
            data: currentData,
            errors,
            isAIFolderExtractionEnabled,
            isCascadingEnabled,
            isCascadingOverwritten,
        }: State = this.state;

        if (!this.isEditing() || !isDirty || !onSave || Object.keys(errors).length) {
            return;
        }

        this.setState({
            isBusy: true,
            isEditing: false,
            // reset state if cascading policy is removed
            isAIFolderExtractionEnabled: isCascadingEnabled ? isAIFolderExtractionEnabled : false,
        });

        onSave(
            id,
            this.createJSONPatch(currentData, originalData),
            isCascadingPolicyApplicable
                ? {
                      canEdit: cascadePolicy ? cascadePolicy.canEdit : false,
                      id: cascadePolicy ? cascadePolicy.id : undefined,
                      isEnabled: isCascadingEnabled,
                      overwrite: isCascadingOverwritten,
                      isAIFolderExtractionEnabled,
                      cascadePolicyConfiguration,
                  }
                : undefined,
            cloneDeep(currentData),
        );
    };

    /**
     * Updates a key value in the instance data
     *
     * @param {string} key - key to update
     * @param {FieldValue} value - value to update
     * @param {string} type - type of field
     * @return {void}
     */
    onFieldChange = (key: string, value: MetadataFieldValue, type: string): void => {
        const { data, errors }: State = this.state;

        // Don't do anything if data is the same or not in edit mode
        if (!this.isEditing() || isEqual(data[key], value)) {
            return;
        }

        const isValid = isValidValue(type, value);
        const finalErrors = { ...errors };
        const finalData = cloneDeep(data);
        finalData[key] = value;

        if (isValid) {
            delete finalErrors[key];
        } else {
            finalErrors[key] = <FormattedMessage {...messages.invalidInput} />;
        }

        this.setState({ data: finalData, errors: finalErrors }, () => {
            this.setDirty(type);
        });
    };

    /**
     * Removes a key from instance data
     *
     * @param {string} key - key to remove
     * @return {void}
     */
    onFieldRemove = (key: string): void => {
        if (!this.isEditing()) {
            return;
        }

        const { data, errors }: State = this.state;
        const finalData = cloneDeep(data);
        const finalErrors = { ...errors };
        delete finalData[key];
        delete finalErrors[key];
        this.setState({ data: finalData, errors: finalErrors }, this.setDirty);
    };

    /**
     * Toggle cascading policy
     *
     * @param {boolean} value - true when turned on
     * @return {void}
     */
    onCascadeToggle = (value: boolean) => {
        const { isCascadingPolicyApplicable }: Props = this.props;
        if (!isCascadingPolicyApplicable) {
            return;
        }

        this.setState(
            {
                isCascadingEnabled: value,
                shouldShowCascadeOptions: value,
            },
            this.setDirty,
        );
    };

    /**
     * Changes the cascade mode.
     * isCascadingOverwritten is slways false to start off.
     *
     * @param {boolean} value - true when overwrite policy is chosen
     * @return {void}
     */
    onCascadeModeChange = (value: boolean): void => {
        const { isCascadingPolicyApplicable }: Props = this.props;
        if (!isCascadingPolicyApplicable) {
            return;
        }

        this.setState(
            {
                isCascadingOverwritten: value,
            },
            this.setDirty,
        );
    };

    onAIFolderExtractionToggle = (value: boolean) => {
        this.setState({ isAIFolderExtractionEnabled: value }, this.setDirty);
    };

    /**
     * Handles the selection of an AI agent
     * @param {AgentType | null} agent - The selected agent
     */
    onAIAgentSelect = (agent: AgentType | null): void => {
        // '2' is the id for the enhanced agent
        if (agent && agent.id === ENHANCED_AGENT_ID) {
            this.setState({
                cascadePolicyConfiguration: {
                    agent: ENHANCED_AGENT_CONFIGURATION,
                },
            });
        } else {
            this.setState({ cascadePolicyConfiguration: null });
        }
    };

    /**
     * Returns the state from props
     *
     * @return {Object} - react state
     */
    getState(props: Props): State {
        const isCascadingEnabled = this.isCascadingEnabledThroughProps(props);

        return {
            cascadePolicyConfiguration: null,
            data: cloneDeep(props.data),
            errors: {},
            isAIFolderExtractionEnabled: this.isAIFolderExtractionEnabledThroughProps(props),
            isBusy: false,
            isCascadingEnabled,
            isCascadingOverwritten: false,
            isEditing: false,
            shouldConfirmRemove: false,
            shouldShowCascadeOptions: isCascadingEnabled,
        };
    }

    /**
     * Returns the card title with possible error mark
     *
     * @return {Object} - react title element
     */
    getTitle(): React.Node {
        const { cascadePolicy = {}, hasError, isCascadingPolicyApplicable, template }: Props = this.props;
        const isProperties = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES;

        const type = isCascadingPolicyApplicable && cascadePolicy.id ? 'cascade' : 'default';

        return (
            <span className="metadata-instance-editor-instance-title">
                <IconMetadataColored type={type} />
                <span
                    className={classNames('metadata-instance-editor-instance-title-text', {
                        'metadata-instance-editor-instance-has-error': hasError,
                    })}
                >
                    {isProperties ? <FormattedMessage {...messages.customTitle} /> : template.displayName}
                </span>
                {hasError && <IconAlertCircle color={bdlWatermelonRed} />}
            </span>
        );
    }

    /**
     * Render the correct delete message to show based on custom metadata and file/folder metadata
     */
    renderDeleteMessage = (isFile: boolean, template: Object) => {
        let message;
        const isProperties = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES;

        if (isProperties) {
            message = isFile ? 'fileMetadataRemoveCustomTemplateConfirm' : 'folderMetadataRemoveCustomTemplateConfirm';
        } else {
            message = isFile ? 'fileMetadataRemoveTemplateConfirm' : 'folderMetadataRemoveTemplateConfirm';
        }

        return (
            <FormattedMessage
                {...messages[message]}
                values={{
                    metadataName: template.displayName,
                }}
            />
        );
    };

    /**
     * Get the delete confirmation message base on the template key
     */
    getConfirmationMessage(): React.Node {
        const { template, isCascadingPolicyApplicable }: Props = this.props;
        const isFile = !isCascadingPolicyApplicable;
        return this.renderDeleteMessage(isFile, template);
    }

    /**
     * Evaluates if the metadata was changed or cascading policy
     * altered or enabled.
     *
     * @return {void}
     */
    setDirty = (type?: string): void => {
        const { id, isCascadingPolicyApplicable, onModification }: Props = this.props;
        const { data, isCascadingEnabled, isCascadingOverwritten, isAIFolderExtractionEnabled } = this.state;
        const hasDataChanged = !isEqual(data, this.props.data);
        let hasCascadingChanged = false;

        if (isCascadingPolicyApplicable) {
            // isCascadingOverwritten always starts out as false, so true signifies a change
            hasCascadingChanged =
                isCascadingOverwritten ||
                isCascadingEnabled !== this.isCascadingEnabledThroughProps(this.props) ||
                isAIFolderExtractionEnabled !== this.isAIFolderExtractionEnabledThroughProps(this.props);
        }

        // Callback to parent to tell that something is dirty
        if (onModification) {
            onModification(id, hasDataChanged || hasCascadingChanged, type);
        }
    };

    collapsibleRef: {
        current: null | HTMLDivElement,
    } = React.createRef();

    fieldKeyToTypeMap: Object;

    /**
     * Determines if cascading policy is enabled through props based on
     * whether it has an id or not.
     *
     * @param {Object} props - component props
     * @return {boolean} true if cascading policy is enabled
     */
    isCascadingEnabledThroughProps(props: Props) {
        if (props.cascadePolicy) {
            return !!props.cascadePolicy.id;
        }
        return false;
    }

    /**
     * Determines if ai extraction is enabled based on
     * if cascade policy type is ai_extract
     *
     * @param {Object} props - component props
     * @return {boolean} true if ai extraction is enabled
     */
    isAIFolderExtractionEnabledThroughProps({ cascadePolicy }: Props) {
        return cascadePolicy?.cascadePolicyType === CASCADE_POLICY_TYPE_AI_EXTRACT;
    }

    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    toggleIsEditing = (): void => {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing,
        }));
    };

    /**
     * Creates JSON Patch operations from the passed in
     * data while comparing it to the original data from props.
     *
     * Only diffs at the root level and primitives.
     *
     * @param {*} currentData - the latest changes by the user
     * @param {*} originalData - the original values
     * @return {Array} - JSON patch operations
     */
    createJSONPatch(currentData: Object, originalData: Object): JSONPatchOperations {
        const ops = [];
        const data = cloneDeep(currentData); // clone the data for mutation

        // Iterate over the original data and find keys that have changed.
        // Also remove them from the data object to only leave new keys.
        Object.keys(originalData).forEach(key => {
            const type = this.fieldKeyToTypeMap[key];
            const originalValue = getValue(originalData, key, type);
            const path = `/${key}`;

            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = getValue(data, key, type);

                // Only register changed data
                if (!isEqual(value, originalValue)) {
                    // Add a test OP for each replaces
                    ops.push({
                        op: JSON_PATCH_OP_TEST,
                        path,
                        value: originalValue,
                    });
                    ops.push({
                        op: JSON_PATCH_OP_REPLACE,
                        path,
                        value,
                    });
                }
            } else {
                // Key was removed
                // Add a test OP for removes
                ops.push({
                    op: JSON_PATCH_OP_TEST,
                    path,
                    value: originalValue,
                });
                ops.push({ op: JSON_PATCH_OP_REMOVE, path });
            }
            delete data[key];
        });

        // Iterate over the remaining keys that are new.
        Object.keys(data).forEach(key => {
            const type = this.fieldKeyToTypeMap[key];
            const value = getValue(data, key, type);

            ops.push({
                op: JSON_PATCH_OP_ADD,
                path: `/${key}`,
                value,
            });
        });

        return ops;
    }

    /**
     * Utility function to determine if instance is editable
     *
     * @return {boolean} true if editable
     */
    canEdit(): boolean {
        const { canEdit, onModification, onRemove, onSave }: Props = this.props;
        return (
            canEdit &&
            typeof onRemove === 'function' &&
            typeof onSave === 'function' &&
            typeof onModification === 'function'
        );
    }

    /**
     * Utility function to determine if instance is in edit mode
     *
     * @return {boolean} true if editing
     */
    isEditing(): boolean {
        const { isEditing }: State = this.state;
        return this.canEdit() && isEditing;
    }

    renderEditButton = () => {
        const { intl, isDirty }: Props = this.props;
        const { isBusy }: State = this.state;
        const canEdit = this.canEdit();
        const isEditing = this.isEditing();
        const editClassName = classNames('metadata-instance-editor-instance-edit', {
            'metadata-instance-editor-instance-is-editing': isEditing,
        });

        if (canEdit && !isDirty && !isBusy) {
            const metadataLabelEditText = intl.formatMessage(messages.metadataEditTooltip);
            return (
                <Tooltip position="top-left" text={metadataLabelEditText}>
                    <PlainButton
                        aria-label={metadataLabelEditText}
                        aria-pressed={isEditing}
                        className={editClassName}
                        data-resin-target="metadata-instanceedit"
                        onClick={this.toggleIsEditing}
                        type="button"
                    >
                        <IconEdit />
                    </PlainButton>
                </Tooltip>
            );
        }
        return null;
    };

    render() {
        const {
            canUseAIFolderExtraction = false,
            canUseAIFolderExtractionAgentSelector = false,
            cascadePolicy = {},
            isDirty,
            isCascadingPolicyApplicable,
            isOpen,
            template,
        }: Props = this.props;
        const { fields = [] } = template;
        const {
            data,
            errors,
            isBusy,
            isAIFolderExtractionEnabled,
            isCascadingEnabled,
            shouldConfirmRemove,
            shouldShowCascadeOptions,
            isCascadingOverwritten,
        }: State = this.state;
        const isProperties = template.templateKey === TEMPLATE_CUSTOM_PROPERTIES;
        const isEditing = this.isEditing();

        if (!template || isHidden(template)) {
            return null;
        }

        // Animate short and tall cards at consistent speeds.
        const animationDuration = (fields.length + 1) * 50;

        const isExistingCascadePolicy = this.isCascadingEnabledThroughProps(this.props);

        return (
            <div ref={this.collapsibleRef}>
                <Collapsible
                    animationDuration={animationDuration}
                    buttonProps={{
                        [RESIN_TAG_TARGET]: 'metadata-card',
                    }}
                    hasStickyHeader
                    headerActionItems={this.renderEditButton()}
                    isBordered
                    isOpen={isOpen}
                    title={this.getTitle()}
                >
                    {shouldConfirmRemove && (
                        <LoadingIndicatorWrapper isLoading={isBusy}>
                            <MetadataInstanceConfirmDialog
                                confirmationMessage={this.getConfirmationMessage()}
                                onCancel={this.onConfirmCancel}
                                onConfirm={this.onRemove}
                            />
                        </LoadingIndicatorWrapper>
                    )}
                    {!shouldConfirmRemove && (
                        <LoadingIndicatorWrapper isLoading={isBusy}>
                            <Form onValidSubmit={isDirty ? this.onSave : noop}>
                                <div className="metadata-instance-editor-instance">
                                    {isCascadingPolicyApplicable && (
                                        <CascadePolicy
                                            canEdit={isEditing && !!cascadePolicy.canEdit}
                                            canUseAIFolderExtraction={canUseAIFolderExtraction}
                                            canUseAIFolderExtractionAgentSelector={
                                                canUseAIFolderExtractionAgentSelector
                                            }
                                            isAIFolderExtractionEnabled={isAIFolderExtractionEnabled}
                                            isCascadingEnabled={isCascadingEnabled}
                                            isCascadingOverwritten={isCascadingOverwritten}
                                            isCustomMetadata={isProperties}
                                            isExistingCascadePolicy={isExistingCascadePolicy}
                                            onAIAgentSelect={this.onAIAgentSelect}
                                            onAIFolderExtractionToggle={this.onAIFolderExtractionToggle}
                                            onCascadeModeChange={this.onCascadeModeChange}
                                            onCascadeToggle={this.onCascadeToggle}
                                            shouldShowCascadeOptions={shouldShowCascadeOptions}
                                        />
                                    )}
                                    {isProperties ? (
                                        <CustomInstance
                                            canEdit={isEditing}
                                            data={data}
                                            onFieldChange={this.onFieldChange}
                                            onFieldRemove={this.onFieldRemove}
                                        />
                                    ) : (
                                        <TemplatedInstance
                                            canEdit={isEditing}
                                            data={data}
                                            errors={errors}
                                            isDisabled={isAIFolderExtractionEnabled}
                                            onFieldChange={this.onFieldChange}
                                            onFieldRemove={this.onFieldRemove}
                                            template={template}
                                        />
                                    )}
                                </div>
                                {isEditing && (
                                    <Footer
                                        onCancel={this.onCancel}
                                        onRemove={this.onConfirmRemove}
                                        showSave={isDirty}
                                    />
                                )}
                            </Form>
                        </LoadingIndicatorWrapper>
                    )}
                </Collapsible>
            </div>
        );
    }
}

export { Instance as InstanceBase };
export default injectIntl(Instance);
