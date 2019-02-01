// @flow
import * as React from 'react';

import TemplateButton from '../TemplateButton';

describe('feature/metadata-view/components/TemplateButton', () => {
    const getWrapper = () => {
        return shallow(<TemplateButton />);
    };

    describe('render()', () => {
        test('should render TemplateButton', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
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
        const template = {
            id: '123',
            displayName: 'template name 1',
        };
        const selectedTemplateClassName = 'is-active';

        test.each`
            selectedTemplate | expectedReturn | description
            ${template}      | ${true}        | ${'Should render div with class containing is-active'}
            ${null}          | ${false}       | ${'Should render div with class that does not contain is-active'}
        `('$description', ({ selectedTemplate, expectedReturn }) => {
            const wrapper = getWrapper();
            wrapper.instance().setState({
                isTemplateMenuOpen: true,
                selectedTemplate,
            });

            const entryButtonWrapper = shallow(wrapper.instance().renderEntryButton());
            expect(entryButtonWrapper.props().className.includes(selectedTemplateClassName)).toEqual(expectedReturn);
        });
    });
});
