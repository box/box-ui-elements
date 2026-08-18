import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { EditorState } from 'draft-js';

import DatalistItem from '../../datalist-item';
import DraftJSEditor from '../../draft-js-editor';
import SelectorDropdown from '../../selector-dropdown';
import { addMention, defaultMentionTriggers, getActiveMentionForEditorState } from './utils';
import type { Mention } from './utils';

import messages from './messages';

import type { SelectorItems } from '../../../common/types/core';

import './MentionSelector.scss';

export interface DefaultSelectorRowProps {
    /** Contact shown in the default mention dropdown row */
    item?: {
        email?: string;
        name?: string;
    };
}

const DefaultSelectorRow = ({ item = {}, ...rest }: DefaultSelectorRowProps): React.ReactElement => (
    <DatalistItem {...rest}>
        {item.name} <span className="dropdown-secondary-text">{item.email}</span>
    </DatalistItem>
);

const DefaultStartMentionMessage = (): React.ReactElement => <FormattedMessage {...messages.startMention} />;

export interface MentionStartStateProps {
    /** Message shown when a mention is started */
    message?: React.ReactNode;
}

const MentionStartState = ({ message }: MentionStartStateProps): React.ReactElement => (
    <div role="alert" className="mention-start-state">
        {message}
    </div>
);

export interface DraftJSMentionSelectorCoreProps {
    /** Additional CSS class for the wrapper */
    className?: string;
    /** Contact list used to populate mention suggestions */
    contacts: SelectorItems;
    /** Whether mention contacts have finished loading */
    contactsLoaded?: boolean;
    /** Description announced to screen-reader users */
    description?: React.ReactNode;
    /** Current DraftJS editor state */
    editorState: EditorState;
    /** Error displayed in the editor tooltip */
    error?: object | null;
    /** Whether the visible label should be hidden */
    hideLabel?: boolean;
    /** Whether the editor is disabled */
    isDisabled?: boolean;
    /** Whether the editor is required */
    isRequired?: boolean;
    /** Editor label */
    label: React.ReactNode;
    /** Characters that start a mention */
    mentionTriggers: Array<string>;
    /** Called when the editor loses focus */
    onBlur?: Function;
    /** Called when the editor state changes */
    onChange?: Function;
    /** Called when the editor receives focus */
    onFocus?: Function;
    /** Called with the current mention query string */
    onMention?: Function;
    /** Called before DraftJS handles the return key */
    onReturn?: Function;
    /** Editor placeholder */
    placeholder?: string;
    /** Custom row renderer for mention suggestions */
    selectorRow: React.ReactElement;
    /** Message shown when a mention is started */
    startMentionMessage?: React.ReactNode;
}

interface DraftJSMentionSelectorCoreState {
    activeMention: Mention | null;
    isFocused: boolean;
    mentionPattern: RegExp;
}

class DraftJSMentionSelector extends React.Component<DraftJSMentionSelectorCoreProps, DraftJSMentionSelectorCoreState> {
    static defaultProps = {
        className: '',
        contacts: [],
        isDisabled: false,
        isRequired: false,
        mentionTriggers: defaultMentionTriggers,
        selectorRow: <DefaultSelectorRow />,
        startMentionMessage: <DefaultStartMentionMessage />,
    };

    constructor(props: DraftJSMentionSelectorCoreProps) {
        super(props);
        const mentionTriggers = props.mentionTriggers.reduce((prev, current) => `${prev}\\${current}`, '');

        this.state = {
            activeMention: null,
            isFocused: false,
            mentionPattern: new RegExp(`([${mentionTriggers}])([^${mentionTriggers}]*)$`),
        };
    }

    componentDidUpdate(prevProps: DraftJSMentionSelectorCoreProps): void {
        const { contacts: prevContacts } = prevProps;
        const { contacts: currentContacts } = this.props;
        const { activeMention } = this.state;

        if (activeMention !== null && !currentContacts.length && prevContacts.length !== currentContacts.length) {
            // if empty set of contacts get passed in, set active mention to null
            this.setState({
                activeMention: null,
            });
        }
    }

