import React from 'react';
import { mount } from 'enzyme';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';

jest.mock('../../Header/Header', () => 'mock-header');
jest.mock('../../SubHeader/SubHeader', () => 'mock-subheader');
jest.mock('../Content', () => 'mock-content');
jest.mock('../../UploadDialog/UploadDialog', () => 'mock-uploaddialog');
jest.mock(
    '../../CreateFolderDialog/CreateFolderDialog',
    () => 'mock-createfolderdialog',
);
jest.mock('../DeleteConfirmationDialog', () => 'mock-deletedialog');
jest.mock('../RenameDialog', () => 'mock-renamedialog');
jest.mock('../ShareDialog', () => 'mock-sharedialog');
jest.mock('../PreviewDialog', () => 'mock-previewdialog');

describe('components/ContentExplorer/ContentExplorer', () => {
    let rootElement;
    const getWrapper = props =>
        mount(<ContentExplorer {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('uploadSuccessHandler()', () => {
        test('should force reload the files list', () => {
            const wrapper = getWrapper({});
            const instance = wrapper.instance();
            instance.setState({
                currentCollection: {
                    id: '123',
                },
            });
            instance.fetchFolder = jest.fn();
            instance.uploadSuccessHandler();
            expect(instance.fetchFolder).toHaveBeenCalledWith('123', false);
        });
    });
});
