import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItem from '../VersionsItem';
import VersionsItemButton from '../VersionsItemButton';
import { ReadableTime } from '../../../../components/time';

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const defaults = {
        id: '12345',
        created_at: new Date('2019-03-01T00:00:00'),
        modified_at: new Date('2019-03-01T00:00:00'),
        modified_by: { name: 'Test User', id: 10 },
        size: 10240,
        version_number: 1,
    };
    const defaultPermissions = {
        can_delete: true,
        can_preview: true,
    };
    const getVersion = (overrides = {}) => ({
        ...defaults,
        ...overrides,
    });
    const getWrapper = ({ permissions = defaultPermissions, ...props } = {}) =>
        shallow(<VersionsItem permissions={permissions} {...props} />);

    describe('render', () => {
        test('should render an uploaded version correctly', () => {
            const wrapper = getWrapper({
                version: getVersion({ action: 'upload' }),
            });
            const button = wrapper.closest(VersionsItemButton);

            expect(button.prop('isDisabled')).toBe(false);
            expect(wrapper.closest(ReadableTime)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a deleted version correctly', () => {
            const wrapper = getWrapper({
                version: getVersion({ action: 'delete' }),
            });
            const button = wrapper.closest(VersionsItemButton);

            expect(button.prop('isDisabled')).toBe(true);
            expect(wrapper.closest(ReadableTime)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should default to an unknown user if none is provided', () => {
            const wrapper = getWrapper({
                version: getVersion({ modified_by: undefined }),
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
