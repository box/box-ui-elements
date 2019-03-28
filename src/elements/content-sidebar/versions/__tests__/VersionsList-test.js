import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsList from '../VersionsList';

describe('elements/content-sidebar/versions/VersionsList', () => {
    const getWrapper = (props = {}) => shallow(<VersionsList {...props} />);

    describe('render', () => {
        test.each`
            versions
            ${undefined}
            ${[]}
            ${[{ id: '12345' }]}
            ${[{ id: '12345' }, { id: '45678' }]}
        `('should match its snapshot', ({ versions }) => {
            const wrapper = getWrapper({ versions });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
