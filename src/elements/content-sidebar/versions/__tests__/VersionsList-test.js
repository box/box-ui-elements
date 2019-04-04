import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsList from '../VersionsList';

describe('elements/content-sidebar/versions/VersionsList', () => {
    const getWrapper = (props = {}) => shallow(<VersionsList {...props} />);

    describe('render', () => {
        test.each`
            versions
            ${[]}
            ${[{ id: '12345' }]}
            ${[{ id: '12345' }, { id: '45678' }]}
        `('should match its snapshot', ({ versions }) => {
            const match = {
                params: { versionId: '12345' },
                path: '/versions/:versionId',
            };
            const wrapper = getWrapper({ match, versions });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
