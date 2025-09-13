// @flow
import * as React from 'react';
import { CompositeDecorator, EditorState, Modifier, SelectionState, ContentState } from 'draft-js';
import noop from 'lodash/noop';

import DraftJSMentionSelectorCore from './DraftJSMentionSelectorCore';
import DraftMentionItem from './DraftMentionItem';
import DraftTimestampItem from './DraftTimestampItem';
import FormInput from '../form/FormInput';
import * as messages from '../input-messages';
import type { SelectorItems } from '../../../common/types/core';
import Toggle from '../../toggle/Toggle';
import { UNEDITABLE_TIMESTAMP_TEXT } from './utils';
import { convertSecondsToHMMSS } from '../../../utils/timestampUtils';

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
    if (!contentBlock || !contentState) {
        return;
    }
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        const hasEntityKey = entityKey !== null;
        // $FlowFixMe
        const entityType = hasEntityKey && contentState?.getEntity(entityKey)?.getType();
        const timeStampEntityFound = entityType === UNEDITABLE_TIMESTAMP_TEXT;
        return timeStampEntityFound;
    }, callback);
};

type Props = {
    className?: string,
    contacts: SelectorItems<>,
    contactsLoaded?: boolean,
    description?: React.Node,
    editorState?: EditorState,
    fileVersionId?: string,
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
    isTimestampToggledOn: boolean,
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
            isTimestampToggledOn: false,
        };
    }

    static getDerivedStateFromProps(nextProps: Props) {
        const { contacts } = nextProps;
        return contacts ? { contacts } : null;
    }

    componentDidMount() {
        // if video timestamping is enabled we need to check if a timestamp entity is present in the editor state passed in via props
        // and if it is then set the isTimestampToggledOn state to true. This happens when the user is edeting a comment
        // that has a timestamp entity.
        if (this.getIsVideoTimestampEnabled()) {
            const { isTimestampToggledOn, internalEditorState } = this.state;
            const { editorState: externalEditorState } = this.props;
            const currentEditorState = internalEditorState || externalEditorState;
            // it video timestamping is enabled and the editor state is being passed in check if a timestamp entity is present
            // and if it is then set the isTimestampToggledOn state to true.
            if (!isTimestampToggledOn && currentEditorState) {
                const currentContent = currentEditorState.getCurrentContent();
                const isTimeStampEntityPresent = this.getIsTimestampEntityPresent(currentContent);
                if (isTimeStampEntityPresent) {
                    this.setState({ isTimestampToggledOn: true });
                }
            }
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { internalEditorState: prevInternalEditorState } = prevState;
        const { internalEditorState } = this.state;
        const { editorState: prevEditorStateFromProps, isRequired: prevIsRequiredFromProps } = prevProps;
        const { editorState, isRequired } = this.props;

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

        // if isRequired is false then the comment box will be closed and we want
        // to make sure that isTimestampToggledOn is always set to false in this casee
        if (this.getIsVideoTimestampEnabled() && isRequired !== prevIsRequiredFromProps && isRequired === false) {
            this.setState({ isTimestampToggledOn: false });
        }

        // If timestamplabel is set and isRequired is true then force the timestamp
        // to be added to the editor state as that is the specified default behavior for video comments
        if (this.getIsVideoTimestampEnabled() && isRequired !== prevIsRequiredFromProps && isRequired === true) {
            this.toggleTimestamp(currentEditorState, true);
        }
    }

    getIsVideoTimestampEnabled = () => {
        const { timestampLabel } = this.props;
        return !!timestampLabel && timestampLabel.trim() !== '';
    };

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

    toggleTimestamp = (editorState: ?EditorState, forceOn: boolean = false) => {
        if (!editorState) return;
        const currentContent = editorState.getCurrentContent();

        let updatedContent;
        let newIsTimestampToggledOn;
        const { isTimestampToggledOn } = this.state;

        // If timestamp is already prepended and forceOn is true, do not toggle it.
        if (isTimestampToggledOn && forceOn) {
            return;
        }

        const timestampLengthIncludingSpace = this.getTimestampLength(currentContent, currentContent.getFirstBlock());
        const isTimestampEntityPresent = timestampLengthIncludingSpace > 0;

        // check if we need to toggle the timestamp on and that the timestamp entity is not already present in the content
        if ((!isTimestampToggledOn || forceOn) && !isTimestampEntityPresent) {
            // get the current timestamp
            const { timestamp, timestampInMilliseconds } = this.getVideoTimestamp();
            const { fileVersionId } = this.props;
            const timestampText = `${timestamp}`;
            // Create a new entity for the timestamp. It is immutable so it will not be editable. Adding
            // timestampInMilliseconds, and fileVersionId to the entity data which will be used when the comment form is submitted
            // and will be added to the text of the comment. This will let us filter out timetsamped comments based on version and also
            // be able to click the timestamp button in comments in the sidebar and got to the proper place in the video.
            // $FlowFixMe
            const timestampEntity = currentContent?.createEntity(
                UNEDITABLE_TIMESTAMP_TEXT, // Entity type
                'IMMUTABLE',
                { timestampInMilliseconds, fileVersionId },
            );

            // Create a selection at the very beginning of the input box for the timestamp
            const selectionAtStart = SelectionState.createEmpty(currentContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: 0,
            });

            // First insert the timestamp text followed by a space
            updatedContent = Modifier.insertText(currentContent, selectionAtStart, `${timestampText} `);

            // Then select the timestamp text not including the space
            const selectionWithTimestamp = SelectionState.createEmpty(updatedContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: timestampText.length,
            });

            // Get the entity key for the timestamp entity
            const entityKey = timestampEntity.getLastCreatedEntityKey();

            // Apply the timestamp entity to selected timestamp text. This will ensure that the timestamp is uneditable and that
            // the decorator will apply the proper styling to the timestamp.
            updatedContent = Modifier.applyEntity(updatedContent, selectionWithTimestamp, entityKey);

            newIsTimestampToggledOn = true;
        } else {
            // Create a selection range for the timestamp text and space so that we know what to remove and
            // remove it from the beginning of the input box. This uses the timestsamp length that we calculated earlier.
            const selectionToRemove = SelectionState.createEmpty(currentContent.getFirstBlock().getKey()).merge({
                anchorOffset: 0,
                focusOffset: timestampLengthIncludingSpace,
            });

            // Remove the timestamp text and space. No need for an entity key because we are not applying any entity to the text.
            updatedContent = Modifier.replaceText(currentContent, selectionToRemove, '');
            newIsTimestampToggledOn = false;
        }

        // Position cursor after the timestamp and space (if adding) or at the beginning (if removing)
        const cursorOffset = newIsTimestampToggledOn ? timestampLengthIncludingSpace : 0;
        // Create a selection that ensures the cursor is outside any entity. This is important because we want to ensure
        // that the cursor is not inside the timestamp component when it is displayed
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
            isTimestampToggledOn: newIsTimestampToggledOn,
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

    getIsTimestampEntityPresent = (currentContent: ContentState): boolean => {
        return this.getTimestampLength(currentContent, currentContent.getFirstBlock()) > 0;
    };

    /**
     * Calculates the length of the timestamp entity in the current block
     * @param {ContentState} currentContent The current content state
     * @param {ContentBlock} block The content block to analyze
     * @returns {number} The length of the timestamp entity (including the space after it)
     */
    getTimestampLength = (currentContent: ContentState, block: any): number => {
        if (!block || !currentContent) {
            return 0;
        }
        let timestampLength = 0;
        const characterList = block.getCharacterList();

        // get the length of the timestamp entity. This will include the space after the timestamp.
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
     * Updates editorState, rechecks validity
     * @param {EditorState} nextEditorState The new editor state to set in the state
     * @returns {void}
     */
    handleChange = (nextEditorState: EditorState) => {
        const { internalEditorState, isTimestampToggledOn }: State = this.state;
        const { onChange }: Props = this.props;

        // Check if timestamp entity is still present in the content if video timestamping is enabled.
        // Update the timestamp prepended state to false if the timestamp entity is no longer present in the editor content
        // This can happen when the user deletes it with the backspace key.
        if (this.getIsVideoTimestampEnabled() && isTimestampToggledOn) {
            const currentContent = nextEditorState.getCurrentContent();
            const firstBlock = currentContent.getFirstBlock();
            const timestampLength = this.getTimestampLength(currentContent, firstBlock);
            const timestampEntityFound = timestampLength > 0;
            // If timestamp entity is no longer present, update the state
            if (!timestampEntityFound) {
                this.setState({ isTimestampToggledOn: false });
            } else {
                // Check if the timestamp entity is at the beginning of the content, if not do not update the editor state.
                // This is to prevent the user from inserting text before the timestamp entity.
                const characterList = firstBlock.getCharacterList();
                const firstChar = characterList.get(0);
                if (firstChar && !firstChar.getEntity()) {
                    return;
                }
            }
        }

        onChange(nextEditorState);

        if (internalEditorState) {
            const newState = { internalEditorState: nextEditorState };
            this.setState(newState);
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

    getVideoTimestamp = (): { timestamp: string, timestampInMilliseconds: number } => {
        const mediaDashContainer: ?HTMLElement = document.querySelector('.bp-media-dash');
        // $FlowFixMe
        const video: ?HTMLVideoElement = mediaDashContainer?.querySelector('video');

        const currentTime = video?.currentTime || 0;

        // $FlowFixMe
        const totalSeconds = Math.floor(currentTime || 0);
        const timestampToDisplay = convertSecondsToHMMSS(totalSeconds);

        const timestampInMilliseconds = Math.floor(currentTime * 1000);

        return { timestamp: timestampToDisplay, timestampInMilliseconds };
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
        const { contacts, internalEditorState, error, isTimestampToggledOn: timestampToggledOn } = this.state;
        const { handleBlur, handleChange, handleFocus, toggleTimestamp } = this;
        let editorState: EditorState = internalEditorState || externalEditorState;

        // Ensure the editor state has the composite decorator
        if (editorState.getDecorator() !== this.compositeDecorator) {
            editorState = EditorState.set(editorState, { decorator: this.compositeDecorator });
        }

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

                    {isRequired && this.getIsVideoTimestampEnabled() && (
                        <Toggle
                            className="bcs-CommentTimestamp-toggle"
                            // $FlowFixMe - timestampLabel is guaranteed to be defined when getIsVideoTimestampEnabled() returns true
                            label={timestampLabel}
                            isOn={timestampToggledOn}
                            onChange={() => toggleTimestamp(editorState)}
                        />
                    )}
                </FormInput>
            </div>
        );
    }
}

export default DraftJSMentionSelector;
