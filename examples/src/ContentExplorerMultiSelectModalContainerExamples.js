import React, { Component } from 'react';

import Button from '../../src/components/button';
import { ContentExplorerModalContainer } from '../../src/features/content-explorer';

import './ContentExplorerMultiSelectModalContainerExamples.scss';

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

class ContentExplorerMultiSelectModalContainerExamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleMessage: 'Content Explorer is configured to selevt multiple file / folder.',
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

    handleEnterFolder = enteredFolder => {
        this.setState({ folderId: enteredFolder.id });
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
        const { exampleMessage, folderId, foldersPath, isModalOpen } = this.state;
        const items = ITEMS[folderId] || [];

        return (
            <div>
                <Button onClick={this.openModal}>Multi Select Modal</Button>
                <h5>{exampleMessage}</h5>
                {isModalOpen && (
                    <ContentExplorerModalContainer
                        className="content-explorer-multi-select-modal-example"
                        headerActionsAccessory={this.renderHeaderActionsAccessory()}
                        modalTitle="Select multiple items"
                        modalDescription="This is some optional description text."
                        onRequestClose={this.closeModal}
                        contentExplorerMode="multiSelect"
                        initialFoldersPath={foldersPath}
                        isCreateNewFolderAllowed={false}
                        onEnterFolder={this.handleEnterFolder}
                        onSearchSubmit={this.handleSearchSubmit}
                        onExitSearch={this.handleExitSearch}
                        showCreateNewFolderButton={false}
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

export default ContentExplorerMultiSelectModalContainerExamples;
