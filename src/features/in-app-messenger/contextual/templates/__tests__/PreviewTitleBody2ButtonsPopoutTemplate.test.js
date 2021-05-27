import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import PreviewTitleBody2ButtonsPopoutTemplate from '../PreviewTitleBody2ButtonsPopoutTemplate';

const sandbox = sinon.sandbox.create();

describe('features/in-app-messenger/contextual/templates/PreviewTitleBody2ButtonsPopoutTemplate', () => {
    const onActionSpy = sandbox.spy();

    const paramsConfigs = {
        all: {
            params: {
                body: 'body',
                button1: {
                    label: 'button1',
                    actions: 'actions1',
                },
                button2: {
                    label: 'button2',
                    actions: 'actions2',
                },
                fileUpload: {
                    fileId: '1234',
                    sharedLinkUrl: 'https://shared-link.com',
                },
                templateID: 'preview-title-body-2buttons-template',
                title: 'title',
            },
        },
        missingButton2: {
            params: {
                body: 'body',
                button1: {
                    label: 'button1',
                    actions: 'actions1',
                },
                footnote: 'footnote',
                fileUpload: {
                    fileId: '1234',
                    sharedLinkUrl: 'https://shared-link.com',
                },
                templateID: 'image-title-body-2buttons-template',
                title: 'title',
            },
        },
    };

    const getWrapper = params =>
        shallow(<PreviewTitleBody2ButtonsPopoutTemplate onAction={onActionSpy} params={params} />);

    beforeEach(() => {});

    afterEach(() => {
        sandbox.verify();
        sandbox.reset();
    });

    describe.each([paramsConfigs.all, paramsConfigs.missingButton2])('%o', ({ params }) => {
        test('renders correctly', () => {
            getWrapper(params);
        });
    });

    function checkClickElement(findElement, expectCalled, ...expectCalledWith) {
        const element = findElement(getWrapper(paramsConfigs.all.params));
        element.simulate('click');
        if (expectCalled) {
            expect(onActionSpy.callCount).toBe(1);
            expect(onActionSpy.calledWith(...expectCalledWith)).toBe(true);
        } else {
            expect(onActionSpy.callCount).toBe(0);
        }
    }

    test('should call onAction(button1.actions) if button1 is clicked', () =>
        checkClickElement(wrapper => wrapper.find('Button').at(1), true, 'actions1'));

    test('should call onAction(button2.actions) if button2 is clicked', () =>
        checkClickElement(wrapper => wrapper.find('Button').at(0), true, 'actions2'));

    test('should not call onAction if clicked else where', () =>
        checkClickElement(wrapper => wrapper.find('Overlay'), false));
});
