import * as React from 'react';
import { shallow } from 'enzyme/build';
import DateField from '../../../common/date';
import NavButton from '../../../common/nav-button';
import VersionsItem from '../VersionsItem';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    withRouter: Component => Component,
}));

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const defaults = {
        id: '12345',
        modified_at: new Date('2019-03-01T00:00:00'),
        modified_by: { name: 'Test User', id: 10 },
        size: 10240,
        version_number: 1,
    };
    const getMatch = () => ({ path: '/:versionId', params: {} });
    const getWrapper = (props = {}) => shallow(<VersionsItem match={getMatch()} {...props} />);
    const getVersion = (overrides = {}) => ({
        ...defaults,
        ...overrides,
    });

    describe('render', () => {
        test('should render an uploaded version correctly', () => {
            const wrapper = getWrapper(getVersion({ action: 'upload' }));
            const navButton = wrapper.closest(NavButton);

            expect(navButton.prop('disabled')).toBe(false);
            expect(navButton.prop('className')).not.toContain('bcs-is-disabled');
            expect(navButton.prop('to')).toBe('/12345');
            expect(wrapper.closest(DateField)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render a deleted version correctly', () => {
            const wrapper = getWrapper(getVersion({ action: 'delete' }));
            const navButton = wrapper.closest(NavButton);

            expect(navButton.prop('disabled')).toBe(true);
            expect(navButton.prop('className')).toContain('bcs-is-disabled');
            expect(wrapper.closest(DateField)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });

        test('should default to an unknown user if none is provided', () => {
            const wrapper = getWrapper(getVersion({ modified_by: undefined }));
            expect(wrapper).toMatchSnapshot();
        });
    });
});
