// @flow
import * as React from 'react';
import { CompositeDecorator, EditorState } from 'draft-js';

import DraftJSMentionSelectorCore from './DraftJSMentionSelectorCore';
import DraftMentionItem from './DraftMentionItem';
import FormInput from '../form/FormInput';
import * as messages from '../input-messages';

/**
 * Scans a Draft ContentBlock for entity ranges, so they can be annotated
 * @see docs at {@link https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator}
 * @param {ContentBlock} contentBlock
 * @param {function} callback
 * @param {ContentState} contentState
 */
const mentionStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();

        const ret = entityKey !== null && contentState.getEntity(entityKey).getType() === 'MENTION';
        return ret;
    }, callback);
};

type Props = {
    className?: string,
    contacts: SelectorItems,
    editorState?: EditorState,
    hideLabel?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    label: React.Node,
    maxLength?: number,
    mentionTriggers?: Array<string>,
    minLength?: number,
    name: string,
    onChange?: Function,
    onFocus?: Function,
    onMention?: Function,
    onReturn?: Function,
    placeholder?: string,
    selectorRow?: React.Element<any>,
    startMentionMessage?: React.Node,
    validateOnBlur?: boolean,
};

type State = {
    contacts: SelectorItems,
    error: ?Object,
    hasReceivedFirstInteraction: boolean,
    internalEditorState: ?EditorState,
};

class DraftJSMentionSelector extends React.Component<Props, State> {
    static defaultProps = {
        isRequired: false,
        validateOnBlur: true,
    };

    constructor(props: Props) {
        super(props);

        const mentionDecorator = new CompositeDecorator([
            {
                strategy: mentionStrategy,
                component: DraftMentionItem,
            },
        ]);

        // @NOTE (smotraghi 2017-05-30):
        // This component might be either own its EditorState (in which case it lives in `this.state.internalEditorState`)
        // or be a controlled component whose EditorState is passed in via the `editorState` prop.
        // If `props.editorState` is set, `internalEditorState` is `null`,
        // otherwise we initialize it here
        this.state = {
            contacts: [],
            hasReceivedFirstInteraction: false,
            internalEditorState: props.editorState ? null : EditorState.createEmpty(mentionDecorator),
            error: null,
        };
    }

    /**
     * Lifecycle method that gets called when a component is receiving new props
     * @param {object} nextProps Props the component is receiving
     * @returns {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        const { editorState } = this.props;
        const { contacts, editorState: nextEditorState } = nextProps;
        let nextState = {};

        if (contacts) {
            nextState = { contacts };
        }

        // Only check if operating in the mode where EditorState is received as a
        // prop vs internalEditorState stored in state
        if (editorState) {
            const isCurrentEditorStateEmpty = this.isEditorStateEmpty(editorState);
            const isNextEditorStateEmpty = this.isEditorStateEmpty(nextEditorState);
            const isNewEditorState = isNextEditorStateEmpty && !isCurrentEditorStateEmpty;
            const isEditorStateDirty = isCurrentEditorStateEmpty && !isNextEditorStateEmpty;

            // Detect case where controlled EditorState is created anew and empty.
            // If next editorState is empty and the current editorState is not empty
            // that means it is a new empty state and this component should not be marked dirty
            if (isNewEditorState) {
                nextState = { ...nextState, hasReceivedFirstInteraction: false, error: null };
            } else if (isEditorStateDirty) {
                // Detect case where controlled EditorState has been made dirty
                // If the current editorState is empty and the next editorState is not
                // empty then this is the first interaction so mark this component dirty
                nextState = { ...nextState, hasReceivedFirstInteraction: true };
            }
        }

        if (Object.keys(nextState).length !== 0) {
            this.setState(nextState, this.checkValidity);
        }
    }

    isEditorStateEmpty(editorState: EditorState): boolean {
        const text = editorState
            .getCurrentContent()
            .getPlainText()
            .trim();
        const lastChangeType = editorState.getLastChangeType();

        return text.length === 0 && lastChangeType === null;
    }

    /**
     * @returns {string}
     */
    getErrorFromValidityState() {
        const { editorState: externalEditorState, isRequired, maxLength, minLength } = this.props;
        const { internalEditorState } = this.state;

        // manually check for content length if isRequired is true
        const editorState: EditorState = internalEditorState || externalEditorState;
        const length = editorState
            .getCurrentContent()
            .getPlainText()
            .trim().length;

        if (isRequired && !length) {
            return messages.valueMissing();
        }

        if (typeof minLength !== 'undefined' && length < minLength) {
            return messages.tooShort(minLength);
        }

        if (typeof maxLength !== 'undefined' && length > maxLength) {
            return messages.tooLong(maxLength);
        }

        return null;
    }

