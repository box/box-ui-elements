import { FILE_EXTENSIONS } from './constants';
const getFileIconType = (extension = '') => {
  const iconTypes = {};
  Object.entries(FILE_EXTENSIONS).forEach(([iconType, typeExtensions]) => {
    typeExtensions.forEach(typeExtension => {
      iconTypes[typeExtension] = iconType;
    });
  });
  return iconTypes[extension] || 'default';
};
export { getFileIconType };
//# sourceMappingURL=utils.js.map