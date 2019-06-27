import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItem from '../VersionsItem';
import VersionsItemButton from '../VersionsItemButton';
import { ReadableTime } from '../../../../components/time';
import VersionsItemActions from '../VersionsItemActions';

jest.mock('../../../../utils/dom', () => ({
    ...jest.requireActual('../../../../utils/dom'),
    scrollIntoView: jest.fn(),
}));

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const defaults = {
        id: '12345',
        action: 'upload',
        created_at: new Date('2019-03-01T00:00:00'),
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
            'should render version number $versionNumber with a limit of $versionLimit correctly',
            ({ isLimited, versionLimit, versionNumber }) => {
                const wrapper = getWrapper({
                    version: getVersion({ action: 'upload', version_number: versionNumber }),
                    versionCount: 10,
                    versionLimit,
                });
                const button = wrapper.find(VersionsItemButton).first();

                expect(button.prop('isDisabled')).toBe(isLimited);
                expect(wrapper.find(VersionsItemActions).length).toBe(isLimited ? 0 : 1);
            },
        );

        test('should render an uploaded version correctly', () => {
            const wrapper = getWrapper({
                version: getVersion({ action: 'upload' }),
            });
            const button = wrapper.find(VersionsItemButton).first();

            expect(button.prop('isDisabled')).toBe(false);
            expect(wrapper.find(ReadableTime)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a deleted version correctly', () => {
            const wrapper = getWrapper({
                version: getVersion({ action: 'delete' }),
            });
            const button = wrapper.find(VersionsItemButton).first();

            expect(button.prop('isDisabled')).toBe(true);
            expect(wrapper.find(ReadableTime)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a selected version correctly', () => {
            const wrapper = getWrapper({
                isSelected: true,
                version: getVersion({ action: 'upload' }),
            });
            const button = wrapper.find(VersionsItemButton).first();

            expect(button.prop('isSelected')).toBe(true);
        });

        test.each`
            modified_by
            ${null}
            ${undefined}
        `('should default to an unknown user if $modified_by is provided for modified_by', ({ modified_by }) => {
            const wrapper = getWrapper({
                version: getVersion({ modified_by }),
            });
            const wrapperInfo = wrapper.find('[data-testid="bcs-VersionsItem-log"]');
            expect(wrapperInfo).toMatchSnapshot();
        });
    });
});
