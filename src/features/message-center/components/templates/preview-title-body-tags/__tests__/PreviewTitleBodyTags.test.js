import * as React from 'react';
import { shallow } from 'enzyme';

import PreviewTitleBodyTags from '../PreviewTitleBodyTags';

const templateParams = { body: 'foo', tags: 'a,b,c', title: 'bar' };
const fileUpload = {
    fileUpload: {
        fileId: '123',
        sharedLinkUrl: 'https://app.box.com/s/1fdsfds',
    },
};
const defaultProps = {
    date: new Date(1600304584205),
    ...templateParams,
    ...fileUpload,
};
const getWrapper = (props = {}) => shallow(<PreviewTitleBodyTags {...defaultProps} {...props} />);

describe('components/message-center/components/templates/preview-title-body-tags/PreviewTitleBodyTags', () => {
    test('should render PreviewTitleBodyTags template', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
