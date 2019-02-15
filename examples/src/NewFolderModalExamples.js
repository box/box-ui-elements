import React, { Component } from 'react';

import Button from '../../src/components/button';
import { NewFolderModal } from '../../src/features/content-explorer';

class NewFolderModalExamples extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            error: '',
        };
    }

    openModal = () => {
        this.setState({ isOpen: true });
    };

    closeModal = () => {
        this.setState({
            isOpen: false,
            error: '',
        });
    };

    handleCreateFolderInput = () => {
        this.setState({ error: '' });
    };

    handleCreateFolderSubmit = () => {
        this.setState({
            error: 'Invalid Folder Name',
        });
    };

    render() {
        const { isOpen, error } = this.state;

        return (
            <div>
                <Button onClick={this.openModal}>New Folder</Button>
                <NewFolderModal
                    createFolderError={error}
                    isOpen={isOpen}
                    onCreateFolderInput={this.handleCreateFolderInput}
                    onCreateFolderSubmit={this.handleCreateFolderSubmit}
                    onRequestClose={this.closeModal}
                    parentFolderName="My Favorite Folder"
                />
            </div>
        );
    }
}

export default NewFolderModalExamples;
