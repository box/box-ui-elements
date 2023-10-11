import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContentAnswers from '../ContentAnswers';
import { mockApi, mockFile } from '../__mocks__/mocks';
// @ts-ignore: no ts definition
import APIContext from '../../../elements/common/api-context';

jest.mock('../ContentAnswersModalFooter', () => () => <div />);

describe('features/content-answers', () => {
    const renderComponent = (props?: {}) =>
        render(
            <APIContext.Provider value={mockApi}>
                <ContentAnswers file={mockFile} {...props} />
            </APIContext.Provider>,
        );

    test('should render the content answers', () => {
        renderComponent();

        const button = screen.getByTestId('content-answers-open-button');
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        const modal = screen.getByTestId('content-answers-modal');
        expect(modal).toBeInTheDocument();
    });
});
