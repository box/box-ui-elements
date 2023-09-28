import React from 'react';
import { render, screen } from '@testing-library/react';

import ContentAnswersModal from '../ContentAnswersModal';

jest.mock('../ContentAnswersModalFooter', () => () => <div />);

describe('features/content-answers/ContentAnswersModal', () => {
    const file = { extension: 'doc' };
    const renderComponent = (props?: {}) =>
        render(<ContentAnswersModal file={file} isOpen onRequestClose={jest.fn()} {...props} />);

    test('should render the header icon', () => {
        renderComponent();

        const headerIcon = screen.queryByTestId('content-answers-icon-color');
        expect(headerIcon).toBeInTheDocument();
    });
});
