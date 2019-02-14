import React, { Component } from 'react';

import DraftJSMentionSelector from '../../src/components/form-elements/draft-js-mention-selector';

const contactData = [
    { email: 'ken@streetfighter.com', id: '1', name: 'Ken' },
    { email: 'ryu@streetfighter.com', id: '2', name: 'Ryu' },
    { email: 'guile@streetfighter.com', id: '3', name: 'Guile' },
    { email: 'm.bison@streetfighter.com', id: '4', name: 'M. Bison' },
    { email: 'vega@streetfighter.com', id: '5', name: 'Vega' },
    { email: 'blanka@streetfighter.com', id: '6', name: 'Blanka' },
    { email: 'akuma@streetfighter.com', id: '7', name: 'Akuma' },
    { email: 'りゅう@streetfighter.com', id: '8', name: 'りゅう' },
    { email: 'リュー@streetfighter.com', id: '9', name: 'リュー' },
];

class MentionSelectorContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
        };
    }

    isMatchingContact(mentionString, contact) {
        const { email, name } = contact;
        return email.toLowerCase().indexOf(mentionString) > -1 || name.toLowerCase().indexOf(mentionString) > -1;
    }

    handleMention = mentionString => {
        if (!mentionString.length) {
            return;
        }
        const matchingContacts = contactData.reduce((prev, contact) => {
            return this.isMatchingContact(mentionString, contact) ? prev.concat([contact]) : prev;
        }, []);

        this.setState({
            contacts: matchingContacts,
        });
    };

    render() {
        const { ...props } = this.props;
        const { contacts } = this.state;

        return (
            <DraftJSMentionSelector
                className="mention-selector"
                contacts={contacts.map(contact => ({
                    id: contact.id,
                    name: contact.name,
                    item: contact,
                }))}
                label="Comment"
                onMention={this.handleMention}
                {...props}
            />
        );
    }
}

export default MentionSelectorContainer;
