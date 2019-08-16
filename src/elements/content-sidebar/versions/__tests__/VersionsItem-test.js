import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItem from '../VersionsItem';
import VersionsItemActions from '../VersionsItemActions';
import VersionsItemButton from '../VersionsItemButton';
import { ReadableTime } from '../../../../components/time';

jest.mock('../../../../utils/dom', () => ({
    ...jest.requireActual('../../../../utils/dom'),
    scrollIntoView: jest.fn(),
}));

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const defaults = {
        id: '12345',
        action: 'upload',
        created_at: new Date('2019-03-01T00:00:00'),
        is_download_available: true,
        modified_at: new Date('2019-03-01T00:00:00'),
        modified_by: { name: 'Test User', id: 10 },
        permissions: {
            can_delete: true,
            can_preview: true,
        },
        size: 10240,
        version_number: '1',
    };
    const getVersion = (overrides = {}) => ({
        ...defaults,
        ...overrides,
    });
    const getWrapper = (props = {}) => shallow(<VersionsItem fileId="123" version={defaults} {...props} />);

    describe('render', () => {
        test.each`
            action       | showDelete | showDownload | showPreview | showPromote | showRestore
            ${'delete'}  | ${false}   | ${false}     | ${false}    | ${false}    | ${true}
            ${'restore'} | ${true}    | ${true}      | ${true}     | ${true}     | ${false}
            ${'upload'}  | ${true}    | ${true}      | ${true}     | ${true}     | ${false}
        `(
            "should show actions correctly when the version's action is $action",
            ({ action, showDelete, showDownload, showPreview, showPromote, showRestore }) => {
                const wrapper = getWrapper({
                    version: getVersion({
                        action,
                        permissions: {
                            can_delete: true,
                            can_download: true,
                            can_preview: true,
                            can_upload: true,
                        },
                    }),
                });
                const actions = wrapper.find(VersionsItemActions);
                const button = wrapper.find(VersionsItemButton);

                expect(button.prop('isDisabled')).toBe(!showPreview);
                expect(actions.prop('showDelete')).toBe(showDelete);
                expect(actions.prop('showDownload')).toBe(showDownload);
                expect(actions.prop('showPromote')).toBe(showPromote);
                expect(actions.prop('showPreview')).toBe(showPreview);
                expect(actions.prop('showRestore')).toBe(showRestore);
                expect(wrapper.find(ReadableTime)).toBeTruthy();
                expect(wrapper).toMatchSnapshot();
            },
        );

        test.each`
            permissions
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: true }}
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: false }}
            ${{ can_delete: true, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: true, can_download: false, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: true, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: true }}
        `('should show the correct menu items based on permissions', ({ permissions }) => {
            const wrapper = getWrapper({ version: getVersion({ permissions }) });
            const actions = wrapper.find(VersionsItemActions);
            const button = wrapper.find(VersionsItemButton);

            expect(button.prop('isDisabled')).toBe(!permissions.can_preview);
            expect(actions.prop('showDelete')).toBe(permissions.can_delete);
            expect(actions.prop('showDownload')).toBe(permissions.can_download);
            expect(actions.prop('showPromote')).toBe(permissions.can_upload);
            expect(actions.prop('showPreview')).toBe(permissions.can_preview);
            expect(wrapper.find(ReadableTime)).toBeTruthy();
        });

        test('should render a selected version correctly', () => {
            const wrapper = getWrapper({ isSelected: true });
            const actions = wrapper.find(VersionsItemActions);
            const button = wrapper.find(VersionsItemButton);

            expect(actions.prop('showPreview')).toBe(false);
            expect(button.prop('isSelected')).toBe(true);
        });

        test.each([null, undefined])('should default to an unknown user if modified_by is %s', modified_by => {
            const wrapper = getWrapper({
                version: getVersion({ modified_by }),
            });
            expect(wrapper.find('[data-testid="bcs-VersionsItem-log"]')).toMatchSnapshot();
        });

        test.each`
            versionLimit | versionNumber | isLimited
            ${1}         | ${1}          | ${true}
            ${1}         | ${5}          | ${true}
            ${5}         | ${3}          | ${true}
            ${5}         | ${7}          | ${false}
            ${10}        | ${1}          | ${false}
            ${100}       | ${3}          | ${false}
            ${Infinity}  | ${3}          | ${false}
            ${Infinity}  | ${3000}       | ${false}
        `(
            'should show version number $versionNumber with a limit of $versionLimit correctly',
            ({ isLimited, versionLimit, versionNumber }) => {
                const wrapper = getWrapper({
                    version: getVersion({ action: 'upload', version_number: versionNumber }),
                    versionCount: 10,
                    versionLimit,
                });
                const button = wrapper.find(VersionsItemButton);

                expect(button.prop('isDisabled')).toBe(isLimited);
                expect(wrapper.find(VersionsItemActions).length).toBe(isLimited ? 0 : 1);
            },
        );

        test('should disable preview if the file is watermarked and missing the can_download permission', () => {
            const wrapper = getWrapper({
                isWatermarked: true,
                version: getVersion({
                    permissions: {
                        can_download: false,
                        can_preview: true, // Download should take priority in this case, even if can_preview is true
                        can_upload: true,
                    },
                }),
            });
            const actions = wrapper.find(VersionsItemActions);
            const button = wrapper.find(VersionsItemButton);

            expect(actions.prop('showPreview')).toBe(false);
            expect(button.prop('isDisabled')).toBe(true);
        });
    });
});
