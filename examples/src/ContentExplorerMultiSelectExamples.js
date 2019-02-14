import React, { Component } from 'react';

import { ContentExplorer } from '../../src/features/content-explorer';

import './ContentExplorerMultiSelectExamples.scss';

const INITIAL_FOLDERS_PATH = [
    {
        id: '0',
        name: 'All Files',
    },
];

const ITEMS = {
    0: [
        {
            id: '1',
            name: 'Choose me or drill in',
            type: 'folder',
            hasCollaborations: true,
            isActionDisabled: true,
        },
        {
            id: '2',
            name: 'Choose me or drill in 2',
            type: 'folder',
        },
        {
            id: '3',
            name: 'File.boxnote',
            type: 'file',
            extension: 'boxnote',
            isDisabled: false,
        },
        {
            id: '4',
            name: 'File.docx',
            type: 'file',
            extension: 'docx',
            isDisabled: false,
        },
        {
            id: '5',
            name: 'Choose me or drill with loading items',
            type: 'folder',
        },
        {
            id: '6',
            name: 'File 2.docx',
            type: 'file',
            extension: 'docx',
            isDisabled: true,
        },
    ],
    1: [
        {
            id: '11',
            name: 'Choose me or drill in',
            type: 'folder',
        },
        {
            id: '12',
            name: 'File.docx',
            type: 'file',
            extension: 'docx',
            isDisabled: false,
        },
        {
            id: '13',
            name: 'File.ppt',
            type: 'file',
            extension: 'ppt',
            isDisabled: false,
        },
    ],
    5: [
        { isLoading: true },
        { isLoading: true },
        { isLoading: true },
        { isLoading: true },
        { isLoading: true },
        { isLoading: true },
        { isLoading: true },
    ],
    search: [
        {
            id: '2',
            name: 'Choose me or drill in',
            type: 'folder',
        },
    ],
    userFilter: [
        {
            id: '30',
            name: 'Folder owned by the filtered user',
            type: 'folder',
        },
        {
            id: '31',
            name: 'File owned by the filtered user',
            type: 'file',
        },
    ],
};

class ContentExplorerMultiSelectExamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleMessage: 'Content Explorer is configured for multi select.',
            folderId: '0',
        };
    }

    handleEnterFolder = enteredFolder => {
        this.setState({
            exampleMessage: `Enter folder { id: ${enteredFolder.id}, name: ${enteredFolder.name} }`,
            folderId: enteredFolder.id,
        });
    };

    handleChooseItems = chosenItems => {
        this.setState({
            exampleMessage: chosenItems.reduce(
                (message, chosenItem) => `${message}, Choose { id: ${chosenItem.id}, name: ${chosenItem.name} }`,
                '',
            ),
        });
    };

    handleSearchSubmit = searchQuery => {
        this.setState({
            exampleMessage: `Searched for '${searchQuery}'`,
            folderId: 'search',
        });
    };

    handleExitSearch = ({ id }) => {
        this.setState({
            exampleMessage: 'Exited search',
            folderId: id,
        });
    };

    handleOnItemAdd = newItem => {
        this.setState({
            exampleMessage: `User Filtered: ${newItem.name}`,
            folderId: 'userFilter',
        });
    };

    handleOnItemRemove = () => {
        this.setState({
            exampleMessage: 'User Filtered Removed',
            folderId: '0',
        });
    };

    renderHeaderActionsAccessory = () => {
        return <div>Accessory</div>;
    };

    render() {
        const { exampleMessage, folderId } = this.state;
        const items = ITEMS[folderId] || [];

        return (
            <div className="content-explorer-example">
                <ContentExplorer
                    contentExplorerMode="multiSelect"
                    headerActionsAccessory={this.renderHeaderActionsAccessory()}
                    initialFoldersPath={INITIAL_FOLDERS_PATH}
                    onEnterFolder={this.handleEnterFolder}
                    onChooseItems={this.handleChooseItems}
                    onSearchSubmit={this.handleSearchSubmit}
                    onExitSearch={this.handleExitSearch}
                    showCreateNewFolderButton={false}
                    items={items}
                    listWidth={600}
                    listHeight={350}
                />
                <h5>{exampleMessage}</h5>
            </div>
        );
    }
}

export default ContentExplorerMultiSelectExamples;
