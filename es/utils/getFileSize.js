import filesize from 'filesize';
const defaultDigitalUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const bcp47TagToDigitalUnits = {
  fi: ['t', 'kt', 'Mt', 'Gt', 'Tt', 'Pt', 'Et', 'Zt', 'Yt'],
  fr: ['o', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'],
  ru: ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ЙБ']
};

/**
 * Formats a file size from number of bytes to a human-readable, localized string.
 * @param {number} size Number of bytes
 * @param {string} [locale] Optional locale, defaults to 'en'
 * @returns {string} The size as a localized string
 */
const getFileSize = (size, locale = 'en') => {
  const settings = {
    round: 1,
    locale
  };
  const localizedUnits = bcp47TagToDigitalUnits[locale];
  if (localizedUnits) {
    // map default units to localized units, ex. { B: Б, KB: КБ, ... }
    settings.symbols = defaultDigitalUnits.reduce((symbols, unit, index) => {
      symbols[unit] = localizedUnits[index];
      return symbols;
    }, {});
  }
  return filesize(size, settings);
};
export default getFileSize;
//# sourceMappingURL=getFileSize.js.map