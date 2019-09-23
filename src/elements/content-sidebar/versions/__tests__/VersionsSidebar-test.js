import * as React from 'react';
import { shallow } from 'enzyme/build';
import InlineError from '../../../../components/inline-error';
import messages from '../messages';
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

            expect(wrapper.exists(InlineError)).toBe(false);
            expect(wrapper.exists(VersionsMenu)).toBe(true);
            expect(wrapper).toMatchSnapshot();
        });

        test('should show an inline error if the prop is provided', () => {
            const wrapper = getWrapper({ error: messages.versionFetchError, versions: [] });

            expect(wrapper.exists(InlineError)).toBe(true);
            expect(wrapper).toMatchSnapshot();
        });

        test('should show max versions text if max versions provided', () => {
            const versions = Array.from({ length: 1000 }).map((item, index) => ({ id: index }));
            const wrapper = getWrapper({ versions });

            expect(wrapper.exists('[data-testid="max-versions"]')).toBe(true);
        });
    });
});
