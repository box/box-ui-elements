import * as React from 'react';
import { render, screen } from '@testing-library/react';

import Question from '../Question';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

describe('features/content-answers/question', () => {
    const renderComponent = (props: { currentUser: User; prompt: string }) => render(<Question {...props} />);

    test('should render the question', () => {
        renderComponent({ currentUser: { id: 'id', name: 'g w' }, prompt: 'some prompt' });

        const prompt = screen.getByText('some prompt');
        expect(prompt).toBeInTheDocument();
        const avatar = screen.getByText('GW');
        expect(avatar).toBeInTheDocument();
    });
});
