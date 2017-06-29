const isRelease = process.env.NODE_ENV === 'production';
const isCI = process.env.CI === '1';

module.exports = isRelease && !isCI ? [
    'en-AU',
    'en-CA',
    'en-GB',
    'en-US',
    'da-DK',
    'de-DE',
    'es-ES',
    'fi-FI',
    'fr-CA',
    'fr-FR',
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
