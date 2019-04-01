import * as React from 'react';
import { shallow } from 'enzyme/build';
import IconClockPast from '../../../../icons/general/IconClockPast';
import IconDownload from '../../../../icons/general/IconDownload';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import IconOpenWith from '../../../../icons/general/IconOpenWith';
import IconTrash from '../../../../icons/general/IconTrash';
import IconUpload from '../../../../icons/general/IconUpload';
import VersionsItemActions from '../VersionsItemActions';

describe('elements/content-sidebar/versions/VersionsItemActions', () => {
    const getWrapper = (props = {}) => shallow(<VersionsItemActions {...props} />);

    describe('render', () => {
        test.each`
            permissions
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: true }}
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: false }}
            ${{ can_delete: true, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: true, can_download: false, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: true, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: true }}
        `('should return the correct menu items based on permissions', ({ permissions }) => {
            const wrapper = getWrapper({ permissions });

            expect(wrapper.find(IconEllipsis).exists()).toBe(true); // Versions show actions if any permission is true
            expect(wrapper.find(IconClockPast).exists()).toBe(false); // Versions are not deleted by default
            expect(wrapper.find(IconDownload).exists()).toBe(permissions.can_download);
            expect(wrapper.find(IconOpenWith).exists()).toBe(permissions.can_preview);
            expect(wrapper.find(IconTrash).exists()).toBe(permissions.can_delete);
            expect(wrapper.find(IconUpload).exists()).toBe(permissions.can_upload);
            expect(wrapper).toMatchSnapshot();
        });

        test.each`
            permissions
            ${{}}
            ${{ can_delete: false, can_download: false }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: false }}
        `('should return nothing if no valid permissions are supplied', ({ permissions }) => {
            const wrapper = getWrapper({ permissions });
            expect(wrapper.isEmptyRender()).toBe(true);
        });

        test.each`
            isDeleted | expected
            ${true}   | ${false}
            ${false}  | ${true}
        `(
            'should show the DOWNLOAD and PREVIEW actions only if the version is not deleted',
            ({ expected, isDeleted }) => {
                const wrapper = getWrapper({
                    isDeleted,
                    permissions: { can_download: true, can_preview: true },
                });
                expect(wrapper.find(IconDownload).exists()).toBe(expected);
                expect(wrapper.find(IconOpenWith).exists()).toBe(expected);
            },
        );

        test.each`
            isCurrent | isDeleted | expected
            ${true}   | ${false}  | ${false}
            ${false}  | ${true}   | ${false}
            ${false}  | ${false}  | ${true}
        `(
            'should show the DELETE and PROMOTE actions only if the version is not current/deleted',
            ({ expected, isCurrent, isDeleted }) => {
                const wrapper = getWrapper({
                    isCurrent,
                    isDeleted,
                    permissions: { can_delete: true, can_upload: true },
                });
                expect(wrapper.find(IconTrash).exists()).toBe(expected);
                expect(wrapper.find(IconUpload).exists()).toBe(expected);
            },
        );

        test.each`
            isDeleted | expected
            ${true}   | ${true}
            ${false}  | ${false}
        `('should show the RESTORE action only if the version is deleted', ({ expected, isDeleted }) => {
            const wrapper = getWrapper({
                isDeleted,
                permissions: { can_delete: true },
            });
            expect(wrapper.find(IconClockPast).exists()).toBe(expected);
        });
    });
});
