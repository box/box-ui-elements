import React from 'react';
import { mount } from 'enzyme';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import { VIEW_MODE_LIST, VIEW_MODE_GRID } from '../../../constants';

jest.mock('../../common/header/Header', () => 'mock-header');
jest.mock('../../common/sub-header/SubHeader', () => 'mock-subheader');
jest.mock('../Content', () => 'mock-content');
jest.mock('../../common/upload-dialog/UploadDialog', () => 'mock-uploaddialog');
jest.mock('../../common/create-folder-dialog/CreateFolderDialog', () => 'mock-createfolderdialog');
jest.mock('../DeleteConfirmationDialog', () => 'mock-deletedialog');
jest.mock('../RenameDialog', () => 'mock-renamedialog');
jest.mock('../ShareDialog', () => 'mock-sharedialog');
jest.mock('../PreviewDialog', () => 'mock-previewdialog');

describe('elements/content-explorer/ContentExplorer', () => {
    let rootElement;
    const getWrapper = (props = {}) => mount(<ContentExplorer {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('uploadSuccessHandler()', () => {
        test('should force reload the files list', () => {
            const wrapper = getWrapper();
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

    describe('changeViewMode()', () => {
        test('should initially be list view', () => {
            const wrapper = getWrapper();
            expect(wrapper.state('viewMode')).toBe(VIEW_MODE_LIST);
        });

        test('should change to grid view', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.changeViewMode(VIEW_MODE_GRID);
            expect(wrapper.state('viewMode')).toBe(VIEW_MODE_GRID);
        });
    });
});
