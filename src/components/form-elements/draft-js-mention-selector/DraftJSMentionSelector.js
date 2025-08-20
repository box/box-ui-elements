// @flow
import * as React from 'react';
import { CompositeDecorator, EditorState } from 'draft-js';
import noop from 'lodash/noop';

import DraftJSMentionSelectorCore from './DraftJSMentionSelectorCore';
import DraftMentionItem from './DraftMentionItem';
import FormInput from '../form/FormInput';
import * as messages from '../input-messages';
import type { SelectorItems } from '../../../common/types/core';
import Toggle from '../../toggle/Toggle';

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
    contacts: SelectorItems<>,
    contactsLoaded?: boolean,
    description?: React.Node,
    editorState?: EditorState,
    hideLabel?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    label: React.Node,
    maxLength?: number,
    mentionTriggers?: Array<string>,
    minLength?: number,
    name: string,
    onChange: Function,
    onFocus?: Function,
    onMention?: Function,
    onReturn?: Function,
    placeholder?: string,
    selectorRow?: React.Element<any>,
    startMentionMessage?: React.Node,
    timestampLabel?: string | null,
    validateOnBlur?: boolean,
};

type State = {
    contacts: SelectorItems<>,
    error: ?Object,
    internalEditorState: ?EditorState,
    isTouched: boolean,
};

class DraftJSMentionSelector extends React.Component<Props, State> {
    static defaultProps = {
        isRequired: false,
        onChange: noop,
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

        // @NOTE:
        // This component might be either own its EditorState (in which case it lives in `this.state.internalEditorState`)
        // or be a controlled component whose EditorState is passed in via the `editorState` prop.
        // If `props.editorState` is set, `internalEditorState` is `null`,
        // otherwise we initialize it here
        this.state = {
            contacts: [],
            isTouched: false,
            internalEditorState: props.editorState ? null : EditorState.createEmpty(mentionDecorator),
            error: null,
        };
    }

    static getDerivedStateFromProps(nextProps: Props) {
        const { contacts } = nextProps;
        return contacts ? { contacts } : null;
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { internalEditorState: prevInternalEditorState } = prevState;
        const { internalEditorState } = this.state;

        const { editorState: prevEditorStateFromProps } = prevProps;
        const { editorState } = this.props;

        // Determine whether we're working with the internal editor state or
        // external editor state passed in from props
        const prevEditorState = prevInternalEditorState || prevEditorStateFromProps;
        const currentEditorState = internalEditorState || editorState;

        // Only handle isTouched state transitions and check validity if the
        // editorState references are different. This is to avoid getting stuck
        // in an infinite loop of checking validity because checkValidity always
        // calls setState({ error })
        if (prevEditorState && currentEditorState && prevEditorState !== currentEditorState) {
            const newState = this.getDerivedStateFromEditorState(currentEditorState, prevEditorState);
            if (newState) {
                this.setState(newState, this.checkValidityIfAllowed);
            } else {
                this.checkValidityIfAllowed();
            }
        }
    }

    getDerivedStateFromEditorState(currentEditorState: EditorState, previousEditorState: EditorState) {
        const isPreviousEditorStateEmpty = this.isEditorStateEmpty(previousEditorState);
        const isCurrentEditorStateEmpty = this.isEditorStateEmpty(currentEditorState);
        const isNewEditorState = isCurrentEditorStateEmpty && !isPreviousEditorStateEmpty;
        const isEditorStateDirty = isPreviousEditorStateEmpty && !isCurrentEditorStateEmpty;

        let newState = null;
        // Detect case where controlled EditorState is created anew and empty.
        // If next editorState is empty and the current editorState is not empty
        // that means it is a new empty state and this component should not be marked dirty
        if (isNewEditorState) {
            newState = { isTouched: false, error: null };
        } else if (isEditorStateDirty) {
            // Detect case where controlled EditorState has been made dirty
            // If the current editorState is empty and the next editorState is not
            // empty then this is the first interaction so mark this component dirty
            newState = { isTouched: true };
        }

        return newState;
    }

    checkValidityIfAllowed() {
        const { validateOnBlur }: Props = this.props;

        if (!validateOnBlur) {
            this.checkValidity();
        }
    }

    isEditorStateEmpty(editorState: EditorState): boolean {
        const text = editorState.getCurrentContent().getPlainText().trim();
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
        const { length } = editorState.getCurrentContent().getPlainText().trim();

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
        const { internalEditorState }: State = this.state;
        const { onChange }: Props = this.props;

        onChange(nextEditorState);

        if (internalEditorState) {
            this.setState({ internalEditorState: nextEditorState });
        }
    };

    handleValidityStateUpdateHandler = () => {
        const { isTouched } = this.state;

        if (!isTouched) {
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
            contactsLoaded,
            editorState: externalEditorState,
            hideLabel,
            isDisabled,
            isRequired,
            label,
            description,
            mentionTriggers,
            name,
            onMention,
            placeholder,
            selectorRow,
            startMentionMessage,
            onReturn,
            timestampLabel,
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
                        contactsLoaded={contactsLoaded}
                        editorState={editorState}
                        error={error}
                        hideLabel={hideLabel}
                        isDisabled={isDisabled}
                        isRequired={isRequired}
                        label={label}
                        description={description}
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

                    {isRequired && timestampLabel && (
                        <Toggle className="bcs-CommentTimestamp-toggle" label={timestampLabel} onChange={noop} />
                    )}
                </FormInput>
            </div>
        );
    }
}

export default DraftJSMentionSelector;
