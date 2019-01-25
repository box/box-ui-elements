import PropTypes from 'prop-types';

const VersionPropType = PropTypes.shape({
    canDownload: PropTypes.bool,
    created: PropTypes.number.isRequired,
    currentFromUserName: PropTypes.string,
    currentFromFileVersionID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentFromVersionNumber: PropTypes.number,
    deleted: PropTypes.number,
    deletedPermanentlyBy: PropTypes.number,
    deleterUserName: PropTypes.string,
    // Disposition fields used for retention
    dispositionAction: PropTypes.number,
    dispositionDate: PropTypes.number,
    extension: PropTypes.string.isRequired,
    // Backend is very inconsistent with the return types, let's just allow both for flexibility
    fileVersionID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isCurrent: PropTypes.bool,
    itemName: PropTypes.string.isRequired,
    // Note this could be file_1234 (current version) or even file_1234_5678 (old version).
    // This isn't used directly by the component, but should be available to the action callbacks
    itemTypedID: PropTypes.string.isRequired,
    isIndefinitelyRetained: PropTypes.bool,
    isRetained: PropTypes.bool,
    restored: PropTypes.number,
    restorerUserName: PropTypes.string,
    updated: PropTypes.number.isRequired,
    uploaderUserName: PropTypes.string.isRequired,
    versionNumber: PropTypes.number.isRequired,
});

const VersionsPropType = PropTypes.arrayOf(VersionPropType);

export { VersionsPropType, VersionPropType };
