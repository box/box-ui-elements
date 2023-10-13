import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';

import InlineError from '../InlineError';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ElementsXhrError } from '../../../common/types/api';

import messages from '../messages';

jest.mock('react-intl', () => jest.requireActual('react-intl'));

describe('features/content-answers/InlineError', () => {
    const IntlWrapper = ({ children }: { children?: React.ReactNode }) => {
        return <IntlProvider locale="en">{children}</IntlProvider>;
    };

    const renderComponent = (props: { error: ElementsXhrError }) =>
        render(<InlineError {...props} />, { wrapper: IntlWrapper });

    test('should show inline error message', () => {
        renderComponent({ error: new Error('error') });
        expect(screen.getByText(messages.inlineErrorText.defaultMessage)).toBeInTheDocument();
    });
});
