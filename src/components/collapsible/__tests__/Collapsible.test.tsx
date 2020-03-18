import React from 'react';
import sinon from 'sinon';
import { shallow, ShallowWrapper } from 'enzyme';

import Button from '../../button/Button';
import PlainButton from '../../plain-button/PlainButton';
import Collapsible from '..';

describe('components/collapsible/Collapsible', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Collapsible isOpen title="foo">
                <span className="test-content">foobar</span>
            </Collapsible>,
        );
    });

    test('should render component correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should toggle visibility on click', () => {
        wrapper.find('.collapsible-card-title').simulate('click');
        expect(wrapper.state('isOpen')).toBeFalsy();

        wrapper.find('.collapsible-card-title').simulate('click');
        expect(wrapper.state('isOpen')).toBeTruthy();
    });

    test('should render with headerActionItems', () => {
        wrapper = shallow(
            <Collapsible headerActionItems={<Button>Click Here</Button>} isOpen={false} title="foo">
                <span className="test-content">foobar</span>
            </Collapsible>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should apply correct border class', () => {
        wrapper = shallow(
            <Collapsible isBordered isOpen title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should apply correct isOpen state', () => {
        wrapper = shallow(
            <Collapsible isOpen={false} title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should apply buttonProps correctly', () => {
        wrapper = shallow(
            <Collapsible buttonProps={{ a: 1, b: 2 }} isOpen title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should render a PlainButton if a button is passed in', () => {
        wrapper = shallow(
            <Collapsible headerButton={<PlainButton />} title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render a PlainButton if a button is not passed in', () => {
        wrapper = shallow(
            <Collapsible title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should fire open and close handlers', () => {
        const closeSpy = sinon.spy();
        const openSpy = sinon.spy();

        wrapper = shallow(
            <Collapsible buttonProps={{ a: 1, b: 2 }} isOpen onClose={closeSpy} onOpen={openSpy} title="foo">
                <span>foobar</span>
            </Collapsible>,
        );

        expect(closeSpy.notCalled).toBe(true);
        expect(openSpy.notCalled).toBe(true);

        wrapper.find('.collapsible-card-title').simulate('click');

        expect(closeSpy.calledOnce).toBe(true);
        expect(openSpy.notCalled).toBe(true);

        wrapper.find('.collapsible-card-title').simulate('click');
        expect(closeSpy.calledOnce).toBe(true);
        expect(openSpy.calledOnce).toBe(true);
    });
});
