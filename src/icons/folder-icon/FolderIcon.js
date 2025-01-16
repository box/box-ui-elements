Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const FolderShared32_1 = require('../../icon/content/FolderShared32');
const FolderExternal32_1 = require('../../icon/content/FolderExternal32');
const FolderPersonal32_1 = require('../../icon/content/FolderPersonal32');

const FolderIcon = function (_a) {
    const _b = _a.dimension;
    const dimension = _b === void 0 ? 32 : _b;
    const _c = _a.isCollab;
    const isCollab = _c === void 0 ? false : _c;
    const _d = _a.isExternal;
    const isExternal = _d === void 0 ? false : _d;
    const { title } = _a;
    const _e = _a.role;
    const role = _e === void 0 ? 'img' : _e;
    const ariaLabel = _a['aria-label'];
    const ariaHidden = _a['aria-hidden'];
    const Icon = isExternal
        ? FolderExternal32_1.default
        : isCollab
          ? FolderShared32_1.default
          : FolderPersonal32_1.default;
    const size = typeof dimension === 'string' ? parseInt(dimension, 10) : dimension;
    return (
        <Icon
            height={size}
            width={size}
            role={role}
            aria-label={ariaLabel || title}
            aria-hidden={ariaHidden}
            title={title}
            viewBox="0 0 32 32"
        />
    );
};
exports.default = FolderIcon;
