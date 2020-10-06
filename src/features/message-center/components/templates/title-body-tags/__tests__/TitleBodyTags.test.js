import * as React from 'react';
import { shallow } from 'enzyme';

import TitleBodyTags from '../TitleBodyTags';

const templateParams = { body: 'foo', tags: 'a,b,c', title: 'bar' };
const defaultProps = {
    date: new Date(1600304584205),
    ...templateParams,
};
const getWrapper = (props = {}) => shallow(<TitleBodyTags {...defaultProps} {...props} />);

describe('components/message-center/components/templates/title-body-tags-button/TitleBodyTags', () => {
    test('should render TitleBodyTags template', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
