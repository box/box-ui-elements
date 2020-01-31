/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import { Link, LinkGroup, LinkButton, LinkPrimaryButton } from '..';
import { LinkBaseProps } from '../LinkBase';

const sandbox = sinon.sandbox.create();

describe('components/link/Link', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should correctly render default Link', () => {
        const wrapper = mount(<Link>a link</Link>);

        expect(wrapper.find('a').hasClass('link')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('#');
    });

    test('should correctly render Link with href', () => {
        const wrapper = mount(<Link href="foo">a link</Link>);

        expect(wrapper.find('a').hasClass('link')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('foo');
    });

    test('should render Link with rel="noopener" when target="_blank"', () => {
        const wrapper = mount(
            <Link href="foo" target="_blank">
                a link
            </Link>,
        );

        const linkWrapper = wrapper.find('a');
        expect(linkWrapper.prop('target')).toEqual('_blank');
        expect(linkWrapper.prop('rel')).toEqual('noopener');
    });

    test('should render Link but not override "rel" when target="_blank"', () => {
        const wrapper = mount(
            <Link href="foo" rel="noreferrer" target="_blank">
                a link
            </Link>,
        );

        const linkWrapper = wrapper.find('a');
        expect(linkWrapper.prop('target')).toEqual('_blank');
        expect(linkWrapper.prop('rel')).toEqual('noreferrer');
    });

    test('should use "component" prop for element if passed', () => {
        const MyLink = ({ href, children, ...rest }: LinkBaseProps) => (
            <a {...rest} href={href}>
                {children}
            </a>
        );
        const wrapper = mount(
            <Link component={MyLink} href="my-route">
                a link
            </Link>,
        );

        expect(wrapper.find(MyLink).hasClass('link')).toBe(true);
        expect(wrapper.find(MyLink).prop('children')).toEqual('a link');
        // test that unknown props like "to" are passed down:
        expect(wrapper.find('a').prop('href')).toEqual('my-route');
    });

    test('should use "refProp" prop for element if passed', () => {
        const linkRef = jest.fn();
        mount(
            <Link linkRef={linkRef} refProp="ref" href="my-route">
                a link
            </Link>,
        );

        expect(linkRef).toHaveBeenCalled();
    });

    test('should correctly render LinkButton', () => {
        const wrapper = mount(<LinkButton>a link</LinkButton>);

        expect(wrapper.find('a').hasClass('btn')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('#');
    });

    test('should correctly render LinkButton with proper href', () => {
        const wrapper = mount(<LinkButton href="foo">a link</LinkButton>);

        expect(wrapper.find('a').hasClass('btn')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('foo');
    });

    test('should correctly render LinkButton with linkRef', () => {
        const linkRef = sandbox.spy();
        mount(
            <LinkButton href="foo" linkRef={linkRef}>
                a link
            </LinkButton>,
        );

        expect(linkRef.calledOnce).toBe(true);
    });

    test('should correctly render LinkPrimaryButton', () => {
        const wrapper = mount(<LinkPrimaryButton>a link</LinkPrimaryButton>);

        expect(wrapper.find('a').hasClass('btn')).toBe(true);
        expect(wrapper.find('a').hasClass('btn-primary')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('#');
    });

    test('should correctly render LinkPrimaryButton with proper href', () => {
        const wrapper = mount(<LinkPrimaryButton href="foo">a link</LinkPrimaryButton>);

        expect(wrapper.find('a').hasClass('btn')).toBe(true);
        expect(wrapper.find('a').hasClass('btn-primary')).toBe(true);
        expect(wrapper.find('a').prop('children')).toEqual('a link');
        expect(wrapper.find('a').prop('href')).toEqual('foo');
    });

    test('should correctly render link group with title', () => {
        const wrapper = shallow(
            <LinkGroup title="lg">
                <a>first link</a>
                <a>second link</a>
            </LinkGroup>,
        );

        expect(wrapper.hasClass('link-group')).toBe(true);
        expect(wrapper.prop('children')[0].props.children).toEqual('lg');
        expect(wrapper.prop('children')[0].props.children.length).toEqual(2);
    });

    test('should correctly render link group without title', () => {
        const wrapper = shallow(
            <LinkGroup>
                <a>first link</a>
                <a>second link</a>
            </LinkGroup>,
        );
        expect(wrapper.hasClass('link-group')).toBe(true);
        expect(wrapper.prop('children')[0]).toEqual(null);
        expect(wrapper.prop('children')[1].props.children.length).toEqual(2);
    });
});
