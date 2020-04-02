import React from 'react';
import { mount } from 'enzyme';
import { ContentPickerComponent as ContentPicker } from '../ContentPicker';
import UploadDialog from '../../common/upload-dialog';

jest.mock('../../common/header/Header', () => 'mock-header');
jest.mock('../../common/sub-header/SubHeader', () => 'mock-subheader');
jest.mock('../Footer', () => 'mock-footer');
jest.mock('../Content', () => 'mock-content');
jest.mock('../../common/upload-dialog/UploadDialog', () => 'mock-uploaddialog');
jest.mock('../../common/create-folder-dialog/CreateFolderDialog', () => 'mock-createfolderdialog');

describe('elements/content-picker/ContentPicker', () => {
    let rootElement;
    const getWrapper = props => mount(<ContentPicker {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        rootElement.appendChild(document.createElement('div'));
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('uploadSuccessHandler()', () => {
        test('should reload the files list', () => {
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

    describe('render()', () => {
        test('should render UploadDialog with contentUploaderProps', () => {
            const contentUploaderProps = {
                apiHost: 'https://api.box.com',
                chunked: false,
            };
            const wrapper = getWrapper({ canUpload: true, contentUploaderProps });
            wrapper.setState({
                currentCollection: {
                    permissions: {
                        can_upload: true,
                    },
                },
            });
            const uploadDialogElement = wrapper.find(UploadDialog);
            expect(uploadDialogElement.length).toBe(1);
            expect(uploadDialogElement.prop('contentUploaderProps')).toEqual(contentUploaderProps);
        });
    });
});
