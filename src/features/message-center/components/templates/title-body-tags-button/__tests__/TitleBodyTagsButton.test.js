import * as React from 'react';
import { shallow } from 'enzyme';

import TitleBodyTagsButton from '../TitleBodyTagsButton';

const templateParams = { body: 'foo', tags: 'a,b,c', title: 'bar' };
const button = {
    button1: {
        label: 'learn more',
        actions: [{ type: 'openURL', target: '_blank', url: 'https://support.box.com/hc/en-us' }, { type: 'close' }],
    },
};
const defaultProps = {
    date: new Date(1600304584205),
    ...templateParams,
    ...button,
};
const getWrapper = (props = {}) => shallow(<TitleBodyTagsButton {...defaultProps} {...props} />);

describe('components/message-center/components/templates/preview-title-body-tags/TitleBodyTagsButton', () => {
    test('should render TitleBodyTagsButton template', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
