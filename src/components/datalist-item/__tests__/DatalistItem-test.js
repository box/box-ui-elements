import React from 'react';
import sinon from 'sinon';

import DatalistItem from '..';

const sandbox = sinon.sandbox.create();

describe('components/datalist-item/DatalistItem', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render default component', () => {
            const child = 'Test';
            const wrapper = shallow(<DatalistItem>{child}</DatalistItem>);

            expect(wrapper.is('li')).toBe(true);
            expect(wrapper.hasClass('datalist-item')).toBe(true);
            expect(wrapper.prop('id')).toBeTruthy();
            expect(wrapper.text()).toEqual(child);
        });

        test('should render the correct classes when className and isActive are specified', () => {
            const className = 'test';
            const wrapper = shallow(
                <DatalistItem className={className} isActive>
                    Test
                </DatalistItem>,
            );

            expect(wrapper.hasClass('datalist-item')).toBe(true);
            expect(wrapper.hasClass('is-active')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render custom attributes when specified', () => {
            const wrapper = shallow(<DatalistItem data-resin-target="test">Test</DatalistItem>);

            expect(wrapper.prop('data-resin-target')).toEqual('test');
        });

        test('should not override id or role on li when props are specified', () => {
            const id = 'test';
            const role = 'listitem';
            const wrapper = shallow(
                <DatalistItem id={id} role={role}>
                    Test
                </DatalistItem>,
            );

            expect(wrapper.prop('id')).not.toEqual(id);
            expect(wrapper.prop('role')).toEqual('option');
        });
    });

    describe('setActiveItemID()', () => {
        test('should call setActiveItemID() in componentDidUpdate when isActive is true', () => {
            const setActiveItemIDSpy = sandbox.spy();
            shallow(
                <DatalistItem isActive setActiveItemID={setActiveItemIDSpy}>
                    Test
                </DatalistItem>,
            );

            expect(setActiveItemIDSpy.calledOnce).toBe(true);
        });

        test('should call setActiveItemID() when prop isActive becomes true', () => {
            const setActiveItemIDSpy = sandbox.spy();
            const wrapper = shallow(<DatalistItem setActiveItemID={setActiveItemIDSpy}>Test</DatalistItem>);
            wrapper.setProps({ isActive: true });

            expect(setActiveItemIDSpy.calledOnce).toBe(true);
        });
    });
});
