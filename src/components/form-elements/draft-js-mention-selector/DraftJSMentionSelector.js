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
        const { contacts } = nextProps;

        if (contacts) {
            this.setState({ contacts }, () => {
                this.checkValidity();
            });
        }
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

        this.setState({ hasReceivedFirstInteraction: true });
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
            this.setState(
                {
                    internalEditorState: nextEditorState,
                },
                () => {
                    if (onChange) {
                        onChange(nextEditorState);
                    }
                    this.checkValidity();
                },
            );
        } else {
            if (onChange) {
                onChange(nextEditorState);
            }
            this.checkValidity();
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