    /** Extracts the active mention from the editor state */
    getActiveMentionForEditorState(editorState: EditorState): Mention | null {
        const { mentionPattern } = this.state;

        return getActiveMentionForEditorState(editorState, mentionPattern);
    }

    /** Called on each keypress when a mention is being composed */
    handleMention = (): void => {
        const { onMention } = this.props;
        const { activeMention } = this.state;

        if (onMention) {
            onMention(activeMention ? activeMention.mentionString : '');
        }
    };

    /** Called when a mention contact is selected from the dropdown */
    handleContactSelected = (index: number): void => {
        const { contacts } = this.props;
        this.addMention(contacts[index]);
        this.setState(
            {
                activeMention: null,
                isFocused: true,
            },
            () => {
                this.handleMention();
            },
        );
    };

    handleBlur = (event: React.SyntheticEvent): void => {
        const { onBlur } = this.props;

        this.setState({
            isFocused: false,
        });

        if (onBlur) {
            onBlur(event);
        }
    };

    handleFocus = (event: React.SyntheticEvent): void => {
        const { onFocus } = this.props;

        this.setState({
            isFocused: true,
        });

        if (onFocus) {
            onFocus(event);
        }
    };

    /** Called when DraftJSEditor emits onChange; checks current text for in-progress mentions */
    handleChange = (nextEditorState: EditorState): void => {
        const { onChange } = this.props;
        const activeMention = this.getActiveMentionForEditorState(nextEditorState);

        this.setState(
            {
                activeMention,
            },
            () => {
                if (onChange) {
                    onChange(nextEditorState);
                }

                if (activeMention?.mentionString) {
                    this.handleMention();
                }
            },
        );
    };

    /** Inserts a selected mention into the editor */
    addMention(mention: { id: string | number; name: string }): void {
        const { activeMention } = this.state;
        const { editorState } = this.props;

        const editorStateWithLink = addMention(editorState, activeMention, mention);

        this.setState(
            {
                activeMention: null,
            },
            () => {
                this.handleChange(editorStateWithLink);
            },
        );
    }

    shouldDisplayMentionLookup = (): boolean => {
        const { contacts } = this.props;
        const { activeMention } = this.state;

        return !!(activeMention?.mentionString && contacts.length);
    };

    render(): React.ReactNode {
        const {
            className,
            contacts,
            contactsLoaded,
            editorState,
            error,
            hideLabel,
            isDisabled,
            isRequired,
            label,
            description,
            onReturn,
            placeholder,
            selectorRow,
            startMentionMessage,
            onMention,
        } = this.props;
        const { activeMention, isFocused } = this.state;

        const classes = classNames('mention-selector-wrapper', className);

        const showMentionStartState = !!(onMention && activeMention && !activeMention.mentionString && isFocused);

        const usersFoundMessage = this.shouldDisplayMentionLookup()
            ? { ...messages.usersFound, values: { usersCount: contacts.length } }
            : messages.noUsersFound;

        return (
            <div className={classes}>
                <SelectorDropdown
                    onSelect={this.handleContactSelected}
                    selector={
                        <DraftJSEditor
                            editorState={editorState}
                            error={error}
                            hideLabel={hideLabel}
                            isDisabled={isDisabled}
                            isRequired={isRequired}
                            label={label}
                            description={description}
                            onBlur={this.handleBlur}
                            onFocus={this.handleFocus}
                            onChange={this.handleChange}
                            onReturn={onReturn}
                            placeholder={placeholder}
                        />
                    }
                >
                    {this.shouldDisplayMentionLookup()
                        ? contacts.map(contact =>
                              React.cloneElement(selectorRow, {
                                  ...selectorRow.props,
                                  ...contact,
                                  key: contact.id,
                              }),
                          )
                        : []}
                </SelectorDropdown>
                {showMentionStartState ? <MentionStartState message={startMentionMessage} /> : null}
                {contactsLoaded && (
                    <span className="accessibility-hidden" data-testid="accessibility-alert" role="alert">
                        <FormattedMessage {...usersFoundMessage} />
                    </span>
                )}
            </div>
        );
    }
}

export default DraftJSMentionSelector;
