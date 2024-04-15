import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

// Unmock translation framework to allow content-based DOM traversal (in default locale)
// Functional stub for lib/intl format functions (works, but only in default locale)
jest.unmock('react-intl');

function renderConnected(ui, { locale = 'en', ...renderOptions } = {}) {
    // eslint-disable-next-line react/prop-types
    function Wrapper({ children }) {
        return <IntlProvider locale={locale}>{children}</IntlProvider>;
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderConnected as render };
