import { shallow } from 'enzyme';
import * as React from 'react';

import PreviewTitleBodyTwoButtonsModalTemplate from '../PreviewTitleBodyTwoButtonsModalTemplate';

// Override the identity Jest mapper for sanitize-html so these assertions prove
// title/body go through sanitizeHTML (a distinct transformed value is rendered).
jest.mock('sanitize-html', () => html => `sanitized:${html}`);

describe('features/in-app-messenger/contextual/templates/PreviewTitleBodyTwoButtonsModalTemplate', () => {
    const onAction = jest.fn();

    const paramsConfigs = {
        all: {
            params: {
                body: 'body',
                button1: {
                    label: 'button1',
                    actions: ['actions1'],
                },
                button2: {
                    label: 'button2',
                    actions: ['actions2'],
                },
                fileUpload: {
                    fileId: '1234',
                    sharedLinkUrl: 'https://shared-link.com',
                },
                templateID: 'preview-title-body-two-buttons-modal-template',
                title: 'title',
            },
        },
        missingButton2: {
            params: {
                body: 'body',
                button1: {
                    label: 'button1',
                    actions: ['actions1'],
                },
                footnote: 'footnote',
                fileUpload: {
                    fileId: '1234',
                    sharedLinkUrl: 'https://shared-link.com',
                },
                templateID: 'image-title-body-two-buttons-modal-template',
                title: 'title',
            },
        },
    };

    const getWrapper = params =>
        shallow(<PreviewTitleBodyTwoButtonsModalTemplate onAction={onAction} params={params} />);

    beforeEach(() => {});

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe.each([paramsConfigs.all, paramsConfigs.missingButton2])('%o', ({ params }) => {
        test('renders correctly', () => {
            const wrapper = getWrapper(params);
            expect(wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate').length).toEqual(1);
            expect(wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-title').length).toEqual(1);
            expect(wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-body').length).toEqual(1);
            expect(wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-previewContainer').length).toEqual(1);
            expect(wrapper.find('PrimaryButton').length).toEqual(1);
            expect(
                wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-title').prop('dangerouslySetInnerHTML'),
            ).toEqual({ __html: `sanitized:${params.title}` });
            expect(
                wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-body').prop('dangerouslySetInnerHTML'),
            ).toEqual({ __html: `sanitized:${params.body}` });
        });
    });

    test('does not pass raw script/on* payloads through to dangerouslySetInnerHTML', () => {
        const params = {
            ...paramsConfigs.all.params,
            title: '<script>alert(1)</script>Safe title',
            body: '<img src=x onerror=alert(1)>Safe body',
        };
        const wrapper = getWrapper(params);
        const titleHtml = wrapper
            .find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-title')
            .prop('dangerouslySetInnerHTML');
        const bodyHtml = wrapper
            .find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-body')
            .prop('dangerouslySetInnerHTML');

        expect(titleHtml).not.toEqual({ __html: params.title });
        expect(bodyHtml).not.toEqual({ __html: params.body });
        expect(titleHtml).toEqual({ __html: `sanitized:${params.title}` });
        expect(bodyHtml).toEqual({ __html: `sanitized:${params.body}` });
    });

    function checkClickElement(findElement, expectCalled, ...expectCalledWith) {
        const element = findElement(getWrapper(paramsConfigs.all.params));
        element.simulate('click');
        if (expectCalled) {
            expect(onAction).toHaveBeenCalledTimes(1);
            expect(onAction).toHaveBeenCalledWith(...expectCalledWith);
        } else {
            expect(onAction).toHaveBeenCalledTimes(0);
        }
    }

    test('should call onAction(button1.actions) if button1 is clicked', () =>
        checkClickElement(wrapper => wrapper.find('PrimaryButton'), true, ['actions1']));

    test('should call onAction(button2.actions) if button2 is clicked', () =>
        checkClickElement(wrapper => wrapper.find('Button'), true, ['actions2']));

    test('should not call onAction if clicked else where', () =>
        checkClickElement(
            wrapper => wrapper.find('.bdl-PreviewTitleBodyTwoButtonsModalTemplate-contentContainer'),
            false,
        ));
});
