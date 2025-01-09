Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Footer component for content picker
 * Provides action buttons and selection status
 */
const React = require('react');
const react_intl_1 = require('react-intl');
const blueprint_web_1 = require('@box/blueprint-web');
const button_group_1 = require('../../components/button-group');
const IconCheck_1 = require('../../icons/general/IconCheck');
const IconClose_1 = require('../../icons/general/IconClose');
const messages_1 = require('../common/messages');
const Tooltip_1 = require('../common/Tooltip');
require('./Footer.scss');

const Footer = function (_a) {
    const { currentCollection } = _a;
    const { selectedCount } = _a;
    const { selectedItems } = _a;
    const { onSelectedClick } = _a;
    const { hasHitSelectionLimit } = _a;
    const { isSingleSelect } = _a;
    const { onCancel } = _a;
    const { onChoose } = _a;
    const { chooseButtonLabel } = _a;
    const { cancelButtonLabel } = _a;
    const { children } = _a;
    const { renderCustomActionButtons } = _a;
    const { showSelectedButton } = _a;
    const { formatMessage } = (0, react_intl_1.useIntl)();
    const cancelMessage = formatMessage(messages_1.default.cancel);
    const chooseMessage = formatMessage(messages_1.default.choose);
    const isChooseButtonDisabled = !selectedCount;
    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <blueprint_web_1.Button className="bcp-selected" onClick={onSelectedClick} variant="secondary">
                        {formatMessage(messages_1.default.selected, { count: selectedCount })}
                        {hasHitSelectionLimit ? ' ('.concat(formatMessage(messages_1.default.max), ')') : ''}
                    </blueprint_web_1.Button>
                )}
            </div>
            <div className="bcp-footer-right">
                {children}

                {renderCustomActionButtons ? (
                    renderCustomActionButtons({
                        currentFolderId: currentCollection.id,
                        currentFolderName: currentCollection.name,
                        onCancel,
                        onChoose,
                        selectedCount,
                        selectedItems,
                    })
                ) : (
                    <button_group_1.default className="bcp-footer-actions">
                        <Tooltip_1.default text={cancelButtonLabel || cancelMessage}>
                            <blueprint_web_1.Button
                                onClick={onCancel}
                                variant="secondary"
                                aria-label={cancelButtonLabel || cancelMessage}
                                icon={IconClose_1.default}
                            >
                                {cancelButtonLabel || cancelMessage}
                            </blueprint_web_1.Button>
                        </Tooltip_1.default>
                        <Tooltip_1.default
                            isDisabled={isChooseButtonDisabled}
                            text={chooseButtonLabel || chooseMessage}
                        >
                            <blueprint_web_1.Button
                                variant="primary"
                                onClick={onChoose}
                                disabled={isChooseButtonDisabled}
                                aria-disabled={isChooseButtonDisabled}
                                aria-label={chooseButtonLabel || chooseMessage}
                                data-testid="choose-button"
                                data-resin-target="choose"
                                icon={IconCheck_1.default}
                            >
                                {chooseButtonLabel || chooseMessage}
                            </blueprint_web_1.Button>
                        </Tooltip_1.default>
                    </button_group_1.default>
                )}
            </div>
        </footer>
    );
};
exports.default = Footer;
