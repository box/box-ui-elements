const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const isCI = process.env.CI === '1';
const buildPseudo = process.env.BUILD_PSEUDO_LOCALE === '1';

const locales = isProd && !isCI ? [
    'en-AU',
    'en-CA',
    'en-GB',
    'en-US',
    'en-x-pseudo',
    'bn-IN',
    'da-DK',
    'de-DE',
    'es-419',
    'es-ES',
    'fi-FI',
    'fr-CA',
    'fr-FR',
    'hi-IN',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'nb-NO',
    'nl-NL',
    'pl-PL',
    'pt-BR',
    'ru-RU',
    'sv-SE',
    'tr-TR',
    'zh-CN',
    'zh-TW'
] : ['en-US']; // Only 1 locale needed for dev

if (isDev && buildPseudo) {
    locales.push('en-x-pseudo');
}

module.exports = locales;
