// @flow
import * as React from 'react';
import { CompositeDecorator, EditorState, Modifier, SelectionState } from 'draft-js';
import noop from 'lodash/noop';

import DraftJSMentionSelectorCore from './DraftJSMentionSelectorCore';
import DraftMentionItem from './DraftMentionItem';
import DraftTimestampItem from './DraftTimestampItem';
import FormInput from '../form/FormInput';
import * as messages from '../input-messages';
import type { SelectorItems } from '../../../common/types/core';
import Toggle from '../../toggle/Toggle';
import { UNEDITABLE_TIMESTAMP_TEXT } from './utils';

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

/**
 * Scans a Draft ContentBlock for timestamp entity ranges
 * @see docs at {@link https://draftjs.org/docs/advanced-topics-decorators.html#compositedecorator}
 * @param {ContentBlock} contentBlock
 * @param {function} callback
 * @param {ContentState} contentState
 */
const timestampStrategy = (contentBlock: any, callback: (start: number, end: number) => void, contentState: any) => {
    if (!contentBlock || !contentState) return;
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        // $FlowFixMe
        const ret = entityKey !== null && contentState?.getEntity(entityKey)?.getType() === UNEDITABLE_TIMESTAMP_TEXT;
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
    timestampToggledOn: boolean,
};

class DraftJSMentionSelector extends React.Component<Props, State> {
    compositeDecorator: CompositeDecorator;

    static defaultProps = {
        isRequired: false,
        onChange: noop,
        validateOnBlur: true,
    };

