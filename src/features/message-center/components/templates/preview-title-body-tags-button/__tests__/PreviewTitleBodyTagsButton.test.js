import * as React from 'react';
import { shallow } from 'enzyme';

import PreviewTitleBodyTagsButton from '../PreviewTitleBodyTagsButton';

const templateParams = { body: 'foo', tags: 'a,b,c', title: 'bar' };
const fileUpload = {
    fileUpload: {
        fileId: '123',
        sharedLinkUrl: 'https://app.box.com/s/1fdsfds',
    },
};
const button = {
    button1: {
        label: 'learn more',
        actions: [{ type: 'openURL', target: '_blank', url: 'https://support.box.com/hc/en-us' }, { type: 'close' }],
    },
};
const defaultProps = {
    date: new Date(1600304584205),
    ...templateParams,
    ...fileUpload,
    ...button,
};
const getWrapper = (props = {}) => shallow(<PreviewTitleBodyTagsButton {...defaultProps} {...props} />);

describe('components/message-center/components/templates/preview-title-body-tags-button/PreviewTitleBodyTagsButton', () => {
    test('should render PreviewTitleBodyTagsButton template', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
