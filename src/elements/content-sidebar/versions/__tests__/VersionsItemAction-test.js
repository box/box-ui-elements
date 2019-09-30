import * as React from 'react';
import { shallow } from 'enzyme/build';
import { MenuItem } from '../../../../components/menu';
import VersionsItemAction from '../VersionsItemAction';

describe('elements/content-sidebar/versions/VersionsItemAction', () => {
    const defaultProps = {
        action: 'remove',
        children: <div />,
        fildId: '1234',
        isCurrent: false,
    };
    const getWrapper = (props = {}) => shallow(<VersionsItemAction {...defaultProps} {...props} />);

    describe('render', () => {
        test('should render the correct menu item', () => {
            const wrapper = getWrapper();
            const menuItem = wrapper.find(MenuItem);

            expect(menuItem.exists()).toBe(true);
            expect(menuItem.prop('className')).toEqual('bcs-VersionsItemAction');
            expect(menuItem.prop('data-resin-iscurrent')).toEqual(defaultProps.isCurrent);
            expect(menuItem.prop('data-resin-itemid')).toEqual(defaultProps.fileId);
            expect(menuItem.prop('data-resin-target')).toEqual(defaultProps.action);
            expect(menuItem.children()).toHaveLength(1);

            expect(wrapper).toMatchSnapshot();
        });
    });
});
