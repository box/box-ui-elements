import * as React from 'react';
import { shallow } from 'enzyme/build';
import InlineError from '../../../../components/inline-error';
import VersionsSidebar from '../VersionsSidebar';
import VersionsList from '../VersionsList';

jest.mock('../../../common/nav-button', () => ({
    BackButton: () => <button type="button">Back</button>,
}));

describe('elements/content-sidebar/versions/VersionsSidebar', () => {
    const getWrapper = (props = {}) => shallow(<VersionsSidebar parentName="activity" {...props} />);

    describe('render', () => {
        test('should show the versions list if no error prop is provided', () => {
            const wrapper = getWrapper({ versions: [] });

            expect(wrapper.find(InlineError).length).toEqual(0);
            expect(wrapper.find(VersionsList).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });

        test('should show an inline error if the prop is provided', () => {
            const wrapper = getWrapper({ error: 'This is an error' });

            expect(wrapper.find(InlineError).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
