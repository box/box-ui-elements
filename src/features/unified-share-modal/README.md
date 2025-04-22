### Description

This is the simplified sharing modal, internally referred to as the Unified Share Modal
(a combination of the previous invite collaborators modal and the shared link modal).

### Examples

#### Click each button to see different modal states and behaviors
```js
const Button = require('box-ui-elements/es/components/button').default;

// Base Example. Extend for different initial loads, or to demonstrate different interactions
class USMExample extends React.Component {
    constructor() {
        super();

        this.setInitialState();

        this.contacts = [
            { id: 0, collabID: 0, name: 'Jackie', email: 'j@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Owner', userID: '0', profileURL: 'https://foo.bar' },
            { id: 1, collabID: 1, name: 'Jeff', email: 'jt@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Viewer', userID: '1', },
            { id: 2, collabID: 2, name: 'David', email: 'dt@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '2', },
            { id: 3, collabID: 3, name: 'Yang', email: 'yz@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '3', },
            { id: 4, collabID: 4, name: 'Yong', email: 'ysu@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '4', },
            { id: 5, collabID: 5, name: 'Will', email: 'wy@example.com', type: 'pending', hasCustomAvatar: false, translatedRole: 'Editor', userID: '5', },
            { id: 6, collabID: 6, name: 'Dave', email: 'd@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '6', },
            { id: 7, collabID: 7, name: 'Ke', email: 'k@external.com', isExternalUser: true, type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '7', },
            { id: 8, collabID: 8, name: 'Wenbo', email: 'w@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '8', },
            { id: 11, collabID: 11, name: 'Supersupersupersuperreallyreallyreallylongfirstname incrediblyspectacularlylonglastname', email: 'Supersupersupersuperreallyreallyreallyincrediblyspectacularlylongemail@example.com', type: 'user', hasCustomAvatar: false, translatedRole: 'Editor', userID: '11', },
            { /* example group contact */
                    id: 14,
                    collabID: 14,
                    type: 'group',
                    name: 'my group',
                    hasCustomAvatar: false,
                    translatedRole: 'Viewer',
                    userID: null,
            },
        ];

        this.closeModal = this.closeModal.bind(this);
        this.fakeRequest = this.fakeRequest.bind(this);
        this.getInitialData = this.getInitialData.bind(this);
    }

    setInitialState() {
        return this.state = {
            isOpen: false,
            item: {
                bannerPolicy: {
                    body: 'test',
                },
                classification: 'internal',
                grantedPermissions: {
                    itemShare: true
                },
                hideCollaborators: false,
                id: 12345,
                name: 'My Example Folder',
                type: 'folder',
                typedID: 'd_12345'

            },
            collaboratorsList: {
                collaborators: [],
            },
            selectorOptions: [],
            sharedLink: this.setDefaultSharedLinkState(),
            submitting: false
        };
    }

    setDefaultSharedLinkState() {
        return this.defaultSharedLinkState = {
            accessLevel: '',
            allowedAccessLevels: {},
            canChangeAccessLevel: true,
            enterpriseName: '',
            expirationTimestamp: null,
            isDownloadSettingAvailable: true,
            isNewSharedLink: false,
            permissionLevel: '',
            url: '',
        };
    }

    closeModal() {
        this.setState({
            isOpen: false,
            sharedLink: this.setDefaultSharedLinkState(),
            collaboratorsList: {
                collaborators: [],
            },
        });
    }

    getInitialData() {
        const initialPromise = this.fakeRequest();
        const fetchCollaborators = new Promise(resolved => {
            setTimeout(() => {
                const collaborators = this.contacts.slice();

                const collaboratorsList = {
                    collaborators: this.contacts.map(contact => {
                        // convert the existing contact entries to compatible collaborator entries 
                        const isExternalCollab = contact.isExternalUser;
                        delete contact.isExternalUser;
                        contact.isExternalCollab = isExternalCollab;
                        if (isExternalCollab) {
                            contact.expiration = {
                                executeAt: "November 27, 2022",
                            }
                        }

                        return contact;
                    }),
                };
                this.setState({collaboratorsList});
                resolved();
            }, 1000);
        })
        return Promise.all([initialPromise, fetchCollaborators]);
    }

    fakeRequest() {
        // submitting is used to disable input fields, and not to show the loading indicator
        this.setState({ submitting: true });
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Request succeeded!');
                this.setState({ submitting: false });
                resolve();
            }, 500)
        });
    }

    render() {
        return (
            <div>
                { this.state.isOpen &&
                <UnifiedShareModal
                    canInvite={ true }
                    changeSharedLinkAccessLevel={
                        newLevel => this.fakeRequest().then(() => {
                            this.setState({
                                sharedLink: {
                                    ...this.state.sharedLink,
                                    accessLevel: newLevel,
                                }
                            })
                        })
                    }

                    changeSharedLinkPermissionLevel={
                        newLevel => this.fakeRequest().then(() => {
                            this.setState({
                                sharedLink: {
                                    ...this.state.sharedLink,
                                    permissionLevel: newLevel,
                                }
                            })
                        })
                    }

                    collaboratorsList={this.state.collaboratorsList}
                    collaborationRestrictionWarning="Collaboration invitations can only be sent to people within Box Corporate"
                    currentUserID="0"
                    createSharedLinkOnLoad={ this.props.shouldCreateSharedLinkOnLoad }
                    focusSharedLinkOnLoad={ this.props.shouldFocusSharedLinkOnLoad }
                    getCollaboratorContacts={ () => {
                        return Promise.resolve(this.contacts);
                    } }
                    getSharedLinkContacts={ () => {
                        return Promise.resolve(this.contacts);
                    } }
                    getInitialData={this.getInitialData}
                    inviteePermissions={
                        [
                            {value: 'Co-owner', text: 'Co-owner'},
                            {value: 'Editor', text: 'Editor'},
                            {value: 'Viewer Uploader', text: 'Viewer Uploader'},
                            {value: 'Previewer Uploader', text: 'Previewer Uploader'},
                            {value: 'Viewer', text: 'Viewer'},
                            {value: 'Previewer', text: 'Previewer'},
                            {value: 'Uploader', text: 'Uploader'},
                        ]
                    }
                    isOpen={ this.state.isOpen }
                    isToggleEnabled={ true }
                    item={ this.state.item }
                    onAddLink={
                        () => this.fakeRequest().then(() => {
                            this.setState({
                                sharedLink: {
                                    accessLevel: 'peopleInYourCompany',
                                    allowedAccessLevels: {
                                        peopleWithTheLink: true,
                                        peopleInYourCompany: true,
                                        peopleInThisItem: true,
                                    },
                                    canChangeAccessLevel: true,
                                    enterpriseName: 'Box',
                                    expirationTimestamp: 1509173940,
                                    isDownloadSettingAvailable: true,
                                    isNewSharedLink: true,
                                    permissionLevel: 'canViewDownload',
                                    url: 'https://box.com/s/abcdefg',
                                }
                            });
                        })
                    }
                    onRemoveLink={
                        () => this.fakeRequest().then(() => {
                            this.setState({
                                sharedLink: this.defaultSharedLinkState
                            });
                            this.closeModal();
                        })
                    }
                    onRequestClose={ this.closeModal }
                    onSettingsClick={ () => alert('hi!') }
                    sendInvites={
                        () => this.fakeRequest().then(() => {
                            this.closeModal();
                        })
                    }
                    sendInvitesError={''}
                    sendSharedLink={ ({ emails, emailMessage }) => this.fakeRequest().then(() => {
                        this.closeModal();
                        console.log(`Sent invite to ${emails} with message "${emailMessage}"`);
                    })}
                    sendSharedLinkError={''}
                    sharedLink={ this.state.sharedLink }
                    showCalloutForUser={true}
                    showUpgradeOptions
                    submitting={ this.state.submitting }
                    suggestedCollaborators={{
                        '2': { id: 2, userScore: '.1', name: 'David', email: 'dt@example.com', },
                        '5': { id: 5, userScore: '0.2', name: 'Will', email: 'wy@example.com', },
                        '1': { id: 1, userScore: '0.5', name: 'Jeff', email: 'jt@example.com', },
                        '3': { id: 3, userScore: '2', name: 'Yang', email: 'yz@example.com', }
                    }}
                    trackingProps={ {
                        inviteCollabsEmailTracking: {},
                        sharedLinkEmailTracking: {},
                        sharedLinkTracking: {},
                        inviteCollabTracking: {},
                        modalTracking: {},
                        collaboratorListTracking: {},
                    } }
                /> }
                <Button
                    onClick={ () =>
                        this.setState({
                            isOpen: true,
                        }) }
                >
                    {this.props.buttonText}
                </Button>
            </div>
        )
    }
}

class USMSharedLinkExample extends USMExample {
    getInitialData() {
        const resolveSharedLink = new Promise(resolved => {
            setTimeout(() => {
                this.setState({
                    sharedLink: {
                        accessLevel: 'peopleInYourCompany',
                        allowedAccessLevels: {
                            peopleWithTheLink: true,
                            peopleInYourCompany: true,
                            peopleInThisItem: true,
                        },
                        canChangeAccessLevel: true,
                        enterpriseName: 'Box',
                        expirationTimestamp: 1509173940,
                        isDownloadSettingAvailable: true,
                        permissionLevel: 'canViewDownload',
                        url: 'https://box.com/s/abcdefg',
                    }
                });
                resolved();
            }, 400);
        });

        return Promise.all([this.fakeRequest, resolveSharedLink]);
    }
}

<div>
    <div>
        This shows the Unified share modal in its initial state, with some collaborators.
        <USMExample buttonText="Open USM Modal" />
    </div>
    <hr/>
    <div>
        This shows the Unified share modal when it has a shared link to fetch, but should not auto-focus this link.
        <USMSharedLinkExample buttonText="Open USM Modal" shouldFocusSharedLinkOnLoad={false}/>
    </div>
    <hr/>
    <div>
        This shows the Unified share modal when it has a shared link to fetch, and should auto-focus.
        <USMSharedLinkExample buttonText="Open USM Modal" shouldFocusSharedLinkOnLoad/>
    </div>
    <hr/>
    <div>
        This shows the Unified share modal when it needs to generate a shared link, and should auto-focus.
        <USMExample buttonText="Open USM Modal" shouldFocusSharedLinkOnLoad shouldCreateSharedLinkOnLoad />
    </div>
</div>

```
