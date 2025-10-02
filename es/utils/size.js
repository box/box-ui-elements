/**
 * Gets the size in words
 *
 * @param {number} value in bytes
 * @return {string} size in words
 */
export default function size(value) {
  if (!value) return '0 Byte';
  const kilo = 1024;
  const decimals = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const exp = Math.floor(Math.log(value) / Math.log(kilo));
  return `${parseFloat((value / kilo ** exp).toFixed(decimals))} ${sizes[exp]}`;
}
//# sourceMappingURL=size.js.map