    constructor(props: Props) {
        super(props);
        this.compositeDecorator = new CompositeDecorator([
            {
                strategy: mentionStrategy,
                component: DraftMentionItem,
            },
            {
                strategy: timestampStrategy,
                component: DraftTimestampItem,
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
            internalEditorState: props.editorState ? null : EditorState.createEmpty(this.compositeDecorator),
            error: null,
            timestampToggledOn: false,
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

        // If timestamplabel is set and isRequired is true then force the timestamp
        // to be added to the editor state as that is the specified default behavior for video comments
        if (
            this.props.timestampLabel &&
            this.props.isRequired !== prevProps.isRequired &&
            this.props.isRequired === true
        ) {
            this.toggleTimeStamp(currentEditorState, true);
        }
    }

    // Ensure external editor state has the decorator applied
    getEditorStateWithDecorator(editorState: EditorState): EditorState {
        if (!editorState) return editorState;

        // Check if the editor state already has our decorator
        const currentDecorator = editorState.getDecorator();
        if (currentDecorator === this.compositeDecorator) {
            return editorState;
        }

        // Apply our decorator to the editor state
        return EditorState.set(editorState, { decorator: this.compositeDecorator });
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

    toggleTimeStamp = (editorState: ?EditorState, forceOn: boolean = false) => {
        if (!editorState) return;
        const currentContent = editorState.getCurrentContent();

        let updatedContent;
        let newtimestampToggledOn;
        const { timestampToggledOn } = this.state;

        // If timestamp is already prepended and forceOn is true, do not toggle it.
        if (timestampToggledOn && forceOn) {
            return;
        }

        // check if the timestamp entity is already present in the content
        const timestampLength = this.getTimestampLength(currentContent, currentContent.getFirstBlock());
        const isTimestampEntityPresent = timestampLength > 0;
        if ((!timestampToggledOn || forceOn) && !isTimestampEntityPresent) {
            // get the current timestamp
            const timestamp = this.getVideoTimestamp();
            const timestampText = `${timestamp}`;
            // Create a new entity for the timestamp. It is immutable so it will not be editable.
            // $FlowFixMe
            const timestampEntity = currentContent?.createEntity(
                UNEDITABLE_TIMESTAMP_TEXT, // Entity type
                'IMMUTABLE',
                { timestamp },
            );

            // Create a selection at the very beginning of the input box for the timestamp
            const selectionAtStart = SelectionState.createEmpty(currentContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: 0,
            });

            // First insert the timestamp text followed by a space
            updatedContent = Modifier.insertText(currentContent, selectionAtStart, `${timestampText} `);

            // Then apply the entity to the inserted text (excluding the space)
            const selectionWithTimestamp = SelectionState.createEmpty(updatedContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: timestampText.length,
            });

            // Get the entity key for the timestamp entity
            const entityKey = timestampEntity.getLastCreatedEntityKey();

            // Apply the timestamp entity to the timestamp text not including the space. This will ensure that the timestamp is uneditable and that
            // the decorator will apply the proper styling to the timestamp.
            updatedContent = Modifier.applyEntity(updatedContent, selectionWithTimestamp, entityKey);

            newtimestampToggledOn = true;
        } else {
            // Create a selection range for the timestamp text and space so that we know what to remove and
            // to move it from the beginning of the input box
            const selectionToRemove = SelectionState.createEmpty(currentContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: timestampLength,
            });

            // Remove the timestamp text and space. No need for an entity key because we are not applying any entity to the text.
            updatedContent = Modifier.replaceText(currentContent, selectionToRemove, '');
            newtimestampToggledOn = false;
        }

        // Position cursor after the timestamp and space (if adding) or at the beginning (if removing)
        const cursorOffset = newtimestampToggledOn ? timestampLength : 0;
        // Create a selection that ensures the cursor is outside any entity. This is important because we want to ensure
        // that the cursor is not inside the timestamp component when if it is displayed
        const finalSelection = SelectionState.createEmpty(updatedContent.getFirstBlock().getKey()).merge({
            anchorOffset: cursorOffset,
            focusOffset: cursorOffset,
        });

        // Create a new EditorState with the updated content
        let newEditorState = EditorState.push(editorState, updatedContent, 'insert-characters');
        // Apply selection first
        newEditorState = EditorState.forceSelection(newEditorState, finalSelection);

        // Update state with new timestamp status
        this.setState({
            timestampToggledOn: newtimestampToggledOn,
        });

        // handle the change in the editor state
        this.handleChange(newEditorState);
    };

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
     * Calculates the length of the timestamp entity in the current block
     * @param {ContentState} currentContent The current content state
     * @param {ContentBlock} block The content block to analyze
     * @returns {number} The length of the timestamp entity (including the space after it)
     */
    getTimestampLength = (currentContent: any, block: any): number => {
        if (!block || !currentContent) {
            return 0;
        }
        let timestampLength = 0;
        const characterList = block.getCharacterList();

        // get the length of the timestamp entity. While the
        for (let i = 0; i < characterList.size; i += 1) {
            const char = characterList.get(i);
            if (char && char.getEntity()) {
                const entity = currentContent.getEntity(char.getEntity());
                if (entity.getType() === UNEDITABLE_TIMESTAMP_TEXT) {
                    timestampLength = i + 1;
                }
            }
        }
        // Include the space after the timestamp
        return timestampLength ? timestampLength + 1 : 0;
    };

    /**
     * Ensures cursor is never positioned before the timestamp entity
     * @param {EditorState} editorState The editor state to process
     * @returns {EditorState} The processed editor state with corrected cursor position
     */
    ensureCursorAfterTimestamp = (editorState: EditorState): EditorState => {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const blockKey = selection.getStartKey();
        const block = currentContent.getBlockForKey(blockKey);
        const startOffset = selection.getStartOffset();
        const timestampLength = this.getTimestampLength(currentContent, block);
        // If cursor is positioned before the timestamp, move it after
        if (startOffset === 0 && timestampLength > 0) {
            const newSelection = SelectionState.createEmpty(blockKey).merge({
                anchorOffset: timestampLength,
                focusOffset: timestampLength,
            });
            return EditorState.forceSelection(editorState, newSelection);
        }

        return editorState;
    };

    /**
     * Updates editorState, rechecks validity
     * @param {EditorState} nextEditorState The new editor state to set in the state
     * @returns {void}
     */
    handleChange = (nextEditorState: EditorState) => {
        const { internalEditorState, timestampToggledOn }: State = this.state;
        const { onChange }: Props = this.props;

        // Check if timestamp entity is still present in the content
        let processedEditorState = nextEditorState;
        let shouldToggletimestampToggledOnStateOff = false;
        // Update the timestamp prepended state to false if the timestamp entity is no longer present in the content
        // This can happen when the user deletes it with the backapsce key. Also ensure that the cursor is after the timestamp if it is present
        if (timestampToggledOn) {
            const currentContent = nextEditorState.getCurrentContent();
            const firstBlock = currentContent.getFirstBlock();
            const timestampLength = this.getTimestampLength(currentContent, firstBlock);
            const timestampEntityFound = timestampLength > 0;
            // If timestamp entity is no longer present, update the state
            if (!timestampEntityFound) {
                shouldToggletimestampToggledOnStateOff = true;
            } else {
                processedEditorState = this.ensureCursorAfterTimestamp(nextEditorState);
            }
        }

        onChange(processedEditorState);

        if (internalEditorState) {
            let newState = { internalEditorState: processedEditorState };
            if (shouldToggletimestampToggledOnStateOff) {
                newState = { internalEditorState: processedEditorState, timestampToggledOn: false };
            }
            this.setState(newState);
        } else if (shouldToggletimestampToggledOnStateOff) {
            this.setState({ timestampToggledOn: false });
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

    getVideoTimestamp = () => {
        const mediaDashContainer: ?HTMLElement = document.querySelector('.bp-media-dash');
        // $FlowFixMe
        const video: ?HTMLVideoElement = mediaDashContainer?.querySelector('video');

        // $FlowFixMe
        const totalSeconds = Math.floor(video?.currentTime || 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
        const { contacts, internalEditorState, error, timestampToggledOn } = this.state;
        const { handleBlur, handleChange, handleFocus, toggleTimeStamp } = this;
        const rawEditorState: EditorState = internalEditorState || externalEditorState;
        const editorState: EditorState = this.getEditorStateWithDecorator(rawEditorState);

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
                        <Toggle
                            className="bcs-CommentTimestamp-toggle"
                            label={timestampLabel}
                            isOn={timestampToggledOn}
                            onChange={() => toggleTimeStamp(editorState)}
                        />
                    )}
                </FormInput>
            </div>
        );
    }
}

export default DraftJSMentionSelector;
