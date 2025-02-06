import * as React from 'react';
import { render, screen } from '../../../../test-utils/testing-library';

import IconCell from '../IconCell';
import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../../../constants';

const archiveItem = {
    type: TYPE_FOLDER,
    archive_type: 'archive',
};

const externalFolderItem = {
    type: TYPE_FOLDER,
    has_collaborations: false,
    is_externally_owned: true,
};

const fileItem = {
    type: TYPE_FILE,
    extension: 'pdf',
};

const folderArchiveItem = {
    type: TYPE_FOLDER,
    archive_type: 'folder_archive',
};

const folderItem = {
    type: TYPE_FOLDER,
    has_collaborations: true,
    is_externally_owned: false,
};

const personalFolderItem = {
    type: TYPE_FOLDER,
    has_collaborations: false,
    is_externally_owned: false,
};

const webLinkItem = {
    type: TYPE_WEBLINK,
};

describe('elements/common/item/IconCell', () => {
    const renderComponent = props => {
        return render(<IconCell {...props} />);
    };
    test('renders file icon with correct title', () => {
        renderComponent({ rowData: fileItem, dimension: 32 });
        expect(screen.getByLabelText('PDF File')).toBeInTheDocument();
    });

    test('renders collaborated folder icon with correct title', () => {
        renderComponent({ rowData: folderItem, dimension: 32 });
        expect(screen.getByLabelText('Collaborated Folder')).toBeInTheDocument();
    });

    test('renders external folder icon with correct title', () => {
        renderComponent({ rowData: externalFolderItem, dimension: 32 });
        expect(screen.getByLabelText('External Folder')).toBeInTheDocument();
    });

    test('renders personal folder icon with correct title', () => {
        renderComponent({ rowData: personalFolderItem, dimension: 32 });
        expect(screen.getByLabelText('Personal Folder')).toBeInTheDocument();
    });

    test('renders archive icon with correct aria-label', () => {
        renderComponent({ rowData: archiveItem, dimension: 32 });
        expect(screen.getByLabelText('Archive')).toBeInTheDocument();
    });

    test('renders folder archive icon with correct aria-label', () => {
        renderComponent({ rowData: folderArchiveItem, dimension: 32 });
        expect(screen.getByLabelText('Archived Folder')).toBeInTheDocument();
    });

    test('renders bookmark icon with correct title', () => {
        renderComponent({ rowData: webLinkItem, dimension: 32 });
        expect(screen.getByLabelText('Bookmark')).toBeInTheDocument();
    });
});
