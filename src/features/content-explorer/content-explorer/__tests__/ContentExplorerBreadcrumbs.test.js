import * as React from 'react';
import sinon from 'sinon';

import { ContentExplorerBreadcrumbsBase as ContentExplorerBreadcrumbs } from '../ContentExplorerBreadcrumbs';

describe('features/content-explorer/content-explorer/ContentExplorerBreadcrumbs', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props =>
        shallow(<ContentExplorerBreadcrumbs foldersPath={[]} intl={{ formatMessage: () => 'message' }} {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const foldersPath = [
        { id: '0', name: 'folder1' },
        { id: '1', name: 'folder2' },
        { id: '2', name: 'folder3' },
    ];

    describe('render()', () => {
        test('should render correct breadcrumbs', () => {
            const wrapper = renderComponent({
                foldersPath,
            });

            expect(wrapper.find('.content-explorer-breadcrumbs-container').length).toBe(1);
            expect(wrapper.find('.content-explorer-breadcrumbs-up-button').length).toBe(1);
            expect(wrapper.find('Breadcrumb').length).toBe(1);

            const breadcrumbs = wrapper.find('[data-testid="breadcrumb-lnk"]');

            expect(breadcrumbs.length).toBe(foldersPath.length);

            breadcrumbs.forEach((breadcrumb, i) => {
                expect(breadcrumb.prop('title')).toEqual(foldersPath[i].name);

                expect(breadcrumb.find('span').text()).toEqual(foldersPath[i].name);
            });
        });

        test('should render disabled up button when isUpButtonDisabled is true', () => {
            const wrapper = renderComponent({ isUpButtonDisabled: true });

            expect(wrapper.find('.content-explorer-breadcrumbs-up-button').prop('isDisabled')).toBe(true);
        });

        test('should render custom breadcrumb icon if specified', () => {
            const wrapper = renderComponent({
                breadcrumbIcon: <div className="test-icon" />,
                foldersPath,
            });
            expect(wrapper.find('.test-icon').length).toBe(1);
            expect(wrapper.find('IconAllFiles').length).toBe(0);
        });

        test('should render IconAllFiles if breadcrumb icon not specified', () => {
            const wrapper = renderComponent({
                foldersPath,
            });
            expect(wrapper.find('IconAllFiles').length).toBe(1);
        });
    });

    describe('onUpButtonClick', () => {
        test('should call onUpButtonClick when up button is clicked', () => {
            const onUpButtonClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                onUpButtonClick: onUpButtonClickSpy,
            });

            wrapper.find('.content-explorer-breadcrumbs-up-button').simulate('click');

            expect(onUpButtonClickSpy.calledOnce).toBe(true);
        });
    });

    describe('onBreadcrumbClick', () => {
        test('should call onBreadcrumbClick when breadcrumb is clicked', () => {
            const breadcrumbIndex = 1;
            const event = {};
            const onBreadcrumbClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                foldersPath,
                onBreadcrumbClick: onBreadcrumbClickSpy,
            });

            wrapper.find('[data-testid="breadcrumb-lnk"]').at(breadcrumbIndex).simulate('click', event);

            expect(onBreadcrumbClickSpy.calledOnce).toBe(true);
            expect(onBreadcrumbClickSpy.calledWithExactly(breadcrumbIndex, event)).toBe(true);
        });
    });
});
