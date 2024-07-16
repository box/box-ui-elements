import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';

import WelcomeMessage from '../WelcomeMessage';

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('features/content-answers/WelcomeMessage', () => {
    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = (props?: {}) => {
        render(<WelcomeMessage fileName="" {...props} />, { wrapper: IntlWrapper });
    };

    test('should render correctly with the filename', () => {
        const mockFileName = 'testFile';
        renderComponent({ fileName: mockFileName });
        const fileNameContent = screen.getByTestId('content-answers-filename').textContent;
        expect(fileNameContent).toEqual(`"${mockFileName}"`);
    });
});
