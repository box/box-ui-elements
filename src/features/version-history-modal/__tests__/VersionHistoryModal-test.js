import React from 'react';
import sinon from 'sinon';

import VersionHistoryModal from '../VersionHistoryModal';

const sandbox = sinon.sandbox.create();

describe('features/version-history-modal/VersionHistoryModal', () => {
    const getTestVersion = (values = {}) => ({
        created: 5000,
        extension: 'jpg',
        fileVersionID: '123_456',
        id: 1,
        isCurrent: false,
        itemName: 'test',
        itemTypedID: 'file_123_456',
        updated: 10000,
        uploaderUserName: 'uploader',
        versionNumber: 10,
        ...values,
    });

    const getWrapper = (props = {}) =>
        shallow(
            <VersionHistoryModal
                canDelete
                canUpload
                isOpen
                isProcessing={false}
                onDelete={() => {}}
                onDownload={() => {}}
                onMakeCurrent={() => {}}
                onRestore={() => {}}
                onRequestClose={() => {}}
                versions={[
                    getTestVersion({ id: 1, versionNumber: 1 }),
                    getTestVersion({ id: 2, versionNumber: 2 }),
                    getTestVersion({ id: 3, versionNumber: 3 }),
                ]}
                versionLimit={100}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render component correctly', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        test('should render a Modal', () => {
            const wrapper = getWrapper({
                onRequestClose: sandbox.mock(),
            });

            const modalWrapper = wrapper.find('Modal');
            expect(modalWrapper.length).toBe(1);

            const closeBtn = wrapper.find('Button');
            expect(closeBtn.length).toBe(1);
            closeBtn.simulate('click');
        });

        // Obviously there could be a better solution than just null, but we don't foresee this as a possible scenario
        test('should not render FileVersionList when there are no versions', () => {
            const wrapper = getWrapper({
                versions: [],
            });

            const listWrapper = wrapper.find('FileVersionList');
            expect(listWrapper.length).toBe(0);
        });

        test('should render FileVersionList when there are versions', () => {
            const versions = [getTestVersion()];
            const wrapper = getWrapper({
                isProcessing: true,
                scrollToVersionNumber: 10,
                versionLimit: 100,
                versions,
            });

            const listWrapper = wrapper.find('FileVersionList');
            expect(listWrapper.length).toBe(1);
            expect(listWrapper.prop('isProcessing')).toBe(true);
            expect(listWrapper.prop('scrollToVersionNumber')).toEqual(10);
            expect(listWrapper.prop('versionLimit')).toEqual(100);
            expect(listWrapper.prop('versions')).toEqual(versions);
        });
    });
});
