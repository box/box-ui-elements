// @flow
import * as React from 'react';

import TemplateButton from '../components/TemplateButton';
import { template } from '../components/fixtures';

describe('feature/query-bar/components/TemplateButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<TemplateButton {...props} />);
    };

    describe('render()', () => {
        test('should render TemplateButton', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updateActiveTemplate', () => {
        test('should call onTemplateChange', () => {
            const onTemplateChangeMock = jest.fn();
            const wrapper = getWrapper({
                onTemplateChange: onTemplateChangeMock,
            });

            wrapper.instance().updateActiveTemplate(template);
            expect(onTemplateChangeMock.mock.calls.length).toBe(1);
        });
    });

    describe('toggleTemplateDropdownButton()', () => {
        [
            {
                description: 'Should open the dropdown',
                initialState: {
                    isTemplateMenuOpen: false,
                },
                updatedState: {
                    isTemplateMenuOpen: true,
                },
            },
            {
                description: 'Should close the dropdown',
                initialState: {
                    isTemplateMenuOpen: true,
                },
                updatedState: {
                    isTemplateMenuOpen: false,
                },
            },
        ].forEach(({ description, initialState, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().setState({
                    isTemplateMenuOpen: initialState.isTemplateMenuOpen,
                });
                wrapper.instance().toggleTemplateDropdownButton();

                expect(wrapper.state('isTemplateMenuOpen')).toEqual(updatedState.isTemplateMenuOpen);
            });
        });
    });

    describe('renderEntryButton()', () => {
        const templ = {
            id: '123',
            displayName: 'template name 1',
        };
        const activeTemplateClassName = 'is-active';

        test.each`
            activeTemplate | expectedReturn | description
            ${templ}       | ${true}        | ${'Should render div with class containing is-active'}
            ${null}        | ${false}       | ${'Should render div with class that does not contain is-active'}
        `('$description', ({ activeTemplate, expectedReturn }) => {
            const wrapper = getWrapper({ activeTemplate });
            wrapper.instance().setState({
                isTemplateMenuOpen: true,
            });

            const entryButtonWrapper = shallow(wrapper.instance().renderEntryButton());
            expect(entryButtonWrapper.props().className.includes(activeTemplateClassName)).toEqual(expectedReturn);
        });

        test.each`
            templates | expectedMessage             | description
            ${null}   | ${'Template Name'}          | ${'Should render templates loading message'}
            ${[]}     | ${'No Templates Available'} | ${'Should render no templates message'}
        `('$description', ({ templates, expectedMessage }) => {
            const wrapper = getWrapper({ templates });

            const entryButtonWrapper = shallow(wrapper.instance().renderEntryButton());
            expect(entryButtonWrapper.find('FormattedMessage').props().defaultMessage).toEqual(expectedMessage);
        });
    });
});
