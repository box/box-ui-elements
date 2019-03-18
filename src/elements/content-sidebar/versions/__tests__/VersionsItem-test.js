import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItem from '../VersionsItem';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    withRouter: Component => Component,
}));

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const getMatch = () => ({ path: '/:versionId', params: {} });
    const getWrapper = (props = {}) => shallow(<VersionsItem match={getMatch()} {...props} />);

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ id: '12345' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
