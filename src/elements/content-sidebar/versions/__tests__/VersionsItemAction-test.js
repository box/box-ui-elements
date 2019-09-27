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

            expect(wrapper.find(MenuItem)).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
