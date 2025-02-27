import * as React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { Tooltip, IconButton } from '@box/blueprint-web';
import { Grid, Hamburger } from '@box/blueprint-web-assets/icons/Fill';
import type { ViewMode } from '../flowTypes';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';

import './ViewModeChangeButton.scss';

import messages from '../messages';

interface ViewModeChangeButtonProps {
    className?: string;
    onViewModeChange?: (viewMode: ViewMode) => void;
    viewMode: ViewMode;
}

const ViewModeChangeButton = ({
    className = '',
    onViewModeChange = noop,
    viewMode,
    ...rest
}: ViewModeChangeButtonProps) => {
    const { formatMessage } = useIntl();
    const isGridView = viewMode === VIEW_MODE_GRID;
    const viewMessage = isGridView ? formatMessage(messages.listView) : formatMessage(messages.gridView);
    const onClick = () => {
        onViewModeChange(isGridView ? VIEW_MODE_LIST : VIEW_MODE_GRID);
    };

    return (
        <Tooltip content={viewMessage}>
            <IconButton
                aria-label={viewMessage}
                data-testid="view-mode-change-button"
                className={classNames('bdl-ViewModeChangeButton', className)}
                icon={isGridView ? Hamburger : Grid}
                onClick={onClick}
                {...rest}
            />
        </Tooltip>
    );
};

export default ViewModeChangeButton;
