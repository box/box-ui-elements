import * as React from 'react';
import { render } from 'enzyme/build';
import VersionsItemBadge from '../VersionsItemBadge';

describe('elements/content-sidebar/versions/VersionsItemBadge', () => {
    const getWrapper = (props = {}) => render(<VersionsItemBadge {...props} />);

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ versionNumber: '1' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
