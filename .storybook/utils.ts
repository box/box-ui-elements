import { http, HttpResponse } from 'msw';
import { DEFAULT_HOSTNAME_STATIC } from '../src/constants';

export const getFontHandlers = (fonts: string[]) => {
    return fonts.reduce((acc, font) => {
        acc.push(
            ...['woff2,woff'].map(fontExtension => {
                return http.get(`${DEFAULT_HOSTNAME_STATIC}/fonts/1.0.17/lato/${font}`, async () => {
                    return HttpResponse.json(new Blob([], { type: `font/${fontExtension}` }), {
                        status: 200,
                        headers: {
                            'Content-Type': `font/${fontExtension}`,
                        },
                    });
                });
            }),
        );
        return acc;
    }, []);
};
