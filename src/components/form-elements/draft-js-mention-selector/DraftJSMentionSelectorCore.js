// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { EditorState } from 'draft-js';

import DatalistItem from '../../datalist-item';
import DraftJSEditor from '../../draft-js-editor';
import SelectorDropdown from '../../selector-dropdown';
import { addMention, defaultMentionTriggers, getActiveMentionForEditorState } from './utils';

import messages from './messages';

import type { SelectorItems } from '../../../common/types/core';
import type { Mention } from './utils';

import './MentionSelector.scss';

type DefaultSelectorRowProps = {
    item?: {
        email?: string,
        name?: string,
    },
};

const DefaultSelectorRow = ({ item = {}, ...rest }: DefaultSelectorRowProps) => (
    <DatalistItem {...rest}>
        {item.name} <span className="dropdown-secondary-text">{item.email}</span>
    </DatalistItem>
);

const DefaultStartMentionMessage = () => <FormattedMessage {...messages.startMention} />;

type MentionStartStateProps = {
    message?: React.Node,
};

const MentionStartState = ({ message }: MentionStartStateProps) => (
    <div role="alert" className="mention-start-state">
        {message}
    </div>
);

type Props = {
    className?: string,
    contacts: SelectorItems<>,
    contactsLoaded?: boolean,
    description?: React.Node,
    editorState: EditorState,
    error?: ?Object,
    hideLabel?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    label: React.Node,
    mentionTriggers: Array<string>,
    onBlur?: Function,
    onChange?: Function,
    onFocus?: Function,
    onMention?: Function,
    onReturn?: Function,
    placeholder?: string,
    selectorRow: React.Element<any>,
    startMentionMessage?: React.Node,
};

type State = {
    activeMention: Mention | null,
    isFocused: boolean,
    mentionPattern: RegExp,
};

class DraftJSMentionSelector extends React.Component<Props, State> {
    static defaultProps = {
        className: '',
        contacts: [],
        isDisabled: false,
        isRequired: false,
        mentionTriggers: defaultMentionTriggers,
        selectorRow: <DefaultSelectorRow />,
        startMentionMessage: <DefaultStartMentionMessage />,
    };

    mentorSelectorRef: { current: null | HTMLDivElement } = React.createRef();

    constructor(props: Props) {
        super(props);
        const mentionTriggers = props.mentionTriggers.reduce((prev, current) => `${prev}\\${current}`, '');

        this.state = {
            activeMention: null,
            isFocused: false,
            mentionPattern: new RegExp(`([${mentionTriggers}])([^${mentionTriggers}]*)$`),
        };
    }

    /**
     * Lifecycle method that gets called immediately after an update
     * @param {object} lastProps Props the component is receiving
     * @returns {void}
     */
    componentDidUpdate(prevProps: Props) {
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

    /**
     * Extracts the active mention from the editor state
     *
     * @param {EditorState} editorState
     * @returns {object}
     */
    getActiveMentionForEditorState(editorState: EditorState) {
        const { mentionPattern } = this.state;

        return getActiveMentionForEditorState(editorState, mentionPattern);
    }

    /**
     * Called on each keypress when a mention is being composed
     * @returns {void}
     */
    handleMention = () => {
        const { onMention } = this.props;
        const { activeMention } = this.state;

        if (onMention) {
            onMention(activeMention ? activeMention.mentionString : '');
        }
    };

    /**
     * Method that gets called when a mention contact is selected
     * @param {number} index The selected index
     * @returns {void}
     */
    handleContactSelected = (index: number) => {
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

    handleBlur = (event: SyntheticEvent<>) => {
        const { onBlur } = this.props;

        this.setState({
            isFocused: false,
        });

        if (onBlur) {
            onBlur(event);
        }
    };

    handleFocus = (event: SyntheticEvent<>) => {
        const { onFocus } = this.props;

        this.setState({
            isFocused: true,
        });

        if (onFocus) {
            onFocus(event);
        }
    };

    /**
     * Event handler called when DraftJSEditor emits onChange
     * Checks current text to see if any mentions were made
     * @param {EditorState} editorState The new editor state
     * @returns {void}
     */
    handleChange = (nextEditorState: EditorState) => {
        const { onChange } = this.props;
        const activeMention = this.getActiveMentionForEditorState(nextEditorState);

        if (activeMention !== null) {
            this.buildAccessibleAlert(activeMention);
        }

        this.setState(
            {
                activeMention,
            },
            () => {
                if (onChange) {
                    onChange(nextEditorState);
                }

                if (activeMention && activeMention.mentionString) {
                    this.handleMention();
                }
            },
        );
    };

    /**
     * Inserts a selected mention into the editor
     * @param {object} mention The selected mention to insert
     */
    addMention(mention: Object) {
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

    /**
     * @returns {boolean}
     */
    shouldDisplayMentionLookup = () => {
        const { contacts } = this.props;
        const { activeMention } = this.state;

        return !!(activeMention && activeMention.mentionString && contacts.length);
    };

    buildAccessibleAlert = (activeMention: Object) => {
        const { isFocused } = this.state;
        const { contacts } = this.props;
        let alertElement = null;
        const addAlert = activeMention && activeMention.mentionString?.length > 0 && isFocused;
        const previousElement = document.querySelector('[data-testid="accessibility-alert"]');
        if (previousElement) {
            previousElement.remove();
        }
        if (addAlert) {
            alertElement = document.createElement('span');
            alertElement.setAttribute('class', 'accessibility-hidden');
            alertElement.setAttribute('data-testid', 'accessibility-alert');
            alertElement.setAttribute('role', 'alert');
            alertElement.innerText = contacts.length > 0 ? `${contacts.length} users found` : 'No users found';
            if (this.mentorSelectorRef.current) {
                this.mentorSelectorRef.current.appendChild(alertElement);
            }
        }
    };

    render() {
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
            <div className={classes} ref={this.mentorSelectorRef}>
                <SelectorDropdown
                    onSelect={this.handleContactSelected}
                    selector={
                        <DraftJSEditor
                            editorState={editorState}
                            error={error}
                            hideLabel={hideLabel}
                            isDisabled={isDisabled}
                            isFocused={isFocused}
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