    containerEl: ?HTMLDivElement;

    /**
     * Event handler called on blur. Triggers validation
     * @param {SyntheticFocusEvent} event The event object
     * @returns {void}
     */
    handleBlur = (event: SyntheticFocusEvent<>) => {
        if (
            this.props.validateOnBlur &&
            this.containerEl &&
            event.relatedTarget instanceof Node &&
            !this.containerEl.contains(event.relatedTarget)
        ) {
            this.checkValidity();
        }
    };

    handleFocus = (event: SyntheticEvent<>) => {
        const { onFocus } = this.props;

        if (onFocus) {
            onFocus(event);
        }
    };

    /**
     * Updates editorState, rechecks validity
     * @param {EditorState} nextEditorState The new editor state to set in the state
     * @returns {void}
     */
    handleChange = (nextEditorState: EditorState) => {
        const { internalEditorState } = this.state;
        const { onChange } = this.props;

        if (internalEditorState) {
            const isCurrentEditorStateEmpty = this.isEditorStateEmpty(internalEditorState);
            const isNextEditorStateEmpty = this.isEditorStateEmpty(nextEditorState);
            const isEditorStateDirty = isCurrentEditorStateEmpty && !isNextEditorStateEmpty;

            let nextState = { internalEditorState: nextEditorState };

            // Detect case where controlled EditorState has been made dirty
            // If the current editorState is empty and the next editorState is not
            // empty then this is the first interaction so mark this component dirty
            if (isEditorStateDirty) {
                nextState = { ...nextState, hasReceivedFirstInteraction: true };
            }

            this.setState(nextState, () => {
                if (onChange) {
                    onChange(nextEditorState);
                }
                this.checkValidity();
            });
        } else if (onChange) {
            onChange(nextEditorState);
        }
    };

    handleValidityStateUpdateHandler = () => {
        if (!this.state.hasReceivedFirstInteraction) {
            return;
        }

        const error = this.getErrorFromValidityState();

        this.setState({ error });
    };

    checkValidity = () => {
        this.handleValidityStateUpdateHandler();
    };

    render() {
        const {
            className = '',
            editorState: externalEditorState,
            hideLabel,
            isDisabled,
            isRequired,
            label,
            mentionTriggers,
            name,
            onMention,
            placeholder,
            selectorRow,
            startMentionMessage,
            onReturn,
        } = this.props;
        const { contacts, internalEditorState, error } = this.state;
        const { handleBlur, handleChange, handleFocus } = this;
        const editorState: EditorState = internalEditorState || externalEditorState;

        return (
            <div
                ref={containerEl => {
                    this.containerEl = containerEl;
                }}
                className={className}
            >
                <FormInput name={name} onValidityStateUpdate={this.handleValidityStateUpdateHandler}>
                    <DraftJSMentionSelectorCore
                        contacts={contacts}
                        editorState={editorState}
                        error={error}
                        hideLabel={hideLabel}
                        isDisabled={isDisabled}
                        isRequired={isRequired}
                        label={label}
                        mentionTriggers={mentionTriggers}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onMention={onMention}
                        onReturn={onReturn}
                        placeholder={placeholder}
                        selectorRow={selectorRow}
                        startMentionMessage={startMentionMessage}
                    />
                </FormInput>
            </div>
        );
    }
}

export default DraftJSMentionSelector;
