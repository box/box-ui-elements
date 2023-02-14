import { mount } from 'enzyme';
import React from 'react';
import { ContentAnswersComponent as ContentAnswers } from '../ContentAnswers';

describe('elements/content-answers/ContentAnswers', () => {
    let rootElement;
    const getWrapper = (props = {}) => mount(<ContentAnswers {...props} />, { attachTo: rootElement });

    beforeEach(() => {
        rootElement = document.createElement('div');
        rootElement.appendChild(document.createElement('div'));
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        document.body.removeChild(rootElement);
    });

    describe('render()', () => {
        test('should render test id for e2e testing', () => {
            const wrapper = getWrapper();
            expect(wrapper.find('[data-testid="content-answers"]')).toHaveLength(1);
        });
    });
});
