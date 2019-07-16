import React from 'react';
import { mount } from 'enzyme';
import { ContentExplorerComponent as ContentExplorer } from '../ContentExplorer';
import TokenService from '../../../utils/TokenService';
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
        let wrapper;
        beforeEach(() => {
            wrapper = getWrapper();
        });

        test('should initially be list view', () => {
            expect(wrapper.state('viewMode')).toBe(VIEW_MODE_LIST);
        });

        test('should change to grid view', () => {
            const instance = wrapper.instance();
            instance.changeViewMode(VIEW_MODE_GRID);
            expect(wrapper.state('viewMode')).toBe(VIEW_MODE_GRID);
        });
    });

    describe('makeThumbnailUrl()', () => {
        const baseUrl = 'baseUrl';
        const template = `${baseUrl}/{+asset_path}`;
        const token = 'token';
        let instance;
        beforeEach(() => {
            instance = getWrapper().instance();
        });

        test('should properly make thumbnail url with png', () => {
            expect(instance.makeThumbnailUrl('png', template, token)).toBe(`${baseUrl}/1.png?access_token=${token}`);
        });

        test('should properly make thumbnail url with jpg', () => {
            expect(instance.makeThumbnailUrl('jpg', template, token)).toBe(`${baseUrl}/?access_token=token`);
        });
    });

    describe('assignThumbnailUrl()', () => {
        const commonId = 1;
        let instance;
        beforeEach(() => {
            instance = getWrapper().instance();
            TokenService.getToken = jest.fn();
        });

        describe('early return cases', () => {
            beforeEach(() => {
                instance.setState = jest.fn();
            });

            test('should not call setState or getToken if no represenatation or template are given', () => {
                instance.assignItemThumbnailUrl({ id: commonId }).then(() => {
                    expect(TokenService.getToken).not.toHaveBeenCalled();
                    expect(instance.setState).not.toHaveBeenCalled();
                });
            });

            test('should not call setState if getToken returns null', () => {
                TokenService.getToken.mockReturnValue(null);
                instance.assignItemThumbnailUrl({ id: commonId }, 'representation', 'template').then(() => {
                    expect(TokenService.getToken).toHaveBeenCalled();
                    expect(instance.setState).not.toHaveBeenCalled();
                });
            });

            test('should not call setState if getToken returns object with only write token', () => {
                TokenService.getToken.mockReturnValue({ write: 'token' });
                instance.assignItemThumbnailUrl({ id: commonId }, 'representation', 'template').then(() => {
                    expect(TokenService.getToken).toHaveBeenCalled();
                    expect(instance.setState).not.toHaveBeenCalled();
                });
            });
        });

        describe('success cases', () => {
            beforeEach(() => {
                instance.setState({ currentCollection: { items: [{ id: commonId }] } });
                instance.makeThumbnailUrl = jest.fn().mockReturnValueOnce('thumbnailUrl');
            });

            afterEach(() => {
                expect(instance.state.currentCollection.items[0]).not.toHaveProperty('thumbnailUrl');
                instance.assignItemThumbnailUrl({ id: commonId }, 'representation', 'template').then(() => {
                    expect(TokenService.getToken).toHaveBeenCalled();
                    expect(instance.state.currentCollection.items[0].thumbnailUrl).toBe('thumbnailUrl');
                });
            });

            test('should update thumbnailUrl if getToken returns string', () => {
                TokenService.getToken.mockReturnValue('token');
            });

            test('should update thumbnailUrl if getToken returns object with read token', () => {
                TokenService.getToken.mockReturnValue({ read: 'token' });
            });
        });
    });
});
