import * as React from 'react';
import { shallow } from 'enzyme';

import MessageTags from '../MessageTags';

const defaultProps = {
    tags: 'testTag1,testTag2',
};

const getWrapper = props => shallow(<MessageTags {...defaultProps} {...props} />);

describe('components/message-center/components/templates/common/MessageTags', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });

    test('should strip out blank tags', () => {
        expect(getWrapper({ tags: 'foo,bar,,baz' }).find('LabelPillText')).toHaveLength(3);
    });
});
