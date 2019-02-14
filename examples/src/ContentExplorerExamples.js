import React, { Component } from 'react';

import { ContentExplorer } from '../../src/features/content-explorer';

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
            name: "Can't choose but can drill in",
            type: 'folder',
            hasCollaborations: true,
            isActionDisabled: true,
        },
        {
            id: '2',
            name: 'Choose me or drill in',
            type: 'folder',
        },
        {
            id: '3',
            name: 'File.boxnote',
            type: 'file',
            extension: 'boxnote',
            isDisabled: true,
        },
        {
            id: '4',
            name: 'File.docx',
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
            isDisabled: true,
        },
        {
            id: '13',
            name: 'File.ppt',
            type: 'file',
            extension: 'ppt',
            isDisabled: true,
        },
    ],
    search: [
        {
            id: '1',
            name: 'Choose me or drill in',
            type: 'folder',
        },
    ],
};

class ContentExplorerExamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleMessage: 'Content Explorer is configured to select a folder.',
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

    render() {
        const { exampleMessage, folderId } = this.state;
        const items = ITEMS[folderId] || [];

        return (
            <div className="content-explorer-example">
                <ContentExplorer
                    contentExplorerMode="selectFolder"
                    initialFoldersPath={INITIAL_FOLDERS_PATH}
                    items={items}
                    listHeight={350}
                    listWidth={600}
                    onChooseItems={this.handleChooseItems}
                    onEnterFolder={this.handleEnterFolder}
                    onExitSearch={this.handleExitSearch}
                    onSearchSubmit={this.handleSearchSubmit}
                />
                <h5>{exampleMessage}</h5>
            </div>
        );
    }
}

export default ContentExplorerExamples;
