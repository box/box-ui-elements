import React from 'react';
import sinon from 'sinon';

import ItemListName from '../ItemListName';

describe('features/content-explorer/item-list/ItemListName', () => {
    const sandbox = sinon.sandbox.create();

    const renderComponent = props => shallow(<ItemListName name="item" {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const name = 'item';
            const wrapper = renderComponent({ name });

            expect(wrapper.hasClass('item-list-name-container')).toBe(true);
            expect(wrapper.find('.item-list-name').text()).toEqual(name);
            expect(wrapper.find('.item-list-name-label').length).toBe(0);
        });

        test('should render a PlainButton if the type is a folder', () => {
            const type = 'folder';
            const wrapper = renderComponent({ type });

            expect(wrapper.find('PlainButton.lnk.item-list-name').length).toBe(1);
        });

        test('should render component with label when specified', () => {
            const label = 'label';
            const wrapper = renderComponent({ label });

            expect(wrapper.find('.item-list-name-label').text()).toEqual(label);
        });
    });

    describe('onClick', () => {
        test('should call onClick when name is clicked', () => {
            const onClickSpy = sandbox.spy();
            const wrapper = renderComponent({
                type: 'folder',
                onClick: onClickSpy,
            });

            wrapper.find('.item-list-name').simulate('click');

            expect(onClickSpy.calledOnce).toBe(true);
        });
    });

    describe('linkRenderer', () => {
        test('should use linkRenderer when specified', () => {
            const name = 'item';
            const linkRenderer = () => <button type="button" className="name-test" />;
            const wrapper = renderComponent({
                name,
                type: 'folder',
                linkRenderer,
            });

            expect(wrapper.find('button.name-test').length).toBe(1);
        });
    });
});
