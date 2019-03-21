import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsSidebar from '..';

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const versionsAPI = {
        getVersions: jest.fn(),
    };
    const api = {
        getVersionsAPI: () => versionsAPI,
    };
    const getWrapper = ({ fileId = '12345', ...rest } = {}) =>
        shallow(<VersionsSidebar api={api} fileId={fileId} {...rest} />);

    describe('componentDidMount', () => {
        test('should fetch versions', () => {
            const wrapper = getWrapper();

            expect(wrapper.state('versions')).toHaveLength(0);
            expect(versionsAPI.getVersions).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate', () => {
        test('should forward version id changes to the parent component', () => {
            const onVersionChange = jest.fn();
            const wrapper = getWrapper({ onVersionChange });

            wrapper.setProps({ versionId: '12345' });

            expect(onVersionChange).toHaveBeenCalledWith('12345');
        });
    });

    describe('render', () => {
        test('should match its snapshot', () => {
            const wrapper = getWrapper({ parentName: 'activity' });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
