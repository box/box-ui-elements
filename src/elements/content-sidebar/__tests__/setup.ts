/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';

jest.mock('@box/blueprint-web-assets/icons/Logo', () => ({
    BoxAiLogo: function BoxAiLogo() {
        return React.createElement('div', { 'data-testid': 'mock-boxai-logo' });
    },
}));

jest.mock(
    '../../icon/fill/DocGenIcon',
    () =>
        function DocGenIcon() {
            return React.createElement('div', { 'data-testid': 'mock-docgen-icon' });
        },
);

jest.mock(
    '../../icons/general/IconChatRound',
    () =>
        function IconChatRound() {
            return React.createElement('div', { 'data-testid': 'mock-chat-icon' });
        },
);

jest.mock(
    '../../icons/general/IconDocInfo',
    () =>
        function IconDocInfo() {
            return React.createElement('div', { 'data-testid': 'mock-docinfo-icon' });
        },
);

jest.mock(
    '../../icons/general/IconMagicWand',
    () =>
        function IconMagicWand() {
            return React.createElement('div', { 'data-testid': 'mock-magic-wand-icon' });
        },
);

jest.mock(
    '../../icons/general/IconMetadataThick',
    () =>
        function IconMetadataThick() {
            return React.createElement('div', { 'data-testid': 'mock-metadata-icon' });
        },
);

jest.mock('@box/blueprint-web-assets/tokens/tokens', () => ({
    Size6: '16px',
}));
