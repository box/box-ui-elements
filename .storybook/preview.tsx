import React from 'react';
import { BlueprintProvider, useNoopTreatment } from '@box/blueprint-web';
import { boxLanguages } from '@box/languages';
import { addWindowFocusTracking } from '@react-aria/interactions';
import isChromatic from 'chromatic/isChromatic';
import { initialize, mswLoader } from 'msw-storybook-addon';
import type { Decorator, Preview } from '@storybook/react-webpack5';

import '../src/styles/variables';
import '../src/styles/base.scss';

import { AnimationsEnabledContext } from '../src/elements/common/withBlueprintAnimations';
import { reactIntl } from './reactIntl';

// Constants
global.FEATURE_FLAGS = global.FEATURE_FLAGS || {};
global.FILE_ID = global.FILE_ID || '415542803939';
global.FOLDER_ID = global.FOLDER_ID || '69083462919';
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || 'P1n3ID8nYMxHRWvenDatQ9k6JKzWzYrz';

// Initialize react-aria focus tracking before Storybook patches HTMLElement.prototype.focus,
// which causes react-aria to throw "TypeError: Illegal invocation" and crash the component.
addWindowFocusTracking();

initialize({
    serviceWorker: {
        url: './mockServiceWorker.js',
    },
});

const withBlueprintAnimations: Decorator = Story =>
    isChromatic() ? (
        <AnimationsEnabledContext.Provider value={false}>
            <Story />
        </AnimationsEnabledContext.Provider>
    ) : (
        <BlueprintProvider
            useTreatment={useNoopTreatment}
            configurationOverrides={{
                animationsPhase1Enabled: true,
                animationsPhase2Enabled: true,
            }}
        >
            <Story />
        </BlueprintProvider>
    );

const preview: Preview = {
    decorators: [withBlueprintAnimations],

    parameters: {
        chromatic: {
            cropToViewport: true,
            delay: 500,
            diffThreshold: 0.1,
            modes: {
                specific: {
                    viewport: {
                        height: 1000,
                        width: 1200,
                    },
                },
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        options: {
            storySort: {
                order: ['Elements'],
            },
        },
        reactIntl,
    },

    loaders: [mswLoader],

    tags: ['autodocs'],

    initialGlobals: {
        locale: reactIntl.defaultLocale,
        locales: Object.keys(boxLanguages).reduce((locales, language) => {
            locales[language] = boxLanguages[language].name;
            return locales;
        }, {}),
    },
};

export default preview;
