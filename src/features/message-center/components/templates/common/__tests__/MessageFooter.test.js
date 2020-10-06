import * as React from 'react';
import { shallow } from 'enzyme';

import MessageFooter from '../MessageFooter';

const defaultProps = {
    date: new Date(1600297599505),
};

const getWrapper = props => shallow(<MessageFooter {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessageFooter', () => {
    test('should render correctly if no action item present', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should render correctly if action item provided', () => {
        expect(
            getWrapper({
                actionItem: { label: 'label', actions: [{ type: 'openURL', url: 'testURL', target: '_self' }] },
            }),
        ).toMatchSnapshot();
    });
});
