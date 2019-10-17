import React from 'react';

import SuggestedPill from '../SuggestedPill';

describe('components/pill-selector-dropdown/SuggestedPill', () => {
    const preventDefaultStub = jest.fn();
    const basicEvent = { preventDefault: preventDefaultStub };
    const getWrapper = (params = {}) =>
        shallow(<SuggestedPill email="foo@bar.com" id={123} name="Foo" onAdd={jest.fn()} {...params} />);

    describe('render()', () => {
        test('should render the SuggestedPill', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        test('button element should call addSuggestedCollab with event when clicked', () => {
            const onAdd = jest.fn();
            const wrapper = getWrapper({
                onAdd,
            });

            wrapper.find('.suggested-pill-invisible-button').simulate('click', basicEvent);

            expect(onAdd).toHaveBeenCalled();
        });

        test('button element should call addSuggestedCollab with event when keypressed with enter', () => {
            const onAdd = jest.fn();
            const wrapper = getWrapper({
                onAdd,
            });

            const fakeEvent = { ...basicEvent, key: 'Enter' };
            wrapper.find('.suggested-pill-invisible-button').simulate('keyDown', fakeEvent);

            expect(onAdd).toHaveBeenCalled();
        });

        test('button element should call addSuggestedCollab with event when keypressed with a random key', () => {
            const onAdd = jest.fn();
            const wrapper = getWrapper({
                onAdd,
            });

            const fakeEvent = { ...basicEvent, key: 'foo' };
            wrapper.find('.suggested-pill-invisible-button').simulate('keyDown', fakeEvent);

            expect(onAdd).not.toHaveBeenCalled();
        });
    });

    describe('addSuggestedCollab()', () => {
        test('should call preventDefault', () => {
            const wrapper = getWrapper();
            wrapper.find('.suggested-pill-invisible-button').simulate('click', basicEvent);

            expect(preventDefaultStub).toHaveBeenCalled();
        });

        test('should call onSelect with the correct params', () => {
            const email = 'abc@123.com';
            const id = 123;
            const name = 'Foo';
            const onAdd = jest.fn();
            const wrapper = getWrapper({
                email,
                id,
                name,
                onAdd,
            });
            wrapper.find('.suggested-pill-invisible-button').simulate('click', basicEvent);

            expect(onAdd).toHaveBeenCalledWith({
                email,
                id,
                name,
                text: name,
                type: 'user',
                value: email,
            });
        });
    });
});
