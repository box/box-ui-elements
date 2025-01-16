import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import InfoBadge16 from '../../../icon/fill/InfoBadge16';
import Toggle from '../../../components/toggle';
import Tooltip from '../../../components/tooltip';
// eslint-disable-next-line import/no-named-as-default
import messages from '../messages';

const ContentExplorerIncludeSubfolders = ({ isDisabled, onChange, tooltipMessage }) => {
    const label = (
        <>
            <FormattedMessage {...messages.includeSubfolders} />
            {tooltipMessage && (
                <Tooltip text={<FormattedMessage {...tooltipMessage} />}>
                    <InfoBadge16 className="bdl-ContentExplorerIncludeSubfolders-icon" fill="blue" />
                </Tooltip>
            )}
        </>
    );
    return <Toggle isDisabled={isDisabled} label={label} onChange={onChange} />;
};

ContentExplorerIncludeSubfolders.propTypes = {
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    tooltipMessage: PropTypes.shape({
        id: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired,
        description: PropTypes.string,
    }),
};

export { ContentExplorerIncludeSubfolders as ContentExplorerIncludeSubfoldersBase };
export default injectIntl(ContentExplorerIncludeSubfolders);
