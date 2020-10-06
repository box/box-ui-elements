import * as React from 'react';
import { shallow } from 'enzyme';

import Message from '../Message';
import {
    PREVIEW_TITLE_BODY_TAGS,
    PREVIEW_TITLE_BODY_TAGS_BUTTON,
    TITLE_BODY_TAGS,
    TITLE_BODY_TAGS_BUTTON,
} from '../../../constants';

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
    activateDate: 1600304584205,
};
const getWrapper = (props = {}) => shallow(<Message {...defaultProps} {...props} />);

describe('components/message-center/components/message/Message', () => {
    test('should render PREVIEW_TITLE_BODY_TAGS template', () => {
        expect(
            getWrapper({
                templateParams: {
                    ...templateParams,
                    ...fileUpload,
                },
                templateName: PREVIEW_TITLE_BODY_TAGS,
            })
                .find('PreviewTitleBodyTags')
                .exists(),
        ).toBe(true);
    });

    test('should render PREVIEW_TITLE_BODY_TAGS_BUTTON template', () => {
        expect(
            getWrapper({
                templateParams: {
                    ...templateParams,
                    ...fileUpload,
                    ...button,
                },
                templateName: PREVIEW_TITLE_BODY_TAGS_BUTTON,
            })
                .find('PreviewTitleBodyTagsButton')
                .exists(),
        ).toBe(true);
    });

    test('should render TITLE_BODY_TAGS template', () => {
        expect(
            getWrapper({
                templateParams: {
                    ...templateParams,
                },
                templateName: TITLE_BODY_TAGS,
            })
                .find('TitleBodyTags')
                .exists(),
        ).toBe(true);
    });

    test('should render TITLE_BODY_TAGS_BUTTON template', () => {
        expect(
            getWrapper({
                templateParams: {
                    ...templateParams,
                    ...button,
                },
                templateName: TITLE_BODY_TAGS_BUTTON,
            })
                .find('TitleBodyTagsButton')
                .exists(),
        ).toBe(true);
    });

    test('should render nothing if invalid template type', () => {
        expect(
            getWrapper({
                templateParams: {
                    ...templateParams,
                    ...button,
                },
                templateName: 'foo_template',
            }).isEmptyRender(),
        ).toBe(true);
    });
});
