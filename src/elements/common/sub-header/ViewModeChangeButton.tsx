import * as React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { Tooltip, IconButton } from '@box/blueprint-web';
import { Grid, Hamburger } from '@box/blueprint-web-assets/icons/Fill';
import { ViewMode } from '../flowTypes';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';

import './ViewModeChangeButton.scss';

import messages from '../messages';

interface Props {
    className?: string;
    onViewModeChange?: (viewMode: ViewMode) => void;
    viewMode: ViewMode;
}

const ViewModeChangeButton = ({ className = '', onViewModeChange = noop, viewMode, ...rest }: Props) => {
    const { formatMessage } = useIntl();
    const isGridView = viewMode === VIEW_MODE_GRID;
    const tooltipText = formatMessage(isGridView ? messages.listView : messages.gridView);
    const Icon = isGridView ? Hamburger : Grid;

    const handleClick = () => {
        onViewModeChange(isGridView ? VIEW_MODE_LIST : VIEW_MODE_GRID);
    };

    return (
        <Tooltip content={tooltipText}>
            <IconButton className={classNames('bdl-ViewModeChangeButton', className)} onClick={handleClick} {...rest}>
                <Icon />
            </IconButton>
        </Tooltip>
    );
};

export default ViewModeChangeButton;
