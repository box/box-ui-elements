import * as React from 'react';
import { shallow } from 'enzyme/build';
import InlineError from '../../../../components/inline-error';
import VersionsMenu from '../VersionsMenu';
import VersionsSidebar from '../VersionsSidebar';

jest.mock('../../../common/nav-button', () => ({
    BackButton: () => <button type="button">Back</button>,
}));

describe('elements/content-sidebar/versions/VersionsSidebar', () => {
    const getWrapper = (props = {}) => shallow(<VersionsSidebar parentName="activity" {...props} />);

    describe('render', () => {
        test('should show the versions list if no error prop is provided', () => {
            const wrapper = getWrapper({ versions: [{ id: '12345' }] });

            expect(wrapper.find(InlineError).length).toEqual(0);
            expect(wrapper.find(VersionsMenu).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should show an inline error if the prop is provided', () => {
            const wrapper = getWrapper({ error: 'This is an error', versions: [] });

            expect(wrapper.find(InlineError).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
