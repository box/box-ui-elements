import React, { Component } from 'react';

import Button from '../../src/components/button';
import { ContentExplorerModalContainer } from '../../src/features/content-explorer';

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
            name: 'File.boxnote',
            type: 'file',
            extension: 'boxnote',
            isDisabled: true,
        },
        {
            name: 'File.docx',
            type: 'file',
            extension: 'docx',
            isDisabled: true,
        },
    ],
    1: [
        {
            id: '3',
            name: 'Choose me or drill in',
            type: 'folder',
        },
        {
            name: 'File.docx',
            type: 'file',
            extension: 'docx',
            isDisabled: true,
        },
        {
            name: 'File.ppt',
            type: 'file',
            extension: 'ppt',
            isDisabled: true,
        },
    ],
    search: [
        {
            id: '4',
            name: 'Choose me or drill in',
            type: 'folder',
        },
    ],
};

class ContentExplorerModalContainerExamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleMessage: 'Content Explorer is configured to move/copy a file.',
            folderId: '0',
            foldersPath: INITIAL_FOLDERS_PATH,
            isModalOpen: false,
        };
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({
            folderId: '0',
            foldersPath: INITIAL_FOLDERS_PATH,
            isModalOpen: false,
        });
    };

    handleCreateFolderSubmit = folderName => {
        const { folderId: currentFolderId, foldersPath } = this.state;

        // Add folder to list of items
        const folderId = `${Date.now()}`;
        const newFolder = {
            id: folderId,
            name: folderName,
            type: 'folder',
        };
        ITEMS[currentFolderId] = ITEMS[currentFolderId] || [];
        ITEMS[currentFolderId].push(newFolder);

        // Drill into that folder
        this.setState({
            folderId,
            foldersPath: foldersPath.concat([newFolder]),
        });
    };

    handleEnterFolder = enteredFolder => {
        this.setState({ folderId: enteredFolder.id });
    };

    handleMoveItem = destFolder => {
        this.setState({
            exampleMessage: `Moved item to { id: ${destFolder.id}, name: ${destFolder.name} }`,
        });
        this.closeModal();
    };

    handleCopyItem = destFolder => {
        this.setState({
            exampleMessage: `Copied item to { id: ${destFolder.id}, name: ${destFolder.name} }`,
        });
        this.closeModal();
    };

    handleSearchSubmit = () => {
        this.setState({
            folderId: 'search',
        });
    };

    handleExitSearch = ({ id }) => {
        this.setState({
            folderId: id,
        });
    };

    render() {
        const { exampleMessage, folderId, foldersPath, isModalOpen } = this.state;
        const items = ITEMS[folderId] || [];

        return (
            <div>
                <Button onClick={this.openModal}>Move/Copy</Button>
                <h5>{exampleMessage}</h5>
                {isModalOpen && (
                    <ContentExplorerModalContainer
                        modalTitle='Move or copy "Item.boxnote"'
                        modalDescription="This is some optional description text."
                        onRequestClose={this.closeModal}
                        onCreateFolderSubmit={this.handleCreateFolderSubmit}
                        contentExplorerMode="moveCopy"
                        initialFoldersPath={foldersPath}
                        onEnterFolder={this.handleEnterFolder}
                        onMoveItem={this.handleMoveItem}
                        onCopyItem={this.handleCopyItem}
                        onSearchSubmit={this.handleSearchSubmit}
                        onExitSearch={this.handleExitSearch}
                        items={items}
                        numItemsPerPage={100}
                        numTotalItems={items.length}
                        onLoadMoreItems={() => {}}
                        listWidth={600}
                        listHeight={350}
                    />
                )}
            </div>
        );
    }
}

export default ContentExplorerModalContainerExamples;
