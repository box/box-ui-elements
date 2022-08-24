import React from 'react';
import sinon from 'sinon';
import { shallow, ShallowWrapper } from 'enzyme';
import AccordionCollapsible from '../AccordionCollapsible';

describe('components/accordion-collapsible/AccordionCollapsible', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(
            <AccordionCollapsible isOpen title="foo">
                <span className="test-content">foobar</span>
            </AccordionCollapsible>,
        );
    });

    test('should render component correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('should toggle visibility on click', async () => {
        wrapper.find('.accordion-collapsible-header-btn').simulate('click');
        expect(wrapper).toMatchSnapshot();

        wrapper.find('.accordion-collapsible-header-btn').simulate('click');
        expect(wrapper).toMatchSnapshot();
    });

    test('should apply correct isOpen state', () => {
        wrapper = shallow(
            <AccordionCollapsible isOpen={false} title="foo">
                <span>foobar</span>
            </AccordionCollapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should apply buttonProps correctly', () => {
        wrapper = shallow(
            <AccordionCollapsible buttonProps={{ a: 1, b: 2 }} isOpen title="foo">
                <span>foobar</span>
            </AccordionCollapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should apply containerProps correctly', () => {
        wrapper = shallow(
            <AccordionCollapsible containerProps={{ a: 1, b: 2 }} isOpen title="foo">
                <span>foobar</span>
            </AccordionCollapsible>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should fire open and close handlers', () => {
        const closeSpy = sinon.spy();
        const openSpy = sinon.spy();

        wrapper = shallow(
            <AccordionCollapsible buttonProps={{ a: 1, b: 2 }} isOpen onClose={closeSpy} onOpen={openSpy} title="foo">
                <span>foobar</span>
            </AccordionCollapsible>,
        );

        expect(closeSpy.notCalled).toBe(true);
        expect(openSpy.notCalled).toBe(true);

        wrapper.find('.accordion-collapsible-header-btn').simulate('click');

        expect(closeSpy.calledOnce).toBe(true);
        expect(openSpy.notCalled).toBe(true);

        wrapper.find('.accordion-collapsible-header-btn').simulate('click');
        expect(closeSpy.calledOnce).toBe(true);
        expect(openSpy.calledOnce).toBe(true);
    });
});
